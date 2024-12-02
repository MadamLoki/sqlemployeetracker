const { Pool } = require('pg');

// Database configuration
const pool = new Pool({
    user: 'your_username',
    host: 'localhost',
    database: 'employee_tracker',
    password: 'your_password',
    port: 5432,
});

class Database {
    // View all departments
    async viewAllDepartments() {
        const query = 'SELECT * FROM department ORDER BY id';
        const result = await pool.query(query);
        return result.rows;
    }

    // View all roles with department names
    async viewAllRoles() {
        const query = `
            SELECT r.id, r.title, d.name AS department, r.salary 
            FROM role r 
            JOIN department d ON r.department_id = d.id 
            ORDER BY r.id`;
        const result = await pool.query(query);
        return result.rows;
    }

    // View all employees with their roles, departments, and managers
    async viewAllEmployees() {
        const query = `
            SELECT 
                e.id,
                e.first_name,
                e.last_name,
                r.title,
                d.name AS department,
                r.salary,
                CONCAT(m.first_name, ' ', m.last_name) AS manager
            FROM employee e
            LEFT JOIN role r ON e.role_id = r.id
            LEFT JOIN department d ON r.department_id = d.id
            LEFT JOIN employee m ON e.manager_id = m.id
            ORDER BY e.id`;
        const result = await pool.query(query);
        return result.rows;
    }

    // Add a department
    async addDepartment(name) {
        const query = 'INSERT INTO department (name) VALUES ($1) RETURNING *';
        const result = await pool.query(query, [name]);
        return result.rows[0];
    }

    // Add a role
    async addRole(title, salary, departmentId) {
        const query = 'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3) RETURNING *';
        const result = await pool.query(query, [title, salary, departmentId]);
        return result.rows[0];
    }

    // Add an employee
    async addEmployee(firstName, lastName, roleId, managerId) {
        const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING *';
        const result = await pool.query(query, [firstName, lastName, roleId, managerId]);
        return result.rows[0];
    }

    // Update employee role
    async updateEmployeeRole(employeeId, roleId) {
        const query = 'UPDATE employee SET role_id = $1 WHERE id = $2 RETURNING *';
        const result = await pool.query(query, [roleId, employeeId]);
        return result.rows[0];
    }

    // Get all employees for selection
    async getEmployeesForSelection() {
        const query = 'SELECT id, CONCAT(first_name, \' \', last_name) AS name FROM employee';
        const result = await pool.query(query);
        return result.rows;
    }

    // Get all roles for selection
    async getRolesForSelection() {
        const query = 'SELECT id, title FROM role';
        const result = await pool.query(query);
        return result.rows;
    }

    // Get all departments for selection
    async getDepartmentsForSelection() {
        const query = 'SELECT id, name FROM department';
        const result = await pool.query(query);
        return result.rows;
    }
}

module.exports = new Database();