const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');



// Default route for user section
router.get('/', userController.index); 

// Route to show a user's profile
router.get('/:id', userController.show);





module.exports = router;







