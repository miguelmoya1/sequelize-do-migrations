import { DataTypes, Sequelize } from 'sequelize';
import { runMigrations } from '../src';
import * as fs from 'fs';
import * as path from 'path';
import { Model } from 'sequelize';

class User extends Model {
  public id!: string;
}

describe('MAIN TEST', () => {
  let sequelize: Sequelize;
  const deleteDir = () => {
    if (fs.existsSync(path.join(__dirname, './migrations/'))) {
      fs.rmdirSync(path.join(__dirname, './migrations/'), { recursive: true });
    }
  };

  const createDir = () => {
    if (!fs.existsSync(path.join(__dirname, './migrations/'))) {
      fs.mkdirSync(path.join(__dirname, './migrations/'));
    }
  };

  const createFile = (withError = false) => {
    const fileName = `${Math.floor(100000 + Math.random() * 900000)}.ts`;
    fs.writeFileSync(
      path.join(__dirname, './migrations', fileName),
      (withError
        ? 'export const up = () => { throw new Error("error"); };'
        : 'export const up = () => {};'
      ).concat(' export const down = () => {};')
    );
    return fileName;
  };

  beforeAll(async () => {
    // WE CREATE A TEST DATABASE
    sequelize = new Sequelize('sqlite::memory:', { logging: false });

    // TABLE OF USERS FOR TEST
    User.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
      },
      { sequelize }
    );
  });

  beforeEach(async () => {
    await sequelize.sync({ force: true });
    createDir();
  });

  afterEach(() => {
    deleteDir();
  });

  it('Function return correctly', async () => {
    expect(await runMigrations(sequelize)).toStrictEqual([]);
  });

  it('Check that the up works', async () => {
    const name = createFile();
    expect(await runMigrations(sequelize)).toStrictEqual([name]);
  });

  it('Check that the down works', async () => {
    createFile(true);
    expect(await runMigrations(sequelize)).toStrictEqual([]);
  });

  it('Check multiples times run migrations', async () => {
    const name = createFile();
    expect(await runMigrations(sequelize)).toStrictEqual([name]);
    expect(await runMigrations(sequelize)).toStrictEqual([]);
  });

  it('Check multiples migrations', async () => {
    const name = createFile();
    const name2 = createFile();
    createFile(true);
    expect(await runMigrations(sequelize)).toStrictEqual([name, name2]);
    expect(await runMigrations(sequelize)).toStrictEqual([]);
  });
});
