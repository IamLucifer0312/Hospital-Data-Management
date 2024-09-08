-- Patients table
CREATE INDEX idx_patients_name ON Patients (FirstName, LastName);

-- Staff table
CREATE INDEX idx_staff_department ON Staff (DepartmentID);
CREATE INDEX idx_staff_lastname ON Staff (FirstName, LastName);
CREATE INDEX idx_managerid_staff ON Staff(ManagerID);

-- Staff schedule table
CREATE INDEX idx_staffid_staff_schedule ON Staff_Schedule(StaffID);
CREATE INDEX idx_dayofweek_staff_schedule ON Staff_Schedule(DayOfWeek);
CREATE INDEX idx_starttime_staff_schedule ON Staff_Schedule(StartTime);
-- Optimize Recursive Queries for procedure in StaffWorkLoad Report
CREATE INDEX idx_staffid_dayofweek_staff_schedule ON Staff_Schedule(StaffID, DayOfWeek);


-- Treatment table
CREATE INDEX idx_treatment_patient ON TreatmentHistory(PatientID);
CREATE INDEX idx_treatment_doctor ON TreatmentHistory(DoctorID);
CREATE INDEX idx_startdate_treatmenthistory ON TreatmentHistory(StartDate);
CREATE INDEX idx_enddate_treatmenthistory ON TreatmentHistory(EndDate);
CREATE INDEX idx_status_treatmenthistory ON TreatmentHistory(Status);

-- Appointment tables
CREATE INDEX idx_appointment_patient ON Appointments(PatientID);
CREATE INDEX idx_appointment_staff ON Appointments(StaffID);
CREATE INDEX idx_appointment_date ON Appointments(AppointmentDate);
CREATE INDEX idx_appointmentstatus_appointments ON Appointments(AppointmentStatus);
-- AppointmentDate, StaffID, and AppointmentStatus are commonly queried together:
CREATE INDEX idx_appointments_staffid_date_status ON Appointments(StaffID, AppointmentDate, AppointmentStatus);


-- Report 
CREATE INDEX idx_patientid_patienttreatmentreport ON PatientTreatmentReport(PatientID);
CREATE INDEX idx_doctorid_patienttreatmentreport ON PatientTreatmentReport(DoctorID);
CREATE INDEX idx_treatmentid_patienttreatmentreport ON PatientTreatmentReport(TreatmentID);
CREATE INDEX idx_staffid_workloadreport ON StaffWorkloadGivenDurationReport(StaffID);
CREATE INDEX idx_staffid_performance_report ON StaffPerformanceReport(StaffID);
