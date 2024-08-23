-- Create all user roles:
CREATE USER 'admin'@'localhost' IDENTIFIED BY 'admin123';
CREATE USER 'doctor'@'localhost' IDENTIFIED BY 'doctor123';
CREATE USER 'nurse'@'localhost' IDENTIFIED BY 'nurse123';
CREATE USER 'receptionist'@'localhost' IDENTIFIED BY 'receptionist123';

-- Grant Privileges:
GRANT ALL PRIVILEGES ON *.* TO 'admin'@'localhost';

GRANT SELECT ON Patients TO 'doctor'@'localhost';
GRANT SELECT ON Appointments TO 'doctor'@'localhost';
GRANT SELECT ON department TO 'doctor'@'localhost';
GRANT SELECT (StaffID, FirstName, LastName, JobType, Qualification, DepartmentID, ManagerID) ON Staff TO 'doctor'@'localhost';
GRANT SELECT, INSERT, UPDATE ON treatmenthistory TO 'doctor'@'localhost';
GRANT SELECT ON patienttreatmentreport TO 'doctor'@'localhost';
GRANT SELECT ON staff_schedule TO 'doctor'@'localhost';
GRANT SELECT ON staffperformancereport TO 'doctor'@'localhost';
GRANT SELECT ON staffworkloadreport TO 'doctor'@'localhost';

GRANT SELECT ON Patients TO 'nurse'@'localhost';
GRANT SELECT ON Appointments TO 'nurse'@'localhost';
GRANT SELECT ON department TO 'nurse'@'localhost';
GRANT SELECT (StaffID, FirstName, LastName, JobType, Qualification, DepartmentID, ManagerID) ON Staff TO 'nurse'@'localhost';
GRANT SELECT ON treatmenthistory TO 'nurse'@'localhost';
GRANT SELECT ON patienttreatmentreport TO 'nurse'@'localhost';
GRANT SELECT ON staff_schedule TO 'nurse'@'localhost';
GRANT SELECT ON staffperformancereport TO 'nurse'@'localhost';
GRANT SELECT ON staffworkloadreport TO 'nurse'@'localhost';

GRANT SELECT, INSERT, UPDATE ON Patients TO 'receptionist'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON Appointments TO 'receptionist'@'localhost';
GRANT SELECT ON department TO 'receptionist'@'localhost';
GRANT SELECT (StaffID, FirstName, LastName, JobType, Qualification, DepartmentID, ManagerID) ON Staff TO 'receptionist'@'localhost';
GRANT SELECT ON treatmenthistory TO 'receptionist'@'localhost';
GRANT SELECT ON patienttreatmentreport TO 'receptionist'@'localhost';
GRANT SELECT ON staff_schedule TO 'receptionist'@'localhost';
GRANT SELECT ON staffperformancereport TO 'receptionist'@'localhost';
GRANT SELECT ON staffworkloadreport TO 'receptionist'@'localhost';


