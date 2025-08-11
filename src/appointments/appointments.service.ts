import { Injectable, BadRequestException } from '@nestjs/common';
import { pool } from '../db';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Injectable()
export class AppointmentsService {
  async create(dto: CreateAppointmentDto) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const overlapQ = `SELECT 1 FROM appointments WHERE doctor_id = $1 AND start_time < $2 AND end_time > $3 LIMIT 1`;
      const overlapRes = await client.query(overlapQ, [dto.doctor_id, dto.end_time, dto.start_time]);
      if (overlapRes.rows.length) {
        await client.query('ROLLBACK');
        throw new BadRequestException('Requested time overlaps with existing appointment');
      }
      const insertQ = `INSERT INTO appointments (doctor_id, patient_name, patient_contact, start_time, end_time)
        VALUES ($1,$2,$3,$4,$5) RETURNING *`;
      const inserted = await client.query(insertQ, [dto.doctor_id, dto.patient_name, dto.patient_contact || null, dto.start_time, dto.end_time]);
      await client.query('COMMIT');
      return inserted.rows[0];
    } catch (err) {
      try { await client.query('ROLLBACK'); } catch(e) {}
      throw err;
    } finally {
      client.release();
    }
  }
}
