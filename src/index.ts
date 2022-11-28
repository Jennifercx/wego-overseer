import 'dotenv/config';
import Bot from '@/Bot';
import Logger from '@/telemetry/logger';
import knex from 'knex';
import knexfile from '../knexfile';
import {Model} from 'objection';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import {Maybe} from '@/types/util';
import {KortebroekCommand} from '@/commands/fun/KortebroekCommand';
import {PingCommand} from '@/commands/PingCommand';
import {StufiCommand} from '@/commands/fun/StufiCommand';
import {HelpCommand} from '@/commands/HelpCommand';
import {WhereMemeCommand} from '@/commands/meme/WhereMemeCommand';
import {IAmDadEvent} from './events/meme/IAmDadEvent';
import {BangerEvent} from './events/meme/BangerEvent';
import {SpooktoberCommand} from './commands/meme/SpooktoberCommand';
import {DeepFryCommand} from './commands/meme/DeepFryCommand';
import {JokeMemeCommand} from './commands/meme/JokeMemeCommand';
import {MockifyCommand} from './commands/text/MockifyCommand';
import {DrakeMemeCommand} from './commands/meme/DrakeMemeCommand';
import {UwuCommand} from './commands/text/UwuCommand';
import {MarieKondoCommand} from './commands/meme/MarieKondoCommand';
import {I18n} from 'i18n';
import {UpvoteEvent} from './events/UpvoteEvent';

const DISCORD_APPLICATION_ID = process.env.DISCORD_APPLICATION_ID ?? '';
const DISCORD_TOKEN = process.env.DISCORD_TOKEN ?? '';

const logger = new Logger('wego-overseer:index');

export let bot: Maybe<Bot> = null;

export const i18n = new I18n({
    directory: __dirname + '/lang',
});

// Setup knex connection for objection
Model.knex(knex(knexfile));

dayjs.extend(utc);
dayjs.extend(timezone);

(async () => {
    bot = new Bot({
        applicationId: DISCORD_APPLICATION_ID,
        token: DISCORD_TOKEN,
        commands: [
            PingCommand,
            KortebroekCommand,
            StufiCommand,
            WhereMemeCommand,
            SpooktoberCommand,
            HelpCommand,
            DeepFryCommand,
            JokeMemeCommand,
            MockifyCommand,
            DrakeMemeCommand,
            UwuCommand,
            MarieKondoCommand,
        ],
        events: [IAmDadEvent, BangerEvent, UpvoteEvent],
    });

    try {
        const client = await bot.boot();
        logger.info(`Bot now ready and listening as '${client.user?.tag}'`);

        // TODO: remove
        client.on('messageReactionAdd', (reaction, user) => {
            console.log('messageReactionAdd', reaction, user);
        });
        client.on('messageReactionRemove', (reaction, user) => {
            console.log('messageReactionRemove', reaction, user);
        });
        client.on('messageCreate', (message) => {
            console.log('messageCreate', message);
        });
    } catch (err) {
        logger.fatal(err);
    }
})();
