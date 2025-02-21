import { Controller, Get, Post, Put, Delete, Body, Param, HttpStatus, HttpException } from '@nestjs/common';
import { TarjetaService } from '../services/tarjeta.service';
import { CrearTarjetaDto } from '../dtos/crear-tarjeta.dto';
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

    @Post()
    async crear(@Body() dto: CrearTarjetaDto): Promise<Tarjeta> {
        try {
            const tarjeta = await this.servicio.crear(dto);
            this.logger.log(`Se creó la tarjeta con código: ${tarjeta.codTarjeta}`);
            return tarjeta;
        } catch (error) {
            this.logger.error('Error al crear la tarjeta', error);
            throw new HttpException('Error al crear la tarjeta', HttpStatus.BAD_REQUEST);
        }
    }

    @Put(':codTarjeta')
    async actualizar(
        @Param('codTarjeta') codTarjeta: string,
        @Body() estado: string
    ): Promise<Tarjeta> {
        try {
            const tarjeta = await this.servicio.actualizar({ codTarjeta, estado });
            this.logger.log(`Se actualizó el estado de la tarjeta ${codTarjeta}`);
            return tarjeta;
        } catch (error) {
            if (error.name === 'NotFoundException') {
                this.logger.error(`No se encontró la tarjeta con código: ${codTarjeta}`);
                throw new HttpException('Tarjeta no encontrada', HttpStatus.NOT_FOUND);
            }
            this.logger.error('Error al actualizar la tarjeta', error);
            throw new HttpException('Error al actualizar la tarjeta', HttpStatus.BAD_REQUEST);
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
} 