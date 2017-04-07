'use strict';

const fs = require("fs");
const yaml = require("js-yaml");
const expect = require('chai').expect;
const logger = ("../../src/logger/logger");
const index = require("../../../index");
const Reasoner = index.Reasoner;
const testConfig = require("../../configurations/config");

/*
 * USE MOCHA AND CHAI for testing your code
 */
describe('Reasoner', function () {

    this.timeout(testConfig.default.timeout);

    it('docker', (done) => {
        fs.readFile("./tests/resources/csp/csp-satisfy.yaml", "utf8", function (err, cspModel) {

            if (err) {
                return console.log(err);
            } else {
                var reasoner = new Reasoner({
                    type: 'docker',
                    folder: testConfig.default.folder
                });
                reasoner.solve(yaml.safeLoad(cspModel), function (error, stdout, sterr, isSatisfiable) {
                    expect(isSatisfiable).to.be.equal(true);
                    done();
                });
            }

        });
    });
});