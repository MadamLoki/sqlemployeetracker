import inquirer from 'inquirer';
import { db } from './src/connection';
export { db } from './src/connection';

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

            }
        }
    
        async viewAllDepartments() {
            const departments = await db.viewAllDepartments();
            console.log('Viewing all departments');
            console.table(departments);
            // Implement the logic to view all departments
            
        }
    
        async viewAllRoles() {
            const roles = await db.viewAllRoles();
            // Implement the logic to view all roles
            console.log('Viewing all roles');
            console.table(roles);
        }
    
        async viewAllEmployees() {
            const employees = await db.viewAllEmployees();
            // Implement the logic to view all employees
            console.table(employees);
            console.log('Viewing all employees');
        }
    
        async addDepartment() {
            const { name } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'name',
                    message: 'What is the name of the department?'
                }
            ]);
        
            await db.addDepartment(name);
            console.log('Department added!');
        }

        async addRole() {
            // Implement the logic to add a role
            const { name } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'name',
                    message: 'What is the name of the role?'
                }
            ]);
            
            console.log('Role added!');
        }

        async addEmployee() {
            // Implement the logic to add an employee
            const { name } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'name',
                    message: 'What is the name of the employee?'
                }
            ]);
            console.log('Employee added!');
        }
    }

// Start the application
const app = new EmployeeTracker();
app.start().catch(console.error);



