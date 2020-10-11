import { Sequelize } from 'sequelize';
declare const runMigrations: (sequelize: Sequelize, pathToMigrations?: string | undefined) => Promise<void>;
export { runMigrations };
