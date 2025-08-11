import { Controller, Get, Query, Param, ParseUUIDPipe, BadRequestException } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('doctors')
@Controller('doctors')
export class DoctorsController {
  constructor(private readonly service: DoctorsService) {}

  @Get()
  async list(@Query('page') page = '1', @Query('limit') limit = '10', @Query('specialization') specialization?: string) {
    const p = parseInt(page, 10);
    const l = parseInt(limit, 10);
    if (isNaN(p) || isNaN(l)) throw new BadRequestException('Invalid pagination');
    return this.service.list({ page: p, limit: l, specialization });
  }

  @Get(':id/slots')
  async slots(@Param('id', ParseUUIDPipe) id: string, @Query('date') date: string) {
    if (!date) throw new BadRequestException('date query param required (YYYY-MM-DD)');
    return this.service.getSlots(id, date);
  }
}
