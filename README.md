# sequelize-do-migrations

**sequelize-do-migrations** requires sequelize.

To install the library use the following command.

With yarn:

    yarn add sequelize-do-migrations

Or npm:

    npm install --save sequelize-do-migrations

## How to use

To use the library you must import **runMigrations**:

    import { runMigrations } from 'sequelize-do-migrations';

Call the function passing it the connection of sequelize, passing it the connection of sequelize, optionally you can pass another parameter with options:

    runMigrations(sequelize, options);

**Return**: An array of strings with the name of the files executed and saved in the database.

The options:

    {
      path?: string;
      showLogs?: boolean;
    }

By default, **showLogs** is false, if true, prints logs by console.log.

The path to the migrations folder, by default, is in the same folder from where the function is called, it looks for a folder called **migrations** or **migration** unless the path parameter is modified.

An example of migration is to create a file called 01_XXXXX.ts (It can be any name as long as it is not repeated) inside the migrations folder with the following code:

    import { DataTypes, Sequelize } from 'sequelize';

    export const up = async (sequelize: Sequelize) => {
      const user = await sequelize.models.User.describe();
      if (!user.location) {
        await sequelize.getQueryInterface().addColumn('Users', 'location', {
          type: DataTypes.GEOGRAPHY,
        });
      }
    };

    export const down = async (sequelize: Sequelize) => {
      const user = await sequelize.models.User.describe();
      if (user.location) {
        await sequelize.getQueryInterface().removeColumn('Users', 'location');
      }
    };
