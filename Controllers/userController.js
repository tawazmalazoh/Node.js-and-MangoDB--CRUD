const User = require('../Models/employee');

const userController = {
    // Default user route action
    index(req, res) {    
        res.render('index'); 
    },


   // show register page 
   userSignup(req, res) {
            res.render('signup'); 
        },

    
};


module.exports = userController;



