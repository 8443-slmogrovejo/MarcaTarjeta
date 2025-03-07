import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EncryptionService {
    private readonly saltRounds = 10;

    async hashCvv(cvv: string): Promise<string> {
        try {
            return await bcrypt.hash(cvv, this.saltRounds);
        } catch (error) {
            console.error('Error al encriptar CVV:', error);
            throw new Error('Error al procesar el CVV');
        }
    }

    async compareCvv(cvvPlano: string, cvvEncriptado: string): Promise<boolean> {
        try {
            return await bcrypt.compare(cvvPlano, cvvEncriptado);
        } catch (error) {
            console.error('Error al comparar CVV:', error);
            return false;
        }
    }
} 