# Employee Manager CLI

## Description

Employee Manager is a command-line interface (CLI) application that allows business owners to view and manage their company's employee database. Users can view departments, roles, and employees, as well as add new entries and update employee roles.

## Table of Contents

- [Employee Manager CLI](#employee-manager-cli)
  - [Description](#description)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Features](#features)
  - [Database Schema](#database-schema)
    - [Department](#department)
    - [Role](#role)
    - [Employee](#employee)
  - [Technologies Used](#technologies-used)
  - [Screenshots](#screenshots)
  - [Contributing](#contributing)
  - [License](#license)
  - [Contact](#contact)

## Installation

1. Clone the repository:

    ```bash
    git clone ^git@github.com:MadamLoki/sqlemployeetracker.git
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create a .env file in the root directory with your PostgreSQL credentials:

    ```bash
    DB_USER=your_username
    DB_PASSWORD=your_password
    ```

4. Set up the database:

    ```bash
    psql -U postgres -f db/schema.sql
    psql -U postgres -f db/seed.sql
    ```

## Usage

To start the application:

    ```bash
    npm start
    ```

## Features

- View all departments
- View all roles
- View all employees
- Add a department
- Add a role
- Add an employee
- Update an employee's role

## Database Schema

### Department

- id: INT PRIMARY KEY
- name: VARCHAR(30)

### Role

- id: INT PRIMARY KEY
- title: VARCHAR(30)
- salary: DECIMAL
- department_id: INT FOREIGN KEY

### Employee

- id: INT PRIMARY KEY
- first_name: VARCHAR(30)
- last_name: VARCHAR(30)
- role_id: INT FOREIGN KEY
- manager_id: INT FOREIGN KEY

## Technologies Used

- Node.js
- TypeScript
- PostgreSQL
- Inquirer
- Figlet (for CLI styling)
- pg (PostgreSQL client)
- dotenv

## Screenshots

[Add your application screenshots here]

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Contact

- [Github](https://github.com/MadamLoki)
- [Email](sara.j.ryan.90@gmail.com)
