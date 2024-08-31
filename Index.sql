-- Patients table
CREATE INDEX idx_patients_name ON Patients (FirstName, LastName);

-- Staff table
CREATE INDEX idx_staff_department ON Staff (DepartmentID);
CREATE INDEX idx_staff_lastname ON Staff (FirstName, LastName);

-- Staff schedule table
CREATE INDEX idx_staff_schedule ON Staff_Schedule (StaffID, DayOfWeek);

-- Treatment table
CREATE INDEX idx_treatment_patient ON TreatmentHistory(PatientID);
CREATE INDEX idx_treatment_doctor ON TreatmentHistory(DoctorID);
CREATE INDEX idx_treatment_dates ON TreatmentHistory(StartDate, EndDate);

-- Appointment tables
CREATE INDEX idx_appointment_patient ON Appointments(PatientID);
CREATE INDEX idx_appointment_staff ON Appointments(StaffID);
CREATE INDEX idx_appointment_date ON Appointments(AppointmentDate);

-- Report
CREATE INDEX idx_treatment_date ON PatientTreatmentReport(StartDate, EndDate);
CREATE INDEX idx_patient_treatment_date ON PatientTreatmentReport(PatientID, StartDate, EndDate);

CREATE INDEX idx_performance_staff_date ON StaffPerformanceReport(StaffID, ReportDate);
CREATE INDEX idx_performance_date ON StaffPerformanceReport(ReportDate);

CREATE INDEX idx_workload_staff_date ON StaffWorkloadReport(StaffID, ReportDate);
CREATE INDEX idx_workload_date ON StaffWorkloadReport(ReportDate);
