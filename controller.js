/**
 * Created by Cyber
 */

const fs = require('fs-extra');
var jwt = require('jsonwebtoken');
let constants = require('./constants');
var privateKey = fs.readFileSync('./private.key', 'utf8');
// Public Key (must read as utf8)
var publicKey = fs.readFileSync('./public.key', 'utf8');
var client;

//signing options
var signOptions = {
    issuer: constants.iss,
    subject: constants.sub,
    audience: constants.aud,
    expiresIn: constants.exp,
    algorithm: "RS256"
};

//verify options
var verifyOptions = {
    issuer: constants.iss,
    subject: constants.sub,
    audience: constants.aud,
    maxAge: constants.exp,
    algorithms: ["RS256"]
};


exports.initial_endpoint = function (req, res) {
    res.json({
        description: 'Please authenticate!'
    });
};

exports.getToken = function (req, res) {

    // insert code here to actually authenticate, or fake it
    console.log(req.body);

    if (req.body.constructor == Object && Object.keys(req.body).length === 0) {
        console.log("error");
        res.json({
            message: 'request body empty!'
        });


    } else {
        if (Object.keys(req.body).includes("urlParameter")) {
            var user = req.body.urlParameter;
            // then return a token, secret key should be an env variable
            var token = jwt.sign({ user }, privateKey, signOptions);
            var validhit = req.body.validhit;
            client.set(token, validhit, client.print);
            res.json({
                message: 'Authenticated! Use this token in the Authorization header',
                token: token
            });
        } else {

            res.json({
                message: 'invalid request body!'
            });
        }
    }
};

exports.verifytoken = function (req, res) {
    client.get(req.token, function (error, value) {
        if (error) {
            throw error;
        } else {
            var hit_count = value;
            console.log(hit_count);
            if (hit_count > 0) {
                hit_count--;
                console.log(hit_count);
                client.set(req.token, hit_count, client.print);
                jwt.verify(req.token, publicKey, verifyOptions, function (err, data) {
                    if (err) {
                        console.log(err.message);

                        res.json({
                            message: err.message,

                        });
                    } else {
                        res.json({
                            message: 'JWT Payload',
                            data: data
                        });
                    }
                })
            } else {
                res.json({
                    message: "invalid token",

                });
            }

        }

    })

};
exports.ensuretoken = function ensureToken(req, res, next) {
    const bearerHeader = req.headers["authorization"];
    console.log(typeof bearerHeader);
    if (typeof bearerHeader !== 'undefined') {
        req.token = bearerHeader;
        next();
    } else {
        res.sendStatus(403);
    }
};

exports.setClient = function (inClient) {
    client = inClient;
}
 