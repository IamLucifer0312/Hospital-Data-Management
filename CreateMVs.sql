drop table if exists PatientTreatmentReport;
drop table if exists StaffWorkloadReport;
drop table if exists StaffPerformanceReport;

CREATE TABLE PatientTreatmentReport AS
SELECT 
    concat(p.FirstName, ' ', p.LastName) AS PatientName,
    concat(s.FirstName, ' ', s.LastName) AS DoctorName,
    t.TreatmentID, 
    t.StartDate,
    t.EndDate,
    CURDATE() AS ReportDate
FROM 
    TreatmentHistory t
JOIN patients p 
ON t.PatientID = p.PatientID
JOIN staff s
ON t.DoctorID = s.StaffID
WHERE 
    t.StartDate >= '2024-01-01' AND t.EndDate <= '2024-12-31';
ALTER TABLE PatientTreatmentReport ADD COLUMN ReportID INT AUTO_INCREMENT PRIMARY KEY;

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