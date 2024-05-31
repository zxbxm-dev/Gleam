module.exports = app => {
    const userController = require('../controller/user/signup')

    const express = require('express');
    const router = express.Router();

    router.post('/postResData', userController.createUser);
    router.get('/checkUserManagement', userController.getAllUsers);
    router.post('/approveUserManagement/:userId', userController.approveUser);
    router.delete('/deleteUserManagement/:userId', userController.deleteUser);

    app.use('/api', router);
};