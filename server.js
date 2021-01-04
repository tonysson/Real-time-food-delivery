const express = require('express');
const ejs = require('ejs');
const path = require("path")
const expressLayout = require('express-ejs-layouts');
const passport = require('passport');
const session = require('express-session');
const flash = require('express-flash');
const MongoDbStore = require('connect-mongo')(session);
require('dotenv').config();
const mongoose = require('mongoose');
const Emitter = require('events')

const app = express()

const PORT = process.env.PORT || 5500

//DBB CONNECTION
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

//mongoose connection
const connection = mongoose.connection;
connection.once('open', () => {
    console.log(`DB connection successfully`)
    
}).catch(error => console.log(error))


//session store , nous permet de creer une collection pour pouvoir stocker notre cookie
let mongoStore = new MongoDbStore({
    mongooseConnection: connection,
    collection: "sessions"
});

//event Emitter || pour socket io
const eventEmitter = new Emitter()
app.set('eventEmitter',eventEmitter)

//session config
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: mongoStore,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } //24hours
}))

//Passport config (doit etre placé apres la config de session)
const passportInit = require('./app/config/passport');
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())

//flash
app.use(flash())

//Assets set up
app.use(express.static('public'))

//like body parser
app.use(express.urlencoded({extended:false}))
//express-json
app.use(express.json());


//Global middleware , quand on utilise la variable session ds le ejs il nous dit: session is not defined , to avoid that we set this middlware
app.use((req, res, next) => {
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})

//set Template engine
app.use(expressLayout); // nous permet de communiquer avec notre layout.ejs
app.set('views' , path.join(__dirname , '/ressources/views'));
app.set('view engine' , 'ejs')

//routes
require('./routes/web')(app)
app.use((req, res) => {
    res.status(404).render('errors/404')
})

// server
const server = app.listen(PORT  , () => {
   console.log(`app listening on port ${PORT}`);
})

//SOCKET
const io = require('socket.io')(server);

io.on('connection', (socket) => {
    //Join
    socket.on('join', (orderId) => {
        // console.log(orderId);
    socket.join(orderId)
   })
    
})

// Event envoyé par l'eventEmitter quand le status est mis a jour (cf adminStatusController)
//socket envoit le changement au room orderId crée par le client side
eventEmitter.on('orderUpdated', (data) => {
    io.to(`order_${data.id}`).emit('orderUpdated' , data)
});

//Quand une commande est placée
eventEmitter.on('orderPlaced', (data) => {
    io.to('adminRoom').emit('orderPlaced' , data)
})