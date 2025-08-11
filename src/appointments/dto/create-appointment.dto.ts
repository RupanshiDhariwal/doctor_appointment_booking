import { IsUUID, IsNotEmpty, IsString, IsOptional, IsISO8601 } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  doctor_id: string;

  @IsNotEmpty()
  @IsString()
  patient_name: string;

  @IsOptional()
  @IsString()
  patient_contact?: string;

  @IsISO8601()
  start_time: string; // ISO

  @IsISO8601()
  end_time: string; // ISO
}
