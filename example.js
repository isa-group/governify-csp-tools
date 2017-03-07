var Reasoner = require("governify-csp-tools").Reasoner;

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
}

// Configure the CSP reasoner
var reasoner = new Reasoner({
    type: 'local', // type value also can be 'api' or 'docker'
    folder: 'csp_files' // name of the folder which stores .mzn, .fzn and .ozn temporary files
});

// Solve CSP
reasoner.solve(cspModel, (err, sol) => {
    if (err) {
        // manage error
    } else {
        // manage solution
    }
});