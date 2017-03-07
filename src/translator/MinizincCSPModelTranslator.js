/*!
governify-csp-tools 0.0.1, built on: 2017-03-07
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
class MinizincCSPModelTranslator {
    constructor(mznDocument) {
        this.mznDocument = mznDocument;
    }
    translate() {
        var mznObject = {};
        var isEnum = false;
        var enumStatements = "";
        var _prevThis = this;
        this.mznDocument.split("\n").forEach(function (line) {
            line = line.trim();
            if (line.startsWith("var ") && !isEnum) {
                _prevThis.var(line, mznObject);
            }
            else if (line.startsWith("constraint ") && !isEnum) {
                _prevThis.constraint(line, mznObject);
            }
            else if ((line.startsWith("float") || line.startsWith("int") || line.startsWith("bool")) && !isEnum) {
                _prevThis.parameter(line, mznObject);
            }
            else if ((line.startsWith("set") && line.endsWith("% enum block start")) || isEnum) {
                if (line.endsWith("% enum block end")) {
                    enumStatements += line;
                    isEnum = false;
                    _prevThis.enum(enumStatements.split("\n"), mznObject);
                    enumStatements = "";
                }
                else {
                    isEnum = true;
                    enumStatements += line + "\n";
                }
            }
            else if (line.startsWith("solve ")) {
                _prevThis.goal(line, mznObject);
            }
        });
        return mznObject;
    }
    var(statement, mznObject) {
        if (!("variables" in mznObject)) {
            mznObject.variables = [];
        }
        var group = /^var\s(.+)\.\.(.+)\s*:\s*(.+)\s*;/.exec(statement);
        var varObj = {};
        if (group && group[1] && group[2] && group[3]) {
            varObj = {
                "id": group[3],
                "range": {
                    "min": group[1],
                    "max": group[2]
                }
            };
        }
        else {
            group = /^var\s(.+)\s*:\s*(.+)\s*;/.exec(statement);
            varObj = {
                "id": group[2],
                "type": group[1]
            };
        }
        mznObject.variables.push(varObj);
        return mznObject;
    }
    parameter(statement, mznObject) {
        if (!("parameters" in mznObject)) {
            mznObject.parameters = [];
        }
        var group = /^(.+)\s*:\s*(.+)\s*=\s*(.+)\s*;/.exec(statement);
        var param = {
            "id": group[2].trim(),
            "type": group[1],
            "value": group[3].trim()
        };
        mznObject.parameters.push(param);
        return mznObject;
    }
    enum(statements, mznObject) {
        if (!("parameters" in mznObject)) {
            mznObject.parameters = [];
        }
        var param = {
            id: "",
            type: "enum",
            values: []
        };
        statements.forEach(function (statement) {
            if (statement.startsWith("set of int:")) {
            }
            else if (statement.startsWith("int:")) {
                var enumValue = /^.+:(.*)=.*;$/.exec(statement)[1].trim();
                param.values.push(enumValue);
            }
            else if (statement.startsWith("var ")) {
                var enumName = /^.+:(.*);.*$/.exec(statement)[1].trim();
                param.id = enumName;
            }
        });
        mznObject.parameters.push(param);
        return mznObject;
    }
    constraint(statement, mznObject) {
        if (!("constraints" in mznObject)) {
            mznObject.constraints = [];
        }
        var groupWithoutId = /^constraint\s+(.+);$/.exec(statement);
        var constObj = {};
        if (groupWithoutId) {
            var constNumber = 1;
            mznObject.constraints.forEach(function (constraint) {
                var groupQ = /^Q([0-9]+)$/.exec(constraint.id);
                if (groupQ && constNumber <= parseInt(groupQ[1])) {
                    constNumber = parseInt(groupQ[1]) + 1;
                }
            });
            constObj = {
                "id": "Q" + constNumber,
                "expression": groupWithoutId[1]
            };
        }
        else {
            var groupWithId = /^constraint\s(.+);\s*\%\s*(.+)-constraint$/.exec(statement);
            constObj = {
                "id": groupWithId[2],
                "expression": groupWithId[1]
            };
        }
        mznObject.constraints.push(constObj);
        return mznObject;
    }
    goal(statement, mznObject) {
        var group = /^solve\s+(.+);/.exec(statement);
        mznObject.goal = group[1];
        return mznObject;
    }
    goals(statement, mznObject) {
        var group = /^% goals:\s*[\"\"](.+)[\"\"]/.exec(statement);
        var goals = [];
        group[1].split(",").forEach(function (goal) {
            goals.push(goal.trim());
        });
        mznObject.goals = goals;
        return mznObject;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MinizincCSPModelTranslator;
