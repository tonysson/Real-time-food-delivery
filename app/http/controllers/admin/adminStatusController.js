const Order = require('../../../models/OrderModel');

function adminStatusController() {
    
    return {

        /**
         * @description Permet d'envoyer une request POST et de mettre a jour le status dans Order DOCUMENT
         * Confère  markup (ressources/js/admin.js)
         * @param {request} req 
         * @param {response} res 
         */

        updateStatus(req, res) {
            
            Order.updateOne({ _id: req.body.orderId }, { status: req.body.status }, (err, data) => {
                
                if (err) {
                    return res.redirect('/admin/orders');
                }

                // Dés lors que le status est changé l'eventEmitter envoit un event au server node qui informe socket qui le transmet au client side
                //  Emit Event
                const eventEmitter = req.app.get('eventEmitter')
                eventEmitter.emit('orderUpdated', { id: req.body.orderId, status: req.body.status })
                return res.redirect('/admin/orders');
            })
        }

    }
}

module.exports = adminStatusController