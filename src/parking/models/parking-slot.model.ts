import { Car } from './car.model';
 
export interface ParkingSlot {
  slotNumber: number;
  isOccupied: boolean;
  car?: Car;
} 