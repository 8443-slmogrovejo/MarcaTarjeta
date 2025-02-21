import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'TARJETA' })
export class Tarjeta {
    @PrimaryColumn({ name: 'COD_TARJETA', length: 10 })
    codTarjeta: string;

    @Column({ name: 'SWIFT_BANCO', length: 11, nullable: false })
    swiftBanco: string;

    @Column({ name: 'TIPO_DOCUMENTO_CLIENTE', length: 3, nullable: false })
    tipoDocumentoCliente: string;

    @Column({ name: 'NUMERO_DOCUMENTO_CLIENTE', length: 15, nullable: false })
    numeroDocumentoCliente: string;

    @Column({ name: 'NOMBRE_CLIENTE', length: 100, nullable: false })
    nombreCliente: string;

    @Column({ name: 'PAIS_CLIENTE', length: 2, nullable: false })
    paisCliente: string;

    @Column({ name: 'CORREO_CLIENTE', length: 100, nullable: false })
    correoCliente: string;

    @Column({ name: 'ID_CLIENTE_BANCO', length: 40, nullable: false })
    idClienteBanco: string;

    @Column({ name: 'NUMERO_TARJETA', length: 16, nullable: false })
    numeroTarjeta: string;

    @Column({ name: 'FECHA_EMISION', type: 'timestamp', nullable: false })
    fechaEmision: Date;

    @Column({ name: 'FECHA_CADUCIDAD', type: 'date', nullable: false })
    fechaCaducidad: Date;

    @Column({ name: 'CVV', length: 100, nullable: false })
    cvv: string;

    @Column({ name: 'ESTADO', length: 3, nullable: false })
    estado: string;
} 