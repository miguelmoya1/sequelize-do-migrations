import * as fs from 'fs';
import * as path from 'path';
import { Sequelize } from 'sequelize';
import {
  initMigrationModel,
  MigrationsModel,
} from './classes/migrations.model';
import { getParentPath } from './tools';
import { MigrationType, Options } from './types';

/**
 * Execute the migrations that are in the ./migrations folder or the one specified in options.path
 * @param sequelize Connection where do you want to save the migration history
 * @param options Options to configure the migrations
 * @returns An array of strings with the name of the files executed and saved in the database
 */
const runMigrations = async (sequelize: Sequelize, options: Options = {}) => {
  const created: string[] = [];
  let { path: pathToMigrations, logger, createGitkeep } = options;

  createGitkeep ??= true;

  logger?.('RUNNING MIGRATIONS...');

  if (!pathToMigrations) {
    pathToMigrations = path.join(path.dirname(getParentPath()), './migrations');
  }

  logger?.('PATH MIGRATIONS: ', pathToMigrations);

  if (!fs.existsSync(pathToMigrations)) {
    fs.mkdirSync(pathToMigrations);

    logger?.('PATH MIGRATIONS CREATED: ', pathToMigrations);
  }

  const pathSrc = path.join(pathToMigrations.replace(/dist/, 'src'));
  if (!fs.existsSync(pathSrc)) {
    fs.mkdirSync(pathSrc);
    logger?.('PATH MIGRATIONS CREATED: ', pathSrc);

    if (createGitkeep) {
      fs.writeFileSync(path.join(pathSrc, '.gitkeep'), '');
      logger?.('FILE .gitkeep CREATED: ', path.join(pathSrc, '.gitkeep'));
    }
  }

  const files = fs
    .readdirSync(pathToMigrations)
    .filter((f) => f.endsWith('.js') && !f.endsWith('.map.js'))
    .map((file) => file.split('.').slice(0, -1).join('.'));

  await initMigrationModel(sequelize);

  const migrations = await MigrationsModel.findAll();

  for await (const name of files) {
    if (name && migrations.findIndex((m) => m.name === name) === -1) {
      const migration: MigrationType = require(path.join(
        pathToMigrations,
        name
      ));

      try {
        await migration.up(sequelize);
        await MigrationsModel.create({
          name,
        });

        created.push(name);
      } catch (e) {
        if (migration.down) {
          await migration.down(sequelize);
        }

        logger?.('THE MIGRATION COULD NOT BE RUN: ', name);
      }
    } else {
      logger?.(
        `${'\x1b[33m'}${name} ${'\x1b[31m'}IT HAS ALREADY BEEN ADDED PREVIOUSLY${'\x1b[0m'}`
      );
    }
  }

  return created;
};

export { runMigrations };
