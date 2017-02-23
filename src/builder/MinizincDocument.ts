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


export default class MinizincDocument {

    mznObject: any;

    constructor(mznObject: any) {
        this.mznObject = mznObject;
    }

    /**
     * Build a Minizinc document from a javascript object.
     */
    translate(): String {
        var mznDocument = "";
        var _this = this;

        // Parameters
        if (this.mznObject.parameters) {
            this.mznObject.parameters.forEach(function (parameter: any) {
                mznDocument += _this.parameter(parameter);
            });
        }
        // Variables
        if (this.mznObject.variables) {
            this.mznObject.variables.forEach(function (variable: any) {
                mznDocument += _this.var(variable);
            });
        }
        // Constraints
        if (this.mznObject.constraints) {
            this.mznObject.constraints.forEach(function (constraint: any) {
                mznDocument += _this.constraint(constraint);
            });
        }
        // Goals
        if (this.mznObject.goals) {
            mznDocument += this.goals(this.mznObject.goals);
        }

        return mznDocument;
    }

    /**
     * Returns a "var" Minizinc statement from a variable object.
     */
    private var(mznVariableObject: any) {
        var typeOrRange = "";

        if ("range" in mznVariableObject) {
            typeOrRange += mznVariableObject.range.min + ".." + mznVariableObject.range.max;
        } else {
            typeOrRange += mznVariableObject.type;
        }

        let mznTypeDict = {
            "number": "float",
            "int32": "int",
            "int64": "int",
            "float": "float",
            "double": "float",
            "byte": "string",
            "binary": "string",
            "date": "string",
            "date-time": "string",
            "password": "string",
            "string": "string"
        };

        let _type = mznTypeDict[typeOrRange];
        if (!_type) {
            _type = typeOrRange;
        }

        return "var " + _type + ": " + mznVariableObject.id + ";\n";
    }

    /**
     * Returns a "constraint" statement Minizinc statement from a constraint object.
     */
    private parameter(mznParameterObject: any) {
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
            ret += mznParameterObject.type + ": " + mznParameterObject.id + " = " + mznParameterObject.value + ";\n";
        }
        return ret;
    }

    /**
     * Returns a "constraint" statement Minizinc statement from a constraint object.
     */
    private constraint(mznConstraintObject: any) {
        return "constraint " + mznConstraintObject.expression + "; % " + mznConstraintObject.id + "\n";
    }

    /**
     * Returns a "goals" statement Minizinc statement from a constraint object.
     */
    private goals(mznGoals: Array<string>) {
        return "% goals: '" + mznGoals.join(", ") + "'\n";
    }

    /**
     * Returns a "commentary" Minizinc statement from a string.
     */
    private commentary(c: String) {
        return "% " + c + ";\n";
    }

}