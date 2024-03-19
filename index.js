const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/User-Post');
const userRoute = require('./routes/userRoutes');

var passport = require('passport');
app.use(passport.initialize());

app.use(cors());
app.use('/api', userRoute)


const port = 8080;
app.listen(port, () => { console.log(`Server is running on ${port}`) });
