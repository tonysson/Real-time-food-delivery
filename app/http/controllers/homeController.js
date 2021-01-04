const Menu = require('../../models/MenuModel')

function HomeController (){

    return {
        async index(req, res) {
            const pizzas = await Menu.find();
            return res.render('home', { pizzas })
        }
    }
}

module.exports = HomeController