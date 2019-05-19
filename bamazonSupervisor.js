var inquirer = require("inquirer");

var Table = require('cli-table2');
var connection = require("./Connection");
var clrScr = require("./ClearScreen");
var formatJS = require("./FormatJS");
var validateNum = require("./ValidateJS");

var fmtStr = new formatJS();
var validateNm = new validateNum();
var options = ['View Product Sales by Department', 'Create New Department', 'Exit'];
var callFunctions = [displayProductSales, prompAddDepartment, connection.endConnection];

clrScr();
selectOptions();

function selectOptions() {
    console.log("\n Amazon Supervisor Module");
    console.log(" ---------------------------------------------------------\n");
    inquirer.prompt([{
        type: 'list',
        name: 'option',
        message: 'Select Options: ',
        choices: options
    }
    ]).then(function (answer) {
        if (options.indexOf(answer.option) !== -1) {
            gotoFunction = callFunctions[options.indexOf(answer.option)];
            clrScr();
            gotoFunction();
        }
    });
};

function displayProductSales() {
    var table = new Table({
        head: ['id', 'department_name', 'over head cost', 'product sales', 'total profit']
        , colWidths: [6, 20, 17, 15, 15]
        , style: { compact: true, 'padding-left': 1 }
    });
    connection.query("SELECT department_id, IFNULL(SUM(products.product_sale),0) as totalSales, over_head_costs,departments.department_name FROM departments LEFT OUTER JOIN products ON  departments.department_name = products.department_name GROUP BY departments.department_name ORDER BY totalSales DESC", function (err, res) {
        clrScr();
        console.log("\n Department Sales");
        console.log(" ---------------------------------------------------------\n");
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            var total_profit = 0;
            if (res[i].totalSales > 0) {
                var total_profit = res[i].totalSales - res[i].over_head_costs;
            }
            table.push(
                [{ hAlign: 'right', content: res[i].department_id }, res[i].department_name, { hAlign: 'right', content: fmtStr.formatFloat(res[i].over_head_costs) }, { hAlign: 'right', content: fmtStr.formatFloat(res[i].totalSales) }, { hAlign: 'right', content: fmtStr.formatFloat(total_profit) }]);
            // ['v0.1',{hAlign:'right',content:'1234'}, 'rauchg@gmail.com', '7 minutes ago']
        }
        console.log(table.toString());
        startSelection();
    });
};

function startSelection() {
    console.log("\n ---------------------------------------------------------\n");
    selectOptions();
};

function prompAddDepartment() {
    console.log("\n Add Department");
    console.log(" ---------------------------------------------------------\n");
    inquirer.prompt([
        {
            name: "dept",
            type: "input",
            message: "Enter Department Name : "
        },
        {
            name: "cost",
            type: "input",
            message: "Enter OverHead Cost : ",
            validate: validateNm.validateFloat
        }
    ]).then(function (addDept) {
        //add addDept
        processAddDepartment(addDept);
    });
};

function processAddDepartment(newDept) {
    var newdept = newDept.dept.toUpperCase().trim();
    var query = connection.query("SELECT * FROM departments WHERE UPPER(department_name)=?", [newdept], function (err, res) {
        if (!err) {
            if (res.length > 0) {
                clrScr();
                console.log("\n", "\033[31m", " Department " + newdept + " already exists.. Try Again!!", "\x1b[0m\n");
                prompAddDepartment();
            }
            else {
                addDepartment(newDept);
            }
        }
    });
};

function addDepartment(newDept) {
    var query = connection.query(
        "INSERT INTO departments SET ?",
        {
            department_name: newDept.dept,
            over_head_costs: newDept.cost
        },
        function (err, res) {
            if (err) {
                console.log(err)
            }
            else {
                clrScr();
                console.log("\n", "\033[32m", " Department " + newDept.dept + " added successfully", "\x1b[0m\n");
                startSelection();
            }
        }
    );
}