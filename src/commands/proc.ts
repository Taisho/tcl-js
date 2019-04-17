import { Interpreter } from '../interpreter';
import { TclVariable, TclSimple } from '../types';
import { Scope } from '../scope';

let commands: { [index: string]: Function } = {};

/**
 * proc - creates a new command
 *
 * :: name arguments body
 *
 * @see https://wiki.tcl-lang.org/page/proc
 */

commands.proc = (
  interpreter: Interpreter,
  args: Array<string>,
  varArgs: Array<TclVariable>,
): any => {
  if (varArgs.length !== 3)
    throw new Error('wrong # args: should be "proc name arguments body"');

  let commandArgsString = varArgs[1];

  if (!(commandArgsString instanceof TclSimple))
    throw new Error('invalid arguments argument');

  let command = args[0];
  let commandArgs = commandArgsString.getList();
  let tclCode = args[2];

  let commandFunction = (
    parsedInterpreter: Interpreter,
    parsedArgs: Array<string>,
    parsedVarArgs: Array<TclVariable>,
  ) => {
    if (parsedVarArgs.length !== commandArgs.getLength())
      throw new Error(`wrong # args on function "${command}"`);

    let newScope = new Scope(parsedInterpreter.scope);

    for (let i = 0; i < parsedVarArgs.length; i++) {
      let argName = commandArgs.getSubValue(i).getValue();
      let argValue = parsedVarArgs[i].getValue();
      newScope.define(argName, argValue);
      
    }

    let newInterpreter = new Interpreter(parsedInterpreter.tcl, tclCode, newScope);
    return newInterpreter.run();
  };

  interpreter.scope.defineProc(command, commandFunction);

  return '';
};

export function Load(scope: Scope) {
  for (let command in commands) {
    scope.defineProc(command, commands[command]);
  }
}