import figlet from 'figlet';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import { logger } from '../utils/logger.js';
import { getTranscript } from '../services/transcriptService.js';
import { generateNotes } from '../services/aiService.js';
import { getApiKey, setApiKey, getConfiguredProviders, removeApiKey, getCookiesPath, setCookiesPath } from '../utils/config.js';
import { saveNotes } from '../services/fileService.js';
import { runSetup } from '../utils/setup.js';
import { existsSync } from 'fs';

const PROVIDERS = ['Gemini', 'Claude', 'OpenAI', 'Groq', 'Grok', 'OpenRouter'];

function showBanner() {
    console.clear();
    console.log(
        chalk.magenta(
            figlet.textSync('Lazy Notes', { font: 'Standard' })
        )
    );
    console.log(chalk.gray('  AI-powered notes from YouTube videos\n'));
}

function getProviderChoices() {
    const configured = getConfiguredProviders();
    return PROVIDERS.map(p => ({
        name: configured.includes(p.toLowerCase())
            ? `${p} ${chalk.green('(configured ✓)')}`
            : `${p} ${chalk.red('(not configured ✗)')}`,
        value: p
    }));
}

async function configureKeys() {
    while (true) {
      const { provider } = await inquirer.prompt([
          {
              type: 'select',
              name: 'provider',
              message: 'Which provider do you want to configure?',
              pageSize: 10,
              choices: [
                  ...getProviderChoices(),
                  { 
                      name: getCookiesPath() 
                          ? chalk.green('YouTube Cookies (configured ✓)') 
                          : chalk.red('YouTube Cookies (not configured ✗)'),
                      value: 'cookies'
                  },
                  { name: chalk.yellow('← Back to main menu'), value: 'back' }
              ]
          }
      ]);

      if (provider === 'back') return;

      if (provider === 'cookies') {
          const { cookiesPath } = await inquirer.prompt([
              {
                  type: 'input',
                  name: 'cookiesPath',
                  message: 'Enter full path to your cookies.txt file:',
                  default: getCookiesPath() || '',
                  validate: (input) => {
                      if (!input.trim()) return 'Path cannot be empty';
                      if (!existsSync(input.trim())) return 'File not found at that path';
                      return true;
                  }
              }
          ]);
          setCookiesPath(cookiesPath.trim());
          logger.success('Cookies path saved successfully!');
          console.log('');
          continue;
      }
      
      const isConfigured = getApiKey(provider) !== null;

      if (isConfigured) {
        const { action } = await inquirer.prompt([
          {
            type: 'select',
            name: 'action',
            message: `${provider} is already configured. What do you want to do?`,
            choices: [
              { name: 'Update API key', value: 'update' },
              { name: 'Reset (remove key)', value: 'reset' },
              { name: 'Cancel', value: 'cancel' }
            ]
          }
        ]);

        if (action === 'cancel') continue;
        if (action === 'reset') {
          removeApiKey(provider);
          logger.success(`${provider} API key removed.`);
          console.log('');
          continue;
        }
      }

      const { apiKey } = await inquirer.prompt([
        {
          type: 'password',
          name: 'apiKey',
          message: `Enter your ${provider} API key:`,
          mask: "*",
          validate: (input) => {
            if (!input.trim()) return 'API key cannot be empty';
            return true;
          }
        }
      ]);

      setApiKey(provider, apiKey.trim());
      logger.success(`${provider} API key saved successfully!`);
      console.log('');
    }
  }

async function generateNotesFlow() {
    const { url } = await inquirer.prompt([
        {
            type: 'input',
            name: 'url',
            message: 'Enter YouTube URL:',
            validate: (input) => {
                if (!input.includes('youtube.com') && !input.includes('youtu.be')) {
                    return 'Please enter a valid YouTube URL';
                }
                return true;
            }
        }
    ]);

  while (true) {
        const { provider } = await inquirer.prompt([
            {
                type: 'select',
                name: 'provider',
                message: 'Choose AI provider:',
                choices: [
                    ...getProviderChoices(),
                    { name: chalk.yellow('← Back to main menu'), value: 'back' }
                ]
            }
        ]);
        if (provider === 'back') return;
        const apiKey = getApiKey(provider);
        if (!apiKey) {
            logger.warning(`${provider} is not configured yet.`);
            const { configure } = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'configure',
                    message: `Would you like to configure ${provider} now?`,
                    default: true
                }
            ]);
            if (configure) await configureKeys();
            continue; // loop back to provider selection
        }

        const spinner = ora('Fetching transcript...').start();

        try {
            const { transcript, title } = await getTranscript(url);
            spinner.succeed('Transcript fetched!');
            logger.info(`Video: ${title}`);
            logger.info(`Transcript length: ${transcript.length} characters`);

            spinner.text = 'Generating notes with AI...';
            spinner.start();
            const notes = await generateNotes(transcript, apiKey, provider);
            spinner.succeed('Notes generated!');

            const filePath = saveNotes(title, notes);
            logger.success(`Notes saved to: ${filePath}`);
        } catch (error) {
            spinner.fail('Something went wrong');
            logger.error(error.message);
        }

        return;
    }
}


async function main() {
  showBanner();
  await runSetup();
  while (true) {
    const { action } = await inquirer.prompt([
      {
        type: 'select',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          { name: 'Generate Notes', value: 'generate' },
          { name: 'Configure API Keys', value: 'configure' },
          { name: 'Exit', value: 'exit' }
        ]
      }
    ]);

    if (action === 'exit') {
      logger.info('Goodbye!');
      process.exit(0);
    } else if (action === 'configure') {
      await configureKeys();
    } else {
      await generateNotesFlow();
    }

    console.log('');
  }
}


main();
