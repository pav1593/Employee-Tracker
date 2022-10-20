const cTable = require('console.table');
const inquirer = require("inquirer");
const mysql = require('mysql2');

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // *** PLEASE ENTER YOUR MYSQL USERNAME
    user: 'root',
    // *** PLEASE ENTER YOUR MYSQL PASSWORD
    password: '',
    database: 'company_db'
  },
  console.log(`Connected to the movies_db database.`)
);

// Main menu questions

const mainMenuChoices = [
  new inquirer.Separator(),
  "View All Employees",
  "Add Employee",
  "Update Employee Role",
  "View All Roles",
  "Add Role",
  "View all Departments",
  "Add Department",
  "Quit"
];

// function to view all employees

 async function viewAllEmployees() {
    console.log('\n---- View All Employees ----\n');
    const [employees] = await db.promise().query(`SELECT DISTINCT
    a.id,
    a.first_name as 'First Name',
    a.last_name as 'Last Name',
    b.title as 'Title',
    b.salary as 'Salary',
    c.name as 'Department',
    IFNULL(CONCAT(d.first_name,' ',d.last_name),
            'null') AS 'Manager'
FROM 
    employee as a 
    JOIN role as b ON a.role_id=b.id
    JOIN department as c ON b.department_id=c.id
    LEFT JOIN employee as d ON a.manager_id=d.id`);
    console.table(employees);
    mainMenu();
}

// funciton to add an employee
async function addEmployee() {
  console.log('\n---- Add Employee ----\n');

  // queries the current roles for the select list
  const [role] = await db.promise().query('SELECT id as value, title as name FROM role');

  // queries the current employees for the select list and adds a null for manager selection
  const [employee] = await db.promise().query('SELECT concat(first_name," ",last_name) as name,id as value FROM employee');
  employee.unshift({ name: 'None', value: 'null' });
  
  inquirer.prompt([
    {
        type: 'input',
        message: "Enter employee's first name (ENTER ':q' to return to the menu):",
        name: 'first_Name',
        validate(text) {
          if (text==="") {
            return `Must enter first name.`;
          } else if (text===":q") {mainMenu();}
          else 
            return true;
        }
      },
    {
      type: 'input',
      message: "Enter employee's last name (ENTER ':q' to return to the menu):",
      name: 'last_Name',
      validate(text) {
        if (text==="") {
          return `Must enter last name.`;
        } else if (text===":q") {mainMenu();}
        else 
          return true;
      }
  },
  {   type: 'rawlist',
      name: 'role_id',
      message: "Enter employee's role:",
      choices: role,
},
  {   type: 'rawlist',
      name: 'manager_id',
      message: "Enter employee's role:",
      choices: employee,
},
]).then((answers)=>{
  const {first_Name,last_Name,role_id,manager_id} = answers;
  
  console.log(`\nAdded ${first_Name} ${last_Name} to employees.\n`);

  db.query(`INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES ("${first_Name}","${last_Name}",${role_id},${manager_id})`,function (err, results) {
    if (err) { console.log(err); }
  });
  
  mainMenu();
});

}

// allows updates to an employee role
async function updateEmployeeRole() {

  console.log('---- Update Employee Role ----');
  
  const [role] = await db.promise().query('SELECT id as value, title as name FROM role');

  const [employee] = await db.promise().query('SELECT concat(first_name," ",last_name) as name,id as value FROM employee');
  
  inquirer.prompt([
  
  {   type: 'list',
      name: 'employee_id',
      message: "Enter employee to change role:",
      choices: employee,
},
{   type: 'list',
      name: 'new_role',
      message: "Enter new role:",
      choices: role,
}
]).then((answers)=>{
  const {new_role,employee_id} = answers;
  
  console.log(`\nChanaged role to ${new_role}.\n`);

  db.query(`UPDATE employee SET role_id=${new_role} WHERE id=${employee_id}`,function (err, results) {
    if (err) { console.log(err); }
  });
  
  mainMenu();
});

}

// views all roles
async function viewAllRoles() {
  console.log('\n---- View All Roles ----\n');
  const [rows] = await db.promise().query(`SELECT 
    r.id,
    r.title as 'Title',
    r.salary as 'Salary',
    d.name as 'Department'
FROM
    role as r
    JOIN department as d ON r.department_id=d.id`);
  console.table(rows);
  mainMenu();
}

