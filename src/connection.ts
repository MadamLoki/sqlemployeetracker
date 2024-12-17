import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();
const { Pool } = pg;

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: 'localhost',
    database: 'employee_tracker',
    port: 5432,
});

export const db = {
    viewAllDepartments: async () => {
        const result = await pool.query(`
            SELECT id, name 
            FROM department 
            ORDER BY name
        `);
        return result.rows;
    },

    viewAllRoles: async () => {
        const result = await pool.query(`
            SELECT r.id, r.title, d.name AS department, r.salary
            FROM role r
            JOIN department d ON r.department_id = d.id
            ORDER BY d.name, r.title
        `);
        return result.rows;
    },

    viewAllEmployees: async () => {
        const result = await pool.query(`
            SELECT 
                e.id,
                e.first_name,
                e.last_name,
                r.title AS job_title,
                d.name AS department,
                r.salary,
                CONCAT(m.first_name, ' ', m.last_name) AS manager
            FROM employee e
            LEFT JOIN role r ON e.role_id = r.id
            LEFT JOIN department d ON r.department_id = d.id
            LEFT JOIN employee m ON e.manager_id = m.id
            ORDER BY e.last_name, e.first_name
        `);
        return result.rows;
    },

    addDepartment: async (name: string) => {
        const result = await pool.query(
            'INSERT INTO department (name) VALUES ($1) RETURNING *',
            [name]
        );
        return result.rows[0];
    },

    addRole: async (title: string, salary: number, departmentId: number) => {
        const result = await pool.query(
            'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3) RETURNING *',
            [title, salary, departmentId]
        );
        return result.rows[0];
    },

    addEmployee: async (firstName: string, lastName: string, roleId: number, managerId: number | null) => {
        const result = await pool.query(
            'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [firstName, lastName, roleId, managerId]
        );
        return result.rows[0];
    },

    updateEmployeeRole: async (employeeId: number, roleId: number) => {
        const result = await pool.query(
            'UPDATE employee SET role_id = $2 WHERE id = $1 RETURNING *',
            [employeeId, roleId]
        );
        return result.rows[0];
    },

    getDepartments: async () => {
        const result = await pool.query('SELECT id, name FROM department ORDER BY name');
        return result.rows;
    },

    getRoles: async () => {
        const result = await pool.query('SELECT id, title FROM role ORDER BY title');
        return result.rows;
    },

    getEmployees: async () => {
        const result = await pool.query(
            'SELECT id, first_name, last_name FROM employee ORDER BY last_name, first_name'
        );
        return result.rows;
    }
};