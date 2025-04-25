import { Module } from '@nestjs/common';
import { ParkingController } from './controllers/parking.controller';
import { ParkingService } from './services/parking.service';
 
@Module({
  controllers: [ParkingController],
  providers: [ParkingService],
})
export class ParkingModule {} 