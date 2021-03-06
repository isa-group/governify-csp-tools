/*!
governify-csp-tools 0.3.5, built on: 2017-05-10
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
const CSPRange_1 = require("./CSPRange");
const typeMap = require("../../configurations/config").translator.typeMap;
class CSPVar {
    constructor(id, valueOrRange) {
        this.id = id;
        if (typeof valueOrRange === "object") {
            this.range = valueOrRange;
        }
        else {
            valueOrRange = valueOrRange in typeMap ? typeMap[valueOrRange] : valueOrRange;
            this.type = valueOrRange;
        }
    }
    static create(obj) {
        if (obj.range) {
            return new CSPVar(obj.id, CSPRange_1.default.create(obj.range));
        }
        else {
            return new CSPVar(obj.id, obj.type);
        }
    }
}
exports.default = CSPVar;
