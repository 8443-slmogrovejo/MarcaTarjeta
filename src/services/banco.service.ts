import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class BancoService {
    private readonly bancoServiceUrl: string;

    constructor(private configService: ConfigService) {
        this.bancoServiceUrl = this.configService.get<string>('BANCO_SERVICE_URL');
    }

    async validarSwiftBanco(swiftBanco: string): Promise<boolean> {
        try {
            const response = await axios.get(`${this.bancoServiceUrl}/api/v1/banco/${swiftBanco}`);
            return response.data === true;
        } catch (error) {
            if (error.response?.status === 404) {
                return false;
            }
            throw new HttpException('Error al validar el banco', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
} 