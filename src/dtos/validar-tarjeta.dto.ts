import { IsNotEmpty, IsString, Length, IsDateString } from 'class-validator';

export class ValidarTarjetaDto {
    @IsNotEmpty({ message: 'El número de tarjeta es requerido' })
    @IsString()
    @Length(16, 16, { message: 'El número de tarjeta debe tener 16 dígitos' })
    numeroTarjeta: string;

    @IsNotEmpty({ message: 'El CVV es requerido' })
    @IsString()
    @Length(3, 4, { message: 'El CVV debe tener entre 3 y 4 dígitos' })
    cvv: string;

    @IsNotEmpty({ message: 'La fecha de caducidad es requerida' })
    @IsDateString({}, { message: 'La fecha de caducidad debe ser una fecha válida' })
    fechaCaducidad: string;
} 