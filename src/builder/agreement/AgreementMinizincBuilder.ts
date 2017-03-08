/*!
governify-csp-tools 0.1.1, built on: 2017-03-08
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


const globalConfig = require("../../configurations/config");
const typeMap = globalConfig.translator.typeMap;
const modSuffix = globalConfig.translator.modSuffix;

export default class AgreementMinizincBuilder {

    agreement: any;

    constructor(agreement: any) {
        this.agreement = agreement;
    }

    buildConstraints(): string {

        let mznDocument = this._buildDefinitions() + "\n";
        mznDocument += this._buildMetrics() + "\n";
        mznDocument += this._buildGuarantees() + "\n";
        mznDocument += "solve satisfy;";

        return mznDocument;

    }

    private _buildDefinitions(renameFlag?: boolean): string {

        var definitions = this.agreement.context.definitions.schemas;
        var ret = "";

        if (definitions) {

            var names = Object.keys(definitions);

            names.forEach(function (name: string) {
                if (definitions[name].type !== "string") {
                    if (!renameFlag) {
                        ret += "var " + typeMap[definitions[name].type] + ": " + name + ";\n";
                    } else {
                        ret += "var " + typeMap[definitions[name].type] + ": " + name + modSuffix + "\n";
                    }
                }
            });

        }

        return !renameFlag ? "% Definitions variables\n" + ret : "% Definitions variables for CCC\n" + ret;
    }

    private _buildMetrics(renameFlag?: boolean): string {

        var metrics = this.agreement.terms.metrics;
        var ret = "";

        if (metrics) {

            var names = Object.keys(metrics);

            names.forEach(function (name: string) {
                if (metrics[name].schema.type !== "string") {
                    if (!renameFlag) {
                        ret += "var " + typeMap[metrics[name].schema.type] + ": " + name + ";\n";
                    } else {
                        ret += "var " + typeMap[metrics[name].schema.type] + ": " + name + modSuffix + "\n";
                    }
                }
            });

        }

        return !renameFlag ? "% Metrics variables\n" + ret : "% Metrics variables for CCC\n" + ret;

    }

    private _buildGuarantees(renameFlag?: boolean): string {

        var guarantees = this.agreement.terms.guarantees;
        var ret = "";

        if (guarantees) {
            guarantees.forEach(function (guarantee: any) {
                guarantee.of.forEach(function (of: any) {
                    if ( of.precondition && of.precondition !== "") {
                        // Use "precondition->objective" to define constraint
                        ret += "constraint (" + of.precondition + ") -> (" + of.objective + ");\n";
                    } else if ( of.objective && of.objective !== "") {
                        // Use "objective" property to define constraint
                        ret += "constraint " + of.objective + ";\n";
                    }
                });
            });
        }

        return "% Guarantees objectives\n" + ret;

    }

}