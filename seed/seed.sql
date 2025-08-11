-- Doctors
INSERT INTO doctors (id, name, specialization, working_start, working_end, slot_duration_minutes)
VALUES
  ('00000000-0000-0000-0000-000000000101', 'Dr. Asha Singh', 'Pediatrics', '09:00', '17:00', 30),
  ('00000000-0000-0000-0000-000000000102', 'Dr. Ravi Kumar', 'General Physician', '10:00', '18:00', 20)
ON CONFLICT DO NOTHING;

-- Appointments
INSERT INTO appointments (doctor_id, patient_name, patient_contact, start_time, end_time)
VALUES
  ('00000000-0000-0000-0000-000000000101', 'Test Patient', '+911234567890', '2025-08-15T10:00:00+05:30', '2025-08-15T10:30:00+05:30')
ON CONFLICT DO NOTHING;
