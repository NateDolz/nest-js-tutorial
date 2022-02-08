import { NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { COFFEE_BRANDS } from './coffees.constants';
import { CoffeesService } from './coffees.service';
import coffeesConfig from './config/coffees.config';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';

describe('CoffeesService', () => {
  let service: CoffeesService;
  let coffeeRepository: MockRepository;

  type MockRepository<T = any> = Partial<
    Record<keyof Repository<T>, jest.Mock>
  >;
  const createMockRepository = <T = any>(): MockRepository<T> => ({
    findOne: jest.fn(),
    create: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoffeesService,
        { provide: Connection, useValue: {} },
        {
          provide: getRepositoryToken(Flavor),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(Coffee),
          useValue: createMockRepository(),
        },
        { provide: COFFEE_BRANDS, useValue: ['starbucks'] },
        { provide: coffeesConfig.KEY, useValue: { foo: 'bar' } },
        { provide: ConfigService, useValue: { get: () => '' } },
      ],
    }).compile();

    service = module.get<CoffeesService>(CoffeesService);
    coffeeRepository = module.get<MockRepository>(getRepositoryToken(Coffee));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    describe('when coffee with ID exists', () => {
      it('should return the coffee object', async () => {
        coffeeRepository.findOne.mockReturnValue({ id: 1, name: 'test' });

        const coffee = await service.findOne(1);
        expect(coffee.id).toBe(1);
        expect(coffee.name).toBe('test');
      });
    });

    describe('otherwise', () => {
      it('should throw the "NotFoundException"', async (done) => {
        coffeeRepository.findOne.mockReturnValue(undefined);

        try {
          await service.findOne(1);
          done();
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(`Coffee 1 not found`);
        }
      });
    });
  });
});
