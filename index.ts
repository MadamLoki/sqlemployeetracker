import inquirer from 'inquirer';
import { db } from './src/connection';


class EmployeeTracker {
    async start() {
        while (true) {
            const { choice } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'choice',
                    message: 'What would you like to do?',
                    choices: [
                        'View All Departments',
                        'View All Roles',
                        'View All Employees',
                        'Add Department',
                        'Add Role',
                        'Add Employee',
                        'Update Employee Role',
                        'Exit'
                    ]
                }
            ]);

            if (choice === 'Exit') break;

            await this.handleChoice(choice);
        }
    }

    async handleChoice(choice) {
        switch (choice) {
            case 'View All Departments':
                await this.viewDepartments();
                break;
            case 'View All Roles':
                await this.viewRoles();
                break;
            case 'View All Employees':
                await this.viewEmployees();
                break;
            case 'Add Department':
                await this.addDepartment();
                break;
            case 'Add Role':
                await this.addRole();
                break;
            case 'Add Employee':
                await this.addEmployee();
                break;
            case 'Update Employee Role':
                await this.updateEmployeeRole();
                break;
        }
    }

    async viewDepartments() {
        const departments = await db.viewAllDepartments();
        if (departments.length === 0) {
            console.log('No departments found');
            console.log('Departments:', departments);
            return;
        };
        console.table(departments);
    }

    async viewRoles() {
        const roles = await db.viewAllRoles();
        if (roles.length === 0) {
            console.log('No roles found');
            console.log('Roles:', roles);
            return;
        };
        console.table(roles);
    }

    async viewEmployees() {
        const employees = await db.viewAllEmployees();
        if (employees.length === 0) {
            console.log('No employees found');
            console.log('Employees:', employees);
            return;
        };
        console.table(employees);
    }

    async addDepartment() {
        const { name } = await inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'What is the name of the department?',
                validate: input => input ? true : 'Department name cannot be empty'
            }
        ]);

        await db.addDepartment(name);
        if (name === 'Exit') 
            return;
        else (
            console.log(`Added ${name} to departments`)
        );
    }

    async addRole() {
        const departments = await db.getDepartmentsForSelection();
        
        const { title, salary, departmentId } = await inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'What is the title of the role?',
                validate: input => input ? true : 'Role title cannot be empty'
            },
            {
                type: 'number',
                name: 'salary',
                message: 'What is the salary for this role?',
                validate: input => input && input > 0 ? true : 'Salary must be greater than 0'
            },
            {
                type: 'list',
                name: 'departmentId',
                message: 'Which department does this role belong to?',
                choices: departments.map(dept => ({
                    name: dept.name,
                    value: dept.id
                }))
            }
        ]);

        await db.addRole(title, salary, departmentId);
        if (title === 'Exit') 
            return;
        else (
            console.log(`Added ${title} role`)
        );
    }

    async addEmployee() {
        const roles = await db.getRolesForSelection();
        const employees = await db.getEmployeesForSelection();

        if (roles.length === 0) {
            console.log('No roles found. Please add a role before adding an employee');
            return;
        } else if (employees.length === 0) {
            console.log('No employees found. Please add an employee before adding a manager');
            return;
        }
        
        const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
            {
                type: 'input',
                name: 'firstName',
                message: "What is the employee's first name?",
                validate: input => input ? true : 'First name cannot be empty'
            },
            {
                type: 'input',
                name: 'lastName',
                message: "What is the employee's last name?",
                validate: input => input ? true : 'Last name cannot be empty'
            },
            {
                type: 'list',
                name: 'roleId',
                message: "What is the employee's role?",
                choices: roles.map(role => ({
                    name: role.title,
                    value: role.id
                }))
            },
            {
                type: 'list',
                name: 'managerId',
                message: "Who is the employee's manager?",
                choices: [
                    { name: 'None', value: null },
                    ...employees.map(emp => ({
                        name: emp.name,
                        value: emp.id
                    }))
                ]
            }
        ]);

        await db.addEmployee(firstName, lastName, roleId, managerId);
        if (firstName === 'Exit') 
            return;
        else (
            console.log(`Added ${firstName} ${lastName} to employees`)
        );
    }

    async updateEmployeeRole() {
        const employees = await db.getEmployeesForSelection();
        const roles = await db.getRolesForSelection();

        if (employees.length === 0) {
            console.log('No employees found. Please add an employee before updating their role');
            return;
        } else if (roles.length === 0) {
            console.log('No roles found. Please add a role before updating an employee\'s role');
            return;
        }

        const { employeeId, roleId } = await inquirer.prompt([
            {
                type: 'list',
                name: 'employeeId',
                message: 'Which employee\'s role do you want to update?',
                choices: employees.map(emp => ({
                    name: emp.name,
                    value: emp.id
                }))
            },
            {
                type: 'list',
                name: 'roleId',
                message: 'Which role do you want to assign to the selected employee?',
                choices: roles.map(role => ({
                    name: role.title,
                    value: role.id
                }))
            }
        ]);

        await db.updateEmployeeRole(employeeId, roleId);
        if (employeeId === 'Exit') 
            return;
        else (roleId === 'Exit')
            console.log('Role not updated')
            console.log(`Updated role for employee with ID ${employeeId}`)
            return;        
    }
}

// Start the application
const app = new EmployeeTracker();
app.start().catch(console.error);

export { db } from './src/connection';