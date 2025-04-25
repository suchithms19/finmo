import { IsInt, Min } from 'class-validator';
 
export class InitializeParkingDto {
  @IsInt()
  @Min(1)
  size: number;
} 