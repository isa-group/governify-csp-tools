/*!
governify-csp-tools 0.2.1, built on: 2017-03-27
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


import MinizincExecutor from "../../tools/MinizincExecutor";
import CSPModel from "../csp/CSPModel";

const logger = require("../../logger/logger");

export default class Problem {

    model: CSPModel;
    config: any;

    constructor(model: CSPModel, config: any) {
        this.model = model;
        this.config = config;
    }

    getSolution(callback: () => void) {
        if (this.config.type === "api") {
            this.getRemoteSolution(callback);
        } else if (this.config.type === "local") {
            this.getLocalSolution(callback);
        } else if (this.config.type === "docker") {
            this.getDockerSolution(callback);
        } else {
            throw "Unable to get solution for undefined reasoner type. Please, specify reasoner.type \"api\" or \"local\"";
        }
    }

    private getLocalSolution(callback: () => void) {
        new MinizincExecutor(this).execute(callback);
    }

    private getDockerSolution(callback: () => void) {
        new MinizincExecutor(this, "docker").execute(callback);
    }

    private getRemoteSolution(callback: (sol: any, resp: any) => void) {
        require("request")({
            url: this.config.api.server + "/api/" + this.config.api.version + "/" + this.config.api.operationPath,
            method: "POST",
            json: [{
                fileUri: "",
                content: require("js-yaml").safeDump(this.model)
            }]
        }, (error, res, body) => {
            callback(error, body);
        });
    }

}