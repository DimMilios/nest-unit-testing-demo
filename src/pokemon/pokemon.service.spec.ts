import { Test, TestingModule } from '@nestjs/testing';
import { PokemonService } from './pokemon.service';
import { HttpService } from '@nestjs/axios';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('PokemonService', () => {
  let pokemonService: PokemonService;
  let httpService: DeepMocked<HttpService>;

  beforeEach(async () => {
    /*
    Use useMocker combined with createMock to avoid specifying providers manually

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PokemonService,
        {
          provide: HttpService,
          useValue: createMock<HttpService>(),
        },
        {
          provide: LogService,
          useValue: createMock<LogService>(),
        },
        ...
      ],
    }).compile();
    */

    const module: TestingModule = await Test.createTestingModule({
      providers: [PokemonService],
    })
      .useMocker(createMock)
      .compile();

    pokemonService = module.get<PokemonService>(PokemonService);
    httpService = module.get(HttpService);
  });

  it('should be defined', () => {
    expect(pokemonService).toBeDefined();
  });

  describe('getPokemon', () => {
    it('should get pokemon with id 1', async () => {
      httpService.axiosRef.mockResolvedValueOnce({
        data: {
          species: { name: 'bulbasaur' },
        },
        headers: {},
        config: { url: '' },
        status: 200,
        statusText: '',
      });
      const bulbasaurId = 1;

      const pokemon = pokemonService.getPokemon(bulbasaurId);

      expect(pokemon).resolves.toBe('bulbasaur');
    });

    it('should throw error if Pokemon API response changes', async () => {
      httpService.axiosRef.mockResolvedValueOnce({
        data: 'Unexpected data',
        headers: {},
        config: { url: '' },
        status: 200,
        statusText: '',
      });

      const pokemon = pokemonService.getPokemon(1);

      expect(pokemon).rejects.toBeInstanceOf(InternalServerErrorException);
    });

    it('should throw error if id less than 1', async () => {
      const pokemon = pokemonService.getPokemon(0);

      expect(pokemon).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should throw error if id greater than 151', async () => {
      const pokemon = pokemonService.getPokemon(152);

      expect(pokemon).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  /*
  // Solution without mocking. Test the API we're interacting with directly.
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [PokemonService],
    }).compile();

    service = module.get<PokemonService>(PokemonService);
  });

  describe('getPokemon', () => {
    it('should get pokemon with id 1', async () => {
      const bulbasaurId = 1;

      const pokemon = service.getPokemon(bulbasaurId);

      expect(pokemon).resolves.toBe('bulbasaur');
    });

    it('should throw error if id less than 1', async () => {
      const pokemon = service.getPokemon(0);

      expect(pokemon).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should throw error if id greater than 151', async () => {
      const pokemon = service.getPokemon(152);

      expect(pokemon).rejects.toBeInstanceOf(BadRequestException);
    });
  });
  */
});
