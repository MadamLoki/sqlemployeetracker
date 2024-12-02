const inquirer = require('inquirer');
const db = require('./db/db');
const { table } = require('console');

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
        console.table(departments);
    }

    async viewRoles() {
        const roles = await db.viewAllRoles();
        console.table(roles);
    }

    async viewEmployees() {
        const employees = await db.viewAllEmployees();
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
        console.log(`Added ${name} to departments`);
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
                validate: input => input > 0 ? true : 'Salary must be greater than 0'
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
        console.log(`Added ${title} role`);
    }

    async addEmployee() {
        const roles = await db.getRolesForSelection();
        const employees = await db.getEmployeesForSelection();
        
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
        console.log(`Added ${firstName} ${lastName} to employees`);
    }

    async updateEmployeeRole() {
        const employees = await db.getEmployeesForSelection();
        const roles = await db.getRolesForSelection();

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
        console.log('Updated employee\'s role');
    }
}

// Start the application
const app = new EmployeeTracker();
app.start().catch(console.error);