// allows adding a role
async function addRole() {
  console.log('\n---- Add Role ----\n');

  const [deparment] = await db.promise().query('SELECT id as value, name FROM department');
  
  inquirer.prompt([
    {
        type: 'input',
        message: "Enter role name: (ENTER ':q' to return to the menu):",
        name: 'role',
        validate(text) {
          if (text==="") {
            return `Must enter role name.`;
          } else if (text===":q") {mainMenu();}
          else 
            return true;
        }
      },
    {
      type: 'input',
      message: "Enter role salary: (ENTER ':q' to return to the menu):",
      name: 'salary',
      validate(text) {
        if (text==="") {
          return `Must enter salary.`;
        } else if (text===":q") {mainMenu();}
        else 
          return true;
      }
  },
  {   type: 'list',
      name: 'department_id',
      message: "Select department:",
      choices: deparment,
}
]).then((answers)=>{
  const {role,salary,department_id} = answers;
  
  console.log(`\nAdded ${role} to roles.\n`);

  db.query(`INSERT INTO role (title,salary,department_id) VALUES ("${role}",${salary},${department_id})`,function (err, results) {
    if (err) { console.log(err); }
  });
  
  mainMenu();
});

}

// views all deparments
async function viewAllDepartments() {
  console.log('\n---- View All Departments ----\n');
  const [rows] = await db.promise().query('SELECT * FROM department');
  console.table(rows);
  mainMenu();
}

// allows adding a department
async function addDepartment() {
  console.log('\n---- Add Department ----\n');
  
  inquirer.prompt([
    {
        type: 'input',
        message: "Enter new department name: (ENTER ':q' to return to the menu):",
        name: 'department',
        validate(text) {
          if (text==="") {
            return `Must enter department name.`;
          } else if (text===":q") {mainMenu();}
          else 
            return true;
        }
    }
    
]).then((answers)=>{
  const {department} = answers;
  
  console.log(`\nAdded ${department} to departments.\n`);

  db.query(`INSERT INTO department (name) VALUES ("${department}")`,function (err, results) {
    if (err) { console.log(err); }
  });
  
  mainMenu();
});

}

// quit option
function quit() {
  console.log('\nBye!\n');
  process.exit(0);
}

// main menu function that presents the main choices and calls the appropriate next function using a switch statement
function mainMenu() {
  console.log('\n');
  inquirer.prompt([
    {   type: 'list',
        name: 'menuChoice',
        message: 'What would you like to do?',
        choices: mainMenuChoices,
    },
  ]).then( (answers)=>{
   switch (answers.menuChoice) {
          case 'View All Employees': viewAllEmployees();
              break;
          case 'Add Employee': addEmployee();
              break;
          case 'Update Employee Role': updateEmployeeRole();
              break;
          case 'View All Roles': viewAllRoles();
              break;
          case 'Add Role': addRole();
              break;
          case 'View all Departments': viewAllDepartments();
              break;
          case 'Add Department': addDepartment();
              break;
          case 'Quit': quit();
              return;
      };
        
  });

}



// INIT() function 

function init() {

    console.clear;

    console.log(`
    ███████╗███╗   ███╗██████╗ ██╗      ██████╗ ██╗   ██╗███████╗███████╗
    ██╔════╝████╗ ████║██╔══██╗██║     ██╔═══██╗╚██╗ ██╔╝██╔════╝██╔════╝
    █████╗  ██╔████╔██║██████╔╝██║     ██║   ██║ ╚████╔╝ █████╗  █████╗  
    ██╔══╝  ██║╚██╔╝██║██╔═══╝ ██║     ██║   ██║  ╚██╔╝  ██╔══╝  ██╔══╝  
    ███████╗██║ ╚═╝ ██║██║     ███████╗╚██████╔╝   ██║   ███████╗███████╗
    ╚══════╝╚═╝     ╚═╝╚═╝     ╚══════╝ ╚═════╝    ╚═╝   ╚══════╝╚══════╝
                                                                         
    ████████╗██████╗  █████╗  ██████╗██╗  ██╗███████╗██████╗             
    ╚══██╔══╝██╔══██╗██╔══██╗██╔════╝██║ ██╔╝██╔════╝██╔══██╗            
       ██║   ██████╔╝███████║██║     █████╔╝ █████╗  ██████╔╝            
       ██║   ██╔══██╗██╔══██║██║     ██╔═██╗ ██╔══╝  ██╔══██╗            
       ██║   ██║  ██║██║  ██║╚██████╗██║  ██╗███████╗██║  ██║            
       ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝            
                                                                         `);
    console.log(`
      ┌┐ ┬ ┬  ╔╗╔┬┌─┐┬┌─  ╔═╗┌─┐┬  ┬┬  ┌─┐┬  ┬┬┌─┐
      ├┴┐└┬┘  ║║║││  ├┴┐  ╠═╝├─┤└┐┌┘│  │ │└┐┌┘││  
      └─┘ ┴   ╝╚╝┴└─┘┴ ┴  ╩  ┴ ┴ └┘ ┴─┘└─┘ └┘ ┴└─┘
                                                                          `);


  // initial call to the main menu list
   mainMenu();
     
}

init();