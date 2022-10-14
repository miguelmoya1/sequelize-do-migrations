"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initMigrationModel = exports.MigrationsModel = void 0;
const sequelize_1 = require("sequelize");
class MigrationsModel extends sequelize_1.Model {
}
exports.MigrationsModel = MigrationsModel;
const initMigrationModel = async (sequelize) => {
    MigrationsModel.init({
        name: { type: sequelize_1.DataTypes.STRING, unique: true, primaryKey: true },
    }, { sequelize, timestamps: true });
    await MigrationsModel.sync();
};
exports.initMigrationModel = initMigrationModel;
