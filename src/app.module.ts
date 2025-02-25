import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Tarjeta } from './entities/tarjeta.entity';
import { TarjetaService } from './services/tarjeta.service';
import { TarjetaController } from './controllers/tarjeta.controller';
import { TarjetaRepository } from './repositories/tarjeta.repository';
import { EncryptionService } from './services/encryption.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'SafetyCar16',
      database: 'marca_tarjeta',
      entities: [Tarjeta],
      synchronize: true, // Solo usar en desarrollo
    }),
    TypeOrmModule.forFeature([Tarjeta]),
  ],
  controllers: [AppController, TarjetaController],
  providers: [AppService, TarjetaService, TarjetaRepository, EncryptionService],
})
export class AppModule {}
