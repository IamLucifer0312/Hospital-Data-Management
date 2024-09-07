drop table if exists PatientTreatmentReport;
drop table if exists StaffWorkloadGivenDurationReport;
drop table if exists StaffPerformanceReport;

CREATE TABLE PatientTreatmentReport AS
SELECT
    t.PatientID,
    t.DoctorID,
    concat(p.FirstName, ' ', p.LastName) AS PatientName,
    concat(s.FirstName, ' ', s.LastName) AS DoctorName,
    t.TreatmentID,
    t.StartDate,
    t.EndDate,
    t.Details,
    t.Status,
    DATEDIFF(t.EndDate, t.StartDate) * 2000 AS Billing
FROM
    TreatmentHistory t
JOIN patients p ON t.PatientID = p.PatientID
JOIN staff s ON t.DoctorID = s.StaffID;
ALTER TABLE PatientTreatmentReport ADD COLUMN ReportID INT AUTO_INCREMENT PRIMARY KEY;

CREATE TABLE StaffWorkloadGivenDurationReport AS
WITH RECURSIVE DateRange AS (
  SELECT '2024-01-01' AS DayDate 
  UNION ALL
  SELECT DayDate + INTERVAL 1 DAY
  FROM DateRange
  WHERE DayDate + INTERVAL 1 DAY <= '2024-12-31' 
)
SELECT
    s.StaffID,
    CONCAT(s.FirstName, ' ', s.LastName) AS StaffName,
    SUM(TIMESTAMPDIFF(HOUR, ss.StartTime, ss.EndTime)) AS TotalScheduledWorkHours,

    (SELECT COUNT(t.TreatmentID)
     FROM TreatmentHistory t
     WHERE t.DoctorID = s.StaffID
       AND t.StartDate BETWEEN '2024-01-01' AND '2024-12-31') AS TotalTreatments  -- Replace with dynamic startDate and endDate

FROM
    Staff s
JOIN
    Staff_Schedule ss ON s.StaffID = ss.StaffID
JOIN (
    SELECT
        DayDate,
        CASE
            WHEN DAYOFWEEK(DayDate) = 2 THEN 'Monday'
            WHEN DAYOFWEEK(DayDate) = 3 THEN 'Tuesday'
            WHEN DAYOFWEEK(DayDate) = 4 THEN 'Wednesday'
            WHEN DAYOFWEEK(DayDate) = 5 THEN 'Thursday'
            WHEN DAYOFWEEK(DayDate) = 6 THEN 'Friday'
            WHEN DAYOFWEEK(DayDate) = 7 THEN 'Saturday'
            WHEN DAYOFWEEK(DayDate) = 1 THEN 'Sunday'
        END AS DayOfWeek
    FROM
        DateRange
    WHERE DayDate BETWEEN '2024-01-01' AND '2024-12-31'  -- Replace with dynamic startDate and endDate
) AS dr ON ss.DayOfWeek = dr.DayOfWeek

WHERE dr.DayDate BETWEEN '2024-01-01' AND '2024-12-31'  -- Replace with dynamic startDate and endDate

GROUP BY s.StaffID;

ALTER TABLE StaffWorkloadGivenDurationReport ADD COLUMN ReportID INT AUTO_INCREMENT PRIMARY KEY;


CREATE TABLE StaffPerformanceReport AS
SELECT
    s.StaffID,
    concat(s.FirstName, ' ', s.LastName) AS DoctorName,
    s.JobType,
    s.Qualification,
    COUNT(t.TreatmentID) AS TotalTreatments,
    AVG(t.SatisfactionScore) AS AverageSatisfactionScore
FROM
    Staff s
JOIN TreatmentHistory t ON s.StaffID = t.DoctorID
GROUP BY
    s.StaffID;
ALTER TABLE StaffPerformanceReport ADD COLUMN ReportID INT AUTO_INCREMENT PRIMARY KEY;
