sql = require('mysql')
inq = require('inquirer')

var mainMenu = ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']

var prodObjArr
var idCount
var dbId
var pId

var conn = sql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
});

start()
function start() {
    conn.connect()
    inq.prompt(
        {
            type: 'list',
            message: "What would you like to do?",
            choices: mainMenu,
            name: 'select'
        }).then(function (res) {
            switch (res.select) {

                case mainMenu[0]:
                    return productsList()
                case mainMenu[1]:
                    return productsListLow()
                case mainMenu[2]:
                    return productsList(addInv)
                case mainMenu[3]:
                    return addProd()
            }
        })
}
function productsList(cb) {
    conn.query("select * from products", function (err, res) {
        if (err) throw err
        prodObjArr = res
        idCount = res.length
        for (i = 0; i < idCount; i++) {
            console.log('ID: ' + res[i].item_id + '| Product: ' + res[i].product_name + ' | Price $' + res[i].price + ' | Quanity: ' + res[i].stock_quanity)
        }
        if (cb) {
            cb()
        }
    }
    )
};
function productsListLow() {
    conn.query("select * from products where stock_quanity < 5",
        function (err, res) {
            if (err) throw err
            prodObjArr = res
            idCount = res.length
            for (i = 0; i < idCount; i++) {
                console.log('ID: ' + res[i].item_id + '| Product: ' + res[i].product_name + ' | Price $' + res[i].price + ' | Quanity: ' + res[i].stock_quanity)
            }
        }
    )
};
function addInv() {
    inq.prompt({
        type: 'input',
        message: "What is the ID of the item you'd like to increase the inventory of?",
        name: 'proId'
    }).then(function (res) {
        pId = res.proId
        if (isNaN(pId) || pId > idCount) {
            console.log('You must select a numeric value between 1 and ' + idCount)
            return
        }
        inq.prompt({
            type: 'input',
            message: 'What is the new inventory?',
            name: 'newInv'
        }).then(function (resp) {
            if (isNaN(resp.newInv)) {
                console.log('Your entry must be numeric')
                return
            }
            changeInv(parseInt(pId), resp.newInv)
        })
    })
}

function changeInv(id, newCt) {
    conn.query('update products set ? where ?',
        [
            {
                stock_quanity: newCt
            },
            {
                item_id: id
            }
        ], function (err, res) {
            if (err) throw err
            console.log('Sucessfully updated!')
        })
}
function addProd() {
    inq.prompt(
        [
            {
                type: 'input',
                message: 'Product Name: ',
                name: 'pName'
            },
            {
                type: 'input',
                message: 'Product Department ',
                name: 'depart'
            },
            {
                type: 'input',
                message: 'Price: $',
                name: 'price'
            },
            {
                type: 'input',
                message: 'Inventory Count: ',
                name: 'inv'
            }
        ]
    ).then(function (res) {
        if (isNaN(res.price) || isNaN(res.inv)) {
            console.log('price and/or inventory must be numeric')
        }
        addProdQ = "insert into products (product_name, department_name, price, stock_quanity) values('" + res.pName + "', '" + res.depart + "', '" + res.price + "', '" + res.inv + "');"
        conn.query(addProdQ)
    })
}