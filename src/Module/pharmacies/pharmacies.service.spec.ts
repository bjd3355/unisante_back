import { Test, TestingModule } from '@nestjs/testing';
import { PharmacyService } from './pharmacies.service';

describe('PharmaciesService', () => {
  let service: PharmacyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PharmacyService],
    }).compile();

    service = module.get<PharmacyService>(PharmacyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
