import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundException extends HttpException {
    private readonly data: string;
    private readonly entity: string;

    constructor(data: string, entity: string) {
        const message = `No se ha encontrado ninguna coincidencia para: ${entity}, con el dato: ${data}`;
        super(message, HttpStatus.NOT_FOUND);
        this.data = data;
        this.entity = entity;
    }

    getData(): string {
        return this.data;
    }

    getEntity(): string {
        return this.entity;
    }
} 