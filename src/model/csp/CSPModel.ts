/*!
governify-csp-tools 0.3.6, built on: 2017-05-10
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


import CSPParameter from "./CSPParameter";
import CSPVar from "./CSPVar";
import CSPConstraint from "./CSPConstraint";

interface CSPModelInterface {
    parameters: Array<CSPParameter>;
    variables: Array<CSPVar>;
    constraints: Array<CSPConstraint>;
    goal: string;
    addParameter(param: CSPParameter): void;
}

export default class CSPModel implements CSPModelInterface {

    parameters: Array<CSPParameter>;
    variables: Array<CSPVar>;
    constraints: Array<CSPConstraint>;
    goal: string;

    constructor() {
        this.parameters = [];
        this.variables = [];
        this.constraints = [];
        this.goal = "";
    }

    static create(obj: any): CSPModel {

        let cspModel = new CSPModel();

        if ("parameters" in obj && typeof obj.parameters === "object") {
            cspModel.parameters = obj.parameters.map(p => CSPParameter.create(p));
        }

        if ("variables" in obj && typeof obj.variables === "object") {
            cspModel.variables = obj.variables.map(v => CSPVar.create(v));
        }

        if ("constraints" in obj && typeof obj.constraints === "object") {
            cspModel.constraints = obj.constraints.map(c => CSPConstraint.create(c));
        }

        cspModel.goal = obj.goal;

        return cspModel;

    }

    addParameter(param: CSPParameter): void {
        if (!this.existParam(param)) {
            this.parameters.push(param);
        }
    }

    existParam(param: CSPParameter): boolean {
        var exists = false;
        this.parameters.forEach(function (p: CSPParameter) {
            //TODO: check each value on enum case
            if (!exists && p.id === param.id && p.type === param.type && p.value === param.value) {
                exists = true;
            }
        });
        return exists;
    }

}