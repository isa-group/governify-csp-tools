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
var MinizincDocument = (function () {
    function MinizincDocument(mznObject) {
        this.mznObject = mznObject;
    }
    MinizincDocument.prototype.translate = function () {
        var mznDocument = "";
        var _this = this;
        if (this.mznObject.parameters) {
            this.mznObject.parameters.forEach(function (parameter) {
                mznDocument += _this.parameter(parameter);
            });
        }
        if (this.mznObject.variables) {
            this.mznObject.variables.forEach(function (variable) {
                mznDocument += _this.var(variable);
            });
        }
        if (this.mznObject.constraints) {
            this.mznObject.constraints.forEach(function (constraint) {
                mznDocument += _this.constraint(constraint);
            });
        }
        if (this.mznObject.goals) {
            mznDocument += this.goals(this.mznObject.goals);
        }
        return mznDocument;
    };
    MinizincDocument.prototype.var = function (mznVariableObject) {
        var typeOrRange = "";
        if ("range" in mznVariableObject) {
            typeOrRange += mznVariableObject.range.min + ".." + mznVariableObject.range.max;
        }
        else {
            typeOrRange += mznVariableObject.type;
        }
        return "var " + typeOrRange + ": " + mznVariableObject.id + ";\n";
    };
    MinizincDocument.prototype.parameter = function (mznParameterObject) {
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
            ret += mznParameterObject.type + ": " + mznParameterObject.id + " = " + mznParameterObject.value + ";\n";
        }
        return ret;
    };
    MinizincDocument.prototype.constraint = function (mznConstraintObject) {
        return "constraint " + mznConstraintObject.expression + "; % " + mznConstraintObject.id + "\n";
    };
    MinizincDocument.prototype.goals = function (mznGoals) {
        return "% goals: '" + mznGoals.join(", ") + "'\n";
    };
    MinizincDocument.prototype.commentary = function (c) {
        return "% " + c + ";\n";
    };
    return MinizincDocument;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MinizincDocument;
