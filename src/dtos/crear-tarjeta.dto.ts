import { IsNotEmpty, IsString, Length, IsEmail } from 'class-validator';

export class CrearTarjetaDto {
    @IsNotEmpty({ message: 'El SWIFT del banco es requerido' })
    @IsString()
    @Length(8, 11, { message: 'El SWIFT debe tener entre 8 y 11 caracteres' })
    swiftBanco: string;

    @IsNotEmpty({ message: 'El tipo de documento es requerido' })
    @IsString()
    @Length(2, 3, { message: 'El tipo de documento debe tener entre 2 y 3 caracteres' })
    tipoDocumentoCliente: string;

    @IsNotEmpty({ message: 'El número de documento es requerido' })
    @IsString()
    @Length(1, 15, { message: 'El número de documento no debe exceder 15 caracteres' })
    numeroDocumentoCliente: string;

    @IsNotEmpty({ message: 'El nombre del cliente es requerido' })
    @IsString()
    @Length(1, 100, { message: 'El nombre no debe exceder 100 caracteres' })
    nombreCliente: string;

    @IsNotEmpty({ message: 'El país del cliente es requerido' })
    @IsString()
    @Length(2, 2, { message: 'El código de país debe tener 2 caracteres' })
    paisCliente: string;

    @IsNotEmpty({ message: 'El correo del cliente es requerido' })
    @IsEmail({}, { message: 'El formato del correo no es válido' })
    @Length(1, 100, { message: 'El correo no debe exceder 100 caracteres' })
    correoCliente: string;

    @IsNotEmpty({ message: 'El ID del cliente en el banco es requerido' })
    @IsString()
    @Length(1, 40, { message: 'El ID del cliente no debe exceder 40 caracteres' })
    idClienteBanco: string;
} 