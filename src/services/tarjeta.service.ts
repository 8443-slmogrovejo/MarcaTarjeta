import { Injectable } from '@nestjs/common';
import { Tarjeta } from '../entities/tarjeta.entity';
import { NotFoundException } from '../common/exceptions/not-found.exception';
import { CrearTarjetaDto } from '../dtos/crear-tarjeta.dto';
import { ActualizarTarjetaDto } from '../dtos/actualizar-tarjeta.dto';
import { ValidarTarjetaDto } from '../dtos/validar-tarjeta.dto';
import { TarjetaRepository } from '../repositories/tarjeta.repository';
import { EncryptionService } from './encryption.service';

@Injectable()
export class TarjetaService {
    private readonly ENTITY_NAME = 'Tarjeta';

    constructor(
        private readonly repositorio: TarjetaRepository,
        private readonly encryptionService: EncryptionService
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

    async obtenerSwiftBancoPorNumeroTarjeta(numeroTarjeta: string): Promise<{ swiftBanco: string }> {
        const tarjeta = await this.buscarPorNumeroTarjeta(numeroTarjeta);
        return { swiftBanco: tarjeta.swiftBanco };
    }

    async crear(crearTarjetaDto: CrearTarjetaDto): Promise<Tarjeta> {
        const tarjeta = this.repositorio.create(crearTarjetaDto);
        tarjeta.fechaEmision = new Date();
        const fechaCaducidad = new Date();
        fechaCaducidad.setFullYear(fechaCaducidad.getFullYear() + 4);
        tarjeta.fechaCaducidad = fechaCaducidad;
        
        // Encriptar el CVV antes de guardar
        tarjeta.cvv = await this.encryptionService.hashCvv(tarjeta.cvv);
        
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

    async validarTarjeta(validarTarjetaDto: ValidarTarjetaDto): Promise<{ esValida: boolean, mensaje: string }> {
        const tarjeta = await this.buscarPorNumeroTarjeta(validarTarjetaDto.numeroTarjeta);
        
        // Verificar si la tarjeta está activa
        if (tarjeta.estado !== 'ACT') {
            return { 
                esValida: false, 
                mensaje: 'La tarjeta no está activa' 
            };
        }

        // Verificar la fecha de caducidad
        const fechaCaducidadIngresada = new Date(validarTarjetaDto.fechaCaducidad);
        const fechaCaducidadTarjeta = new Date(tarjeta.fechaCaducidad);
        
        if (fechaCaducidadIngresada.getTime() !== fechaCaducidadTarjeta.getTime()) {
            return { 
                esValida: false, 
                mensaje: 'Datos de la tarjeta incorrectos' 
            };
        }

        // Verificar el CVV
        const cvvValido = await this.encryptionService.compareCvv(validarTarjetaDto.cvv, tarjeta.cvv);
        if (!cvvValido) {
            return { 
                esValida: false, 
                mensaje: 'Datos de la tarjeta incorrectos' 
            };
        }

        return { 
            esValida: true, 
            mensaje: 'La tarjeta es válida' 
        };
    }
} 