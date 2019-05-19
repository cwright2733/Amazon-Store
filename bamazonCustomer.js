var inquirer = require("inquirer");
var Table = require('cli-table2');
var connection = require("./Connection");
var clrScr = require("./ClearScreen");
var formatJS = require("./FormatJS");
var validateNum = require("./ValidateJS");

var fmtStr = new formatJS();
var validateNm = new validateNum();
var options = ['View Products For Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Exit'];
var callFunctions = [displayProducts, displayLowInventory, addStock, prompAddProduct, connection.endConnection];

clrScr();
var dept_option = [];
getDepartments(dept_option);

startSelection();

function startSelection() {
    console.log("\n Amazon Manager Module");
    console.log(" ---------------------------------------------------------\n");
    selectOptions();
};

function selectOptions() {
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

function displayProducts() {
    var table = new Table({
        head: ['id', 'Name', 'Price', 'Inventory']
        , colWidths: [6, 20, 15, 15]
        , style: { compact: true, 'padding-left': 1 }
    });
    connection.query("SELECT * FROM products", function (err, res) {
        clrScr();
        console.log("\n Products For Sale");
        console.log(" ---------------------------------------------------------\n");
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            table.push(
                [{ hAlign: 'right', content: res[i].product_id }, res[i].product_name, { hAlign: 'right', content: fmtStr.formatFloat(res[i].price) }, { hAlign: 'right', content: fmtStr.formatFloat(res[i].stock_quantity) }]);

        }
        console.log(table.toString());
        startSelection();
    });
};

function displayLowInventory() {
    var table = new Table({
        head: ['id', 'Name', 'Price', 'Inventory']
        , colWidths: [6, 20, 15, 15]
        , style: { compact: true, 'padding-left': 1 }
    });
    connection.query("SELECT * FROM products", function (err, res) {
        clrScr();
        console.log("\n Products With Low Inventory");
        console.log(" ---------------------------------------------------------\n");
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            if (res[i].stock_quantity < 20) {
                table.push(
                    [{ hAlign: 'right', content: res[i].product_id }, res[i].product_name, { hAlign: 'right', content: fmtStr.formatFloat(res[i].price) }, { hAlign: 'right', content: res[i].stock_quantity }]);

            }
        }
        console.log(table.toString());
        startSelection();
    });
};

function addStock() {
    console.log("\n Add Inventory");
    console.log(" ---------------------------------------------------------\n");
    inquirer.prompt([
        {
            name: "id",
            type: "input",
            message: "Enter Product ID : ",
            validate: validateNm.validateInt
        },
        {
            name: "addStock_qty",
            type: "input",
            message: "How many would you like to add? : ",
            validate: validateNm.validateInt
        }

    ]).then(function (answer) {

        var itemid = answer.id;
        var addQty = answer.addStock_qty;
        processStockQuantity(itemid, addQty);
    });
};

function processStockQuantity(itemid, addqty) {
    var query = connection.query("SELECT * FROM products WHERE product_id=?", [itemid], function (err, res) {
        if (!err) {
            if (res.length > 0) {
                updateProduct(itemid, addqty, res[0].stock_quantity, res[0].product_name);
            }
            else {
                console.log("\033[31m", " Item not found.. Try Again!!", "\x1b[0m\n");
                addStock();
            }
        }

    });
};

function updateProduct(itemid, addQty, current_stock, product) {
    var query = connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: parseInt(current_stock) + parseInt(addQty)
            },
            {
                product_id: itemid
            }
        ],
        function (err, res) {
            if (err) throw err;
            clrScr();
            console.log("\n Inventory Added");
            console.log(" ---------------------------------------------------------\n", "\033[32m");
            console.log(" You Added  " + addQty + " quantity to " + product + "\n");
            confirmAddStock();
        }
    );
};

function confirmAddStock() {
    inquirer
        .prompt([
            {
                type: "confirm",
                message: "Would you like to add more inventory?",
                name: "confirm",
                default: true
            }
        ]).then(function (continu) {
            clrScr();
            if (continu.confirm) {
                addStock()
            }
            else {
                startSelection();
            }
        });
};

function prompAddProduct() {
   
    console.log("\n Add Product");
    console.log(" ---------------------------------------------------------\n");

    inquirer.prompt([
        {
            name: "item",
            type: "input",
            message: "Enter Product : "
        },
        {
            name: "dept",
            type: "list",
            message: "Enter Department : ",
            choices: dept_option
        },
        {
            name: "price",
            type: "input",
            message: "Enter Price : ",
            validate: validateNm.validateFloat
        },
        {
            name: "stockQty",
            type: "input",
            message: "Enter Stock Quantity : ",
            validate: validateNm.validateInt
        }

    ]).then(function (addProduct) {
        //add item
        processAddProduct(addProduct);
    });
};

function processAddProduct(newProduct) {
    var newItem = fmtStr.capitalizeString(newProduct.item.trim());
    var query = connection.query("SELECT * FROM products WHERE product_name=?", [newItem], function (err, res) {
        if (!err) {
            if (res.length > 0) {
                clrScr();
                console.log("\033[31m", "\n Product " + newItem + " already exists.. Try Again!!", "\x1b[0m\n");
                prompAddProduct();
            }
            else {
                addProduct(newProduct);
            }
        }

    });
};

function addProduct(newProduct) {
    var newFmtProduct = fmtStr.capitalizeString(newProduct.item);
    var query = connection.query(
        "INSERT INTO products SET ?",
        {
            product_name: newFmtProduct,
            department_name: newProduct.dept,
            price: newProduct.price,
            stock_quantity: newProduct.stockQty,
        },
        function (err, res) {
            if (err) { console.log(err) }
            else {
                clrScr();
                console.log("\n", "\033[32m", " product "+newFmtProduct+" added successully!!!", "\x1b[0m\n");
                startSelection();
            }
        }
    );
};

function getDepartments() {

    connection.query("SELECT department_name FROM departments ORDER BY department_name", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {

            dept_option.push(res[i].department_name);
        }

    });
}