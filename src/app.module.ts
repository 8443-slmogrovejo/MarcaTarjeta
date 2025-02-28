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
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'SafetyCar16',
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
