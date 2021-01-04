import axios from 'axios';
import Noty from 'noty';

/**
 * @description all us to place an order ie send request to our route
 * @param {all the data we get from our form} formObject 
 */
export function placeOrder(formObject) {

     axios.post('/orders' , formObject).then((res) => {
                new Noty({
                theme: "relax",
                layout: 'topLeft',
                progressBar: false,
                timeout: 1000,
                type: "success",
                text: res.data.message
            }).show();

            setTimeout(() =>{
                window.location.href = '/customer/orders' 
            }, 1000)

            }).catch(err =>{
                new Noty({
                theme: "relax",
                layout: 'topLeft',
                progressBar: false,
                timeout: 1000,
                type: "error",
                text: err.res.data.message
            }).show();
            })
}