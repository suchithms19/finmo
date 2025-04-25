import { Controller, Post, Body, Delete, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ParkingService } from '../services/parking.service';
import { InitializeParkingDto } from '../dto/initialize-parking.dto';
import { ParkCarDto } from '../dto/park-car.dto';

@Controller('parking')
export class ParkingController {
  constructor(private readonly parkingService: ParkingService) {}

  @Post('initialize')
  initialize(@Body() dto: InitializeParkingDto) {
    this.parkingService.initialize(dto.size);
    return { message: 'Parking lot initialized successfully' };
  }

  @Post('expand')
  expand(@Body('additionalSlots', ParseIntPipe) additionalSlots: number) {
    this.parkingService.expand(additionalSlots);
    return { message: 'Parking lot expanded successfully' };
  }

  @Post()
  parkCar(@Body() dto: ParkCarDto) {
    return this.parkingService.parkCar(dto);
  }

  @Delete(':slotNumber')
  removeCar(@Param('slotNumber', ParseIntPipe) slotNumber: number) {
    this.parkingService.removeCarFromSlot(slotNumber);
    return { message: 'Car removed successfully' };
  }

  @Get('occupied')
  getOccupiedSlots() {
    return this.parkingService.getOccupiedSlots();
  }

  @Get('registration/:registrationNumber')
  getSlotByRegistration(@Param('registrationNumber') registrationNumber: string) {
    return this.parkingService.getSlotByRegistration(registrationNumber);
  }

  @Get('color/:color')
  getSlotsByColor(@Param('color') color: string) {
    return this.parkingService.getSlotsByColor(color);
  }
} 