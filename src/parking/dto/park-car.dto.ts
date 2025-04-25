import { IsString, IsNotEmpty } from 'class-validator';

export class ParkCarDto {
  @IsString()
  @IsNotEmpty()
  registrationNumber: string;

  @IsString()
  @IsNotEmpty()
  color: string;
} 