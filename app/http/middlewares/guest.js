/**
 * @description nous permet de verifier si un utilisateur est authentifié
 * sinon on le renvoit sur la page d'accueil
 * Nous permet egalement d'eviter l'acces aux page login et register via l'url 
 * isAuthenticated() est une methode qui est disponible avec passport jS
 */
function guest(req, res , next){

    if(!req.isAuthenticated()){
        return next()
    }
    return res.redirect('/')
}

module.exports = guest