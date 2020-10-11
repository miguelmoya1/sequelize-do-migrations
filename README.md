# sequelize-do-migrations

**sequelize-do-migrations** requires sequelize.

To install the library use the following command.

With yarn:

    yarn add sequelize-do-migrations

Or npm:

    npm install --save sequelize-do-migrations

## How to use

To use the library you must import **runMigrations**

    import { runMigrations } from 'sequelize-do-migrations';

Call the function passing it the connection of sequelize, passing it the connection of sequelize, optionally you can pass another parameter with options:

    path?: string;
    showLogs?: boolean;
