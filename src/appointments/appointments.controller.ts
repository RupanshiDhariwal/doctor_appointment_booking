import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly service: AppointmentsService) {}

  @Post()
  async create(@Body() dto: CreateAppointmentDto) {
    if (new Date(dto.start_time) >= new Date(dto.end_time)) throw new BadRequestException('start_time must be before end_time');
    return this.service.create(dto);
  }
}
