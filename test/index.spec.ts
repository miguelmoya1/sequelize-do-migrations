import { DataTypes, Sequelize } from 'sequelize';
import { runMigrations } from '../src';
import * as fs from 'fs';
import * as path from 'path';
import { Model } from 'sequelize';

class User extends Model {
  public id!: string;
}

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

describe('MAIN TEST', () => {
  let sequelize: Sequelize;

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

    // CREATE THE TABLE
    await User.sync();
  });

  beforeEach(() => {
    createDir();
  });

  afterEach(() => {
    deleteDir();
  });

  it('Function return correctly', async () => {
    expect(await runMigrations(sequelize)).toStrictEqual([]);
  });

  it('Check that the up works', async () => {
    const name = '001_testNameUser.ts';
    fs.writeFileSync(
      path.join(__dirname, './migrations', name),
      'export const up = () => {}'
    );
    expect(await runMigrations(sequelize)).toStrictEqual([name]);
  });
});
