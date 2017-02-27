# Governify CSP Tools
This is a Node.js module created to provide **Constraint Satisfaction Problems** (CSP) tools
for others Node.js applications. You can require the module by using
`require(governify-csp-tools)`. For now, the only tool available is [Reasoner](#Reasoner).

This module follows the `project-template-nodejs` guidelines.

## Installation
```
npm install governify-csp-tools
```

## How to use the Reasoner tool
### 1. Install module
```
npm install governify-csp-tools --save
```

### 2. Define a Reasoner configuration
```javascript
var config = {
  "reasoner": {
    "type": "docker",
    "folder": "csp_files_docker"
  }
};
```

### 3. Initialize a Reasoner with configuration
Initialize the Reasoner:
```javascript
var Reasoner = require("governify-csp-tools").Reasoner;
var cspReasonerTool = new Reasoner(config);
```

### 4. Solve
Solve the problem by calling `solve` method:
```javascript
cspReasonerTool.solve(model, (error, sol) => {
    if (error) {
        // manage error
    } else {
        // manage success
    }
});
```

The problem must be modeled over [CSP model schema](#csp-model-schema).

## CSP model schema
This schema has been created to describe CSP problem on YAML. For now, it allows you
to define:

- Parameters.
- Variables.
- Constraints.
- Goals.

The JSON schema related to CSP model is:

```yaml
---
title: 'CSP YAML schema'
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
            - 'int'
            - 'float'
            - 'string'
            - 'enum'
            - 'number'
            - 'int32'
            - 'int64'
            - 'double'
            - 'byte'
            - 'binary'
            - 'date'
            - 'date-time'
            - 'password'
        value:
          type: 'string'
        values:
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
  goals:
    type: 'array'
    items:
      type: 'string'
required:
  - 'variables'
  - 'constraints'
  - 'goals'

```

An example for this JSON schema could be:

```yaml
variables:
  - id: ImageTranslation
    range:
      min: '0'
      max: '1'
  - id: TranslationTime
    range:
      min: '0'
      max: '100'
constraints:
  - id: Q1
    expression: ImageTranslation == 0 -> TranslationTime <= 1
  - id: Q2
    expression: ImageTranslation == 1 -> TranslationTime <= 3
  - id: Q3
    expression: ImageTranslation == 1
  - id: Q4
    expression: TranslationTime >= 3
goals:
  - satisfy
  - minimize ImageTranslation

```

## Reasoner
This tool is able to execute problem described on CSP YAML schema. 
The Reasoner can be configured to run in three different environments:
local, remote and docker.

Please, follow this schema below to set your Reasoner configuration file:

```yaml
---
title: Reasoner configuration file schema
type: 'object'
properties:
  type:
    enum:
    - 'api'
    - 'local'
    - 'docker'
  folder:
    type: 'string'  # specifies the directory to save 
  api:              # only if type is 'api'
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

Check some Reasoner configuration examples.

### Example of `local` configuration
You need to set `type: 'local'` on Reasoner YAML configuration file.

```yaml
type: 'local'
folder: 'csp_files_local'
```

### Example of `remote` configuration
You need to set `type: 'api'` on Reasoner YAML configuration file.

```yaml
type: 'api'
api:
  version: 'v2'
  server: 'https://localhost:10044/module-minizinc'
  operationPath: 'models/mzn/operations/execute'
folder: 'csp_files_remote'
```

### Example of `docker` configuration
You need to have docker installed on the machine you are requiring `governify-csp-tools`, e.g:

```yaml
type: 'docker'
folder: 'csp_files_docker'
```

#### Latest release

The version 0.0.0 is the latest stable version of governify-csp-tools component.
see [release note](http://github.com/isa-group/governify-csp-tools/releases/tag/0.0.0) for details.

For running:

- Download latest version from [0.0.0](http://github.com/isa-group/governify-csp-tools/releases/tag/0.0.0)