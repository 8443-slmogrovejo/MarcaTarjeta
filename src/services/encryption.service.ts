import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EncryptionService {
    private readonly SALT_ROUNDS = 10;

    async hashCvv(cvv: string): Promise<string> {
        return await bcrypt.hash(cvv, this.SALT_ROUNDS);
    }

    async compareCvv(cvv: string, hashedCvv: string): Promise<boolean> {
        return await bcrypt.compare(cvv, hashedCvv);
    }
} 