const { Tcl } = require('../dist/Tcl');
const tcl = new Tcl();

async function main() {
  tcl.runFile('./test/test.tcl');
}

main().catch(console.error);
