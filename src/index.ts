#!/usr/bin/env node

import { cosmo } from './cosmo';
import { Command } from 'commander';
import { default as chalk } from 'chalk';
import clear from 'clear';
import * as figlet from 'figlet';

// Console Welcome
// clear();
console.log(
  chalk.bold.blueBright(figlet.textSync('Cosmo', { horizontalLayout: 'full' }))
);

const program = new Command();
program
  .version('0.0.1')
  .description('A tool that generates Graphql files from the Prisma Schema');

cosmo();
