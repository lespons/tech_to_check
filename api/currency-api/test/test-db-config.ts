import { SequelizeModuleOptions } from '@nestjs/sequelize/dist/interfaces/sequelize-options.interface';

export const TEST_DB_CONFIG: SequelizeModuleOptions = {
  dialect: 'mysql',
  host: 'localhost',
  port: 3307,
  username: 'user',
  password: 'user',
  database: 'test_db',
  logging: false,
  logQueryParameters: false,
  autoLoadModels: true,
};
