CREATE DATABASE Hospital;
use Hospital;

drop table if exists TreatmentHistory;
drop table if exists Appointments;
drop table if exists Staff_Schedule;
drop table if exists Patients;
drop table if exists Staff;
drop table if exists Department;

CREATE TABLE Patients (
    PatientID INT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    DateOfBirth DATE,
    Gender VARCHAR(10),
    Address VARCHAR(255),
    PhoneNum VARCHAR(20),
    Email VARCHAR(100),
    Allergies TEXT,
    UNIQUE (Email)
);

CREATE TABLE Department (
    DepartmentID INT PRIMARY KEY AUTO_INCREMENT,
    DepartmentName VARCHAR(50) NOT NULL
);
CREATE TABLE Staff (
    StaffID INT PRIMARY KEY AUTO_INCREMENT,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    JobType ENUM('Doctor', 'Nurse', 'Admin', 'Lab Technician', 'Surgeon') NOT NULL,
	Salary INT,
    Qualification VARCHAR(100),
    DepartmentID INT NOT NULL,
    ManagerID INT,
    FOREIGN KEY (DepartmentID) REFERENCES Department(DepartmentID),
    FOREIGN KEY (ManagerID) REFERENCES Staff(StaffID)
);
CREATE TABLE Staff_Schedule (
    ScheduleID INT PRIMARY KEY AUTO_INCREMENT,
    StaffID INT NOT NULL,
    DayOfWeek ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL,
    StartTime TIME NOT NULL,
    EndTime TIME NOT NULL,
    FOREIGN KEY (StaffID) REFERENCES Staff(StaffID),
    
	CHECK (StartTime >= '00:00:00' AND StartTime <= '23:59:59'),
    CHECK (EndTime >= '00:00:00' AND EndTime <= '23:59:59'),
    CHECK (StartTime < EndTime)
);

CREATE TABLE TreatmentHistory (
    TreatmentID INT AUTO_INCREMENT PRIMARY KEY,
    PatientID INT NOT NULL,
    DoctorID INT NOT NULL,
    StartDate DATE,
    EndDate DATE,
    TreatmentType VARCHAR(100),
    BillingAmount INT,
    SatisfactionScore DECIMAL(3, 2),
    Status VARCHAR(50),
    Details TEXT,
    FOREIGN KEY (PatientID) REFERENCES Patients(PatientID),
    FOREIGN KEY (DoctorID) REFERENCES Staff(StaffID),
    
	CHECK (StartDate <= EndDate)
);

CREATE TABLE Appointments (
    AppointmentID INT PRIMARY KEY AUTO_INCREMENT,
    AppointmentDate DATE NOT NULL,
    AppointmentStartTime TIME NOT NULL,
	AppointmentEndTime TIME NOT NULL,
    AppointmentStatus ENUM('Scheduled','Completed','Cancelled') DEFAULT 'Scheduled', -- Example statuses: Scheduled, Completed, Cancelled
    Purpose VARCHAR(255) NOT NULL,
    PatientID INT NOT NULL,
    StaffID INT NOT NULL,
    
    FOREIGN KEY (PatientID) REFERENCES Patients(PatientID),
    FOREIGN KEY (StaffID) REFERENCES Staff(StaffID),
    
	CHECK (AppointmentStartTime >= '00:00:00' AND AppointmentStartTime <= '23:59:59'),
    CHECK (AppointmentEndTime >= '00:00:00' AND AppointmentEndTime <= '23:59:59'),
    CHECK (AppointmentStartTime < AppointmentEndTime)
);

-- Reports include Patient treatment history, Staff workload, Staff performance, Billing


-- PatientTreatmentReport
-- CREATE TABLE PatientTreatmentReport (
--     ReportID INT PRIMARY KEY AUTO_INCREMENT,
--     PatientID INT,
--     TreatmentID INT,
--     DoctorID INT,
--     FOREIGN KEY (PatientID) REFERENCES Patients(PatientID),
--     FOREIGN KEY (DoctorID) REFERENCES Staff(StaffID),
--     FOREIGN KEY (TreatmentID) REFERENCES TreatmentHistory(TreatmentID)
-- );

CREATE TABLE PatientTreatmentReport AS
SELECT 
    t.PatientID, 
    t.TreatmentID, 
    t.DoctorID
    t.StartDate
    t.EndDate
    CURDATE() AS ReportDate
FROM 
    TreatmentHistory t
WHERE 
    t.StartDate >= '2024-01-01' AND t.EndDate <= '2024-12-31';

ALTER TABLE PatientTreatmentReport ADD COLUMN ReportID INT AUTO_INCREMENT PRIMARY KEY;

-- StaffWorkloadReport
-- CREATE TABLE StaffWorkloadReport (
--     ReportID INT PRIMARY KEY AUTO_INCREMENT,
--     StaffID INT,
--     TotalTreatments INT, 
--     TotalWorkloadHours DECIMAL(5, 2), 
--     ReportDate DATE,
--     FOREIGN KEY (StaffID) REFERENCES Staff(StaffID)
-- );

CREATE TABLE StaffWorkloadReport AS
SELECT 
    s.StaffID, 
    COUNT(t.TreatmentID) AS TotalTreatments, 
    SUM(TIMESTAMPDIFF(HOUR, t.StartDate, t.EndDate)) AS TotalWorkloadHours, 
    CURDATE() AS ReportDate
FROM 
    Staff s
JOIN 
    TreatmentHistory t ON s.StaffID = t.DoctorID
GROUP BY 
    s.StaffID;

ALTER TABLE StaffWorkloadReport ADD COLUMN ReportID INT AUTO_INCREMENT PRIMARY KEY;

-- StaffPerformanceReport
-- CREATE TABLE StaffPerformanceReport (
--     ReportID INT PRIMARY KEY AUTO_INCREMENT,
--     StaffID INT,
--     TotalTreatments INT,
--     AverageSatisfactionScore DECIMAL(3, 2),
--     TreatmentsPerHour DECIMAL(5, 2), 
--     ReportDate DATE,
--     FOREIGN KEY (StaffID) REFERENCES Staff(StaffID)
-- );

CREATE TABLE StaffPerformanceReport AS
SELECT 
    s.StaffID, 
    COUNT(t.TreatmentID) AS TotalTreatments, 
    AVG(t.SatisfactionScore) AS AverageSatisfactionScore, 
    COUNT(t.TreatmentID) / SUM(TIMESTAMPDIFF(HOUR, t.StartDate, t.EndDate)) AS TreatmentsPerHour, 
    CURDATE() AS ReportDate
FROM 
    Staff s
JOIN 
    TreatmentHistory t ON s.StaffID = t.DoctorID
GROUP BY 
    s.StaffID;

ALTER TABLE StaffPerformanceReport ADD COLUMN ReportID INT AUTO_INCREMENT PRIMARY KEY;
