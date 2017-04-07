/*!
governify-csp-tools 0.3.3, built on: 2017-04-07
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
var request = require("request");
var yaml = require("js-yaml");

export default class Problem {

    constructor(public model: CSPModel, public config: any) { }

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

    private getRemoteSolution(callback: (error: any, stdout?: string, stderr?: string, isSatisfiable?: boolean) => void) {
        process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0"; // insecure
        request({
            url: this.config.api.server + "/api/" + this.config.api.version + "/" + this.config.api.operationPath,
            method: "POST",
            json: [{
                content: yaml.safeDump(this.model)
            }]
        }, (error, res, body) => {
            process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "1";
            if (error) {
                logger.error(error);
            }
            callback(error || body.error, body.stdout, body.stderr, body.isSatisfiable);
        });
    }

}