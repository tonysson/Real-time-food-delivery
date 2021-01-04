
/**
 * @description Nous permet de verifier que l'utilsateur eest un admin
 * 
 * @param {request} req 
 * @param {response} res 
 * @param {next} next 
 */

 //IMPORTANT: req .user et isAuthenticated() est available ds le passport.js

function admin(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'admin') {
        return next()
    }
    return res.redirect('/')
}

module.exports = admin