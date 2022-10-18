const express = require('express');
const cTable = require('console.table');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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
  console.log(`Connected to the classlist_db database.`)
);

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// INIT() function 

function init() {

    console.log("\n\n");

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
  
    console.log("\n\n");
    

      // Query database
    db.query('SELECT * FROM department', function (err, results) {
      console.table(results);
    });

    db.query('SELECT * FROM role', function (err, results) {
      console.table(results);
    });

    db.query('SELECT * FROM employee', function (err, results) {
      console.table(results);
    });

}

init();