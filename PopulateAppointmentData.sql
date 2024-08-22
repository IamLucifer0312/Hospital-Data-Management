INSERT INTO Appointments (AppointmentDate, AppointmentStartTime, AppointmentEndTime, AppointmentStatus, Purpose, PatientID, StaffID)
VALUES
-- Appointments for StaffID 1 (Working from 08:00 to 16:00 on 2024-08-23 and 2024-08-25)
('2024-08-23', '08:30:00', '09:00:00', 'Completed', 'Routine check-up', 1, 1),
('2024-08-23', '10:00:00', '10:30:00', 'Canceled', 'Cardiology consultation', 2, 1),
('2024-08-25', '09:00:00', '09:30:00', 'Scheduled', 'Follow-up consultation', 3, 1),

-- Appointments for StaffID 2 (Working from 08:00 to 16:00 on 2024-08-23 and 2024-08-25)
('2024-08-23', '09:00:00', '09:30:00', 'Completed', 'Nursing check-up', 4, 2),
('2024-08-25', '14:00:00', '14:30:00', 'Scheduled', 'Post-surgery care', 5, 2),

-- Appointments for StaffID 3 (Working from 09:00 to 17:00 on 2024-08-23 and 2024-08-25)
('2024-08-23', '09:30:00', '10:00:00', 'Completed', 'General examination', 6, 3),
('2024-08-25', '11:00:00', '11:30:00', 'Canceled', 'Routine check-up', 7, 3),

-- Appointments for StaffID 4 (Working from 08:00 to 16:00 on 2024-08-23 and 2024-08-25)
('2024-08-23', '10:30:00', '11:00:00', 'Completed', 'Neurology consultation', 8, 4),
('2024-08-25', '15:00:00', '15:30:00', 'Scheduled', 'Headache consultation', 9, 4),

-- Appointments for StaffID 5 (Working from 10:00 to 18:00 on 2024-08-23 and 2024-08-25)
('2024-08-23', '11:00:00', '11:30:00', 'Scheduled', 'Lab test', 10, 5),
('2024-08-25', '12:30:00', '13:00:00', 'Completed', 'Blood work analysis', 11, 5),

-- Appointments for StaffID 6 (Working from 08:00 to 16:00 on 2024-08-24 and 2024-08-25)
('2024-08-24', '09:00:00', '09:30:00', 'Canceled', 'Lab check-up', 12, 6),
('2024-08-25', '11:00:00', '11:30:00', 'Completed', 'Routine lab test', 13, 6),

-- Appointments for StaffID 7 (Working from 08:00 to 16:00 on 2024-08-24 and 2024-08-25)
('2024-08-24', '10:30:00', '11:00:00', 'Completed', 'Pre-surgery consultation', 14, 7),
('2024-08-25', '13:00:00', '13:30:00', 'Scheduled', 'Post-surgery consultation', 15, 7),

-- Appointments for StaffID 8 (Working from 09:00 to 17:00 on 2024-08-24 and 2024-08-25)
('2024-08-24', '11:30:00', '12:00:00', 'Scheduled', 'Orthopedic consultation', 16, 8),
('2024-08-25', '12:30:00', '13:00:00', 'Canceled', 'Bone fracture check-up', 17, 8),

-- Appointments for StaffID 9 (Working from 08:00 to 16:00 on 2024-08-24 and 2024-08-25)
('2024-08-24', '09:30:00', '10:00:00', 'Completed', 'Routine health check', 18, 9),
('2024-08-25', '14:30:00', '15:00:00', 'Scheduled', 'Post-treatment care', 19, 9),

-- Appointments for StaffID 10 (Working from 10:00 to 18:00 on 2024-08-24 and 2024-08-25)
('2024-08-24', '11:00:00', '11:30:00', 'Scheduled', 'Follow-up lab test', 20, 10),
('2024-08-25', '15:30:00', '16:00:00', 'Completed', 'Blood test', 21, 10);