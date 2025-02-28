import { Controller, Get, Post, Put, Delete, Body, Param, HttpStatus, HttpException } from '@nestjs/common';
import { TarjetaService } from '../services/tarjeta.service';
import { CrearTarjetaDto } from '../dtos/crear-tarjeta.dto';
import { ValidarTarjetaDto } from '../dtos/validar-tarjeta.dto';
import { ActualizarTarjetaDto } from '../dtos/actualizar-tarjeta.dto';
import { Tarjeta } from '../entities/tarjeta.entity';
import { Logger } from '@nestjs/common';

@Controller('api/v1/tarjetas')
export class TarjetaController {
    private readonly logger = new Logger(TarjetaController.name);

    constructor(
        private readonly servicio: TarjetaService
    ) {}

    @Get()
    async obtenerTodos(): Promise<Tarjeta[]> {
        try {
            const tarjetas = await this.servicio.buscarTodos();
            this.logger.log(`Se encontraron ${tarjetas.length} tarjetas`);
            return tarjetas;
        } catch (error) {
            this.logger.error('Error al obtener todas las tarjetas', error);
            throw new HttpException('Error al obtener las tarjetas', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get(':codTarjeta')
    async obtenerPorId(@Param('codTarjeta') codTarjeta: string): Promise<Tarjeta> {
        try {
            const tarjeta = await this.servicio.buscarPorId(codTarjeta);
            this.logger.log(`Se encontró la tarjeta con código: ${codTarjeta}`);
            return tarjeta;
        } catch (error) {
            this.logger.error(`No se encontró la tarjeta con código: ${codTarjeta}`);
            throw new HttpException('Tarjeta no encontrada', HttpStatus.NOT_FOUND);
        }
    }

    @Get('numero/:numeroTarjeta')
    async obtenerPorNumero(@Param('numeroTarjeta') numeroTarjeta: string): Promise<Tarjeta> {
        try {
            const tarjeta = await this.servicio.buscarPorNumeroTarjeta(numeroTarjeta);
            this.logger.log(`Se encontró la tarjeta con número: ${numeroTarjeta}`);
            return tarjeta;
        } catch (error) {
            this.logger.error(`No se encontró la tarjeta con número: ${numeroTarjeta}`);
            throw new HttpException('Tarjeta no encontrada', HttpStatus.NOT_FOUND);
        }
    }

    @Get('numero/:numeroTarjeta/swift')
    async obtenerSwiftBanco(@Param('numeroTarjeta') numeroTarjeta: string): Promise<{ swiftBanco: string }> {
        try {
            const resultado = await this.servicio.obtenerSwiftBancoPorNumeroTarjeta(numeroTarjeta);
            this.logger.log(`Se encontró el SWIFT del banco para la tarjeta: ${numeroTarjeta}`);
            return resultado;
        } catch (error) {
            this.logger.error(`Error al obtener el SWIFT del banco para la tarjeta: ${numeroTarjeta}`);
            throw new HttpException('Tarjeta no encontrada', HttpStatus.NOT_FOUND);
        }
    }

    @Post()
    async crear(@Body() dto: CrearTarjetaDto): Promise<{ tarjeta: Tarjeta, cvvSinEncriptar: string }> {
        try {
            const resultado = await this.servicio.crear(dto);
            this.logger.log(`Se creó la tarjeta con código: ${resultado.tarjeta.codTarjeta}`);
            return resultado;
        } catch (error) {
            this.logger.error('Error al crear la tarjeta', error);
            throw new HttpException('Error al crear la tarjeta', HttpStatus.BAD_REQUEST);
        }
    }

    @Put('numero/:numeroTarjeta')
    async actualizar(
        @Param('numeroTarjeta') numeroTarjeta: string,
        @Body() actualizarDto: Partial<ActualizarTarjetaDto>
    ): Promise<Tarjeta> {
        try {
            const tarjeta = await this.servicio.actualizar({ 
                numeroTarjeta,
                ...actualizarDto
            });
            this.logger.log(`Se actualizó la tarjeta ${numeroTarjeta}`);
            return tarjeta;
        } catch (error) {
            this.logger.error(`Error al actualizar la tarjeta: ${error.message}`);
            if (error.name === 'NotFoundException') {
                throw new HttpException('Tarjeta no encontrada', HttpStatus.NOT_FOUND);
            }
            throw new HttpException(
                `Error al actualizar la tarjeta: ${error.message}`, 
                HttpStatus.BAD_REQUEST
            );
        }
    }

    @Delete(':codTarjeta')
    async eliminar(@Param('codTarjeta') codTarjeta: string): Promise<void> {
        try {
            await this.servicio.eliminar(codTarjeta);
            this.logger.log(`Se eliminó la tarjeta con código: ${codTarjeta}`);
        } catch (error) {
            this.logger.error(`No se encontró la tarjeta con código: ${codTarjeta}`);
            throw new HttpException('Tarjeta no encontrada', HttpStatus.NOT_FOUND);
        }
    }

    @Post('validar')
    async validarTarjeta(@Body() dto: ValidarTarjetaDto): Promise<{ esValida: boolean, mensaje: string }> {
        try {
            const resultado = await this.servicio.validarTarjeta(dto);
            this.logger.log(`Validación de tarjeta ${dto.numeroTarjeta}: ${resultado.mensaje}`);
            return resultado;
        } catch (error) {
            this.logger.error(`Error al validar la tarjeta: ${error.message}`);
            if (error.name === 'NotFoundException') {
                throw new HttpException('Tarjeta no encontrada', HttpStatus.NOT_FOUND);
            }
            throw new HttpException(
                'Error al validar la tarjeta', 
                HttpStatus.BAD_REQUEST
            );
        }
    }
} 