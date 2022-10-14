import { Model, Sequelize } from 'sequelize';
import { Migration } from '../types';
export declare class MigrationsModel extends Model<Migration> {
    name: string;
}
export declare const initMigrationModel: (sequelize: Sequelize) => Promise<void>;
