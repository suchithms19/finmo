import { Test, TestingModule } from '@nestjs/testing';
import { ParkingService } from './parking.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ParkingService', () => {
  let service: ParkingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParkingService],
    }).compile();

    service = module.get<ParkingService>(ParkingService);
  });

  describe('initialize', () => {
    it('should initialize parking lot with given size', () => {
      service.initialize(3);
      const occupiedSlots = service.getOccupiedSlots();
      expect(occupiedSlots).toHaveLength(0);
    });

    it('should throw error when initializing already initialized parking lot', () => {
      service.initialize(3);
      expect(() => service.initialize(5)).toThrow(BadRequestException);
    });
  });

  describe('expand', () => {
    it('should throw error when expanding uninitialized parking lot', () => {
      expect(() => service.expand(2)).toThrow(BadRequestException);
    });

    it('should expand parking lot with additional slots', () => {
      service.initialize(2);
      service.expand(3);
      
      // Park cars to test expanded capacity
      service.parkCar({ registrationNumber: 'ABC123', color: 'Red' });
      service.parkCar({ registrationNumber: 'DEF456', color: 'Blue' });
      service.parkCar({ registrationNumber: 'GHI789', color: 'Green' });
      service.parkCar({ registrationNumber: 'JKL012', color: 'Red' });
      service.parkCar({ registrationNumber: 'MNO345', color: 'Blue' });

      const occupiedSlots = service.getOccupiedSlots();
      expect(occupiedSlots).toHaveLength(5);
    });
  });

  describe('parkCar', () => {
    beforeEach(() => {
      service.initialize(3);
    });

    it('should park a car in the nearest available slot', () => {
      const car = { registrationNumber: 'ABC123', color: 'Red' };
      const slot = service.parkCar(car);
      expect(slot.slotNumber).toBe(1);
      expect(slot.car).toEqual({ ...car, color: car.color.toLowerCase() });
    });

    it('should throw error when parking lot is full', () => {
      service.parkCar({ registrationNumber: 'ABC123', color: 'Red' });
      service.parkCar({ registrationNumber: 'DEF456', color: 'Blue' });
      service.parkCar({ registrationNumber: 'GHI789', color: 'Green' });

      expect(() => 
        service.parkCar({ registrationNumber: 'JKL012', color: 'Yellow' })
      ).toThrow(BadRequestException);
    });

    it('should throw error when car is already parked', () => {
      const car = { registrationNumber: 'ABC123', color: 'Red' };
      service.parkCar(car);
      expect(() => service.parkCar(car)).toThrow(BadRequestException);
    });
  });

  describe('removeCarFromSlot', () => {
    beforeEach(() => {
      service.initialize(3);
    });

    it('should remove car from slot', () => {
      const car = { registrationNumber: 'ABC123', color: 'Red' };
      const slot = service.parkCar(car);
      service.removeCarFromSlot(slot.slotNumber);
      expect(service.getOccupiedSlots()).toHaveLength(0);
    });

    it('should throw error when removing car from empty slot', () => {
      expect(() => service.removeCarFromSlot(1)).toThrow(BadRequestException);
    });

    it('should throw error when slot number does not exist', () => {
      expect(() => service.removeCarFromSlot(10)).toThrow(NotFoundException);
    });
  });

  describe('getSlotByRegistration', () => {
    beforeEach(() => {
      service.initialize(3);
    });

    it('should return slot for given registration number', () => {
      const car = { registrationNumber: 'ABC123', color: 'Red' };
      service.parkCar(car);
      const slot = service.getSlotByRegistration(car.registrationNumber);
      expect(slot.car?.registrationNumber).toBe(car.registrationNumber);
    });

    it('should throw error when car not found', () => {
      expect(() => service.getSlotByRegistration('NOTFOUND')).toThrow(NotFoundException);
    });
  });

  describe('getSlotsByColor', () => {
    beforeEach(() => {
      service.initialize(3);
    });

    it('should return slots with cars of given color', () => {
      service.parkCar({ registrationNumber: 'ABC123', color: 'Red' });
      service.parkCar({ registrationNumber: 'DEF456', color: 'Blue' });
      service.parkCar({ registrationNumber: 'GHI789', color: 'Red' });

      const redSlots = service.getSlotsByColor('Red');
      expect(redSlots).toHaveLength(2);
      expect(redSlots.every(slot => slot.car?.color === 'red')).toBe(true);
    });

    it('should return empty array when no cars found with given color', () => {
      const slots = service.getSlotsByColor('Yellow');
      expect(slots).toHaveLength(0);
    });
  });
}); 