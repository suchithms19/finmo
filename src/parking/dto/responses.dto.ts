export class ParkingSlotResponseDto {
  slotNumber: number;
  registrationNumber?: string;
  color?: string;
}

export class MessageResponseDto {
  message: string;
}

export class ColorSearchResponseDto {
  registrationNumbers: string[];
  slots: number[];
}

export class OccupiedSlotsResponseDto {
  totalOccupied: number;
  slots: ParkingSlotResponseDto[];
} 