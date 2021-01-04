import {loadStripe} from '@stripe/stripe-js';
import { placeOrder } from './apiService';
import { CardWidget } from './CardWidget';


   // PLACE ORDER AND PAYEMENT FLOW

export async function initStripe(){

    const stripe = await loadStripe('pk_test_YMU1TqH2tyLt499ke8K1O3SL00IsYK7GAo');
    let card = null ;

    // function mountWidget(){
    //         const elements =  stripe.elements()
    //         let style = {
    //             base: {
    //                 color : '#32325d',
    //                 fontFamily: '"Helvetica Neue" , Helvetica , sans-serif ' ,
    //                 fontSmoothing : 'antialiased',
    //                 fontSize : '16px',
    //                 '::placeholder' : {
    //                     color : '#aab7c4'
    //                 }
    //             },
    //             invalid : {
    //                 color: '#fa755a',
    //                 iconColor: '#fa755a'
    //             }
    //         }

    //         card =  elements.create('card', {style , hidePostalCode: true})
    //         card.mount('#card-element');
    // }

    //on change on the select box
  
    const paymentType = document.querySelector("#paymentType")
       // to avoid the fact that if there is no order in cart page we have an error in the console
        if(!paymentType) return
          paymentType.addEventListener('change' , (e) => {
            if(e.target.value === "card"){
                //display widget
                card = new CardWidget(stripe)
                card.mount()
            }else{
                card.destroy()
            }
        })

 
    // when we click on "Commander" button
    const paymentForm = document.querySelector('#payment-form');
        if(paymentForm){
                // submit event on the form
                paymentForm.addEventListener('submit',  async (e) => {
                e.preventDefault()
                // we build our object of formData
                let formData = new FormData(paymentForm)
                let formObject = {}
                for(let [key , value] of  formData.entries()){
                    formObject[key] = value
                }

                // if the client choose "PAYER à la livraison" ? on passe la commande
                if(!card){
                    placeOrder(formObject)
                    return
                }

                // if the client choose "payer avec une carte bancaire"?
                // Verify card with stripe by creating a token
               const token =   await card.createToken()
               //add the token to the formObject
               formObject.stripeToken = token.id
               //place the order with our newly formObject
               placeOrder(formObject)
                
            })
       }

}