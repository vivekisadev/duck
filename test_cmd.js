import { Command } from 'commander';

const program = new Command();
program.command('test1').alias('t1').action(() => {});
program.command('test2').action(() => {});

const knownCommands = program.commands.map(cmd => cmd.name()).concat(program.commands.flatMap(cmd => cmd.aliases()));
console.log(knownCommands);
