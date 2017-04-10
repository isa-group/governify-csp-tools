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

const fs = require("fs");
const yaml = require("js-yaml");
const expect = require('chai').expect;
const logger = ("../../../src/logger/logger");
const index = require("../../../index");
const Reasoner = index.Reasoner;
const api = index.api;
const testConfig = require("../../configurations/config");

describe('Reasoner execution', function () {

    this.timeout(testConfig.default.timeout);

    it('in local', (done) => {
        fs.readFile("./tests/resources/csp/csp-satisfy.yaml", "utf8", function (err, cspModel) {

            if (err) {
                return console.log(err);
            } else {
                var reasoner = new Reasoner({
                    type: 'local',
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