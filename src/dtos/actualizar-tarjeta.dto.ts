import { IsNotEmpty, IsString, Length, IsEmail, IsOptional } from 'class-validator';

export class ActualizarTarjetaDto {
    @IsNotEmpty({ message: 'El número de tarjeta es requerido' })
    @IsString()
    @Length(16, 16, { message: 'El número de tarjeta debe tener 16 dígitos' })
    numeroTarjeta: string;

    @IsOptional()
    @IsString()
    @Length(3, 3, { message: 'El estado debe tener 3 caracteres' })
    estado?: string;

    @IsOptional()
    @IsString()
    @Length(1, 100, { message: 'El nombre no debe exceder 100 caracteres' })
    nombreCliente?: string;

    @IsOptional()
    @IsEmail({}, { message: 'El formato del correo no es válido' })
    @Length(1, 100, { message: 'El correo no debe exceder 100 caracteres' })
    correoCliente?: string;
} 