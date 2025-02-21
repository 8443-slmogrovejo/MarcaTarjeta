import { IsNotEmpty, IsString, Length } from 'class-validator';

export class ActualizarTarjetaDto {
    @IsNotEmpty({ message: 'El código de tarjeta es requerido' })
    @IsString()
    @Length(1, 10)
    codTarjeta: string;

    @IsNotEmpty({ message: 'El estado es requerido' })
    @IsString()
    @Length(1, 3)
    estado: string;
} 