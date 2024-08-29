drop trigger if exists ins_patients;
drop trigger if exists ins_staff;
drop trigger if exists ins_staff_schedule;
drop trigger if exists ins_treatment;
drop trigger if exists ins_appointments;
drop trigger if exists update_staff_schedule;
drop trigger if exists update_staff;
drop trigger if exists update_patients;
drop trigger if exists update_appointments;

DELIMITER $$
CREATE TRIGGER ins_patients
BEFORE INSERT ON Patients
FOR EACH ROW
BEGIN
	-- Check if email unique
	if exists(SELECT * FROM Patients p WHERE NEW.Email = Email) then
        signal sqlstate '45000' set message_text = "Email is not unique";
    end if;
END $$

CREATE TRIGGER ins_staff
BEFORE INSERT ON Staff
FOR EACH ROW
BEGIN
    -- Check if DepartmentID exists in the Department table
	if not exists(SELECT * FROM Department d WHERE d.DepartmentID = NEW.DepartmentID) then
		signal sqlstate '45000' set message_text = "Department ID not found";
	-- Check if ManagerID exists in the Staff table
	elseif (not exists(SELECT * FROM Staff s WHERE s.StaffID = NEW.ManagerID) and NEW.ManagerID is not null) then
		signal sqlstate '45000' set message_text = "Manager ID not found";
    end if;
END $$

CREATE TRIGGER ins_staff_schedule
BEFORE INSERT ON Staff_Schedule
FOR EACH ROW
BEGIN
    -- Check if Staff ID exists in Staff table
    IF NOT EXISTS(SELECT * FROM Staff s WHERE s.StaffID = NEW.StaffID) THEN
        signal sqlstate '45000' set message_text = "Staff ID not found";
    end if;
END $$

CREATE TRIGGER ins_treatment
BEFORE INSERT ON TreatmentHistory
FOR EACH ROW
BEGIN
	declare staff_jobType varchar(50); 
    select JobType into staff_jobType from staff where StaffID = NEW.DoctorID;
    
    -- Check if Patient ID exists in the Patient table
	if not exists(SELECT * FROM Patients p WHERE p.PatientID = NEW.PatientID) then
        signal sqlstate '45000' set message_text = "Patient ID not found";
    -- Check if Doctor ID exists in the Staff table
	elseif not exists(SELECT * FROM Staff WHERE StaffID = NEW.DoctorID) then
		signal sqlstate '45000' set message_text = "Staff ID not found"; 
	elseif trim(lower(staff_jobType)) != 'doctor' then
		signal sqlstate '45000' set message_text = "Staff is not a doctor"; 
    end if;
END $$

CREATE TRIGGER ins_appointments
BEFORE INSERT ON Appointments
FOR EACH ROW
BEGIN
    -- Check if Patient ID exists in the Patient table
	IF NOT EXISTS(SELECT * FROM Patients p WHERE p.PatientID = NEW.PatientID) THEN
		signal sqlstate '45000' set message_text = "Patient ID not found";
    -- Check if Staff ID exists in the Staff table
	ELSEIF NOT EXISTS(SELECT * FROM Staff s WHERE s.StaffID = NEW.StaffID) THEN
		signal sqlstate '45000' set message_text = "Staff ID not found";
    end if;
END $$

CREATE TRIGGER update_staff_schedule
BEFORE UPDATE ON Staff_Schedule
FOR EACH ROW
BEGIN
	-- Check if Staff ID exists in Staff table
	IF NOT EXISTS(SELECT * FROM Staff s WHERE s.StaffID = NEW.StaffID) THEN
		signal sqlstate '45000' set message_text = "Staff ID not found";
    end if;
END $$

CREATE TRIGGER update_staff
BEFORE UPDATE ON Staff
FOR EACH ROW
BEGIN
	-- Check if DepartmentID exists in the Department table
	if not exists(SELECT * FROM Department d WHERE d.DepartmentID = NEW.DepartmentID) then
		signal sqlstate '45000' set message_text = "Department ID not found";
	-- Check if ManagerID exists in the Staff table
	elseif (not exists(SELECT * FROM Staff s WHERE s.StaffID = NEW.ManagerID) and NEW.ManagerID is not null) then
		signal sqlstate '45000' set message_text = "Manager ID not found";
    end if;
END $$

CREATE TRIGGER update_patients
BEFORE UPDATE ON Patients
FOR EACH ROW
BEGIN
	-- Check if updated email unique
	if exists(SELECT * FROM Patients p WHERE p.Email = NEW.Email AND p.PatientID != NEW.PatientID) then
		signal sqlstate '45000' set message_text = "Email is not unique";
    end if;
END $$

CREATE TRIGGER update_appointments
BEFORE UPDATE ON Appointments
FOR EACH ROW
BEGIN
    -- Check if Patient ID exists in the Patient table
	IF NOT EXISTS(SELECT * FROM Patients p WHERE p.PatientID = NEW.PatientID) THEN
		signal sqlstate '45000' set message_text = "Patient ID not found";
    -- Check if Staff ID exists in the Staff table
	ELSEIF NOT EXISTS(SELECT * FROM Staff s WHERE s.StaffID = NEW.StaffID) THEN
		signal sqlstate '45000' set message_text = "Staff ID not found";
    end if;
END $$

-- CREATE TRIGGER del_appointments
-- BEFORE DELETE ON Appointments
-- FOR EACH ROW
-- BEGIN
-- END $$

DELIMITER ;
