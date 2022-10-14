"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMigrations = void 0;
const fs = require("fs");
const path = require("path");
const migrations_model_1 = require("./classes/migrations.model");
const tools_1 = require("./tools");
/**
 * Execute the migrations that are in the ./migrations folder or the one specified in options.path
 * @param sequelize Connection where do you want to save the migration history
 * @param options type options
 * @returns An array of strings with the name of the files executed and saved in the database
 */
const runMigrations = async (sequelize, options = {}) => {
    let { path: pathToMigrations, logger = console.log } = options;
    const { showLogs } = options;
    const created = [];
    if (showLogs) {
        logger('\x1b[34m', 'RUNNING MIGRATIONS...', '\x1b[0m');
    }
    if (!pathToMigrations) {
        pathToMigrations = path.join(path.dirname((0, tools_1.getParentPath)()), './migrations');
    }
    if (showLogs) {
        logger('PATH MIGRATIONS: ', pathToMigrations);
    }
    if (!fs.existsSync(pathToMigrations)) {
        fs.mkdirSync(pathToMigrations);
        if (showLogs) {
            logger('PATH MIGRATIONS CREATED: ', pathToMigrations);
        }
    }
    const files = fs
        .readdirSync(pathToMigrations)
        .filter((f) => f.endsWith('.js') && !f.endsWith('.map.js'))
        .map((file) => file.split('.').slice(0, -1).join('.'));
    await (0, migrations_model_1.initMigrationModel)(sequelize);
    const migrations = await migrations_model_1.MigrationsModel.findAll();
    for await (const name of files) {
        if (name && migrations.findIndex((m) => m.name === name) === -1) {
            const migration = require(path.join(pathToMigrations, name));
            try {
                await migration.up(sequelize);
                await migrations_model_1.MigrationsModel.create({
                    name,
                });
                created.push(name);
            }
            catch (e) {
                if (migration.down) {
                    await migration.down(sequelize);
                }
                if (showLogs) {
                    logger('THE MIGRATION COULD NOT BE RUN: ', name);
                }
            }
        }
        else {
            if (showLogs) {
                logger(`${'\x1b[33m'}${name} ${'\x1b[31m'}IT HAS ALREADY BEEN ADDED PREVIOUSLY${'\x1b[0m'}`);
            }
        }
    }
    return created;
};
exports.runMigrations = runMigrations;
