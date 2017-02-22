# Governify CSP Tools
This is a Node.js module to compute CSP. The CSP problem can be executed remotely or locally by Reasoner.

For local operations you need to have MiniZinc installed on your host in order to execute
`mzn2fzn`, `fzn-gecode` and `soln2out`.

## Reasoner configuration file
This file defines how the Reasoner should be configure.
The file content has to follow the schema:

```yaml
---
title: Reasoner configuration file schema
type: object
properties:
  type:
    enum:
    - api
    - local
  api:
    type: object
    properties:
      version:
        type: string
      server:
        type: string
      operationPath:
        type: string

```

## MiniZinc YAML schema
```yaml
---
type: object
properties:
  parameters:
    type: array
    items:
      type: object
      properties:
        id:
          type: string
        type:
          type: string
        value:
          type: string
        values:
          type: array
  variables:
    type: array
    items:
      type: object
      properties:
        id:
          type: string
        type:
          type: string
        range:
          type: object
          properties:
            min:
              type: string
            max:
              type: string
  constraints:
    type: array
    item:
      type: object
      properties:
        id:
          type: string
        expression:
          type: string
  goals:
    type: array
```###### Latest release

The version 0.0.1 is the latest stable version of governify-csp-tools component.
see [release note](http://github.com/isa-group/governify-agreement-analyzer/releases/tag/0.0.1) for details.

For running:

- Download latest version from [0.0.1](http://github.com/isa-group/governify-agreement-analyzer/releases/tag/0.0.1)