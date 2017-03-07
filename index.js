const Reasoner = require('./src/model/reasoner/Reasoner').default;
const CSPModelMinizincTranslator = require('./src/translator/CSPModelMinizincTranslator').default;
const MinizincCSPModelTranslator = require('./src/translator/MinizincCSPModelTranslator').default;
const AgreementMinizincBuilder = require('./src/builder/agreement/AgreementMinizincBuilder').default;
const CSPConstraint = require('./src/model/csp/CSPConstraint').default;
const CSPModel = require('./src/model/csp/CSPModel').default;
const CSPParameter = require('./src/model/csp/CSPParameter').default;
const CSPRange = require('./src/model/csp/CSPRange').default;
const CSPVar = require('./src/model/csp/CSPVar').default;
// const Builder = require('./src/model/csp/Builder').default;
// const Executor = require('./src/model/csp/Executor').default;

module.exports = {

    Reasoner: Reasoner,

    // Builders
    AgreementMinizincBuilder: AgreementMinizincBuilder,

    // Translators
    CSPModelMinizincTranslator: CSPModelMinizincTranslator,
    MinizincCSPModelTranslator: MinizincCSPModelTranslator,

    // CSP model
    CSPModel: CSPModel,
    CSPConstraint: CSPConstraint,
    CSPParameter: CSPParameter,
    CSPRange: CSPRange,
    CSPVar: CSPVar

};