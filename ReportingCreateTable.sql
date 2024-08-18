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
    AverageSatisfactionScore DECIMAL(3, 2)
    TreatmentsPerHour DECIMAL(5, 2), 
    ReportDate DATE,
    FOREIGN KEY (StaffID) REFERENCES Staff(StaffID)
);

-- BillingReport
CREATE TABLE BillingReport (
    BillingID INT PRIMARY KEY AUTO_INCREMENT,
    PatientID INT,
    TreatmentID INT,
    BillingAmount DECIMAL(10, 2),
    PaymentStatus VARCHAR(20), -- Paid, Pending, Overdue    
    FOREIGN KEY (PatientID) REFERENCES Patients(PatientID),
    FOREIGN KEY (TreatmentID) REFERENCES Treatments(TreatmentID)
);

