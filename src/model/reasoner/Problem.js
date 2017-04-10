/*!
governify-csp-tools 0.3.5, built on: 2017-04-10
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
const MinizincExecutor_1 = require("../../tools/MinizincExecutor");
const logger = require("../../logger/logger");
var request = require("request");
var yaml = require("js-yaml");
class Problem {
    constructor(model, config) {
        this.model = model;
        this.config = config;
    }
    getSolution(callback) {
        if (this.config.type === "api") {
            this.getRemoteSolution(callback);
        }
        else if (this.config.type === "local") {
            this.getLocalSolution(callback);
        }
        else if (this.config.type === "docker") {
            this.getDockerSolution(callback);
        }
        else {
            throw "Unable to get solution for undefined reasoner type. Please, specify reasoner.type \"api\" or \"local\"";
        }
    }
    getLocalSolution(callback) {
        new MinizincExecutor_1.default(this).execute(callback);
    }
    getDockerSolution(callback) {
        new MinizincExecutor_1.default(this, "docker").execute(callback);
    }
    getRemoteSolution(callback) {
        process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
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
exports.default = Problem;
