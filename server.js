const cTable = require('console.table');
const inquirer = require("inquirer");
const mysql = require('mysql2');

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: '',
    database: 'company_db'
  },
  console.log(`Connected to the movies_db database.`)
);

// Menu prompts and container arrays

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

 async function viewAllEmployees() {
    console.log('\n---- View All Employees ----\n');
    const [employees] = await db.promise().query('SELECT * FROM employee');
    console.table(employees);
    mainMenu();
}

async function addEmployee() {
  console.log('\n---- Add Employee ----\n');

  const [role] = await db.promise().query('SELECT id as value, title as name FROM role');

  const [employee] = await db.promise().query('SELECT concat(first_name," ",last_name) as name,id as value FROM employee');
  employee.unshift({ name: 'None', value: 'null' });
  //console.log(employee);
  
  inquirer.prompt([
    {
        type: 'input',
        message: "Enter employee's first name (ENTER ':q' to return to the menu):",
        name: 'first_Name',
        validate(text) {
          if (text==="") {
            return `Must enter first name.`;
          } else if (text===":q") mainMenu();
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
        } else if (text===":q") mainMenu();
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

function updateEmployeeRole(id,role) {
  console.log('---- Update Employee Role ----');
  db.query('UPDATE employee SET role_id=? WHERE id=?',role,id, function (err, results) {
      if (err) { console.log(err); };
  });
  console.log('\n');
}

async function viewAllRoles() {
  console.log('\n---- View All Roles ----\n');
  const [rows] = await db.promise().query('SELECT * FROM role');
  console.table(rows);
  mainMenu();
}

function addRole(role) {
  console.log('\n---- Add Role ----\n');
  const {title,salary,department_id} = role;
  db.query('INSERT INTO role (title,salary,department_id) VALUES  (?,?,?)',title,salary,department_id, function (err, results) {
      if (err) { console.log(err); };
  });
  console.log('\n');
}

async function viewAllDepartments() {
  console.log('\n---- View All Departments ----\n');
  const [rows] = await db.promise().query('SELECT * FROM department');
  console.table(rows);
  mainMenu();
}

function addDepartment(department) {
  console.log('\n---- Add Department ----\n');
  const {name} = department;
  db.query('INSERT INTO department (name) VALUES  (?)',name, function (err, results) {
        if (err) { console.log(err); };
  });
  console.log('\n');
}

function quit() {
  console.log('\nBye!\n');
  process.exit(0);
}

function mainMenu() {
    
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
  
   mainMenu();
     
}

init();