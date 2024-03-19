const User = require('../model/userModel');
const bcrypt = require('bcrypt');
const Post = require('../model/postModel');
const jwt = require('jsonwebtoken');
const config=require('../config/config')
// Convert a password to secure Password
const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        console.log(passwordHash);
        return passwordHash;
    } catch (error) {
        console.log(error.message);
    }
}


const createToken = async (data) => {
    try {
        const userData = {
            userId: data._id,
            email: data.email
        }
        const token = jwt.sign({ userData }, config.secret_jwt, { expiresIn: "2h" });
        return token;
    } catch (error) {
        console.log(error.message);
    }
}


// Register a new  user
const addUser = async (req, res) => {
    try {
        const reqBody = req.body;
        const { name, email, password, mobile } = reqBody;
        // const { image } = req.file.filename;

        if (!name || !email || !password || !mobile)
            return res.status(400).json({ success: false, message: "All fields are  required" });

        const secure_Password = await securePassword(password);
        const isExist = await User.findOne({ email: email });
        // check if user already exists in the database
        if (!isExist) {
            await User.create({
                name: name,
                email: email,
                password: secure_Password,
                mobile: mobile,
                // image: image
            });
            res.status(200).send({ success: true, message: "User has been Registered successfully." });
        } else {
            res.status(400).json({ success: false, message: "User allready exists " });
        }
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

//Login And genrate a token 
const loginUser = async (req, res) => {
    try {
        const reqBody = req.body;
        const { email, password } = reqBody;
        if (!email || !password)
            return res.status(400).json({ success: false, message: "All fields  are required" });
        let userData = await User.findOne({ email: email });

        if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.password);
            if (passwordMatch) {
                const token = await createToken(userData);
                res.status(200).json({ success: true, message: "Login  Successfully", data: userData, token: token })

            } else {
                res.status(400).json({ success: false, message: "Email Or Password is Wrong!." });
            }
        } else {
            res.status(400).json({ success: false, message: "Email Or Password is Wrong!." });
        }

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}


const createPost = async (req, res) => {
    try {
        const userData = req.user.userData;
        const reqBody = req.body;
        const { Title, Body, latitude, longitude } = reqBody;

        if (!Title || !Body || !latitude || !longitude)
            return res.status(400).json({ success: false, message: "Please provide a Post!" });
        const validUser = await User.findOne({ email: userData.email });
        if (validUser) {
            await Post.create({
                Created_By: validUser._id,
                Title: Title,
                Body: Body,
                location: {
                    type: "Point",
                    coordinates: [parseFloat(longitude), parseFloat(latitude)]
                }
            });
            res.status(200).json({ success: true, message: 'Post created successfully!' });

        } else {
            res.status(400).json({ success: false, message: "Invalid User" });
        }

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });

    }
}



const updatePost = async (req, res) => {
    try {
        const userData = req.user.userData;
        const reqBody = req.body;
        const { Title, Body } = reqBody;
        if (!Title || !Body)
            return res.status(400).json({ success: false, message: "Please provide a Post!" });

        const validUser = await User.findOne({ email: userData.email });
        if (validUser) {
            const isPost = await Post.findOne({ Created_By: userData._id });
            if (isPost) {
                await Post.findOneAndUpdate({ Created_By: userData._id }, { $set: { Title: Title, Body: Body } });
                res.status(200).json({ success: true, message: 'Post updated successfully!' });
            } else {
                res.status(400).json({ success: false, message: "Post isn't avilible!" });
            }
        } else {
            res.status(400).json({ success: false, message: 'User not valid for update post!' });
        }
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

// View all posts
const viewPosts = async (req, res) => {
    try {
        const userData = req.user.userData;
        const validUser = await User.findOne({ email: userData.email });
        if (validUser) {
            let posts = await Post.find({ Created_By: validUser._id });
            res.status(200).json({ success: true, message: "All Posts are", posts });
        } else {
            res.status(400).json({ success: false, message: "User not valid for views post!" });
        }

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}


// Delete Post
const deletePosts = async (req, res) => {
    try {
        const userData = req.user.userData;
        const validUser = await User.findOne({ email: userData.email });
        if (validUser) {
            const isPost = await Post.findOne({ Created_By: validUser._id });
            if (isPost) {
                await findOneAndDelete({ Created_By: validUser._id });
                res.status(200).json({ success: true, message: "Post  Deleted Successfully!" });
            } else {
                res.status(400).json({ success: false, message: "You don't have any post" });
            }
        } else {
            res.status(400).json({ success: false, message: "Unauthorized User!" });
        }

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}



module.exports = {
    addUser,
    loginUser,
    createPost,
    updatePost,
    viewPosts,
    deletePosts
}