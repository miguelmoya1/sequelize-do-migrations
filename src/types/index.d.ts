import { Sequelize } from 'sequelize';
/**
 * Interface for migration files inside options.path
 */
export declare type MigrationType = {
    up: (sequelize: Sequelize) => Promise<void>;
    down: (sequelize: Sequelize) => Promise<void>;
};
export declare type Migration = {
    name: string;
};
export declare type Options = {
    /**
     * by default in the same folder, called "migrations"
     */
    path?: string;
    /**
     * false by default
     * @default false
     */
    showLogs?: boolean;
    /**
     * logger to use
     * @default console
     */
    logger?: (message?: any, ...optionalParams: any[]) => void;
};
