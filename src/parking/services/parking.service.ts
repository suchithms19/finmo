import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Car } from '../models/car.model';
import { ParkingSlot } from '../models/parking-slot.model';

@Injectable()
export class ParkingService {
  private slots: Map<number, ParkingSlot> = new Map();
  private registrationToSlot: Map<string, number> = new Map();
  private colorToSlots: Map<string, Set<number>> = new Map();
  private initialized: boolean = false;

  initialize(size: number): void {
    if (this.initialized) {
      throw new BadRequestException('Parking lot already initialized');
    }
    
    for (let i = 1; i <= size; i++) {
      this.slots.set(i, { slotNumber: i, isOccupied: false });
    }
    this.initialized = true;
  }

  expand(additionalSlots: number): void {
    if (!this.initialized) {
      throw new BadRequestException('Parking lot not initialized');
    }

    const currentSize = this.slots.size;
    for (let i = 1; i <= additionalSlots; i++) {
      const slotNumber = currentSize + i;
      this.slots.set(slotNumber, { slotNumber, isOccupied: false });
    }
  }

  parkCar(car: Car): ParkingSlot {
    if (!this.initialized) {
      throw new BadRequestException('Parking lot not initialized');
    }

    if (this.registrationToSlot.has(car.registrationNumber)) {
      throw new BadRequestException('Car already parked');
    }

    // Find nearest available slot
    const availableSlot = Array.from(this.slots.values())
      .find(slot => !slot.isOccupied);

    if (!availableSlot) {
      throw new BadRequestException('Parking lot is full');
    }

    // Update slot
    const updatedSlot: ParkingSlot = {
      ...availableSlot,
      isOccupied: true,
      car: { ...car, color: car.color.toLowerCase() }
    };
    this.slots.set(availableSlot.slotNumber, updatedSlot);

    // Update mappings
    this.registrationToSlot.set(car.registrationNumber, availableSlot.slotNumber);
    
    const colorSet = this.colorToSlots.get(car.color.toLowerCase()) || new Set();
    colorSet.add(availableSlot.slotNumber);
    this.colorToSlots.set(car.color.toLowerCase(), colorSet);

    return updatedSlot;
  }

  removeCarFromSlot(slotNumber: number): void {
    if (!this.initialized) {
      throw new BadRequestException('Parking lot not initialized');
    }

    const slot = this.slots.get(slotNumber);
    if (!slot) {
      throw new NotFoundException('Slot not found');
    }

    if (!slot.isOccupied || !slot.car) {
      throw new BadRequestException('Slot is already empty');
    }

    // Remove from mappings
    this.registrationToSlot.delete(slot.car.registrationNumber);
    const colorSet = this.colorToSlots.get(slot.car.color);
    if (colorSet) {
      colorSet.delete(slotNumber);
      if (colorSet.size === 0) {
        this.colorToSlots.delete(slot.car.color);
      }
    }

    // Update slot
    this.slots.set(slotNumber, {
      slotNumber,
      isOccupied: false
    });
  }

  getOccupiedSlots(): ParkingSlot[] {
    return Array.from(this.slots.values()).filter(slot => slot.isOccupied);
  }

  getSlotByRegistration(registrationNumber: string): ParkingSlot {
    const slotNumber = this.registrationToSlot.get(registrationNumber);
    if (!slotNumber) {
      throw new NotFoundException('Car not found');
    }
    return this.slots.get(slotNumber)!;
  }

  getSlotsByColor(color: string): ParkingSlot[] {
    const slotNumbers = this.colorToSlots.get(color.toLowerCase());
    if (!slotNumbers) {
      return [];
    }
    return Array.from(slotNumbers).map(slotNumber => this.slots.get(slotNumber)!);
  }
} 