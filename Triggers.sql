drop trigger if exists ins_patients;
drop trigger if exists ins_staff;
drop trigger if exists ins_staff_schedule;
drop trigger if exists ins_treatment;
drop trigger if exists ins_appointments;
drop trigger if exists update_staff_schedule;
drop trigger if exists update_staff;
drop trigger if exists update_patients;
drop trigger if exists update_appointments;
drop trigger if exists at_update_staff;
drop trigger if exists at_update_patients;
drop trigger if exists at_update_staff_schedule;
drop trigger if exists at_del_staff;
drop trigger if exists at_del_staff_schedule;
drop trigger if exists log_job_change;

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
	elseif getStaffSal(NEW.ManagerID) <= NEW.salary then
		signal sqlstate '45000' set message_text = "Staff salary should be less than Manager salary";
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
		signal sqlstate '45000' set message_text = "Assigned staff must be a doctor"; 
    end if;
END $$

CREATE TRIGGER ins_appointments
BEFORE INSERT ON Appointments
FOR EACH ROW
BEGIN
    DECLARE staff_jobType VARCHAR(50);
    
    IF NOT EXISTS (SELECT * FROM Patients p WHERE p.PatientID = NEW.PatientID) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Patient ID not found';
    
    ELSEIF NOT EXISTS (SELECT * FROM Staff s WHERE s.StaffID = NEW.StaffID) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Staff ID not found';
    
	-- check appointment date and time match with staff schedule
    ELSEIF NOT EXISTS(
				SELECT * FROM Staff_Schedule ss 
                WHERE ss.StaffID = NEW.StaffID
                AND ss.DayOfWeek = DAYNAME(NEW.AppointmentDate)
				AND (NEW.AppointmentStartTime BETWEEN ss.StartTime AND ss.EndTime)
				AND (NEW.AppointmentEndTime BETWEEN ss.StartTime AND ss.EndTime)
				) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Appointment date time not match with Staff Schedule';
    ELSE
        SELECT JobType INTO staff_jobType FROM Staff WHERE StaffID = NEW.StaffID;
        IF TRIM(LOWER(staff_jobType)) != 'doctor' THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Assigned staff must be a doctor';
        END IF;
    END IF;
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
	elseif getStaffSal(NEW.ManagerID) <= NEW.salary then
		signal sqlstate '45000' set message_text = "Staff salary should be less than Manager salary";
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
    DECLARE staff_jobType VARCHAR(50);
    
    -- Check foreign key exist 
    IF NOT EXISTS (SELECT * FROM Patients p WHERE p.PatientID = NEW.PatientID) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Patient ID not found';
    ELSEIF NOT EXISTS (SELECT * FROM Staff s WHERE s.StaffID = NEW.StaffID) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Staff ID not found';
    
    -- check appointment date and time match with staff schedule
    ELSEIF NOT EXISTS(
				SELECT * FROM Staff_Schedule ss 
                WHERE ss.StaffID = NEW.StaffID
                AND ss.DayOfWeek = DAYNAME(NEW.AppointmentDate)
				AND (NEW.AppointmentStartTime BETWEEN ss.StartTime AND ss.EndTime)
				AND (NEW.AppointmentEndTime BETWEEN ss.StartTime AND ss.EndTime)
				) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Appointment date time not match with Staff Schedule';
    ELSE
        SELECT JobType INTO staff_jobType FROM Staff WHERE StaffID = NEW.StaffID;
        IF TRIM(LOWER(staff_jobType)) != 'doctor' THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Assigned staff must be a doctor';
        END IF;
    END IF;
END $$

CREATE TRIGGER at_update_staff
AFTER UPDATE ON Staff
FOR EACH ROW
BEGIN
	-- update MV PatientTreatmentReport
	if NEW.FirstName != OLD.FirstName or NEW.LastName != OLD.LastName then
		update PatientTreatmentReport ptr
		set DoctorName = concat(NEW.FirstName, ' ', OLD.LastName) 
        where ptr.DoctorID = NEW.StaffID;
    end if;
END $$

CREATE TRIGGER at_update_patients
AFTER UPDATE ON Patients
FOR EACH ROW
BEGIN
	-- update MV PatientTreatmentReport
	if NEW.FirstName != OLD.FirstName or NEW.LastName != OLD.LastName then
		update PatientTreatmentReport ptr 
        set PatientName= concat(NEW.FirstName, ' ', OLD.LastName) 
        where ptr.PatientID = NEW.PatientID;
    end if;
END $$

CREATE TRIGGER at_update_staff_schedule
AFTER UPDATE ON Staff_Schedule
FOR EACH ROW
BEGIN
	-- change appointment status associated with that old staff schedule to 'Cancelled'
    update Appointments a set a.AppointmentStatus = 'Cancelled' 
    where a.StaffID = OLD.StaffID
    and DAYNAME(a.AppointmentDate) = OLD.DayOfWeek
    and (a.AppointmentStartTime BETWEEN OLD.StartTime AND OLD.EndTime)
    and (a.AppointmentEndTime BETWEEN OLD.StartTime AND OLD.EndTime);
    
    -- change
END $$

CREATE TRIGGER at_del_staff
AFTER DELETE ON Staff
FOR EACH ROW
BEGIN
	-- delete staff schedules associated with the deleted staff
    delete from Staff_Schedule ss where OLD.StaffID = ss.StaffID;
END $$

CREATE TRIGGER at_del_staff_schedule
AFTER DELETE ON Staff_Schedule
FOR EACH ROW
BEGIN
	-- change appointment status associated with that staff schedule to 'Cancelled'
    update Appointments a set a.AppointmentStatus = 'Cancelled' 
    where a.StaffID = OLD.StaffID
    and DAYNAME(a.AppointmentDate) = OLD.DayOfWeek
    and (a.AppointmentStartTime BETWEEN OLD.StartTime AND OLD.EndTime)
    and (a.AppointmentEndTime BETWEEN OLD.StartTime AND OLD.EndTime);
END $$

CREATE TRIGGER log_job_change 
BEFORE UPDATE ON Staff 
FOR EACH ROW
BEGIN
    IF OLD.JobType != NEW.JobType OR OLD.Salary != NEW.Salary OR OLD.DepartmentID != NEW.DepartmentID THEN
        INSERT INTO JobChangeHistory (StaffID, JobType, Salary, DepartmentID, ChangeDate)
        VALUES (OLD.StaffID, OLD.JobType, OLD.Salary, OLD.DepartmentID, CURDATE());
    END IF;
END$$

DELIMITER ;
