import { Injectable } from '@nestjs/common';
import { Tarjeta } from '../entities/tarjeta.entity';
import { NotFoundException } from '../common/exceptions/not-found.exception';
import { CrearTarjetaDto } from '../dtos/crear-tarjeta.dto';
import { ActualizarTarjetaDto } from '../dtos/actualizar-tarjeta.dto';
import { ValidarTarjetaDto } from '../dtos/validar-tarjeta.dto';
import { TarjetaRepository } from '../repositories/tarjeta.repository';
import { EncryptionService } from './encryption.service';
import { BancoService } from './banco.service';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class TarjetaService {
    private readonly ENTITY_NAME = 'Tarjeta';

    constructor(
        private readonly repositorio: TarjetaRepository,
        private readonly encryptionService: EncryptionService,
        private readonly bancoService: BancoService
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

    private generarNumeroTarjetaUnico(): string {
        const prefijo = '5135';
        const sufijo = Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');
        return prefijo + sufijo;
    }

    private generarCvv(): string {
        return Math.floor(Math.random() * 900) + 100 + '';
    }

    private generarCodigoTarjeta(): string {
        const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let codigo = '';
        for (let i = 0; i < 10; i++) {
            codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        }
        return codigo;
    }

    async crear(crearTarjetaDto: CrearTarjetaDto): Promise<{ tarjeta: Tarjeta, cvvSinEncriptar: string }> {
        const bancoValido = await this.bancoService.validarSwiftBanco(crearTarjetaDto.swiftBanco);
        if (!bancoValido) {
            throw new HttpException('El banco no está registrado', HttpStatus.BAD_REQUEST);
        }

        const tarjeta = this.repositorio.create(crearTarjetaDto);
        
        tarjeta.codTarjeta = this.generarCodigoTarjeta();
        tarjeta.numeroTarjeta = this.generarNumeroTarjetaUnico();
        const cvvSinEncriptar = this.generarCvv();
        
        tarjeta.fechaEmision = new Date();
        const fechaCaducidad = new Date();
        fechaCaducidad.setFullYear(fechaCaducidad.getFullYear() + 4);
        tarjeta.fechaCaducidad = fechaCaducidad;
        
        tarjeta.estado = 'ACT';
        
        tarjeta.cvv = await this.encryptionService.hashCvv(cvvSinEncriptar);
        
        const tarjetaGuardada = await this.repositorio.save(tarjeta);
        
        return {
            tarjeta: tarjetaGuardada,
            cvvSinEncriptar
        };
    }

    async actualizar(actualizarTarjetaDto: ActualizarTarjetaDto): Promise<Tarjeta> {
        const tarjeta = await this.buscarPorNumeroTarjeta(actualizarTarjetaDto.numeroTarjeta);
        
        if (actualizarTarjetaDto.estado) {
            tarjeta.estado = actualizarTarjetaDto.estado;
        }
        
        if (actualizarTarjetaDto.nombreCliente) {
            tarjeta.nombreCliente = actualizarTarjetaDto.nombreCliente;
        }
        
        if (actualizarTarjetaDto.correoCliente) {
            tarjeta.correoCliente = actualizarTarjetaDto.correoCliente;
        }
        
        return await this.repositorio.save(tarjeta);
    }

    async eliminar(codTarjeta: string): Promise<void> {
        const tarjeta = await this.buscarPorId(codTarjeta);
        await this.repositorio.remove(tarjeta);
    }

    async validarTarjeta(validarTarjetaDto: ValidarTarjetaDto): Promise<{ esValida: boolean, mensaje: string }> {
        const tarjeta = await this.buscarPorNumeroTarjeta(validarTarjetaDto.numeroTarjeta);
        
        if (tarjeta.estado !== 'ACT') {
            return { 
                esValida: false, 
                mensaje: 'Datos de la tarjeta incorrectos' 
            };
        }

        const fechaCaducidadIngresada = new Date(validarTarjetaDto.fechaCaducidad);
        const fechaCaducidadTarjeta = new Date(tarjeta.fechaCaducidad);
        
        if (fechaCaducidadIngresada.getTime() !== fechaCaducidadTarjeta.getTime()) {
            return { 
                esValida: false, 
                mensaje: 'Datos de la tarjeta incorrectos' 
            };
        }

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