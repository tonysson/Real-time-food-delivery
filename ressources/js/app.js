import axios from 'axios';
import Noty from 'noty';
import { initAdmin } from './admin';
import moment from 'moment' ;
import { initStripe } from './stripe';

/**======ADD TO CART ============ */

//Selectors
let addToCart = document.querySelectorAll('.add_to_cart')
let cartCounter = document.getElementById('cartCounter')


// cart functionality
function updateCart(pizza) {
  
    // send request to our api to add cart functionality
     axios.post('/update-cart', pizza).then(res => {
    cartCounter.innerText = res.data.totalQty;
       new Noty({
           theme:"relax",
           layout: 'topLeft',
           progressBar:false, 
           timeout:1000,
           type: "success",
           text: "1 pizza ajouté au panier"
       }).show();

   }).catch(error => {
       new Noty({
           theme: "relax",
           layout: 'topLeft',
           progressBar: false,
           timeout: 1000,
           type: "error",
           text: "Something went wrong"
       }).show();
   })
}

//click event on every add to cart button
addToCart.forEach((btn) => {
    btn.addEventListener('click' , (e) => {
        let pizza = JSON.parse(btn.dataset.pizza)
        updateCart(pizza)
    })
})


//Remove alert message after x second
const alertMsg = document.querySelector('#success-alert')
if(alertMsg){
    setTimeout(() => {
        alertMsg.remove()
    }, 3000)
}

//Updated status rendered
let statuses = document.querySelectorAll('.status_line')
// console.log(statuses);
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? hiddenInput.value : null;
order = JSON.parse(order)
//Nous permet de creer un element html
let time = document.createElement('small')
// console.log(JSON.parse(order));

function updatedStatus(order) {

    statuses.forEach((status) => {
        status.classList.remove('step_completed')
        status.classList.remove('current')
    })

    let stepCompleted = true;

    statuses.forEach((status) => {

        let dataProp = status.dataset.status;

        //Nous permet d'ajouter la class step_completed
        if (stepCompleted) {
            status.classList.add('step_completed')
        }

        //order.status in database
        // nous permet d'ajouter la class current
        if (dataProp === order.status) {
            stepCompleted = false;
            //on affiche le time a laquelle le order a été mis a jour
            time.innerText = moment(order.updatedAt).format('hh:mm A')
            status.appendChild(time)

            if (status.nextElementSibling) {
                status.nextElementSibling.classList.add('current')
            }
        }
    })
    

}

updatedStatus(order);

//PLACE ORDER AND PAYMENT
initStripe()

//SOCKET
let socket = io()

//Join
if (order) {
    socket.emit('join', `order_${order._id}`) 
}

// Lorsqu'une commande est placée
let adminAreaPath = window.location.pathname
// console.log(adminAreaPath);
if (adminAreaPath.includes('admin')) {
    // INIT LE DASHBOARD ADMIN
    initAdmin(socket)
    socket.emit('join', 'adminRoom')
}

// Event recu par le client side envoyé par le server.js kd un status est changé
socket.on('orderUpdated', (data) => {
    const updatedOrder = { ...order }
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    updatedStatus(updatedOrder)

    new Noty({
        theme: "relax",
        layout: 'topLeft',
        progressBar: false,
        timeout: 1000,
        type: "success",
        text: "Commande mis à jour"
    }).show();

    // console.log(data)
    
})

/*==================== SHOW MENU ====================*/
const showMenu = (toggleId, navId) =>{
    const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId)
    
    // Validate that variables exist
    if(toggle && nav){
        toggle.addEventListener('click', ()=>{
            // We add the show-menu class to the div tag with the nav__menu class
            nav.classList.toggle('show-menu')
        })
    }
}
showMenu('nav-toggle','nav-menu')

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction(){
    const navMenu = document.getElementById('nav-menu')
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove('show-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*==================== SCROLL REVEAL ANIMATION ====================*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '30px',
    duration: 2000,
    reset: true
});

sr.reveal(`.home__data, .home__img,
            .about__data, .about__img,
            .services__content, .menu__content,
            .app__data, .app__img,
            .contact__data, .contact__button,
            .footer__content`, {
    interval: 200
})
