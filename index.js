const Reasoner = require('./src/model/reasoner/Reasoner').default;
const CSPModelMinizincTranslator = require('./src/translator/CSPModelMinizincTranslator').default;
const MinizincCSPModelTranslator = require('./src/translator/MinizincCSPModelTranslator').default;
const CSPConstraint = require('./src/model/csp/CSPConstraint').default;
const CSPModel = require('./src/model/csp/CSPModel').default;
const CSPParameter = require('./src/model/csp/CSPParameter').default;
const CSPRange = require('./src/model/csp/CSPRange').default;
const CSPVar = require('./src/model/csp/CSPVar').default;
const config = require('./src/configurations/config');
const api = require('./src/api/api');

module.exports = {

    Reasoner: Reasoner,

    // Translators
    CSPModelMinizincTranslator: CSPModelMinizincTranslator,
    MinizincCSPModelTranslator: MinizincCSPModelTranslator,

    // CSP model
    CSPModel: CSPModel,
    CSPConstraint: CSPConstraint,
    CSPParameter: CSPParameter,
    CSPRange: CSPRange,
    CSPVar: CSPVar,

    // CSP tools config
    config: config,

    // CSP API
    api: api

};