import { Test, TestingModule } from '@nestjs/testing';
import { ParkingController } from './parking.controller';
import { ParkingService } from '../services/parking.service';

describe('ParkingController', () => {
  let controller: ParkingController;
  let service: ParkingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParkingController],
      providers: [ParkingService],
    }).compile();

    controller = module.get<ParkingController>(ParkingController);
    service = module.get<ParkingService>(ParkingService);
  });

  describe('initialize', () => {
    it('should initialize parking lot', () => {
      const result = controller.initialize({ size: 3 });
      expect(result.message).toBe('Parking lot initialized successfully');
    });
  });

  describe('expand', () => {
    it('should expand parking lot', () => {
      controller.initialize({ size: 2 });
      const result = controller.expand(3);
      expect(result.message).toBe('Parking lot expanded successfully');
    });
  });

  describe('parkCar', () => {
    beforeEach(() => {
      controller.initialize({ size: 3 });
    });

    it('should park a car and return slot details', () => {
      const car = { registrationNumber: 'ABC123', color: 'Red' };
      const result = controller.parkCar(car);
      
      expect(result).toEqual({
        slotNumber: 1,
        registrationNumber: car.registrationNumber,
        color: car.color.toLowerCase()
      });
    });
  });

  describe('removeCar', () => {
    beforeEach(() => {
      controller.initialize({ size: 3 });
    });

    it('should remove a car from slot', () => {
      const car = { registrationNumber: 'ABC123', color: 'Red' };
      const parkedCar = controller.parkCar(car);
      
      const result = controller.removeCar(parkedCar.slotNumber);
      expect(result.message).toBe('Car removed successfully');
    });
  });

  describe('getOccupiedSlots', () => {
    beforeEach(() => {
      controller.initialize({ size: 3 });
    });

    it('should return all occupied slots', () => {
      const car1 = { registrationNumber: 'ABC123', color: 'Red' };
      const car2 = { registrationNumber: 'DEF456', color: 'Blue' };
      
      controller.parkCar(car1);
      controller.parkCar(car2);
      
      const result = controller.getOccupiedSlots();
      expect(result.totalOccupied).toBe(2);
      expect(result.slots).toHaveLength(2);
      expect(result.slots[0].registrationNumber).toBe(car1.registrationNumber);
      expect(result.slots[1].registrationNumber).toBe(car2.registrationNumber);
    });

    it('should return empty list when no slots are occupied', () => {
      const result = controller.getOccupiedSlots();
      expect(result.totalOccupied).toBe(0);
      expect(result.slots).toHaveLength(0);
    });
  });

  describe('getSlotByRegistration', () => {
    beforeEach(() => {
      controller.initialize({ size: 3 });
    });

    it('should return slot details for given registration number', () => {
      const car = { registrationNumber: 'ABC123', color: 'Red' };
      controller.parkCar(car);
      
      const result = controller.getSlotByRegistration(car.registrationNumber);
      expect(result.registrationNumber).toBe(car.registrationNumber);
      expect(result.color).toBe(car.color.toLowerCase());
    });
  });

  describe('getSlotsByColor', () => {
    beforeEach(() => {
      controller.initialize({ size: 3 });
    });

    it('should return slots and registration numbers for given color', () => {
      const car1 = { registrationNumber: 'ABC123', color: 'Red' };
      const car2 = { registrationNumber: 'DEF456', color: 'Blue' };
      const car3 = { registrationNumber: 'GHI789', color: 'Red' };
      
      controller.parkCar(car1);
      controller.parkCar(car2);
      controller.parkCar(car3);
      
      const result = controller.getSlotsByColor('Red');
      expect(result.registrationNumbers).toContain(car1.registrationNumber);
      expect(result.registrationNumbers).toContain(car3.registrationNumber);
      expect(result.registrationNumbers).not.toContain(car2.registrationNumber);
      expect(result.slots).toHaveLength(2);
    });

    it('should return empty arrays when no cars found with given color', () => {
      const result = controller.getSlotsByColor('Yellow');
      expect(result.registrationNumbers).toHaveLength(0);
      expect(result.slots).toHaveLength(0);
    });
  });
}); 