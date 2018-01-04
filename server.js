/**
 * Created by Cyber on 12/15/2017.
 */
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var router = new require( 'express' ).Router()



app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
}));



var  routes = require('./apiroute');

routes(app);

app.listen(3000, function () {
    console.log('listening on port 3000!');
});
