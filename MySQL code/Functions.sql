drop function if exists getStaffSal;
drop function if exists getStaffFullName;
drop function if exists getPatientFullName;
drop function if exists getStaffAvgSatisfactionScore;

DELIMITER $$
CREATE FUNCTION getStaffSal(StaffID INT)
RETURNS INT NOT DETERMINISTIC
READS SQL DATA
BEGIN
	declare sal int;
    
    select StaffSalary into sal
    from Staff s where s.StaffID = StaffID;
	
    return sal;
END $$

CREATE FUNCTION getStaffFullName(StaffID INT)
RETURNS VARCHAR(101) NOT DETERMINISTIC
READS SQL DATA
BEGIN
	declare fullName VARCHAR(101);
    
    select concat(s.FirstName, ' ', s.LastName) into fullName
    from Staff s where s.StaffID = StaffID;
	
    return fullName;
END $$

CREATE FUNCTION getPatientFullName(PatientID INT)
RETURNS VARCHAR(101) NOT DETERMINISTIC
READS SQL DATA
BEGIN
	declare fullName VARCHAR(101);
    
    select concat(p.FirstName, ' ', p.LastName) into fullName
    from Patients p where p.PatientID = PatientID;
	
    return fullName;
END $$

CREATE FUNCTION getStaffAvgSatisfactionScore(StaffID INT)
RETURNS DECIMAL(7,6) NOT DETERMINISTIC
READS SQL DATA
BEGIN
	declare avgScore DECIMAL(7,6);
    
    select AVG(SatisfactionScore) into avgScore
    from TreatmentHistory
    where DoctorID = StaffID
    group by DoctorID;
	
    return avgScore;
END $$

DELIMITER ;