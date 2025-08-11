import { Injectable, NotFoundException } from '@nestjs/common';
import { pool } from '../db';

@Injectable()
export class DoctorsService {
  async list({
  page = 1,
  limit = 10,
  specialization,
}: { page: number; limit: number; specialization?: string }) {
  const offset = (page - 1) * limit;
  const params: any[] = [];
  let where = '';

  // Filter by specialization if provided
  if (specialization) {
    params.push(`%${specialization}%`);
    where = `WHERE specialization ILIKE $${params.length}`;
  }

  // Count total rows for pagination
  const countQuery = `SELECT COUNT(*) AS total FROM doctors ${where}`;
  const countResult = await pool.query(countQuery, params);
  const total = parseInt(countResult.rows[0].total, 10);

  // Add limit and offset
  params.push(limit, offset);
  const q = `SELECT * FROM doctors ${where} ORDER BY name LIMIT $${params.length - 1} OFFSET $${params.length}`;
  const res = await pool.query(q, params);

  return {
    data: res.rows,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}


  async getById(id: string) {
    const r = await pool.query('SELECT * FROM doctors WHERE id = $1', [id]);
    if (!r.rows.length) throw new NotFoundException('Doctor not found');
    return r.rows[0];
  }

  async getSlots(doctorId: string, dateStr: string) {
    const doctor = await this.getById(doctorId);
    const [wsH, wsM] = doctor.working_start.split(':').map(Number);
    const [weH, weM] = doctor.working_end.split(':').map(Number);

    const day = new Date(dateStr + 'T00:00:00Z');
    const start = new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate(), wsH, wsM));
    const end = new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate(), weH, weM));

    const duration = doctor.slot_duration_minutes;

    const appts = await pool.query(
      'SELECT start_time, end_time FROM appointments WHERE doctor_id = $1 AND start_time >= $2 AND start_time < $3',
      [doctorId, start.toISOString(), end.toISOString()]
    );
    const occupied = appts.rows.map(r => ({ start: new Date(r.start_time), end: new Date(r.end_time) }));

    const slots = [];
    let cursor = start;
    while (cursor.getTime() + duration*60000 <= end.getTime()) {
      const slotStart = new Date(cursor);
      const slotEnd = new Date(cursor.getTime() + duration*60000);
      const conflict = occupied.some(o => (o.start < slotEnd && o.end > slotStart));
      if (!conflict) {
        slots.push({ start: slotStart.toISOString(), end: slotEnd.toISOString() });
      }
      cursor = new Date(cursor.getTime() + duration*60000);
    }
    return { doctor: { id: doctor.id, name: doctor.name, specialization: doctor.specialization }, slots };
  }
}
