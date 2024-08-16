CREATE DATABASE Hospital;
use Hospital;

CREATE TABLE Patients (
    PatientID INT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    DateOfBirth DATE,
    Gender VARCHAR(10),
    Address VARCHAR(255),
    PhoneNumber VARCHAR(20),
    Email VARCHAR(100),
    Allergies TEXT,
    UNIQUE (Email)
);
