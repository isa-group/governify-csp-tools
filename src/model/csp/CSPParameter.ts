/*!
governify-csp-tools 0.3.0, built on: 2017-03-30
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


export default class CSPParameter {

    id: String;
    type: String;
    value: String;
    values: Array<String>;

    constructor(id: String, type: String, value: any) {
        this.id = id;
        this.type = type;

        if (value.type === "string") {
            this.value = value;
        } else {
            this.values = value;
        }
    }

}