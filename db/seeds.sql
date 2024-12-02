-- Sample seed data
INSERT INTO department (name) VALUES
    ('Engineering'),
    ('Sales'),
    ('Finance'),
    ('Legal');

INSERT INTO role (title, salary, department_id) VALUES
    ('Software Engineer', 85000, 1),
    ('Lead Engineer', 125000, 1),
    ('Sales Representative', 65000, 2),
    ('Sales Manager', 100000, 2),
    ('Accountant', 75000, 3),
    ('Legal Counsel', 95000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
    ('John', 'Doe', 2, NULL),
    ('Jane', 'Smith', 1, 1),
    ('Mike', 'Wilson', 4, NULL),
    ('Sarah', 'Brown', 3, 3),
    ('Tom', 'Davis', 5, NULL),
    ('Anna', 'Jones', 6, NULL);