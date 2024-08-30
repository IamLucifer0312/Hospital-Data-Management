-- Stored Procedures
-- only check the validity of IDs (primary keys and foreign keys), and the unique characteristic of fields
-- (basically any validity check requires the data from the database)
-- other types of validity check should be done in the backend API

drop procedure if exists sp_add_new_patient;
drop procedure if exists sp_add_new_staff;
drop procedure if exists sp_add_new_staff_schedule;
drop procedure if exists sp_add_new_treatment;
drop procedure if exists sp_add_new_appointment;
drop procedure if exists sp_update_staff_schedule;
drop procedure if exists sp_update_staff;
drop procedure if exists sp_update_patient;
drop procedure if exists sp_update_appointment;
drop procedure if exists sp_delete_staff;
drop procedure if exists sp_delete_patient;
drop procedure if exists sp_delete_staff_schedule;
drop procedure if exists sp_delete_appointment;
drop procedure if exists sp_delete_treatment;
DELIMITER $$
-- add a new patient
CREATE PROCEDURE sp_add_new_patient(IN first_name VARCHAR(50), IN last_name VARCHAR(50), IN DateOfBirth DATE,
    IN Gender VARCHAR(10), IN Address VARCHAR(255), IN PhoneNum VARCHAR(20), IN Email VARCHAR(100), 
    IN Allergies TEXT)
BEGIN
	insert into Patients (FirstName, LastName, DateOfBirth, Gender, Address, PhoneNum, Email, Allergies)
	values (first_name, last_name, DateOfBirth, Gender, Address, PhoneNum, Email, Allergies);
	select * from Patients where PatientID = LAST_INSERT_ID();
END $$

-- add a new staff
CREATE PROCEDURE sp_add_new_staff(IN first_name VARCHAR(50), IN last_name VARCHAR(50), IN JobType VARCHAR(50), 
	IN Salary INT, IN Qualification VARCHAR(100), IN DepartmentID INT, IN ManagerID INT)
BEGIN
	-- insert staff info
	insert into Staff (FirstName, LastName, JobType, Salary, Qualification, DepartmentID, ManagerID)
	values (first_name, last_name, JobType, Salary, Qualification, DepartmentID, ManagerID);
	select * from staff where StaffID = LAST_INSERT_ID();
END $$

-- add new staff schedule
CREATE PROCEDURE sp_add_new_staff_schedule(
	IN p_StaffID INT,
	IN p_DayOfWeek ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
	IN p_StartTime TIME, 
	IN p_EndTime TIME)
BEGIN
    START TRANSACTION;
	-- Insert staff schedule
	INSERT INTO Staff_Schedule (StaffID, DayOfWeek, StartTime, EndTime)
	VALUES (p_StaffID, p_DayOfWeek, p_StartTime, p_EndTime);

	-- Check if insert was successful
	IF ROW_COUNT() > 0 THEN
		COMMIT;
		select * from Staff_Schedule where ScheduleID = LAST_INSERT_ID();
	ELSE
		ROLLBACK;
		signal sqlstate '45000' set message_text = "Failed to add staff schedule";
	END IF;
END $$

-- add a new treatment history
CREATE PROCEDURE sp_add_new_treatment(IN PatientID INT, IN DoctorID INT, IN StartDate DATE, IN EndDate DATE,
    IN TreatmentType VARCHAR(100), IN BillingAmount INT, IN Status VARCHAR(50), IN Details TEXT)
BEGIN
	insert into TreatmentHistory (PatientID,DoctorID,StartDate,EndDate,TreatmentType,BillingAmount,Status,Details)
	values (PatientID,DoctorID,StartDate,EndDate,TreatmentType,BillingAmount,Status,Details);
	select * from TreatmentHistory where TreatmentID = LAST_INSERT_ID();
END $$

