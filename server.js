require('dotenv').config();
const express = require('express')
const path = require('path');
const cors = require('cors')
const app = express()
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const PORT = 3000;

// Connect to MongoDB
connectDB();

//custom middleware logger
app.use(logger)

// Handle options credent - before CORStials check!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

// serve an entire directory using express.static:
// Serves static files (CSS, JS, images, etc.).
// app.use(express.static("public"));
app.use(express.static(path.join(__dirname, 'public')));

//routes
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

app.use(verifyJWT);
app.use('/employees', require('./routes/api/employees'));
app.use('/users', require('./routes/api/users'))

// Homepage route
// app.get('/', (req, res) => {
//     // to send response meesage to the client
//     // res.send('Hello World');  

//     // Serve index.html on the homepage route
//     res.sendFile(path.join(__dirname, "views", "index.html"));                
// });

// app.all('*', (req, res) => {
//     res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
// });

// app.use(function (err, req, res, next){
//     console.log(err.stack);
//     res.status(500).send(err.message);
// })

app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('MongoDB connection established successfully');
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});


