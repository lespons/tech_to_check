import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CurrencyModule } from './currency/currency.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ScheduleModule } from '@nestjs/schedule';
import { DB_CONFIG } from './settings';

@Module({
  imports: [
    CurrencyModule,
    ScheduleModule.forRoot(),
    SequelizeModule.forRoot(DB_CONFIG),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