-- book an appointment
CREATE PROCEDURE sp_add_new_appointment(
	IN p_AppointmentDate DATE, 
	IN p_AppointmentStartTime TIME, 
	IN p_AppointmentEndTime TIME, 
	IN p_AppointmentStatus VARCHAR(50), 
	IN p_Purpose VARCHAR(255), 
	IN p_PatientID INT, 
	IN p_StaffID INT
)
BEGIN
	DECLARE overlap_count INT DEFAULT 0;

	-- Start transaction
	START TRANSACTION;
	-- Check for overlapping appointments
	SELECT COUNT(*) INTO overlap_count
	FROM Appointments
	WHERE StaffID = p_StaffID
		AND AppointmentDate = p_AppointmentDate
		AND ((p_AppointmentStartTime BETWEEN AppointmentStartTime AND AppointmentEndTime)
			OR (p_AppointmentEndTime BETWEEN AppointmentStartTime AND AppointmentEndTime)
			OR (AppointmentStartTime BETWEEN p_AppointmentStartTime AND p_AppointmentEndTime)
			OR (AppointmentEndTime BETWEEN p_AppointmentStartTime AND p_AppointmentEndTime));

	-- If no overlap, insert the appointment
	IF overlap_count = 0 THEN
		INSERT INTO Appointments (AppointmentDate, AppointmentStartTime, AppointmentEndTime, AppointmentStatus, Purpose, PatientID, StaffID)
		VALUES (p_AppointmentDate, p_AppointmentStartTime, p_AppointmentEndTime, 'Scheduled', p_Purpose, p_PatientID, p_StaffID);
		COMMIT; -- Commit transaction
		select * from Appointments where AppointmentID = LAST_INSERT_ID();

	-- If there is no overlap, rollback
	ELSE	
		ROLLBACK; -- Rollback transaction if there is an overlap
		signal sqlstate '45000' set message_text = "Appointment overlaps with existing appointment";
	END IF;	
END $$

-- update patient info
CREATE PROCEDURE sp_update_patient(IN PatientID INT, IN first_name VARCHAR(50), IN last_name VARCHAR(50), 
	IN DateOfBirth DATE, IN Gender VARCHAR(10), IN Address VARCHAR(255), IN PhoneNum VARCHAR(20), 
    IN Email VARCHAR(100), IN Allergies TEXT)
BEGIN
	update Patients p
	set FirstName=first_name, LastName=last_name, p.DateOfBirth=DateOfBirth, p.Gender=Gender, 
	p.Address=Address, p.PhoneNum=PhoneNum, p.Email=Email, p.Allergies=Allergies
	where p.PatientID = PatientID;
	
	-- no rows affected -> error msg
	if row_count() = 0 then
		signal sqlstate '45000' set message_text = "Patient ID not found";
	else
		select * from Patients p where p.PatientID = PatientID;
	end if;
END $$

-- update staff info
CREATE PROCEDURE sp_update_staff(IN StaffID INT, IN first_name VARCHAR(50), IN last_name VARCHAR(50), 
	IN JobType VARCHAR(50), IN Salary INT, IN Qualification VARCHAR(100), IN DepartmentID INT, IN ManagerID INT)
BEGIN
	update Staff s
	set s.FirstName=first_name, s.LastName=last_name, 
	s.JobType=JobType, s.Salary=Salary, 
	s.Qualification=Qualification, s.DepartmentID=DepartmentID, s.ManagerID=ManagerID
	where s.StaffID = StaffID;
    
	-- no rows affected -> error msg
	if row_count() = 0 then
		signal sqlstate '45000' set message_text = "Staff ID not found";
	else
		select * from Staff s where s.StaffID = StaffID;
	end if;
END $$

-- update staff schedule
CREATE PROCEDURE sp_update_staff_schedule(
	IN p_ScheduleID INT, 
	IN p_StaffID INT,
	IN p_DayOfWeek ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
	IN p_StartTime TIME, 
	IN p_EndTime TIME)
BEGIN
	DECLARE conflict_count INT DEFAULT 0;

	-- Start transaction
	START TRANSACTION;
	-- Check for conflicts with exisiting appointments
	SELECT COUNT(*) INTO conflict_count
	FROM Appointment a
	WHERE a.StaffID = p_StaffID
		AND a.AppointmentStatus = 'Scheduled'
		AND a.AppointmentDate = (SELECT CURDATE() + INTERVAL (
				CASE p_DayOfWeek
					WHEN 'Monday' THEN 0
					WHEN 'Tuesday' THEN 1
					WHEN 'Wednesday' THEN 2
					WHEN 'Thursday' THEN 3
					WHEN 'Friday' THEN 4
					WHEN 'Saturday' THEN 5
					WHEN 'Sunday' THEN 6	
				END		
			) DAY)
		AND ((a.AppointmentStartTime BETWEEN p_StartTime AND p_EndTime)
			OR (a.AppointmentEndTime BETWEEN p_StartTime AND p_EndTime)
			OR (a.AppointmentStartTime <= p_StartTime AND a.AppointmentEndTime >= p_EndTime));

	-- If there are no conflicts, update the schedule
	IF conflict_count = 0  THEN
		UPDATE Staff_Schedule ss
		SET ss.StaffID = p_StaffID, ss.DayOfWeek = p_DayOfWeek, ss.StartTime = p_StartTime, ss.EndTime = p_EndTime
		WHERE ss.ScheduleID = p_ScheduleID;
		COMMIT;
		-- no rows affected after update -> schedule ID not found
		if row_count() = 0 then
			signal sqlstate '45000' set message_text = "Schedule ID not found";
		else
			select * from Staff_Schedule where ScheduleID = p_ScheduleID;
		end if;

	-- If there is a conflict, rollback
	ELSE	
		ROLLBACK;
		signal sqlstate '45000' set message_text = "The new schedule conflicts with existing scheduled appointments";
	END IF;	
