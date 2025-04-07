const allowedOrigins = require('./allowedOrigins');

//Creates a configuration object (corsOptions) that will be used for CORS (Cross-Origin Resource Sharing) settings in an Express.js server.
const corsOptions = {
    //This function determines whether a request’s origin (where the request is coming from) is allowed or blocked.
    origin : (origin, callback) => {
        //Checks if the origin (the domain making the request) exists in the allowedOrigins array.
        if(allowedOrigins.indexOf(origin) !== -1 || !origin){
            //If the origin is allowed, the callback function is called with: null (no error) : true (allow request, is permitted to process)
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    //Ensures that preflight requests (HTTP OPTIONS requests sent before GET, POST, etc.) return HTTP status 200 instead of 204 (default).
    optionsSuccessStatus: 200
}

module.exports = corsOptions;