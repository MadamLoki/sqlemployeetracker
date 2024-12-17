import dotenv from 'dotenv';
dotenv.config();

import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: 'localhost',
    database: process.env.DB_NAME,
    port: 5432,
    }
);

const connectTodb = async () => {
    try {
        await pool.connect();
        console.log('Connected to the database.');
    } catch (err) {
        console.error('Error connecting to database:', err);
        process.exit(1);
    }
};


export const db = {
    // existing methods
    viewAllEmployees: async (): Promise<any[]> => {
        const result = await pool.query('SELECT * FROM employees');
        return result.rows;
    },
    viewAllDepartments: async (): Promise<any[]> => {
        const result = await pool.query('SELECT * FROM departments');
        return result.rows;
    },
    viewAllRoles: async (): Promise<any[]> => {
        const result = await pool.query('SELECT * FROM roles');
        return result.rows;
        // Implementation for viewing all roles
    },
    addDepartment: async (name: string): Promise<any[]> => {
        const result = await pool.query('INSERT INTO departments (name) VALUES ($1) RETURNING *', [name]);
        return result.rows;
        // Implementation for adding a department
    },
    addRole: async (title: string, salary: number, departmentId: number): Promise<any[]> => {
        const result = await pool.query('INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3) RETURNING *', [title, salary, departmentId]);
        return result.rows;
        // Implementation for adding a role
    },
    addEmployee: async (firstName: string, lastName: string, roleId: number, managerId: number | null): Promise<any[]> => {
        const result = await pool.query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING *', [firstName, lastName, roleId, managerId]);
        return result.rows;
        // Implementation for adding an employee
    },
    updateEmployeeRole: async (employeeId: number, roleId: number): Promise<any[]> => {
        const result = await pool.query('UPDATE employees SET role_id = $1 WHERE id = $2 RETURNING *', [roleId, employeeId]);
        return result.rows;
        // Implementation for updating an employee role
    },
    getDepartmentsForSelection: async (): Promise<any[]> => {
        const result = await pool.query('SELECT * FROM departments');
        return result.rows;
        // Implementation for getting departments for selection
    },
    getRolesForSelection: async (): Promise<any[]> => {
        const result = await pool.query('SELECT * FROM roles');
        return result.rows;
        // Implementation for getting roles for selection
    },
    getEmployeesForSelection: async (): Promise<any[]> => {
        const result = await pool.query('SELECT * FROM employees');
        return result.rows;
        // Implementation for getting employees for selection
    }
};


export { pool, connectTodb };