# banazon

> Bamazon is a command line node app that manages product inventory. It provides command-line interfaces for customers and managers.

## Bamazon for customers
### Purchase product
![](img/purchase.gif)
![](img/purchasefail.gif)

## Bamazon for managers
List a set of menu options:

### View Products for Sale
![](img/view.gif)
### View Low Inventory
![](img/low.gif)
### Add to Inventory
![](img/add.gif)
### Add New Product
![](img/new.gif)


# How to Run
For the first time only: in MySQL Workbench, connect to `localhost`, port: `3306` and run `init.sql` and `dataInsert.sql` to initialize the database.

Then, in Bash, type:
```
node bamazonCustomer.js
node bamazonManager.js
```
