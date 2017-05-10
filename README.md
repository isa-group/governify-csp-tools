# Governify CSP Tools
This is a Node.js module created to provide **Constraint Satisfaction Problems** (CSP) tools, such as:
- **Reasoner**: solves a CSP in three different environments: local, remote and docker.
- **CSP model**: defines a CSP on a JavaScript object based on [MiniZinc](http://www.minizinc.org/) language.
- **Builders**: creates a CSP model from another model, e.g. AgreementMinizincBuilder(TODO:link)
- **Translators**: translates a CSP model from a language to another language, e.g. CSPModelMinizincTranslator(TODO:link) and MinizincCSPModelTranslator(TODO:link)

**Governify CSP Tools** solves CSP by using:
- [MiniZinc](http://www.minizinc.org/), a free and open-source constraint modeling language.
- [GeCode](http://www.gecode.org/), a toolkit for developing constraint-based systems and applications.

**Governify CSP Tools** executions relies on these command lines:
- mzn2fzn
- fzn-gecode
- solns2out

Make sure you have these commands working if you want to execute the Reasoner on local.

This module follows the [project-template-nodejs](https://github.com/isa-group/project-template-nodejs) developing guidelines.

## Install
```
npm install governify-csp-tools
```

## Basic Usage
```javascript
// Import
var Reasoner = require("governify-csp-tools").Reasoner;

// Define your CSP on a JavaScript object
var cspModel = {
  "variables": [
    {
      "id": "Var1",
      "type": "int"
    },
    {
      "id": "Var2",
      "range": {
        "min": "0",
        "max": "10"
      }
    }
  ],
  "constraints": [
    {
      "id": "C1",
      "expression": "Var1 == 0 -> Var2 <= 1"
    },
    {
      "id": "C2",
      "expression": "Var1 == 0"
    }
  ],
  "goal": "satisfy"
};

// Configure the CSP reasoner
var reasoner = new Reasoner({
    type: 'local', // type value also can be 'api' or 'docker'
    folder: 'csp_files' // name of the folder which stores .mzn, .fzn and .ozn temporary files
});

// Solve CSP
reasoner.solve(cspModel, (err, stdout, stderr, isSatisfiable) => {
    if (err) {
        // manage error
    } else {
        // manage solution
    }
});
```

You can define your CSP model by following the [CSP schema](#csp-model-schema).

Reasoner can also be configured to execute on remote (API) or docker. Take a look in [reasoner configuration](#reasoner-configuration).

## Reasoner configuration
This tool is responsible for executing and solving a CSP. The Reasoner can be configured to run in three different environments: [local](#local-configuration), [remote](#remote-configuration) (api) and [docker](#docker-configuration).

Follow the [configuration examples](#local-configuration) to set your reasoner or take a look on [reasoner configuration schema](#reasoner-schema).

### Local configuration
To use this feature, you need to install `mzn2fzn`, `fzn-gecode` and `solns2out` commands. You can easily install all these commands by installing [MiniZinc IDE](http://www.minizinc.org/ide/index.html) available for Windows, Mac OS X or Linux.

Make sure you have these commands working before running reasoner on local.

To set your reasoner configuration on local you need to set `type:"local"`, e.g.:
```json
{
  "type": "local",
  "folder": "csp_files"
}
```

### Remote configuration
You need to set `"type":"api"` and define `api` object on reasoner configuration, for example:
```json
{
  "type": "api",
  "folder": "csp_files",
  "api": {
    "version": "v2",
    "server": "https://minizinc.modules.designer.governify.io/module-minizinc",
    "operationPath": "models/csp/operations/execute"
  }
}
```
In the example, the final API endpoint will be: `https://localhost/csp/api/v1/operations/execute`

### Docker configuration
To use this feature, you will need to have docker installed on the machine you are requiring `governify-csp-tools`.

To set your reasoner configuration on local you need to set `type:"docker"`, e.g.:
```json
{
  "type": "docker",
  "folder": "csp_files"
}
```

### Reasoner schema

Please, follow the schema to set your reasoner configuration:

```yaml
---
title: Reasoner configuration schema
type: 'object'
properties:
  type:
    enum:
    - 'local'
    - 'api'
    - 'docker'
  folder: # define a folder name to save .mzn, .fzn and .ozn temporary files
    type: 'string' 
  api: # only if type is 'api'
    type: 'object'
    properties:
      version:
        type: 'string'
      server:
        type: 'string'
      operationPath:
        type: 'string'
required:
  - 'type'
  - 'folder'

```

## CSP model schema
This schema has been created to describe CSP problem on YAML, which in turn can be translated to MiniZinc afterward. 

By now, this schema allows you to define:
- Parameters.
- Variables.
- Constraints.
- Goal.

The CSP model JSON schema expressed on YAML is:
```yaml
---
title: 'CSP model JSON schema'
type: 'object'
properties:
  parameters:
    type: 'array'
    items:
      type: 'object'
      properties:
        id:
          type: 'string'
        type:
          enum:
            - 'bool'
            - 'boolean'
            - 'double'
            - 'float'
            - 'int32'
            - 'int64'
            - 'integer'
            - 'number'
        value:
          type: 'string'
        values: # only for 'enum' type
          type: 'array'
          items:
            type: 'string'
      required:
        - 'id'
        - 'type'
  variables:
    type: 'array'
    items:
      type: 'object'
      properties:
        id:
          type: 'string'
        type:
          type: 'string'
        range:
          type: 'object'
          properties:
            min:
              type: 'string'
            max:
              type: 'string'
      required:
        - 'id'
  constraints:
    type: 'array'
    items:
      type: 'object'
      properties:
        id:
          type: 'string'
        expression:
          type: 'string'
      required:
        - 'id'
        - 'expression'
  goal:
    type: 'string'
required:
  - 'variables'
  - 'constraints'
  - 'goal'

```

## Latest release

The version 0.3.6 is the latest stable version of governify-csp-tools component.
see [release note](http://github.com/isa-group/governify-csp-tools/releases/tag/0.3.6) for details.

For running:

- Download latest version from [0.3.6](http://github.com/isa-group/governify-csp-tools/releases/tag/0.3.6)