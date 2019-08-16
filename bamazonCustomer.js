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
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    connection.query("SELECT item_id, product_name, price FROM products", function(err, result, fields) {
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
            message: "What would you like to buy? Select the product ID",
            choices: itemIds
        }).then(function(answer) {
            console.log(answer);
            let orderItemID = answer['Item ID'];
            inquirer.prompt({
                name: "Quantity",
                type: "input",
                message: "How many would you like to buy? Type the number and hit enter"
            }).then(function(answer) {
                console.log(answer);
                let orderQuantity = answer.Quantity;
                inquirer.prompt({
                    name: "Confirmation",
                    type: "list",
                    message: "Would you like to place the order?",
                    choices: ["Yes", "No"]
                }).then(function(answer) {
                    console.log(answer); //remove this later
                    if (answer.Confirmation == "Yes") {
                        connection.query("SELECT stock_quantity, price FROM products WHERE item_id = ?", orderItemID, function(err, result, fields) {
                            // checks the stock
                            if (err) throw err;
                            console.log(result); //remove this later
                            if (result[0].stock_quantity >= orderQuantity) {
                                console.log("Your total is $" + orderQuantity * result[0].price);
                                connection.query("UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?", [orderQuantity, orderItemID], function(err, result, fields) {
                                    if (err) throw err;
                                    console.log("Order placed. Thank you for shopping with us!");

                                });
                            } else {
                                console.log("We're sorry, there was a problem processing your order due to insufficient stock!");
                            }
                        });
                    }
                });
            });
        });

    });
});