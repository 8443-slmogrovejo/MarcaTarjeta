import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Tarjeta } from './entities/tarjeta.entity';
import { TarjetaService } from './services/tarjeta.service';
import { TarjetaController } from './controllers/tarjeta.controller';
import { TarjetaRepository } from './repositories/tarjeta.repository';
import { EncryptionService } from './services/encryption.service';
import { BancoService } from './services/banco.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: 'ms-mariadb.ct6s2uqkmna8.us-east-2.rds.amazonaws.com',
      port: 3306,
      username: 'admin',
      password: 'password123',
      database: 'marca_tarjeta',
      entities: [Tarjeta],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Tarjeta]),
  ],
  controllers: [AppController, TarjetaController],
  providers: [AppService, TarjetaService, TarjetaRepository, EncryptionService, BancoService],
})
export class AppModule {}
