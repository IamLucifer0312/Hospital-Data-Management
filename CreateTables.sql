CREATE DATABASE Hospital;
use Hospital;

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
    JobType VARCHAR(50) NOT NULL,
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
    FOREIGN KEY (StaffID) REFERENCES Staff(StaffID)
);

CREATE TABLE TreatmentHistory (
    TreatmentID INT AUTO_INCREMENT PRIMARY KEY,
    PatientID INT,
    DoctorID INT,
    StartDate DATE,
    TreatmentType VARCHAR(100),
    BillingAmount INT,
    Status VARCHAR(50),
    Details TEXT,
    FOREIGN KEY (PatientID) REFERENCES Patients(PatientID),
    FOREIGN KEY (DoctorID) REFERENCES Staff(StaffID)
);

CREATE TABLE Appointments (
    AppointmentID INT PRIMARY KEY AUTO_INCREMENT,
    AppointmentDate DATE NOT NULL,
    AppointmentStartTime TIME NOT NULL,
	AppointmentEndTime TIME NOT NULL,
    AppointmentStatus VARCHAR(50) DEFAULT 'Scheduled', -- Example statuses: Scheduled, Completed, Canceled
    Purpose VARCHAR(255) NOT NULL,
    PatientID INT NOT NULL,
    StaffID INT NOT NULL,
    
    FOREIGN KEY (PatientID) REFERENCES Patients(PatientID),
    FOREIGN KEY (StaffID) REFERENCES Staff(StaffID)
);

-- Reports include Patient treatment history, Staff workload, Staff performance, Billing


-- PatientTreatmentReport
CREATE TABLE PatientTreatmentReport (
    ReportID INT PRIMARY KEY AUTO_INCREMENT,
    PatientID INT,
    TreatmentID INT,
    DoctorID INT,
    FOREIGN KEY (PatientID) REFERENCES Patients(PatientID),
    FOREIGN KEY (DoctorID) REFERENCES Staff(StaffID),
    FOREIGN KEY (TreatmentID) REFERENCES TreatmentHistory(TreatmentID)
);

-- StaffWorkloadReport
CREATE TABLE StaffWorkloadReport (
    ReportID INT PRIMARY KEY AUTO_INCREMENT,
    StaffID INT,
    TotalTreatments INT, 
    TotalWorkloadHours DECIMAL(5, 2), 
    ReportDate DATE,
    FOREIGN KEY (StaffID) REFERENCES Staff(StaffID)
);

-- StaffPerformanceReport
CREATE TABLE StaffPerformanceReport (
    ReportID INT PRIMARY KEY AUTO_INCREMENT,
    StaffID INT,
    TotalTreatments INT,
    AverageSatisfactionScore DECIMAL(3, 2),
    TreatmentsPerHour DECIMAL(5, 2), 
    ReportDate DATE,
    FOREIGN KEY (StaffID) REFERENCES Staff(StaffID)
);