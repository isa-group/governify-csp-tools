/*!
governify-csp-tools 0.3.3, built on: 2017-04-05
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


import Problem from "./Problem";
import CSPModel from "../csp/CSPModel";

export default class Reasoner {

    private _config: any;

    constructor(config: any) {
        this._config = config;
    }

    get config() {
        return this._config;
    }

    set config(config: any) {
        this._config = config;
    }

    /**
     * Solve a CSP problem and return string solution
     */
    solve(cspModel: CSPModel, callback: () => void) {
        let problem: Problem = new Problem(cspModel, this.config);
        problem.getSolution(callback);
    }
}