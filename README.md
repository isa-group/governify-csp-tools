# Governify CSP Tools
This is a Node.js module to compute Constraint satisfaction problems described in
MiniZinc YAML schema.

## MiniZinc YAML schema
This schema has been created to describe MiniZinc problem over YAML.
For now it allows to define:
- parameters
- variables
- constraints
- goals

The schema is described as:

```yaml
---
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