import { Sequelize } from 'sequelize';

/**
 * Interface for migration files inside options.path
 */
export type MigrationType = {
  up: (sequelize: Sequelize) => Promise<void>;
  down: (sequelize: Sequelize) => Promise<void>;
};

export type Migration = { name: string };

export type Options = {
  /**
   * by default in the same folder, called "migrations"
   * @default same path that the file that calls the function
   */
  path?: string;

  /**
   * logger to use
   */
  logger?: (message?: any, ...optionalParams: any[]) => void;

  /**
   * create the file .gitkeep inside the migrations folder
   * @default true
   */
  createGitkeep?: boolean;

  /**
   * Show the error complete and not only the message
   * @default false
   */
  verbose?: boolean;
};
