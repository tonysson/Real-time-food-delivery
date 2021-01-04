const Order = require('../../../models/OrderModel')
const moment = require('moment');
const stripe = require('stripe')(process.env.STRIPE_KEY)


function orderController() {

    return {

        /**
         * @description Nous permet d'afficher la page des commandes
         * @param {request} req 
         * @param {response} res 
         */

        async  index(req, res){
            
            const orders = await Order.find({customerId : req.user._id} , null , {sort:{'createdAt': -1}})
            res.header('Cache-Control', 'no cache , private , no-store , must-revalidate , max-stale=0 , post-check=0,pre-check=0')
            res.render('customers/orders' , {orders: orders , moment:moment})
        },



        /**
         * @description Nous permet de placer une commande
         */
        store(req, res){
          
            //validate request
            const {phone , address , stripeToken , paymentType} = req.body;
            if(!phone || !address){
                return res.status(422).json({message : 'Tous les champs sont requis'})
            }

            // IMPORTANT: The user is available in req.user with passport.js
            // IMPORTANT: The cart items are store in the session
            const order = new Order({
                customerId : req.user._id,
                items: req.session.cart.items,
                phone,
                address
            })

             order.save().then(result => {

                //allow us to get the name of the customer
                Order.populate(result, { path: 'customerId' }, (err, placedOrder) => {
                   
                 // Stripe payement
                 if(paymentType === 'card'){
                    stripe.charges.create({
                        amount:  req.session.cart.totalPrice * 100 ,
                        source : stripeToken,
                        currency: 'usd',
                        description: `Pizza order : ${placedOrder._id} `
                    }).then(() => {

                        // change the paymentStatus and paymentType in DB
                        placedOrder.paymentStatus = true
                        placedOrder.paymentType = paymentType

                        placedOrder.save().then((ord) =>{
                             //Nous permet d'envoyer une notification en temps réel a l'admin lorsqu'une commande a été passé
                            // Emit Event
                            const eventEmitter = req.app.get('eventEmitter')
                            eventEmitter.emit('orderPlaced', ord)
                              //clear cart
                             delete req.session.cart
                             return res.json({message : 'Commande passée et payement réussi'})
                        }).catch(err => console.log(err))
                    }).catch(err => {
                          //clear cart
                        delete req.session.cart
                        return res.json({message : 'Commande passée ,Votre payement a échoué'})
                    })
                  }else{
                       delete req.session.cart
                        return res.status(201).json({message : 'Votre commande est envoyée'})
                  }
                })
            }).catch(err => {
                  return res.status(500).json({message : 'Une erreur est survenue'})
            })
        },

        /**
         * @description render a single order page and track the order
         * @param {request} req 
         * @param {response} res 
         */
       async showSingleOrder(req, res) {
              const order = await Order.findById(req.params.id);
           //Authorized user , 
           //IMPORTANT : req.user._id === login user (disponible avec passport js)
           // on ne compare pas deux objectId c'est pour ca qu'on na mi toString()
           if (req.user._id.toString() === order.customerId.toString()) {
               res.render('customers/singleOrder', {order})
           } else {
               res.redirect('/')
           }
        }
    }
}

module.exports = orderController