const express = require('express');
const path = require('path');
const router = express.Router();

// Serve the index.html file for the root route
router.get('^/$|/index(.html)?', (req, res) => {
    // Serve index.html on the homepage route   
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

// Serve the 404.html file for all other routes
// router.all('*', (req, res) => {
//     res.status(404).sendFile(path.join(__dirname, '..', 'views', '404.html'));
// });

// Export the router
module.exports = router;
// This code defines a router for handling HTTP requests in an Express application.
// It serves an HTML file for the root route and a 404 error page for all other routes.
// The router is then exported for use in the main application file.
// The code uses the Express framework to create a router that handles HTTP requests.
// It serves an HTML file for the root route and a 404 error page for all other routes.
// The router is then exported for use in the main application file.
// The code uses the Express framework to create a router that handles HTTP requests.
// It serves an HTML file for the root route and a 404 error page for all other routes.
// The router is then exported for use in the main application file.
// The code uses the Express framework to create a router that handles HTTP requests.
// It serves an HTML file for the root route and a 404 error page for all other routes.
// The router is then exported for use in the main application file.