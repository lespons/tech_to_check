import { SequelizeModuleOptions } from '@nestjs/sequelize/dist/interfaces/sequelize-options.interface';
import { Dialect } from 'sequelize/types/sequelize';

export const DB_CONFIG: SequelizeModuleOptions = {
  dialect: (process.env.dialect as Dialect) || 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.PORT) || 3306,
  username: process.env.USER_NAME || 'user',
  password: process.env.PASSWORD || 'user',
  database: process.env.DATABAE_NAME || 'test',
  logQueryParameters: true,
  logging: true,
  autoLoadModels: true,
};
