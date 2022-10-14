import { DataTypes, Model, Sequelize } from 'sequelize';
import { Migration } from '../types';

export class MigrationsModel extends Model<Migration> {
  declare name: string;
}

export const initMigrationModel = async (sequelize: Sequelize) => {
  MigrationsModel.init(
    {
      name: { type: DataTypes.STRING, unique: true, primaryKey: true },
    },
    { sequelize, timestamps: true }
  );

  await MigrationsModel.sync();
};
