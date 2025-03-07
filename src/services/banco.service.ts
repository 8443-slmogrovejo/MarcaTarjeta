import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

interface BancoResponse {
    swiftBanco: string;
    nombre: string;
    pais: string;
    bin: string;
}

@Injectable()
export class BancoService {
    private readonly bancoServiceUrl: string;

    constructor(private configService: ConfigService) {
        this.bancoServiceUrl = this.configService.get<string>('BANCO_SERVICE_URL');
    }

    async validarSwiftBanco(swiftBanco: string): Promise<boolean> {
        try {
            console.log('swiftBanco', swiftBanco);
            console.log(`${this.bancoServiceUrl}api/v1/bancos/${swiftBanco}`);
            const response = await axios.get<BancoResponse>(`${this.bancoServiceUrl}api/v1/bancos/${swiftBanco}`);
            console.log('response', response);
            return response.data && response.data.swiftBanco === swiftBanco;
        } catch (error) {
            if (error.response?.status === 404) {
                return false;
            }
            throw new HttpException('Error al validar el banco', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
} 