"use strict";
var Reasoner = require("../model/reasoner/Reasoner").default;
var logger = require("../logger/logger");
var yaml = require('js-yaml');
var fs = require('fs');
var http = require('http');
var https = require('https');
var port = (process.env.PORT || 10082);
var securePort = (process.env.SECURE_PORT || 10045);

module.exports = {

    initialize: () => {

        var logger = require("../logger/logger");
        var express = require('express');
        var bodyParser = require('body-parser');
        var app = express();

        app.use(bodyParser.json()); // support json encoded bodies
        app.use(bodyParser.urlencoded({
            extended: true
        })); // support encoded bodies

        app.post('/reasoner/api/v1/execute', function (req, res) {
            var data = yaml.safeLoad(req.body[0].content);

            // Configure the CSP reasoner
            var reasoner = new Reasoner({
                type: 'local', // type value also can be 'api' or 'docker'
                folder: 'csp_files' // name of the folder which stores .mzn, .fzn and .ozn temporary files
            });

            // Solve CSP
            reasoner.solve(data, (error, stdout, stderr, isSatisfiable) => {

                if (error && !stderr) {

                    logger.error("Unable to execute CSP");
                    logger.error("Model:", data);
                    logger.error("Error:", error);
                    logger.info("Sending default error response to user");

                    res.send({
                        error: "Unable to execute CSP"
                    });

                }
                if (error && stderr) {

                    res.send({
                        error: error,
                        stdout: stdout,
                        stderr: stderr,
                        isSatisfiable: isSatisfiable
                    });

                } else {

                    logger.info("Success execution. Sending response to user");

                    res.send({
                        stdout: stdout,
                        stderr: stderr,
                        isSatisfiable: isSatisfiable
                    });

                }

            });
        });


        // Start the server
        https.createServer({
            key: fs.readFileSync('certs/privkey.pem'),
            cert: fs.readFileSync('certs/cert.pem')
        }, app).listen(securePort, function () {
            logger.info('Your module is listening on port %d (https://localhost:%d)', securePort, securePort);
        });

        http.createServer(app).listen(port, function () {
            logger.info('Redirect port from %d to %d (http://localhost:%d)', port, securePort, port);
        });

    }

};