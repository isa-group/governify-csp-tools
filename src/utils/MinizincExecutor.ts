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


import MinizincDocument from "../builder/MinizincDocument";
import Problem from "../model/Problem";

const fs = require("fs");
const Promise = require("bluebird");

export default class MinizincExecutor {

    mznObject: any;
    config: any;

    constructor(problem: Problem) {
        this.mznObject = problem.cspModel;
        this.config = problem.config;
    }

    execute(callback: () => void) {
        let promises = this.createMinizincFiles();
        return this.executeMinizincFiles(promises, callback);
    }

    private createMinizincFiles() {

        let promisesCreateFiles = [];
        const mznDocument = new MinizincDocument(this.mznObject).translate();
        const date = new Date(); const random = Math.round(Math.random() * 1000); // Specify minizinc file name
        var _this = this;

        this.mznObject.goals.forEach(function (goal: string, index: number) {

            promisesCreateFiles.push(new Promise(function (resolve: any, reject: any) {

                // Concatenate solve to the document
                var mznDocumentToSolve = mznDocument + "\nsolve " + goal + ";";

                // Create MiniZinc files
                var fileName = "problem_" + date.getTime() + "_" + index + "_" + random;
                fs.rmdir("./data/" + _this.config.folder, function () {
                    fs.mkdir("./data", function () {
                        fs.mkdir("./data/" + _this.config.folder, function () {
                            fs.writeFile("./data/" + _this.config.folder + "/" + fileName + ".mzn", mznDocumentToSolve, function (err: any) {
                                if (err) {
                                    reject(err);
                                } else {
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

    }

    /**
     * Execute Minizinc files
     */
    private executeMinizincFiles(promises: Array<any>, callback: (error: any, resp: any) => void) {

        var _this = this;
        Promise.all(promises).then(function (goalObjs: any) {

            // Get MiniZinc bash command
            let bashCmd = _this.getMinizincCmd(goalObjs);

            // MiniZinc execution
            require("child_process").exec(bashCmd, (error, stdout, stderr) => {
                var resp: string = stdout;
                if (error) {
                    resp = stderr;
                    console.error(error);
                }
                if (callback) {
                    callback(error, resp);
                }
            });
        });

    }

    /**
     * Get Minizinc command based on "goalObjs" array
     */
    private getMinizincCmd(goalObjs: Array<{}>): String {
        var bashCmd = "";
        var _this = this;

        goalObjs.forEach(function (goalObj: any) {
            if (bashCmd !== "") {
                bashCmd += " && ";
            }

            let echoTitle = "echo \"" + goalObj.goal + ":\"";

            let mzn2fznCmd = "mzn2fzn ./data/" + _this.config.folder + "/" + goalObj.fileName + ".mzn";
            let fznGecodeCmd = "fzn-gecode ./data/" + _this.config.folder + "/" + goalObj.fileName + ".fzn";
            let oznCmd = "solns2out --search-complete-msg \"\" ./data/" + _this.config.folder + "/" + goalObj.fileName + ".ozn";

            let grepFilterBlankLines = "grep -v \"^$\"";

            if (/^win/.test(process.platform)) { // is windows os
                bashCmd += echoTitle + " && " + mzn2fznCmd + " && " + fznGecodeCmd + " | " + oznCmd;
            } else {
                bashCmd += echoTitle + " && " + mzn2fznCmd + " && " + fznGecodeCmd + " | " + oznCmd + " | " + grepFilterBlankLines;
            }
        });

        return bashCmd;
    }
}