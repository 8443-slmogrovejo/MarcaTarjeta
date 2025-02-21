import { IsNotEmpty, IsString, Length, IsEmail, Matches } from 'class-validator';

export class CrearTarjetaDto {
    codTarjeta?: string;

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

    @IsNotEmpty({ message: 'El número de tarjeta es requerido' })
    @Matches(/^[0-9]{16}$/, { message: 'El número de tarjeta debe tener 16 dígitos numéricos' })
    numeroTarjeta: string;

    fechaEmision?: Date;
    
    fechaCaducidad?: Date;

    @IsNotEmpty({ message: 'El CVV es requerido' })
    @IsString()
    @Length(1, 100, { message: 'El CVV no debe exceder 100 caracteres' })
    cvv: string;

    @IsNotEmpty({ message: 'El estado es requerido' })
    @Matches(/^(ACT|INA|BLO|SUS)$/, { message: 'El estado debe ser ACT, INA, BLO o SUS' })
    @Length(1, 3, { message: 'El estado no debe exceder 3 caracteres' })
    estado: string;
} 