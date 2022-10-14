import { Sequelize } from 'sequelize';
import { Options } from './types';
/**
 * Execute the migrations that are in the ./migrations folder or the one specified in options.path
 * @param sequelize Connection where do you want to save the migration history
 * @param options type options
 * @returns An array of strings with the name of the files executed and saved in the database
 */
declare const runMigrations: (sequelize: Sequelize, options?: Options) => Promise<string[]>;
export { runMigrations };