END $$

-- update appointment info
CREATE PROCEDURE sp_update_appointment(
	IN p_AppointmentID INT, 
	IN p_AppointmentDate DATE, 
	IN p_AppointmentStartTime TIME, 
	IN p_AppointmentEndTime TIME, 
	IN p_AppointmentStatus VARCHAR(50), 
	IN p_Purpose VARCHAR(255), 
	IN p_PatientID INT, 
	IN p_StaffID INT)
BEGIN
    DECLARE conflict_count INT DEFAULT 0;
    START TRANSACTION;
    
    -- Check for appointment conflicts for the same doctor
	SELECT COUNT(*) INTO conflict_count
	FROM Appointments a
	WHERE a.StaffID = p_StaffID
	  AND a.AppointmentDate = p_AppointmentDate
	  AND a.AppointmentID != p_AppointmentID  -- Exclude the appointment being updated
	  AND ((a.AppointmentStartTime < p_AppointmentEndTime AND a.AppointmentEndTime > p_AppointmentStartTime));

	-- If no conflicts, update the appointment
	IF conflict_count = 0 THEN
		UPDATE Appointments a
		SET a.AppointmentDate = p_AppointmentDate, 
			a.AppointmentStartTime = p_AppointmentStartTime, 
			a.AppointmentEndTime = p_AppointmentEndTime, 
			a.AppointmentStatus = p_AppointmentStatus, 
			a.Purpose = p_Purpose, 
			a.PatientID = p_PatientID, 
			a.StaffID = p_StaffID
		WHERE a.AppointmentID = p_AppointmentID;
		COMMIT;
		-- no rows affected after update -> Appointment ID not found
		if row_count() = 0 then
			signal sqlstate '45000' set message_text = "Appointment ID not found";
		else
			select * from Appointments a where a.AppointmentID = p_AppointmentID;
		end if;
		
	-- If there is a conflict, rollback
	ELSE
		ROLLBACK; 
		signal sqlstate '45000' set message_text = "The updated appointment time conflicts with another appointment for the same staff member";
	END IF;
END $$

-- delete a staff
CREATE PROCEDURE sp_delete_staff(IN StaffID INT)
BEGIN
	delete from staff s where s.StaffID = StaffID;
    -- no rows affected -> error msg
	if row_count() = 0 then
        signal sqlstate '45000' set message_text = "Staff ID not found";
	end if;
END $$

-- delete a patient
CREATE PROCEDURE sp_delete_patient(IN PatientID INT)
BEGIN
	delete from Patients p where p.PatientID = PatientID;
    -- no rows affected -> error msg
	if row_count() = 0 then
        signal sqlstate '45000' set message_text = "Patient ID not found";
	end if;
END $$

-- delete a staff schedule
CREATE PROCEDURE sp_delete_staff_schedule(IN ScheduleID INT)
BEGIN
	delete from Staff_Schedule ss where ss.ScheduleID = ScheduleID;
    -- no rows affected -> error msg
	if row_count() = 0 then
        signal sqlstate '45000' set message_text = "Schedule ID not found";
	end if;
END $$

-- delete an appointment
CREATE PROCEDURE sp_delete_appointment(IN AppointmentID INT)
BEGIN
	delete from Appointments a where a.AppointmentID = AppointmentID;
    -- not exists -> error msg
	if row_count() = 0 then
        signal sqlstate '45000' set message_text = "Appointment ID not found";
	end if;
END $$

-- delete an treatment history
CREATE PROCEDURE sp_delete_treatment(IN TreatmentID INT)
BEGIN
	delete from TreatmentHistory t where t.TreatmentID = TreatmentID;
    -- not exists -> error msg
	if row_count() = 0 then
        signal sqlstate '45000' set message_text = "Treatment ID not found";
	end if;
END $$

DELIMITER ;