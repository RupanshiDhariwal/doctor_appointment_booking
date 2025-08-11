import { Controller, Get, Query, Param, ParseUUIDPipe, BadRequestException } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { ApiTags, ApiQuery } from '@nestjs/swagger';

@ApiTags('doctors')
@Controller('doctors')
export class DoctorsController {
  constructor(private readonly service: DoctorsService) {}

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10, description: 'Number of results per page' })
  @ApiQuery({ name: 'specialization', required: false, type: String, description: 'Filter by specialization' })
  async list(
  @Query('page') page = '1',
  @Query('limit') limit = '10',
  @Query('specialization') specialization?: string
) {
  const p = parseInt(page, 10);
  const l = parseInt(limit, 10);
  if (isNaN(p) || isNaN(l) || p < 1 || l < 1) {
    throw new BadRequestException('Invalid pagination values');
  }

  return this.service.list({ page: p, limit: l, specialization });
}

  @Get(':id/slots')
  async slots(@Param('id', ParseUUIDPipe) id: string, @Query('date') date: string) {
    if (!date) throw new BadRequestException('date query param required (YYYY-MM-DD)');
    return this.service.getSlots(id, date);
  }
}
