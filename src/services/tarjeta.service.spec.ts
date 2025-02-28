import { Test, TestingModule } from '@nestjs/testing';
import { TarjetaService } from './tarjeta.service';
import { TarjetaRepository } from '../repositories/tarjeta.repository';
import { EncryptionService } from './encryption.service';
import { BancoService } from './banco.service';
import { Tarjeta } from '../entities/tarjeta.entity';

describe('TarjetaService', () => {
    let service: TarjetaService;
    let repository: TarjetaRepository;
    let encryptionService: EncryptionService;

    // Mock de una tarjeta para pruebas
    const mockTarjeta: Tarjeta = {
        codTarjeta: 'ABC123XYZ9',
        numeroTarjeta: '5135123456789012',
        swiftBanco: 'PICHECU0001',
        tipoDocumentoCliente: 'DNI',
        numeroDocumentoCliente: '12345678',
        nombreCliente: 'Juan Pérez',
        paisCliente: 'EC',
        correoCliente: 'juan@ejemplo.com',
        idClienteBanco: 'CLIENT123',
        fechaEmision: new Date(),
        fechaCaducidad: new Date('2028-02-24'),
        cvv: 'hashedCvv123',
        estado: 'ACT'
    };

    // Mock de los servicios
    const mockRepository = {
        findByNumeroTarjeta: jest.fn(),
    };

    const mockEncryptionService = {
        compareCvv: jest.fn(),
    };

    const mockBancoService = {
        validarSwiftBanco: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TarjetaService,
                {
                    provide: TarjetaRepository,
                    useValue: mockRepository,
                },
                {
                    provide: EncryptionService,
                    useValue: mockEncryptionService,
                },
                {
                    provide: BancoService,
                    useValue: mockBancoService,
                },
            ],
        }).compile();

        service = module.get<TarjetaService>(TarjetaService);
        repository = module.get<TarjetaRepository>(TarjetaRepository);
        encryptionService = module.get<EncryptionService>(EncryptionService);
    });

    describe('validarTarjeta', () => {
        it('debería validar una tarjeta correctamente cuando todos los datos son válidos', async () => {
            // Arrange
            const validarTarjetaDto = {
                numeroTarjeta: '5135123456789012',
                cvv: '123',
                fechaCaducidad: '2028-02-24',
            };

            mockRepository.findByNumeroTarjeta.mockResolvedValue(mockTarjeta);
            mockEncryptionService.compareCvv.mockResolvedValue(true);

            // Act
            const resultado = await service.validarTarjeta(validarTarjetaDto);

            // Assert
            expect(resultado).toEqual({
                esValida: true,
                mensaje: 'La tarjeta es válida'
            });
            expect(mockRepository.findByNumeroTarjeta).toHaveBeenCalledWith('5135123456789012');
            expect(mockEncryptionService.compareCvv).toHaveBeenCalledWith('123', 'hashedCvv123');
        });

        it('debería retornar inválido cuando la tarjeta está inactiva', async () => {
            // Arrange
            const tarjetaInactiva = { ...mockTarjeta, estado: 'INA' };
            const validarTarjetaDto = {
                numeroTarjeta: '5135123456789012',
                cvv: '123',
                fechaCaducidad: '2028-02-24',
            };

            mockRepository.findByNumeroTarjeta.mockResolvedValue(tarjetaInactiva);

            // Act
            const resultado = await service.validarTarjeta(validarTarjetaDto);

            // Assert
            expect(resultado).toEqual({
                esValida: false,
                mensaje: 'Datos de la tarjeta incorrectos'
            });
        });

        it('debería retornar inválido cuando el CVV no coincide', async () => {
            // Arrange
            const validarTarjetaDto = {
                numeroTarjeta: '5135123456789012',
                cvv: '123',
                fechaCaducidad: '2028-02-24',
            };

            mockRepository.findByNumeroTarjeta.mockResolvedValue(mockTarjeta);
            mockEncryptionService.compareCvv.mockResolvedValue(false);

            // Act
            const resultado = await service.validarTarjeta(validarTarjetaDto);

            // Assert
            expect(resultado).toEqual({
                esValida: false,
                mensaje: 'Datos de la tarjeta incorrectos'
            });
        });

        it('debería retornar inválido cuando la fecha de caducidad no coincide', async () => {
            // Arrange
            const validarTarjetaDto = {
                numeroTarjeta: '5135123456789012',
                cvv: '123',
                fechaCaducidad: '2029-02-24',
            };

            mockRepository.findByNumeroTarjeta.mockResolvedValue(mockTarjeta);

            // Act
            const resultado = await service.validarTarjeta(validarTarjetaDto);

            // Assert
            expect(resultado).toEqual({
                esValida: false,
                mensaje: 'Datos de la tarjeta incorrectos'
            });
        });
    });
}); 