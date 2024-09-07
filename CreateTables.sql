CREATE DATABASE Hospital;
use Hospital;

drop table if exists PatientTreatmentReport;
drop table if exists StaffWorkloadReport;
drop table if exists StaffPerformanceReport;
drop table if exists JobChangeHistory;
drop table if exists TreatmentHistory;
drop table if exists Appointments;
drop table if exists Staff_Schedule;
drop table if exists Patients;
drop table if exists Staff;
drop table if exists Department;
drop table if exists JobChangeHistory;

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

CREATE TABLE JobChangeHistory (
    ChangeID INT PRIMARY KEY AUTO_INCREMENT,
    StaffID INT NOT NULL,
    OldJobType ENUM('Doctor', 'Nurse', 'Admin', 'Lab Technician', 'Surgeon') NOT NULL,
    NewJobType ENUM('Doctor', 'Nurse', 'Admin', 'Lab Technician', 'Surgeon') NOT NULL,
    OldSalary INT,
    NewSalary INT,
    OldDepartmentID INT NOT NULL,
    NewDepartmentID INT NOT NULL,
    ChangeDate DATE NOT NULL,
    Reason VARCHAR(255) NOT NULL,
    FOREIGN KEY (StaffID) REFERENCES Staff(StaffID),
    FOREIGN KEY (OldDepartmentID) REFERENCES Department(DepartmentID),
    FOREIGN KEY (NewDepartmentID) REFERENCES Department(DepartmentID)
);
