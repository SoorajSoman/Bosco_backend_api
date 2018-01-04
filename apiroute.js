'use strict';

module.exports = function(router) {
    var redis = require('redis');
    let constants = require('./constants');
    var controller = require('./controller');
    var client = redis.createClient(constants.port,constants.ip)

    client.on('error', function (error) {
        console.log(error.message);
    });
    controller.setClient(client);


    router.route('/api')
    .get(controller.initial_endpoint);


    router.route('/api/login')
    .post(controller.getToken);

    router.route('/api/protected').get(controller.ensuretoken,controller.verifytoken);
};
