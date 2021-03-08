//Install express server
const compression = require('compression')
const express = require('express');
const path = require('path');

const app = express();

app.use(compression())


app.use(function(req, res, next) {
    if (process.env.NODE_ENV || process.env.NODE_ENV === 'production') {
        if(req.headers["x-forwarded-proto"] === "https"){
            return next();
        }
        return res.redirect('https://'+req.hostname+req.url);
    }
    return next();
});

// Serve only the static files from the dist directory
app.use(express.static('dist/apps/intake-form'));

app.get('/*', function(req,res) {
    res.sendFile('dist/apps/intake-form/index.html', { root: '.' });
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);