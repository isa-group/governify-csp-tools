# Governify CSP Tools
This is a Node.js module created to provide Constraint Satisfaction Problems (CSP) tools
for others Node.js applications. You can require the module by using
`require(governify-csp-tools)`. By now, the only tool available is Reasoner.

This module follows the `project-template-nodejs` guidelines.

## How to use this module
1. Install module: `npm install governify-csp-tools --save`.
2. Initialize a `Reasoner` instance with a configuration.
3. Solve the problem by calling `solve` method.

## Reasoner
This tool is able to execute problem described on CSP YAML schema.

Initialize the Reasoner:
```javascript
var Reasoner = require("governify-csp-tools").Reasoner;
var cspReasonerTool = new Reasoner(config);
```

The Reasoner can be configured to run in three different ways: local, remote and docker.

Please, follow the reasoner configuration file schema:

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

```

Follow the examples configuration to set your Reasoner.

### Local configuration
You need to set `type: 'local'` on Reasoner YAML configuration file.

```yaml
reasoner:
  type: 'local'
  folder: 'csp_files_local'
```

#### Remote configuration
You need to set `type: 'api'` on Reasoner YAML configuration file.

```yaml
reasoner:
  type: 'api'
  api:
    version: 'v2'
    server: 'https://localhost:10044/module-minizinc'
    operationPath: 'models/mzn/operations/execute'
  folder: 'csp_files_remote'
```

#### Docker configuration
You need to have docker installed on the machine you are requiring `governify-csp-tools`, i.e:

```yaml
reasoner:
  type: 'docker'
  folder: 'csp_files_docker'
```

### CSP YAML schema
This schema has been created to describe CSP problem on YAML. By now, it allows you
to define:

- Parameters.
- Variables.
- Constraints.
- Goals.

The schema is described as:

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
