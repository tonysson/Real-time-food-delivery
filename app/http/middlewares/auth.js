/**
 * @description 
 * nous permet de verifier si un utilisateur est authentifié
 * sinon on le renvoit sur la page de login
 * isAuthenticated() est une methode qui est disponible avec passport jS
 */

 function auth(req, res , next){

  if(req.isAuthenticated()){
      return next()
  }

  return res.redirect('/login')

 }

 module.exports = auth