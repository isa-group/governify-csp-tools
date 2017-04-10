/*!
governify-csp-tools 0.3.4, built on: 2017-04-10
Copyright (C) 2017 ISA group
http://www.isa.us.es/
https://github.com/isa-group/governify-csp-tools

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
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CSPParameter_1 = require("./CSPParameter");
const CSPVar_1 = require("./CSPVar");
const CSPConstraint_1 = require("./CSPConstraint");
class CSPModel {
    constructor() {
        this.parameters = [];
        this.variables = [];
        this.constraints = [];
        this.goal = "";
    }
    static create(obj) {
        let cspModel = new CSPModel();
        if ("parameters" in obj && typeof obj.parameters === "object") {
            cspModel.parameters = obj.parameters.map(p => CSPParameter_1.default.create(p));
        }
        if ("variables" in obj && typeof obj.variables === "object") {
            cspModel.variables = obj.variables.map(v => CSPVar_1.default.create(v));
        }
        if ("constraints" in obj && typeof obj.constraints === "object") {
            cspModel.constraints = obj.constraints.map(c => CSPConstraint_1.default.create(c));
        }
        cspModel.goal = obj.goal;
        return cspModel;
    }
    addParameter(param) {
        if (!this.existParam(param)) {
            this.parameters.push(param);
        }
    }
    existParam(param) {
        var exists = false;
        this.parameters.forEach(function (p) {
            if (!exists && p.id === param.id && p.type === param.type && p.value === param.value) {
                exists = true;
            }
        });
        return exists;
    }
}
exports.default = CSPModel;
