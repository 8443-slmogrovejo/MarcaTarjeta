import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Tarjeta } from '../entities/tarjeta.entity';

@Injectable()
export class TarjetaRepository extends Repository<Tarjeta> {
    constructor(private dataSource: DataSource) {
        super(Tarjeta, dataSource.createEntityManager());
    }

    async findByNumeroTarjeta(numeroTarjeta: string): Promise<Tarjeta | null> {
        return this.findOne({ where: { numeroTarjeta } });
    }
} 