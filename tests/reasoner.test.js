/*!
project-template-nodejs 0.0.0, built on: 2017-02-10
Copyright (C) 2017 ISA group
http://www.isa.us.es/
https://github.com/isa-group/project-template-nodejs

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.*/


'use strict';

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0"; // unsecure

const fs = require("fs");
const yaml = require("js-yaml");
const expect = require('chai').expect;
const logger = ("../src/logger/logger");
const Reasoner = require("../src/model/reasoner/Reasoner").default;

/*
 * USE MOCHA AND CHAI for testing your code
 */
describe('Reasoner', function () {

    this.timeout(10000);

    it('local', (done) => {
        fs.readFile("./tests/resources/csp/csp-satisfy.yaml", "utf8", function (err, cspModel) {

            if (err) {
                return console.log(err);
            } else {
                var reasoner = new Reasoner({
                    type: 'local',
                    folder: 'test_csp_files'
                });
                reasoner.solve(yaml.safeLoad(cspModel), function (error, sol) {
                    expect(sol.replace(/\r/g, "")).to.be.equal('invoicePenalty = 0;\ninvoiceReward = 0;\nfeePenalty = 0;\nfeeReward = 0;\ndaysBeforeMeetingDay = 0;\nresolutionHours = 0;\nmaxResolutionDays = 0;\nelapseDaysUntilDelivery = 0;\n----------\n');
                    done();
                });
            }

        });
    });

    it('remote', (done) => {
        fs.readFile("./tests/resources/csp/csp-satisfy.yaml", "utf8", function (err, cspModel) {

            if (err) {
                return console.log(err);
            } else {
                var reasoner = new Reasoner({
                    type: 'api',
                    folder: 'test_csp_files',
                    api: {
                        version: 'v2',
                        server: 'https://designer.governify.io:10044/module-minizinc',
                        operationPath: 'models/csp/operations/execute'
                    }
                });
                reasoner.solve(yaml.safeLoad(cspModel), function (error, sol) {
                    expect(sol.message.replace(/\r/g, "")).to.be.equal('<pre>invoicePenalty = 0;\ninvoiceReward = 0;\nfeePenalty = 0;\nfeeReward = 0;\ndaysBeforeMeetingDay = 0;\nresolutionHours = 0;\nmaxResolutionDays = 0;\nelapseDaysUntilDelivery = 0;\n----------\n</pre>');
                    done();
                });
            }

        });
    });

});