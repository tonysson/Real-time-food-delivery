const LocalStrategy = require('passport-local').Strategy ; 
const User = require('../models/UserModel');
const bcrypt = require('bcrypt');


function init(passport){
    
    passport.use(new LocalStrategy({usernameField: 'email'}, async (email , password , done)=> {
      
        //Login
        //Check if email exists
       const user =  await User.findOne({email: email})

       if(!user){
           return done(null , false , {message : 'Aucun utilisateur avec cet Email'})
       }

       // if user find we compare password in Db with frontend password

       bcrypt.compare(password, user.password).then(match => {

           if(match){
               return done(null , user, {message:'Connexion réussie'})
           }

           return done(null , false , {message:'Email ou mot de passe érroné'})
       }).catch(err => {
           return done(null , false , {messsage: 'Une erreur est survenue'})
       })

    }))


    // serializeUser determines which data of the user object should be stored in the session. The result of the serializeUser method is attached to the session
    passport.serializeUser((user , done) => {
        done(null , user._id)
    })

    // The user._id (you provide as the second argument of the done function in serialise) is saved in the session and is later used to retrieve the whole object via the deserializeUser function.
    passport.deserializeUser((id , done) =>  {
        User.findById(id , (err , user) => {
            done(err , user)
        })
    })

    // IMPORTANT: The user is available in req.user


}

module.exports = init