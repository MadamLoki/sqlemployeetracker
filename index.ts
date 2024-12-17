import inquirer from 'inquirer';
import figlet from 'figlet';
import { db } from './src/connection';

class EmployeeTracker {
    async start() {
        console.log('\n' + 
            figlet.textSync('Employee\nManager', {
                font: 'Chunky',
                horizontalLayout: 'default',
                verticalLayout: 'default',
                width: 80,
                whitespaceBreak: true
            })
        );
        // console.log(figlet.fontsSync());
        console.log('\n');
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

            try {
                switch (choice) {
                    case 'View All Departments':
                        await this.viewAllDepartments();
                        break;
                    case 'View All Roles':
                        await this.viewAllRoles();
                        break;
                    case 'View All Employees':
                        await this.viewAllEmployees();
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
                    case 'Exit':
                        console.log('Goodbye!');
                        process.exit(0);
                }
            } catch (error) {
                console.error('An error occurred:', error);
            }
        }
    }

    async viewAllDepartments() {
        const departments = await db.viewAllDepartments();
        console.table(departments);
    }

    async viewAllRoles() {
        const roles = await db.viewAllRoles();
        console.table(roles);
    }

    async viewAllEmployees() {
        const employees = await db.viewAllEmployees();
        console.table(employees);
    }

    async addDepartment() {
        const { name } = await inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'What is the name of the department?',
                validate: (input) => input.trim() !== '' || 'Department name cannot be empty'
            }
        ]);

        await db.addDepartment(name);
        console.log(`Added department: ${name}`);
    }

    async addRole() {
        const departments = await db.getDepartments();
        
        const { title, salary, departmentId } = await inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'What is the name of the role?',
                validate: (input) => input.trim() !== '' || 'Role name cannot be empty'
            },
            {
                type: 'input',
                name: 'salary',
                message: 'What is the salary for this role?',
                validate: (input) => !isNaN(Number(input)) || 'Please enter a valid number'
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

        await db.addRole(title, Number(salary), departmentId);
        console.log(`Added role: ${title}`);
    }

    async addEmployee() {
        const roles = await db.getRoles();
        const employees = await db.getEmployees();

        const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
            {
                type: 'input',
                name: 'firstName',
                message: "What is the employee's first name?",
                validate: (input) => input.trim() !== '' || 'First name cannot be empty'
            },
            {
                type: 'input',
                name: 'lastName',
                message: "What is the employee's last name?",
                validate: (input) => input.trim() !== '' || 'Last name cannot be empty'
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
                        name: `${emp.first_name} ${emp.last_name}`,
                        value: emp.id
                    }))
                ]
            }
        ]);

        await db.addEmployee(firstName, lastName, roleId, managerId);
        console.log(`Added employee: ${firstName} ${lastName}`);
    }

    async updateEmployeeRole() {
        const employees = await db.getEmployees();
        const roles = await db.getRoles();

        const { employeeId, roleId } = await inquirer.prompt([
            {
                type: 'list',
                name: 'employeeId',
                message: "Which employee's role do you want to update?",
                choices: employees.map(emp => ({
                    name: `${emp.first_name} ${emp.last_name}`,
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
        console.log('Updated employee role');
    }
}

const app = new EmployeeTracker();
app.start().catch(console.error);