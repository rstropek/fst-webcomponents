const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();

app.use(cors()); 

// Middleware to set the Content-Type header depending on the file extension
app.use((req, res, next) => {
    let ext = path.extname(req.path);
    if (ext === '') {
        // Assume .js if no extension
        ext = '.js';
    }

    if (ext === '.js') {
        res.type('text/javascript');
    } else if (ext === '.html') {
        res.type('text/html');
    }
    next();
});

// Custom middleware to handle default extension
app.use((req, res, next) => {
    if (path.extname(req.path) === '') {
        req.url += '.js';
    }
    next();
});

// Serve static files from the "dist" directory
app.use(express.static('dist/esm'));

// Start the server
const port = process.env.PORT || 3002;
app.listen(port, () => console.log(`Server is listening on port ${port}`));