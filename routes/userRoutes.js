const express = require('express');
const userRoute = express();
const multer = require('multer');
const path = require('path');
const userControllers = require('../controllers/userControllers');
userRoute.use(express.json());
userRoute.use(express.urlencoded({ extended: true }));
var passport = require("passport");
require('../middleware/auth')(passport);
const jwt = require('jsonwebtoken');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../public/userImage"));
    },
    filename: function (req, file, cb) {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
});
const upload = multer({ storage: storage });


userRoute.post('/register', upload.single('image'), userControllers.addUser);

userRoute.post('/login',  passport.authenticate('jwt', { session: false }),userControllers.loginUser);

userRoute.post('/create-post', passport.authenticate('jwt', { session: false }), userControllers.createPost);

userRoute.post('/view-post',passport.authenticate('jwt', { session: false }),userControllers.viewPosts);

userRoute.post('/delete-post',passport.authenticate('jwt', { session: false }),userControllers.deletePosts);

userRoute.post('/update-post',passport.authenticate('jwt', { session: false }),userControllers.updatePost);


module.exports = userRoute