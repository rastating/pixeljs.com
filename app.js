var express = require('express');
var app = express();
var hbs = require('hbs');

app.set('view engine', 'html');
app.engine('html', require('hbs').__express);

app.use('/static', express.static('static'));

hbs.registerPartials('views/partials');

app.get ('/*', function (req, res, next) {
    if (req.headers.host.match(/^www/) === null ) {
        res.redirect(301, 'http://www.' + req.headers.host + req.url);
    }
    else {
        return next();
    }
});

app.get('/', function (req, res){
    res.render('overview', { title: 'Overview', pageIsOverview: true });
});

app.get('/getting-started', function (req, res){
    res.render('getting_started.html', { title: 'Getting Started', pageIsGettingStarted: true });
});

app.get('/examples/pong', function (req, res) {
    res.render('pong', { title: 'Pong', pageIsAnExample: true });
});

app.get('/examples/coin-collector', function (req, res) {
    res.render('coin_collector', { title: 'Coin Collector', pageIsAnExample: true });
});

app.get('/faq', function (req, res) {
    res.render('faq', { title: 'FAQ', pageIsFAQ: true });
});

app.get('/changelog', function (req, res) {
    res.render('changelog', { title: 'Changelog', pageIsChangeLog: true });
});

app.get('/documentation', function (req, res) {
    res.render('documentation', { title: 'Documentation', pageIsDocumentation: true });
});

app.listen(3000);
console.log('Listening on port 3000');