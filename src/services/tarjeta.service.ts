import { Injectable } from '@nestjs/common';
import { Tarjeta } from '../entities/tarjeta.entity';
import { NotFoundException } from '../common/exceptions/not-found.exception';
import { CrearTarjetaDto } from '../dtos/crear-tarjeta.dto';
import { ActualizarTarjetaDto } from '../dtos/actualizar-tarjeta.dto';
import { TarjetaRepository } from '../repositories/tarjeta.repository';

@Injectable()
export class TarjetaService {
    private readonly ENTITY_NAME = 'Tarjeta';

    constructor(
        private readonly repositorio: TarjetaRepository
    ) {}

    async buscarTodos(): Promise<Tarjeta[]> {
        return await this.repositorio.find();
    }

    async buscarPorId(codTarjeta: string): Promise<Tarjeta> {
        const tarjeta = await this.repositorio.findOne({ where: { codTarjeta } });
        if (!tarjeta) {
            throw new NotFoundException(codTarjeta, this.ENTITY_NAME);
        }
        return tarjeta;
    }

    async buscarPorNumeroTarjeta(numeroTarjeta: string): Promise<Tarjeta> {
        const tarjeta = await this.repositorio.findByNumeroTarjeta(numeroTarjeta);
        if (!tarjeta) {
            throw new NotFoundException(numeroTarjeta, this.ENTITY_NAME);
        }
        return tarjeta;
    }

    async crear(crearTarjetaDto: CrearTarjetaDto): Promise<Tarjeta> {
        const tarjeta = this.repositorio.create(crearTarjetaDto);
        tarjeta.fechaEmision = new Date();
        const fechaCaducidad = new Date();
        fechaCaducidad.setFullYear(fechaCaducidad.getFullYear() + 4);
        tarjeta.fechaCaducidad = fechaCaducidad;
        
        return await this.repositorio.save(tarjeta);
    }

    async actualizar(actualizarTarjetaDto: ActualizarTarjetaDto): Promise<Tarjeta> {
        const tarjetaDB = await this.buscarPorId(actualizarTarjetaDto.codTarjeta);
        tarjetaDB.estado = actualizarTarjetaDto.estado;
        return await this.repositorio.save(tarjetaDB);
    }

    async eliminar(codTarjeta: string): Promise<void> {
        const tarjeta = await this.buscarPorId(codTarjeta);
        await this.repositorio.remove(tarjeta);
    }
} 