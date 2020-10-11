"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _runMigrations = void 0;
export { _runMigrations as runMigrations };
import { Model, DataTypes } from "sequelize";
import { accessSync, readdirSync } from "fs";
import { join, dirname } from "path";
class SequelizeMigrations extends Model {
}
const runMigrations = async (sequelize, pathToMigrations) => {
    console.log('\x1b[34m', 'RUNNING MIGRATIONS...', '\x1b[0m');
    if (!pathToMigrations) {
        pathToMigrations = join(dirname(getParentPath()), './migration');
        try {
            accessSync(pathToMigrations);
        }
        catch {
            pathToMigrations = join(dirname(getParentPath()), './migrations');
        }
    }
    console.log('PATH MIGRATIONS: ', pathToMigrations);
    const files = readdirSync(pathToMigrations);
    SequelizeMigrations.init({
        name: { type: DataTypes.STRING, unique: true, primaryKey: true },
    }, { sequelize, timestamps: true });
    await SequelizeMigrations.sync();
    const migrations = await SequelizeMigrations.findAll();
    for await (const file of files) {
        if (file && migrations.findIndex((m) => m.name === file) === -1) {
            const migration = require(join(pathToMigrations, file));
            try {
                await migration.up(sequelize);
                await SequelizeMigrations.create({ name: file });
            }
            catch {
                await migration.down(sequelize);
                console.log('THE MIGRATION COULD NOT BE RUN: ', file);
            }
        }
        else {
            console.log(`${'\x1b[33m'}${file} ${'\x1b[31m'}IT HAS ALREADY BEEN ADDED PREVIOUSLY${'\x1b[0m'}`);
        }
    }
};
const _runMigrations = runMigrations;
export { _runMigrations as runMigrations };
const getParentPath = () => {
    const _prepareStackTrace = Error.prepareStackTrace;
    Error.prepareStackTrace = (_, stack) => stack;
    const stack = new Error().stack.slice(1);
    Error.prepareStackTrace = _prepareStackTrace;
    return stack[1].getFileName();
};
