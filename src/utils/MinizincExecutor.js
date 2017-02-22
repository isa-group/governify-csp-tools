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
var MinizincDocument_1 = require("../builder/MinizincDocument");
var fs = require("fs");
var Promise = require("bluebird");
var MinizincExecutor = (function () {
    function MinizincExecutor(problem) {
        this.mznObject = problem.cspModel;
        this.config = problem.config;
    }
    MinizincExecutor.prototype.execute = function (callback) {
        var promises = this.createMinizincFiles();
        return this.executeMinizincFiles(promises, callback);
    };
    MinizincExecutor.prototype.createMinizincFiles = function () {
        var promisesCreateFiles = [];
        var mznDocument = new MinizincDocument_1.default(this.mznObject).translate();
        var date = new Date();
        var random = Math.round(Math.random() * 1000);
        var _this = this;
        this.mznObject.goals.forEach(function (goal, index) {
            promisesCreateFiles.push(new Promise(function (resolve, reject) {
                var mznDocumentToSolve = mznDocument + "\nsolve " + goal + ";";
                var fileName = "problem_" + date.getTime() + "_" + index + "_" + random;
                fs.rmdir("./data/" + _this.config.folder, function () {
                    fs.mkdir("./data", function () {
                        fs.mkdir("./data/" + _this.config.folder, function () {
                            fs.writeFile("./data/" + _this.config.folder + "/" + fileName + ".mzn", mznDocumentToSolve, function (err) {
                                if (err) {
                                    reject(err);
                                }
                                else {
                                    resolve({
                                        goal: goal,
                                        fileName: fileName
                                    });
                                }
                            });
                        });
                    });
                });
            }));
        });
        return promisesCreateFiles;
    };
    MinizincExecutor.prototype.executeMinizincFiles = function (promises, callback) {
        var _this = this;
        Promise.all(promises).then(function (goalObjs) {
            var bashCmd = _this.getMinizincCmd(goalObjs);
            require("child_process").exec(bashCmd, function (error, stdout, stderr) {
                var resp = stdout;
                if (error) {
                    resp = stderr;
                    console.error(error);
                }
                if (callback) {
                    callback(error, resp);
                }
            });
        });
    };
    MinizincExecutor.prototype.getMinizincCmd = function (goalObjs) {
        var bashCmd = "";
        var _this = this;
        goalObjs.forEach(function (goalObj) {
            if (bashCmd !== "") {
                bashCmd += " && ";
            }
            var echoTitle = "echo \"" + goalObj.goal + ":\"";
            var mzn2fznCmd = "mzn2fzn ./data/" + _this.config.folder + "/" + goalObj.fileName + ".mzn";
            var fznGecodeCmd = "fzn-gecode ./data/" + _this.config.folder + "/" + goalObj.fileName + ".fzn";
            var oznCmd = "solns2out --search-complete-msg \"\" ./data/" + _this.config.folder + "/" + goalObj.fileName + ".ozn";
            var grepFilterBlankLines = "grep -v \"^$\"";
            if (/^win/.test(process.platform)) {
                bashCmd += echoTitle + " && " + mzn2fznCmd + " && " + fznGecodeCmd + " | " + oznCmd;
            }
            else {
                bashCmd += echoTitle + " && " + mzn2fznCmd + " && " + fznGecodeCmd + " | " + oznCmd + " | " + grepFilterBlankLines;
            }
        });
        return bashCmd;
    };
    return MinizincExecutor;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MinizincExecutor;
