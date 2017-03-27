/*!
governify-csp-tools 0.2.1, built on: 2017-03-27
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


import CSPRange from "./CSPRange";

const typeMap = require("../../configurations/config").translator.typeMap;

export default class CSPVar {

    id: String;
    type: String;
    range: CSPRange;

    constructor(id: String, valueOrRange: any) {
        this.id = id;
        if (typeof valueOrRange === "object") { // CSPRange
            this.range = valueOrRange;
        } else {
            valueOrRange = valueOrRange in typeMap ? typeMap[valueOrRange] : valueOrRange;
            this.type = valueOrRange;
        }

    }

}