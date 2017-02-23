/*!
governify-csp-tools 0.0.1, built on: 2017-02-22
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
var MinizincExecutor_1 = require("../tools/MinizincExecutor");
var logger = require("../logger/logger");
var Problem = (function () {
    function Problem(cspModel, config) {
        this.cspModel = cspModel;
        this.config = config;
    }
    Problem.prototype.getSolution = function (callback) {
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
    };
    Problem.prototype.getLocalSolution = function (callback) {
        new MinizincExecutor_1.default(this).execute(callback);
    };
    Problem.prototype.getDockerSolution = function (callback) {
        new MinizincExecutor_1.default(this, "docker").execute(callback);
    };
    Problem.prototype.getRemoteSolution = function (callback) {
        require("request")({
            url: this.config.api.server + "/api/" + this.config.api.version + "/" + this.config.api.operationPath,
            method: "POST",
            json: [{
                    fileUri: "",
                    content: require("js-yaml").safeDump(this.cspModel)
                }]
        }, function (error, res, body) {
            callback(error, body);
        });
    };
    return Problem;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Problem;
