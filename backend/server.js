require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
var passport = require('passport');
var crypto = require('crypto');
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const postsRoutes = require('./routes/postsRoute');
const dataRoutes = require('./routes/dataRoutes');
const cors = require('cors');
const gfs = require("./config/db").gfs;


const app = express();


//------------------------------------Connect To database--------------------------------------------------

connectDB();
const connection = mongoose.connection;
const MongoStore = require('connect-mongo')(session);


//------------------------------------Essential Middlewares-----------------------------------------------

app.use(express.json());
app.use(express.urlencoded({extended: true}));



//-------------------------Enable CORS----------------------------------

const corsOptions ={
    origin:'http://localhost:3000', 
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
    credentials:true,            //access-control-allow-credentials:true 
    optionsSuccessStatus: 200  
}

app.use(cors(corsOptions));



//-------------------------Session Setup---------------------------



const sessionStore = new MongoStore({ mongooseConnection: connection, collection: 'sessions' });

app.use(session({
    secret: "mysecret",
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        sameSite: 'none',
        secure : true,
        maxAge: 1000 * 60 * 60 * 24 // Equals 1 day (1 day * 24 hr/1 day * 60 min/1 hr * 60 sec/1 min * 1000 ms / 1 sec)
    }
}));

//----------------------------Passport Auth---------------------------

require('./config/passport');

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    next();
});


//------------------------------Routes---------------------------------------


app.use(postsRoutes);
app.use(dataRoutes);
app.use(userRoutes);



//--------------------------------Create Server--------------------------------------


const PORT = process.env.PORT || 5000 ;

app.listen(PORT , () => console.log(`Server is running on ${PORT} `));