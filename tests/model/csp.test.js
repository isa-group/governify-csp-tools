'use strict';

const expect = require('chai').expect;
const yaml = require('js-yaml');
const fs = require('fs');

const index = require('../../index');
const CSPModel = index.CSPModel;

describe('CSP Model', function () {

    it('Able to create a CSP Model from a JavaScript object without parameters', function (done) {

        let obj = yaml.safeLoad(fs.readFileSync('./tests/resources/csp/csp-without-parameters.yaml'));
        let model = CSPModel.create(obj);

        expect(!!model.variables).to.be.equal(true);
        expect(Object.keys(model.variables).length).to.be.greaterThan(0);
        expect(!!model.parameters).to.be.equal(true);
        expect(Object.keys(model.parameters).length).to.be.equal(0);
        expect(!!model.constraints).to.be.equal(true);
        expect(Object.keys(model.constraints).length).to.be.greaterThan(0);
        expect(!!model.goal).to.be.equal(true);
        expect(Object.keys(model.goal).length).to.be.greaterThan(0);
        done();

    });

});