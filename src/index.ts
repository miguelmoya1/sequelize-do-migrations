import { DataTypes, Sequelize, Model } from 'sequelize';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Interface for migration files inside options.path
 */
export interface IMigrationType {
  up: (sequelize: Sequelize) => Promise<void>;
  down: (sequelize: Sequelize) => Promise<void>;
}

type Migrations = { name: string };

type options = {
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
  implements Migrations {
  public name!: string;
}

const runMigrations = async (sequelize: Sequelize, options: options = {}) => {
  let { path: pathToMigrations } = options;
  const { showLogs } = options;

  if (showLogs) console.log('\x1b[34m', 'RUNNING MIGRATIONS...', '\x1b[0m');

  if (!pathToMigrations) {
    pathToMigrations = path.join(path.dirname(getParentPath()), './migration');
    try {
      fs.accessSync(pathToMigrations);
    } catch {
      pathToMigrations = path.join(
        path.dirname(getParentPath()),
        './migrations'
      );
    }
  }

  if (showLogs) console.log('PATH MIGRATIONS: ', pathToMigrations);

  const files = fs.readdirSync(pathToMigrations);

  SequelizeMigrations.init(
    {
      name: { type: DataTypes.STRING, unique: true, primaryKey: true },
    },
    { sequelize, timestamps: true }
  );

  await SequelizeMigrations.sync();
  const migrations = await SequelizeMigrations.findAll();

  for await (const file of files) {
    if (file && migrations.findIndex((m) => m.name === file) === -1) {
      const migration: IMigrationType = require(path.join(
        pathToMigrations,
        file
      ));
      try {
        await migration.up(sequelize);
        await SequelizeMigrations.create({ name: file });
      } catch {
        await migration.down(sequelize);
        if (showLogs) console.log('THE MIGRATION COULD NOT BE RUN: ', file);
      }
    } else {
      if (showLogs) {
        console.log(
          `${'\x1b[33m'}${file} ${'\x1b[31m'}IT HAS ALREADY BEEN ADDED PREVIOUSLY${'\x1b[0m'}`
        );
      }
    }
  }
};

const getParentPath = () => {
  const _prepareStackTrace = Error.prepareStackTrace;
  Error.prepareStackTrace = (_, stack) => stack;
  const stack = new Error().stack!.slice(1);
  Error.prepareStackTrace = _prepareStackTrace;
  return (stack[1] as any).getFileName() as string;
};

export { runMigrations };
