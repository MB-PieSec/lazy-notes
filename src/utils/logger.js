import chalk from 'chalk';

export const logger = {
    info: (msg) => console.log(chalk.cyan('ℹ'), msg),
    success: (msg) => console.log(chalk.green('✔'), msg),
    error: (msg) => console.log(chalk.red('✖'), msg),
    warning: (msg) => console.log(chalk.yellow('⚠'), msg),
    title: (msg) => console.log(chalk.bold.magenta(msg)),
};