/*!
governify-csp-tools 0.2.0, built on: 2017-03-27
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
const mznTypeDict = require("../configurations/config").translator.typeMap;
class CSPModelMinizincTranslator {
    constructor(mznObject) {
        this.mznObject = mznObject;
    }
    translate() {
        var mznData = "";
        var _pthis = this;
        if (typeof this.mznObject === "object") {
            if (this.mznObject.parameters) {
                this.mznObject.parameters.forEach(function (parameter) {
                    mznData += _pthis.parameter(parameter);
                });
            }
            if (this.mznObject.variables) {
                this.mznObject.variables.sort((a, b) => a.id.localeCompare(b.id)).forEach(function (variable) {
                    mznData += _pthis.var(variable);
                });
            }
            if (this.mznObject.constraints) {
                this.mznObject.constraints.forEach(function (constraint) {
                    mznData += _pthis.constraint(constraint);
                });
            }
            if (this.mznObject.goal) {
                mznData += this.goal(this.mznObject.goal);
            }
        }
        return mznData;
    }
    var(mznVariableObject) {
        var typeOrRange = "";
        if ("range" in mznVariableObject) {
            typeOrRange += mznVariableObject.range.min + ".." + mznVariableObject.range.max;
        }
        else {
            typeOrRange += mznVariableObject.type;
            if (typeOrRange in mznTypeDict) {
                typeOrRange = mznTypeDict[typeOrRange];
            }
        }
        return "var " + typeOrRange + ": " + mznVariableObject.id + "; % " + mznVariableObject.id + "-variable\n";
    }
    parameter(mznParameterObject) {
        var ret = "";
        if (mznParameterObject.type === "enum") {
            ret += "set of int: " + mznParameterObject.id + "_domain = 1.." + mznParameterObject.values.length + "; % enum block start\n";
            var i = 1;
            mznParameterObject.values.forEach(function (value) {
                ret += "int: " + value + " = " + i + ";\n";
                i++;
            });
            ret += "var " + mznParameterObject.id + "_domain: " + mznParameterObject.id + "; % enum block end\n";
        }
        else {
            ret += mznParameterObject.type + ": " + mznParameterObject.id + " = " +
                mznParameterObject.value + "; % " + mznParameterObject.id + "-parameter\n";
        }
        return ret;
    }
    constraint(mznConstraintObject) {
        return "constraint " + mznConstraintObject.expression.replace(/&&/g, "/\\").replace(/\|\|/g, "\\/") +
            "; % " + mznConstraintObject.id + "-constraint\n";
    }
    goal(goal) {
        return "solve " + goal + "; % goal\n";
    }
    goals(mznGoalsObject) {
        return "% goals: '" + mznGoalsObject.join(", ") + "'\n";
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CSPModelMinizincTranslator;
