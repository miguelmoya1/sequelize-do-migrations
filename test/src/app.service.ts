import { Injectable, OnModuleInit } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { runMigrations } from '../../dist';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private sequelize: Sequelize) {}

  onModuleInit() {
    console.log('AppService initialized');

    runMigrations(this.sequelize as any, {
      logger: console.log,
    });
  }
}
