import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { ApiTags, ApiBody  } from '@nestjs/swagger';

@ApiTags('appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly service: AppointmentsService) {}

  @Post()
  @ApiBody({
    description: 'Create a new appointment',
    examples: {
      example1: {
        summary: 'Sample appointment request',
        value: {
          doctor_id: '00000000-0000-0000-0000-000000000101',
          patient_name: 'Ruhi Dev',
          patient_contact: '+917234567890',
          start_time: '2025-08-11T09:30:00.000Z',
          end_time: '2025-08-11T10:00:00.000Z',
        },
      },
    },
  })
  async create(@Body() dto: CreateAppointmentDto) {
    if (new Date(dto.start_time) >= new Date(dto.end_time)) throw new BadRequestException('start_time must be before end_time');
    return this.service.create(dto);
  }
}
