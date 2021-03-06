var express = require('express');
var app = express();
var hbs = require('hbs');
var marked = require('marked');
var documentedClasses = require(__dirname + '/documentation/classes.json');

marked.setOptions({
    sanitize: true
});

app.set('view engine', 'html');
app.engine('html', require('hbs').__express);

app.use(app.router);
app.use('/static', express.static('static'));

var parseMarkdown = function (markdown) {
    return marked(markdown).trim().replace(/^<p>/, '').replace(/<\/p>$/, '');
};

hbs.registerPartials('views/partials');
hbs.registerHelper('parseMarkdown', parseMarkdown);
hbs.registerHelper('equal', function(lvalue, rvalue, options) {
    if (arguments.length < 3) {
        throw new Error("Handlebars Helper equal needs 2 parameters");
    }

    if (lvalue != rvalue) {
        return options.inverse(this);
    }
    else {
        return options.fn(this);
    }
});

app.get ('/*', function (req, res, next) {
    if (req.headers.host.match(/^www/) === null ) {
        if (process.argv.indexOf('debug') === -1) {
            res.redirect(301, 'http://www.' + req.headers.host + req.url);
        }
        else {
            return next();
        }
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
    res.redirect(301, '/documentation/AnimatedSprite');
});

app.get('/documentation/*', function (req, res) {
    try {
        var regex = new RegExp(/^\/documentation\/([a-zA-Z0-9]+)(\/(properties|methods)(\/([a-zA-Z0-9_]+)))?$/);
        var matches = req.url.match(regex);
        var className = matches[1];
        var memberType = matches[3];
        var memberName = matches[5];

        if (className === undefined || documentedClasses.names.indexOf(className) == -1) {
            res.render('404', { title: 'Uh oh...' });
        }
        else {
            var classDocumentation = require(__dirname + '/documentation/' + className + '/summary.json');
            if (memberType === undefined) {
                res.render('module_documentation', {
                    title: className + ' Documentation',
                    pageIsDocumentation: true,
                    module: classDocumentation,
                    supportedClasses: documentedClasses.names,
                    isClassDocumentation: true,
                    supportedProperties: classDocumentation.properties,
                    supportedMethods: classDocumentation.methods
                });
            }
            else {
                var json = require(__dirname + '/documentation/' + className + '/' + memberName + '.json');

                res.render('module_documentation', {
                    title: className + '.' + memberName + ' Documentation',
                    pageIsDocumentation: true,
                    module: json,
                    supportedClasses: documentedClasses.names,
                    isPropertyDocumentation: (memberType === 'properties'),
                    supportedProperties: classDocumentation.properties,
                    supportedMethods: classDocumentation.methods
                });
            }
        }
    }
    catch (err) {
        res.render('404', { title: 'Uh oh...' });
    }
});

app.use(function(req, res) {
    res.render('404', { title: 'Uh oh...' });
});

app.listen(3000);
console.log('Listening on port 3000');
