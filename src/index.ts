import { DataTypes, Sequelize, Model } from 'sequelize';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Interface for migration files inside options.path
 */
export type IMigrationType = {
  up: (sequelize: Sequelize) => Promise<void>;
  down: (sequelize: Sequelize) => Promise<void>;
};

type Migrations = { name: string };

export type options = {
  /**
   * by default in the same folder, called "migrations"
   */
  path?: string;
  /**
   * false by defult
   */
  showLogs?: boolean;
};

class SequelizeMigrations
  extends Model<Migrations, Migrations>
  implements Migrations
{
  public name!: string;
}

/**
 * Execute the migrations that are in the ./migratios folder or the one specified in options.path
 * @param sequelize Connection where do you want to save the migration history
 * @param options type options
 * @returns An array of strings with the name of the files executed and saved in the database
 */
const runMigrations = async (sequelize: Sequelize, options: options = {}) => {
  let { path: pathToMigrations } = options;
  const { showLogs } = options;
  const created: string[] = [];

  if (showLogs) console.log('\x1b[34m', 'RUNNING MIGRATIONS...', '\x1b[0m');

  if (!pathToMigrations) {
    pathToMigrations = path.join(path.dirname(getParentPath()), './migrations');
  }

  if (!fs.existsSync(pathToMigrations)) {
    fs.mkdirSync(pathToMigrations);
  }

  if (showLogs) console.log('PATH MIGRATIONS: ', pathToMigrations);

  const files = fs
    .readdirSync(pathToMigrations)
    .filter((f) => f.endsWith('.js') && !f.endsWith('.map.js'))
    .map((file) => file.split('.').slice(0, -1).join('.'));

  SequelizeMigrations.init(
    {
      name: { type: DataTypes.STRING, unique: true, primaryKey: true },
    },
    { sequelize, timestamps: true }
  );

  await SequelizeMigrations.sync();
  const migrations = await SequelizeMigrations.findAll();

  console.log(migrations);

  for await (const name of files) {
    if (name && migrations.findIndex((m) => m.name === name) === -1) {
      const migration: IMigrationType = require(path.join(
        pathToMigrations,
        name
      ));
      try {
        await migration.up(sequelize);
        await SequelizeMigrations.create({
          name,
        });
        created.push(name);
      } catch (e) {
        console.log(e);
        if (migration.down) await migration.down(sequelize);
        if (showLogs) console.log('THE MIGRATION COULD NOT BE RUN: ', name);
      }
    } else {
      if (showLogs) {
        console.log(
          `${'\x1b[33m'}${name} ${'\x1b[31m'}IT HAS ALREADY BEEN ADDED PREVIOUSLY${'\x1b[0m'}`
        );
      }
    }
  }

  return created;
};

const getParentPath = () => {
  const _prepareStackTrace = Error.prepareStackTrace;
  Error.prepareStackTrace = (_, stack) => stack;
  const stack = new Error().stack!.slice(1);
  Error.prepareStackTrace = _prepareStackTrace;
  return (stack[1] as any).getFileName() as string;
};

export { runMigrations };
