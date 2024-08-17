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

CREATE TABLE TreatmentHistory (
    TreatmentID INT AUTO_INCREMENT PRIMARY KEY,
    PatientID INT,
    DoctorID INT,
    StartDate DATE,
    Allergy VARCHAR(100),
    TreatmentType VARCHAR(100),
    Details TEXT,
    FOREIGN KEY (PatientID) REFERENCES Patients(PatientID),
    FOREIGN KEY (DoctorID) REFERENCES Staff(StaffID)
);
