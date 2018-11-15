sql = require('mysql')
inq = require('inquirer')

var idCount
var proId
var prodObjArr
var currProd

var conn = sql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
});

onStart()
function onStart() {
    conn.connect(function (err) {
        if (err) throw err
        productsList()
    })
}

function productsList() {
    conn.query("select * from products", function (err, res) {
        if (err) throw err
        prodObjArr = res
        idCount = res.length
        for (i = 0; i < idCount; i++) {
            console.log('ID: ' + res[i].item_id + '| ' + res[i].product_name + ' | $' + res[i].price + '\n')
        }
        inq.prompt(
            {
                type: 'input',
                message: "Enter the ID of the product you'd wish to purchase",
                name: 'proId'
            }).then(function (firstRes) {
                if (isNaN(firstRes.proId) || firstRes.proId > idCount) {
                    console.log('You must enter a numeric ID between 1 and ' + idCount)
                    return
                }
                else {
                    proId = firstRes.proId
                    currProd = prodObjArr[proId - 1]
                    inq.prompt(
                        {
                            type: 'input',
                            message: 'How many ' + currProd.product_name + 's would you like to buy?',
                            name: 'qnt'
                        }
                    ).then(function (secRes) {
                        if (parseInt(secRes.qnt) > parseInt(currProd.stock_quanity)) {
                            console.log("We don't have enough to complete your order right now")
                            return
                        }
                        else {
                            processOrder(secRes.qnt)
                        }
                    })
                }
            })
    })

}
function processOrder(quanity) {
    newQ = (currProd.stock_quanity - quanity)
    conn.query('update products set ? where ?',
        [
            {
                stock_quanity: newQ
            },
            {
                item_id: proId
            }
        ], function(err, res){
            if (err) throw err
        })
        console.log('Order processed!')
}
