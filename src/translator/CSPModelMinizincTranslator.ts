/*!
governify-csp-tools 0.1.1, built on: 2017-03-27
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


const mznTypeDict = require("../configurations/config").translator.typeMap;

/**
 * Translate a CSPModel to a MiniZinc document.
 */
export default class CSPModelMinizincTranslator {

    mznObject: any;

    constructor(mznObject: any) {
        this.mznObject = mznObject;
    }

    translate(): string {

        var mznData = "";
        var _pthis = this;

        if (typeof this.mznObject === "object") {
            // Parameters
            if (this.mznObject.parameters) {
                this.mznObject.parameters.forEach(function (parameter: any) {
                    mznData += _pthis.parameter(parameter);
                });
            }
            // Variables
            if (this.mznObject.variables) {
                this.mznObject.variables.sort((a, b) => a.id.localeCompare(b.id)).forEach(function (variable: any) {
                    mznData += _pthis.var(variable);
                });
            }
            // Constraints
            if (this.mznObject.constraints) {
                this.mznObject.constraints.forEach(function (constraint: any) {
                    mznData += _pthis.constraint(constraint);
                });
            }

            // Goal and goals
            if (this.mznObject.goal) {
                mznData += this.goal(this.mznObject.goal);
            }
        }

        return mznData;

    }

    /**
     * Translate a variable object to MiniZinc "var" statement.
     */
    private var(mznVariableObject: any): string {
        var typeOrRange = "";

        if ("range" in mznVariableObject) {
            typeOrRange += mznVariableObject.range.min + ".." + mznVariableObject.range.max;
        } else {
            // Translate type to MiniZinc type
            typeOrRange += mznVariableObject.type;
            if (typeOrRange in mznTypeDict) {
                typeOrRange = mznTypeDict[typeOrRange];
            }
        }

        return "var " + typeOrRange + ": " + mznVariableObject.id + "; % " + mznVariableObject.id + "-variable\n";
    }

    /**
     * Translate a constraint object to MiniZinc "constraint" statement.
     */
    private parameter(mznParameterObject: any): string {
        var ret = "";
        if (mznParameterObject.type === "enum") {
            ret += "set of int: " + mznParameterObject.id + "_domain = 1.." + mznParameterObject.values.length + "; % enum block start\n";
            var i = 1;
            mznParameterObject.values.forEach(function (value: string) {
                ret += "int: " + value + " = " + i + ";\n";
                i++;
            });
            ret += "var " + mznParameterObject.id + "_domain: " + mznParameterObject.id + "; % enum block end\n";
        } else {
            ret += mznParameterObject.type + ": " + mznParameterObject.id + " = " +
                mznParameterObject.value + "; % " + mznParameterObject.id + "-parameter\n";
        }
        return ret;
    }

    /**
     * Translate a constraint object to a MiniZinc "constraint" statement.
     */
    private constraint(mznConstraintObject: any): string {
        return "constraint " + mznConstraintObject.expression.replace(/&&/g, "/\\").replace(/\|\|/g, "\\/") +
            "; % " + mznConstraintObject.id + "-constraint\n";
    }

    /**
     * Translate a goal object to a MiniZinc "goal" statement.
     */
    private goal(goal: string): string {
        return "solve " + goal + "; % goal\n";
    }

    /**
     * Translate a goals array to a MiniZinc "goals" statement.
     */
    private goals(mznGoalsObject: any): string {
        return "% goals: '" + mznGoalsObject.join(", ") + "'\n";
    }

}