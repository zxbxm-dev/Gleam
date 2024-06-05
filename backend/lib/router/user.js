module.exports = app => {
    const userController = require('../controller/user/signup')
    const signinController = require("../controller/user/signin")
    
    const express = require('express');
    const router = express.Router();

    router.post('/postResData', userController.createUser);
    router.get('/checkUserManagement', userController.getAllUsers);
    router.post('/approveUserManagement/:userId', userController.approveUser);
    router.delete('/deleteUserManagement/:userId', userController.deleteUser);
    router.post('/editchainlinker', userController.userleaves);

    router.post('/login', signinController.login);
    router.post('/postFindID', signinController.findUsername);

    app.use('/api', router);
};