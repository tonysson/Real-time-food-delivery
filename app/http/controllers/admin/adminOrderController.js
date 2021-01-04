const Order = require('../../../models/OrderModel')

function adminOrderController() {
    return {
    index(req, res) {
        Order.find({ status: { $ne: 'completed' } }, null, { sort: { 'createdAt': -1 } }).populate('customerId', '-password').exec((err, orders) => {
            //si on est entrain de changer de status de la commande on fait dc une request vers notre api sinon on rend la page (<admin/adminOrders)
                if (req.xhr) {
                    return res.json(orders)
                    
                } else {
                    return res.render('admin/orders' )
                }
            })
        }
    }
}

module.exports = adminOrderController