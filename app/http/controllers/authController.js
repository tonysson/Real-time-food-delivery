const User  = require('../../models/UserModel');
const bcrypt = require('bcrypt');
const passport = require('passport');


function authController(){

     //REDIRECT SELON SI ON EST UN SIMPLE USER OU ADMIN
    const _getRedirectUrl = req => {
        return req.user.role === 'admin' ? '/admin/orders' : '/customer/orders' 
    }


    return {

        /**
         * @description Render the login page
         */
        login(req, res) {
            res.render('auth/login')
        },

        /**
         * @description Login Logic with passport Js
         * @param {request} req 
         * @param {response} res 
         */

        postLogin(req, res , next){

            const {  email, password } = req.body;
            // no data provide?
            if ( !email || !password) {
                req.flash('error', 'Tous les champs sont requis')
                return res.redirect('/login')
            }

            passport.authenticate('local' , (err , user , info)=>{
                if(err){
                    req.flash('error', info.message)
                    return next(err)
                }

                if(!user){
                    req.flash('error', info.message)
                    return res.redirect('/login')
                }

                req.logIn(user , (err) =>{
                    if(err){
                        req.flash('error', info.message)
                        return next(err)
                    }

                    return res.redirect(_getRedirectUrl(req))
                })
            })(req, res , next)
        },

        /**
         * @description Render register page
         */
        register(req, res){
            res.render('auth/register')
        },

        /**
         * @description Registration logic
         * @param {request} req 
         * @param {response} res 
         */
      async  postRegister(req, res) {
            const {name , email , password } = req.body
            // no data provide?
            if(!name || !email || !password){
                req.flash('error', 'Tous les champs sont requis') // to access it in front we do messages.error
                req.flash('name', name) // permet de maintenir la valeur de l'input saisie par le user en cas d'erreur
                req.flash('email', email)
                return res.redirect('/register')
            }

            // check if email exist?
            User.exists({email: email}, (err , result) => {
                if(result){
                    req.flash('error', 'Email existe déjà')
                    req.flash('name', name) 
                    req.flash('email', email)
                    return res.redirect('/register')
                }
            })

            //Hashed password
            const hashedPassword = await bcrypt.hash(password, 10)

            //Create user
            const user = new User({
                name,
                email,
                password:hashedPassword
            })

            user.save().then((user) => {
                return res.redirect('/login')
            }).catch(err => {
                req.flash('error', 'Une erreur est survenue')
                return res.redirect('/register')
            })
        },
        
        /**
         * logout() est une function definie avec passport js
         * @description Nous permet de se deconnecter
         * @param {request} req 
         * @param {response} res 
         */
        logout(req, res) {
            req.logout()
            return res.redirect('/login')
        }
    }

}


module.exports = authController






