

function cartController() {

    return {
       
        /**
         * @description Render the cart page
         * @param {request} req 
         * @param {response} res 
         */
        index(req , res) {
            res.render('customers/cart')
        },

        /**
         * @description Add to cart functionality
         * @param {request} req 
         * @param {response} res 
         */

        update(req, res) {
            //strucure of our cart object
            // let cart = {
            //     items :{
            //         pizzaId : {item : pizzaObject , qty :0}
            //     },
            //     totalQty: 0,
            //     totalPrice: 0
            // }

             // si on a rien dans la session? on créé la cart et on la met ds la session
             //items = {item: pizzaObject , qty= 0}
            if(!req.session.cart){
                req.session.cart = {
                    items : {} , 
                    totalQty: 0,
                    totalPrice: 0
                }
            }

            let cart = req.session.cart
            // console.log(req.body)
            //   check if item does not exist in cart? we add it and we update the totalQty and the totalPrice
              if(!cart.items[req.body._id]){
                  cart.items[req.body._id] = {
                      item : req.body, //tout l'objet
                      qty : 1
                  },

                  cart.totalQty =   cart.totalQty + 1
                  cart.totalPrice +=  req.body.price
              }else{
                   //au cas on deja la pizza ds la cart, on ajoute 1 a la quantité deja exstante et on update le prix et la quantité
                   cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1
                   cart.totalQty =   cart.totalQty + 1
                   cart.totalPrice +=  req.body.price
              }
                console.log(req.session)
            return res.json({totalQty : req.session.cart.totalQty})
        }

    }
}

module.exports = cartController