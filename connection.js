var mysql = require("mysql");
var inquirer = require("inquirer");

  
  var connection = mysql.createConnection({
    
    host: "localhost",
    port: 3306,
    // Your username

    user: "root",

    // Your password
    password: "",
    database: "bamazon"
  });


  connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");

  });
  
  
  connection.endConnection=(function(){
    connection.end();
  });
 
module.exports = connection;
