var mysql = require("mysql");
var inquirer = require("inquirer");

//////////////// connecting to mysql////////////////
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon"
});
//////////////// logging mysql connection status and display items for sale////////////////
connection.connect(function(err) {

    //////////////// prompt questions start here//////////////// 
    inquirer.prompt({
        name: "managerOptions",
        type: "list",
        message: "Please choose an option",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
    }).then(function(answer) {
        console.log(answer); //remove this later
        if (answer.managerOptions == "View Products for Sale") {
            connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function(err, result, fields) {
                // checks the stock
                if (err) throw err;
                console.log(result); //remove this later
            });
        }
        if (answer.managerOptions == "View Low Inventory") {
            connection.query("SELECT item_id, product_name, price, stock_quantity FROM products WHERE stock_quantity <= 4", function(err, result, fields) {
                // checks the stock
                if (err) throw err;
                console.log(result);
            });
        }
        if (answer.managerOptions == "Add to Inventory") {
            connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function(err, result, fields) {
                // checks the stock
                if (err) throw err;
                console.log(result);
                let itemIds = [];
                for (i = 0; i < result.length; i++) {
                    itemIds.push(result[i].item_id);
                }

                //////////////// prompt questions start here//////////////// 
                inquirer.prompt({
                    name: "Item ID",
                    type: "list",
                    message: "What item would you like to add? Select the product ID",
                    choices: itemIds
                }).then(function(answer) {
                    console.log(answer);
                    let addQuantity = answer['Item ID'];
                    inquirer.prompt({
                        name: "Quantity",
                        type: "input",
                        message: "How many would you like to add? Type the number and hit enter"
                    }).then(function(answer) {
                        console.log(answer);
                        let quantityIncrease = answer.Quantity;
                        inquirer.prompt({
                            name: "Confirmation",
                            type: "list",
                            message: "Item ID and Quantity correct?",
                            choices: ["Yes", "No"]
                        }).then(function(answer) {
                            if (answer.Confirmation == "Yes") {
                                connection.query("SELECT stock_quantity, price FROM products WHERE item_id = ?", addQuantity, function(err, result, fields) {
                                    // checks the stock
                                    if (err) throw err;
                                    connection.query("UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id = ?", [quantityIncrease, addQuantity], function(err, result, fields) {
                                        if (err) throw err;
                                        console.log("Item added!");

                                    });
                                });
                            }
                        });
                    });
                });
            });
        }
        if (answer.managerOptions == "Add New Product") {
            inquirer.prompt({
                name: "Product Name",
                type: "input",
                message: "Please type product name and hit enter",
            }).then(function(answer) {
                let addProductName = answer["Product Name"];
                inquirer.prompt({
                    name: "Department Name",
                    type: "input",
                    message: "Please type department name and hit enter",
                }).then(function(answer) {
                    let addDeptName = answer["Department Name"];
                    inquirer.prompt({
                        name: "Item Price",
                        type: "input",
                        message: "Please type item price and hit enter",
                    }).then(function(answer) {
                        let addPrice = answer["Item Price"];
                        inquirer.prompt({
                            name: "Stock Quantity",
                            type: "input",
                            message: "Please type stock quantity name and hit enter",
                        }).then(function(answer) {
                            let addQuantity = answer["Stock Quantity"];
                            inquirer.prompt({
                                name: "Confirmation",
                                type: "list",
                                message: `Are you sure to add new item: ${addProductName}, ${addDeptName} Department, $${addPrice}, Qty:${addQuantity}`,
                                choices: ["Yes", "No"]
                            }).then(function(answer) {
                                if (answer.Confirmation == "Yes") {
                                    connection.query("insert into products values (null, ?,?,?,?)", [addProductName, addDeptName, addPrice, addQuantity], function(err, result, fields) {
                                        // checks the stock
                                        if (err) throw err;
                                        console.log("New item added!"); //remove this later
                                    });
                                }
                            });
                        });
                    });
                });

            });
        }
    });
});