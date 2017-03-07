'use strict';

const fs = require("fs");
const yaml = require("js-yaml");
const expect = require('chai').expect;
const logger = ("../src/logger/logger");
const Reasoner = require("../../src/model/reasoner/Reasoner").default;

/*
 * USE MOCHA AND CHAI for testing your code
 */
describe('Reasoner', function () {

    this.timeout(600000);

    it('docker', (done) => {
        fs.readFile("./tests/resources/csp/csp-satisfy.yaml", "utf8", function (err, cspModel) {

            if (err) {
                return console.log(err);
            } else {
                var reasoner = new Reasoner({
                    type: 'docker',
                    folder: 'test_csp_files'
                });
                reasoner.solve(yaml.safeLoad(cspModel), function (error, sol) {
                    expect(sol.replace(/\r/g, "")).to.be.equal('invoicePenalty = 0;\ninvoiceReward = 0;\nfeePenalty = 0;\nfeeReward = 0;\ndaysBeforeMeetingDay = 0;\nresolutionHours = 0;\nmaxResolutionDays = 0;\nelapseDaysUntilDelivery = 0;\n----------\n');
                    done();
                });
            }

        });
    });
});