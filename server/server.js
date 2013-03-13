var express = require("express"),
    path = require("path"),
    mongoose = require('mongoose');

var app = express();

// Config

app.configure(function () {
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, "../example")));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.listen(4242);