import { Controller, Post, Body, Delete, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ParkingService } from '../services/parking.service';
import { InitializeParkingDto } from '../dto/initialize-parking.dto';
import { ParkCarDto } from '../dto/park-car.dto';
import { 
  MessageResponseDto, 
  ParkingSlotResponseDto, 
  ColorSearchResponseDto,
  OccupiedSlotsResponseDto 
} from '../dto/responses.dto';

@Controller('parking')
export class ParkingController {
  constructor(private readonly parkingService: ParkingService) {}

  @Post('initialize')
  initialize(@Body() dto: InitializeParkingDto): MessageResponseDto {
    this.parkingService.initialize(dto.size);
    return { message: 'Parking lot initialized successfully' };
  }

  @Post('expand')
  expand(@Body('additionalSlots', ParseIntPipe) additionalSlots: number): MessageResponseDto {
    this.parkingService.expand(additionalSlots);
    return { message: 'Parking lot expanded successfully' };
  }

  @Post()
  parkCar(@Body() dto: ParkCarDto): ParkingSlotResponseDto {
    const slot = this.parkingService.parkCar(dto);
    return {
      slotNumber: slot.slotNumber,
      registrationNumber: slot.car?.registrationNumber,
      color: slot.car?.color
    };
  }

  @Delete(':slotNumber')
  removeCar(@Param('slotNumber', ParseIntPipe) slotNumber: number): MessageResponseDto {
    this.parkingService.removeCarFromSlot(slotNumber);
    return { message: 'Car removed successfully' };
  }

  @Get('occupied')
  getOccupiedSlots(): OccupiedSlotsResponseDto {
    const occupiedSlots = this.parkingService.getOccupiedSlots();
    return {
      totalOccupied: occupiedSlots.length,
      slots: occupiedSlots.map(slot => ({
        slotNumber: slot.slotNumber,
        registrationNumber: slot.car?.registrationNumber,
        color: slot.car?.color
      }))
    };
  }

  @Get('registration/:registrationNumber')
  getSlotByRegistration(
    @Param('registrationNumber') registrationNumber: string
  ): ParkingSlotResponseDto {
    const slot = this.parkingService.getSlotByRegistration(registrationNumber);
    return {
      slotNumber: slot.slotNumber,
      registrationNumber: slot.car?.registrationNumber,
      color: slot.car?.color
    };
  }

  @Get('color/:color')
  getSlotsByColor(@Param('color') color: string): ColorSearchResponseDto {
    const slots = this.parkingService.getSlotsByColor(color);
    return {
      registrationNumbers: slots.map(slot => slot.car?.registrationNumber!),
      slots: slots.map(slot => slot.slotNumber)
    };
  }
} 