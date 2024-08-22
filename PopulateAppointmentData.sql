INSERT INTO Appointments (AppointmentDate, AppointmentStartTime, AppointmentEndTime, AppointmentStatus, Purpose, PatientID, StaffID)
VALUES
-- Completed Appointments before 2024-09-01 for StaffID 1
('2024-08-30', '08:30:00', '09:00:00', 'Completed', 'Routine check-up', 1, 1),
('2024-08-28', '09:00:00', '09:30:00', 'Completed', 'Follow-up consultation', 2, 1),
('2024-08-26', '10:00:00', '10:30:00', 'Completed', 'Cardiology consultation', 3, 1),

-- Canceled and Scheduled Appointments for StaffID 1 (Working on Monday, Wednesday, Friday from 08:00 to 16:00)
('2024-09-02', '08:30:00', '09:00:00', 'Canceled', 'Routine check-up', 1, 1),
('2024-09-04', '09:00:00', '09:30:00', 'Scheduled', 'Follow-up consultation', 2, 1),
('2024-09-06', '10:00:00', '10:30:00', 'Scheduled', 'Cardiology consultation', 3, 1),

-- Completed Appointments before 2024-09-01 for StaffID 2
('2024-08-29', '10:30:00', '11:00:00', 'Completed', 'Blood pressure monitoring', 4, 2),
('2024-08-28', '08:30:00', '09:00:00', 'Completed', 'Post-surgery care', 5, 2),

-- Canceled and Scheduled Appointments for StaffID 2 (Working on Monday, Tuesday, Thursday from 08:00 to 16:00)
('2024-09-02', '11:00:00', '11:30:00', 'Canceled', 'Health check-up', 6, 2),
('2024-09-03', '10:30:00', '11:00:00', 'Scheduled', 'Post-surgery care', 5, 2),
('2024-09-05', '11:00:00', '11:30:00', 'Scheduled', 'Health check-up', 6, 2),

-- Completed Appointments before 2024-09-01 for StaffID 3
('2024-08-27', '10:00:00', '10:30:00', 'Completed', 'General examination', 7, 3),
('2024-08-29', '14:00:00', '14:30:00', 'Completed', 'Routine check-up', 8, 3),

-- Canceled and Scheduled Appointments for StaffID 3 (Working on Tuesday, Wednesday, Thursday from 09:00 to 17:00)
('2024-09-03', '10:00:00', '10:30:00', 'Canceled', 'Consultation', 9, 3),
('2024-09-04', '11:00:00', '11:30:00', 'Scheduled', 'Routine check-up', 8, 3),
('2024-09-05', '14:00:00', '14:30:00', 'Scheduled', 'Consultation', 9, 3),

-- Completed Appointments before 2024-09-01 for StaffID 4
('2024-08-26', '08:00:00', '08:30:00', 'Completed', 'Neurology consultation', 10, 4),
('2024-08-28', '09:30:00', '10:00:00', 'Completed', 'Headache treatment', 11, 4),

-- Canceled and Scheduled Appointments for StaffID 4 (Working on Monday, Wednesday, Friday from 08:00 to 16:00)
('2024-09-02', '08:00:00', '08:30:00', 'Canceled', 'Neurology consultation', 10, 4),
('2024-09-04', '09:30:00', '10:00:00', 'Scheduled', 'Headache treatment', 11, 4),
('2024-09-06', '10:00:00', '10:30:00', 'Scheduled', 'Follow-up appointment', 12, 4),

-- Completed Appointments before 2024-09-01 for StaffID 5
('2024-08-29', '12:00:00', '12:30:00', 'Completed', 'Lab test', 13, 5),
('2024-08-27', '10:30:00', '11:00:00', 'Completed', 'X-ray follow-up', 14, 5),

-- Canceled and Scheduled Appointments for StaffID 5 (Working on Tuesday, Thursday, Saturday from 10:00 to 18:00)
('2024-09-03', '12:30:00', '13:00:00', 'Canceled', 'Blood work analysis', 14, 5),
('2024-09-05', '14:00:00', '14:30:00', 'Scheduled', 'X-ray follow-up', 15, 5),
('2024-09-07', '15:00:00', '15:30:00', 'Scheduled', 'Blood work analysis', 15, 5),

-- Completed Appointments before 2024-09-01 for StaffID 6
('2024-08-30', '08:30:00', '09:00:00', 'Completed', 'Lab check-up', 16, 6),
('2024-08-28', '10:00:00', '10:30:00', 'Completed', 'Routine lab test', 17, 6),

-- Canceled and Scheduled Appointments for StaffID 6 (Working on Monday, Wednesday, Friday from 08:00 to 16:00)
('2024-09-02', '13:00:00', '13:30:00', 'Canceled', 'Blood test', 18, 6),
('2024-09-04', '08:30:00', '09:00:00', 'Scheduled', 'Lab check-up', 16, 6),
('2024-09-06', '13:00:00', '13:30:00', 'Scheduled', 'Blood test', 18, 6),

-- Completed Appointments before 2024-09-01 for StaffID 7
('2024-08-29', '15:00:00', '15:30:00', 'Completed', 'Pre-surgery consultation', 19, 7),
('2024-08-27', '09:30:00', '10:00:00', 'Completed', 'Post-surgery care', 20, 7),

-- Canceled and Scheduled Appointments for StaffID 7 (Working on Tuesday, Thursday, Saturday from 08:00 to 16:00)
('2024-09-03', '15:00:00', '15:30:00', 'Canceled', 'Physical therapy session', 21, 7),
('2024-09-05', '10:00:00', '10:30:00', 'Scheduled', 'Pre-surgery consultation', 19, 7),
('2024-09-07', '11:30:00', '12:00:00', 'Scheduled', 'Physical therapy session', 21, 7);
