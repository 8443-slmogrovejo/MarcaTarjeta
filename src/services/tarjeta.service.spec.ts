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

    // Mock actualizado con todos los métodos necesarios
    const mockRepository = {
        findByNumeroTarjeta: jest.fn(),
        save: jest.fn(),
        create: jest.fn(),
        findOne: jest.fn(),
        delete: jest.fn(),
        find: jest.fn(),
        remove: jest.fn()
    };

    const mockEncryptionService = {
        compareCvv: jest.fn(),
        hashCvv: jest.fn().mockResolvedValue('hashedCvv123'),
        generateCvv: jest.fn().mockReturnValue('123')
    };

    const mockBancoService = {
        validarSwiftBanco: jest.fn()
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

        // Resetear todos los mocks antes de cada prueba
        jest.clearAllMocks();
    });

    describe('validarTarjeta', () => {
        it('debería validar una tarjeta correctamente cuando todos los datos son válidos', async () => {
            const validarTarjetaDto = {
                numeroTarjeta: '5135123456789012',
                cvv: '123',
                fechaCaducidad: '02/28',
            };

            mockRepository.findByNumeroTarjeta.mockResolvedValue({
                ...mockTarjeta,
                fechaCaducidad: new Date('2028-02-24')
            });
            mockEncryptionService.compareCvv.mockResolvedValue(true);

            const resultado = await service.validarTarjeta(validarTarjetaDto);

            expect(resultado).toEqual({
                esValida: true,
                mensaje: 'La tarjeta es válida'
            });
        });

        it('debería retornar inválido cuando la tarjeta está inactiva', async () => {
            const tarjetaInactiva = { ...mockTarjeta, estado: 'INA' };
            const validarTarjetaDto = {
                numeroTarjeta: '5135123456789012',
                cvv: '123',
                fechaCaducidad: '02/28',
            };

            mockRepository.findByNumeroTarjeta.mockResolvedValue(tarjetaInactiva);

            const resultado = await service.validarTarjeta(validarTarjetaDto);

            expect(resultado).toEqual({
                esValida: false,
                mensaje: 'Datos de la tarjeta incorrectos'
            });
        });

        it('debería retornar inválido cuando el CVV no coincide', async () => {
            const validarTarjetaDto = {
                numeroTarjeta: '5135123456789012',
                cvv: '123',
                fechaCaducidad: '02/28',
            };

            mockRepository.findByNumeroTarjeta.mockResolvedValue({
                ...mockTarjeta,
                fechaCaducidad: new Date('2028-02-24')
            });
            mockEncryptionService.compareCvv.mockResolvedValue(false);

            const resultado = await service.validarTarjeta(validarTarjetaDto);

            expect(resultado).toEqual({
                esValida: false,
                mensaje: 'Datos de la tarjeta incorrectos'
            });
        });

        it('debería retornar inválido cuando la fecha de caducidad no coincide', async () => {
            const validarTarjetaDto = {
                numeroTarjeta: '5135123456789012',
                cvv: '123',
                fechaCaducidad: '03/28',
            };

            mockRepository.findByNumeroTarjeta.mockResolvedValue({
                ...mockTarjeta,
                fechaCaducidad: new Date('2028-02-24')
            });

            const resultado = await service.validarTarjeta(validarTarjetaDto);

            expect(resultado).toEqual({
                esValida: false,
                mensaje: 'Datos de la tarjeta incorrectos'
            });
        });

        it('debería retornar inválido cuando el año de caducidad no coincide', async () => {
            const validarTarjetaDto = {
                numeroTarjeta: '5135123456789012',
                cvv: '123',
                fechaCaducidad: '02/29',
            };

            mockRepository.findByNumeroTarjeta.mockResolvedValue({
                ...mockTarjeta,
                fechaCaducidad: new Date('2028-02-24')
            });

            const resultado = await service.validarTarjeta(validarTarjetaDto);

            expect(resultado).toEqual({
                esValida: false,
                mensaje: 'Datos de la tarjeta incorrectos'
            });
        });
    });

    describe('crear', () => {
        it('debería crear una nueva tarjeta correctamente', async () => {
            const crearTarjetaDto = {
                swiftBanco: 'PICHECU0001',
                tipoDocumentoCliente: 'DNI',
                numeroDocumentoCliente: '12345678',
                nombreCliente: 'Juan Pérez',
                paisCliente: 'EC',
                correoCliente: 'juan@ejemplo.com',
                idClienteBanco: 'CLIENT123'
            };

            mockRepository.create.mockReturnValue({...mockTarjeta});
            mockRepository.save.mockResolvedValue(mockTarjeta);
            mockBancoService.validarSwiftBanco.mockResolvedValue(true);

            const resultado = await service.crear(crearTarjetaDto);

            expect(resultado.tarjeta).toBeDefined();
            expect(resultado.cvvSinEncriptar).toBeDefined();
            expect(mockRepository.create).toHaveBeenCalled();
            expect(mockRepository.save).toHaveBeenCalled();
        });
    });

    describe('buscarPorId', () => {
        it('debería encontrar una tarjeta por su código', async () => {
            mockRepository.findOne.mockResolvedValue(mockTarjeta);

            const resultado = await service.buscarPorId('ABC123XYZ9');

            expect(resultado).toEqual(mockTarjeta);
            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: { codTarjeta: 'ABC123XYZ9' }
            });
        });

        it('debería lanzar error si la tarjeta no existe', async () => {
            mockRepository.findOne.mockResolvedValue(null);

            await expect(service.buscarPorId('NOEXISTE')).rejects.toThrow();
        });
    });

    describe('actualizar', () => {
        it('debería actualizar una tarjeta existente', async () => {
            const actualizarDto = {
                numeroTarjeta: '5135123456789012',
                estado: 'INA'
            };

            mockRepository.findByNumeroTarjeta.mockResolvedValue(mockTarjeta);
            mockRepository.save.mockResolvedValue({
                ...mockTarjeta,
                estado: 'INA'
            });

            const resultado = await service.actualizar(actualizarDto);

            expect(resultado.estado).toBe('INA');
            expect(mockRepository.save).toHaveBeenCalled();
        });
    });

    describe('eliminar', () => {
        it('debería eliminar una tarjeta existente', async () => {
            mockRepository.findOne.mockResolvedValue(mockTarjeta);
            mockRepository.remove.mockResolvedValue(mockTarjeta);

            await service.eliminar('ABC123XYZ9');

            expect(mockRepository.remove).toHaveBeenCalledWith(mockTarjeta);
        });

        it('debería lanzar error al intentar eliminar una tarjeta inexistente', async () => {
            mockRepository.findOne.mockResolvedValue(null);

            await expect(service.eliminar('NOEXISTE')).rejects.toThrow();
        });
    });
}); 