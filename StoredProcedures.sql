-- Stored Procedures
-- only check the validity of IDs (primary keys and foreign keys), and the unique characteristic of fields
-- (basically any validity check requires the data from the database)
-- other types of validity check should be done in the backend API

DELIMITER $$
-- add a new patient
CREATE PROCEDURE sp_add_new_patient(IN first_name VARCHAR(50), IN last_name VARCHAR(50), IN DateOfBirth DATE,
    IN Gender VARCHAR(10), IN Address VARCHAR(255), IN PhoneNum VARCHAR(20), IN Email VARCHAR(100), 
    IN Allergies TEXT)
BEGIN
	-- Check if email unique
	if exists(SELECT * FROM Patients p WHERE p.Email = Email) then
        signal sqlstate '45000' set message_text = "Email is not unique";
	else
		insert into Patients (FirstName, LastName, DateOfBirth, Gender, Address, PhoneNum, Email, Allergies)
		values (first_name, last_name, DateOfBirth, Gender, Address, PhoneNum, Email, Allergies);
        select * from Patients where PatientID = LAST_INSERT_ID();
	end if;
END $$

-- add a new staff
CREATE PROCEDURE sp_add_new_staff(IN first_name VARCHAR(50), IN last_name VARCHAR(50), IN JobType VARCHAR(50), 
	IN Salary INT, IN Qualification VARCHAR(100), IN DepartmentID INT, IN ManagerID INT)
BEGIN
    -- Check if DepartmentID exists in the Department table
	if not exists(SELECT * FROM Department d WHERE d.DepartmentID = DepartmentID) then
		signal sqlstate '45000' set message_text = "Department ID not found";
	-- Check if ManagerID exists in the Staff table
	elseif (not exists(SELECT * FROM Staff s WHERE s.StaffID = ManagerID) and ManagerID is not null) then
		signal sqlstate '45000' set message_text = "Manager ID not found";
	else
		-- insert staff info
		insert into Staff (FirstName, LastName, JobType, Salary, Qualification, DepartmentID, ManagerID)
		values (first_name, last_name, JobType, Salary, Qualification, DepartmentID, ManagerID);
        select * from staff where StaffID = LAST_INSERT_ID();
	end if;
END $$

-- add new staff schedule
CREATE PROCEDURE sp_add_new_staff_schedule(
	IN p_StaffID INT,
	IN p_DayOfWeek ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
	IN p_StartTime TIME, 
	IN p_EndTime TIME)
BEGIN
    START TRANSACTION;

    -- Check if Staff ID exists in Staff table
    IF NOT EXISTS(SELECT * FROM Staff s WHERE s.StaffID = p_StaffID) THEN
        ROLLBACK;
        signal sqlstate '45000' set message_text = "Staff ID not found";

    ELSE
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
    END IF;
END $$

-- add a new treatment history
CREATE PROCEDURE sp_add_new_treatment(IN PatientID INT, IN DoctorID INT, IN StartDate DATE, IN EndDate DATE,
    IN TreatmentType VARCHAR(100), IN BillingAmount INT, IN Status VARCHAR(50), IN Details TEXT)
BEGIN
    -- Check if Patient ID exists in the Patient table
	if not exists(SELECT * FROM Patients p WHERE p.PatientID = PatientID) then
        signal sqlstate '45000' set message_text = "Patient ID not found";
    -- Check if Doctor ID exists in the Staff table
	elseif not exists(SELECT * FROM Staff WHERE StaffID = DoctorID AND lower(JobType) = 'doctor') then
        -- STAFF DOCTOR CHECK SHOULD BE DONE IN TRIGGER
		signal sqlstate '45000' set message_text = "Staff ID not found or Staff is not doctor"; 
	else
		insert into TreatmentHistory (PatientID,DoctorID,StartDate,EndDate,TreatmentType,BillingAmount,Status,Details)
		values (PatientID,DoctorID,StartDate,EndDate,TreatmentType,BillingAmount,Status,Details);
        select * from TreatmentHistory where TreatmentID = LAST_INSERT_ID();
	end if;
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

    -- Check if Patient ID exists in the Patient table
	IF NOT EXISTS(SELECT * FROM Patients p WHERE p.PatientID = p_PatientID) THEN
		ROLLBACK; -- Rollback transaction if Patient ID does not exist
		signal sqlstate '45000' set message_text = "Patient ID not found";
    -- Check if Staff ID exists in the Staff table
	ELSEIF NOT EXISTS(SELECT * FROM Staff s WHERE s.StaffID = p_StaffID) THEN
		ROLLBACK; -- Rollback transaction if Staff ID does not exist
		signal sqlstate '45000' set message_text = "Staff ID not found";

	-- Check for overlapping appointments
	ELSE
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
	END IF;
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

	-- Check if Schedule ID exists in Staff_Schedule table
	IF NOT EXISTS(SELECT * FROM Staff_Schedule ss WHERE ss.ScheduleID = p_ScheduleID) THEN
		ROLLBACK;
		signal sqlstate '45000' set message_text = "Schedule ID not found";

	-- Check if Staff ID exists in Staff table
	ELSEIF NOT EXISTS(SELECT * FROM Staff s WHERE s.StaffID = p_StaffID) THEN
		ROLLBACK;
		signal sqlstate '45000' set message_text = "Staff ID not found";

	-- Check for confliects with exisiting appointments
	ELSE
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
			select * from Staff_Schedule where ScheduleID = p_ScheduleID;

		-- If there is a conflict, rollback
		ELSE	
			ROLLBACK;
			signal sqlstate '45000' set message_text = "The new schedule conflicts with existing scheduled appointments";
        END IF;	
	END IF;
END $$

-- update staff info
CREATE PROCEDURE sp_update_staff(IN StaffID INT, IN first_name VARCHAR(50), IN last_name VARCHAR(50), 
	IN JobType VARCHAR(50), IN Salary INT, IN Qualification VARCHAR(100), IN DepartmentID INT, IN ManagerID INT)
BEGIN
	-- Check if Staff ID exists in Staff table
	if not exists(SELECT * FROM Staff s WHERE s.StaffID = StaffID) then
		signal sqlstate '45000' set message_text = "Staff ID not found";

	-- Check if DepartmentID exists in the Department table
	elseif not exists(SELECT * FROM Department d WHERE d.DepartmentID = DepartmentID) then
		signal sqlstate '45000' set message_text = "Department ID not found";

	-- Check if ManagerID exists in the Staff table
	elseif (not exists(SELECT * FROM Staff s WHERE s.StaffID = ManagerID) and ManagerID is not null) then
		signal sqlstate '45000' set message_text = "Manager ID not found";
	else
		update Staff s
		set s.FirstName=first_name, s.LastName=last_name, 
        s.JobType=JobType, s.Salary=Salary, 
        s.Qualification=Qualification, s.DepartmentID=DepartmentID, s.ManagerID=ManagerID
        where s.StaffID = StaffID;
		select * from Staff s where s.StaffID = StaffID;
	end if;
END $$

-- update patient info
CREATE PROCEDURE sp_update_patient(IN PatientID INT, IN first_name VARCHAR(50), IN last_name VARCHAR(50), 
	IN DateOfBirth DATE, IN Gender VARCHAR(10), IN Address VARCHAR(255), IN PhoneNum VARCHAR(20), 
    IN Email VARCHAR(100), IN Allergies TEXT)
BEGIN
	-- Check if Patient ID exists
	if not exists(SELECT * FROM Patients p WHERE p.PatientID = PatientID) then
		signal sqlstate '45000' set message_text = "Patient ID not found";
	-- Check if updated email unique
	elseif exists(SELECT * FROM Patients p WHERE p.Email = Email AND p.PatientID != PatientID) then
		signal sqlstate '45000' set message_text = "Email is not unique";
	else
		update Patients p
		set FirstName=first_name, LastName=last_name, p.DateOfBirth=DateOfBirth, p.Gender=Gender, 
        p.Address=Address, p.PhoneNum=PhoneNum, p.Email=Email, p.Allergies=Allergies
        where p.PatientID = PatientID;
		select * from Patients p where p.PatientID = PatientID;
	end if;
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
    
    -- Check if Appointment ID exists
    IF NOT EXISTS (SELECT * FROM Appointments a WHERE a.AppointmentID = p_AppointmentID) THEN
        ROLLBACK;
        signal sqlstate '45000' set message_text = "Appointment ID not found";

    -- Check if Patient ID exists in the Patients table
    ELSEIF NOT EXISTS (SELECT * FROM Patients p WHERE p.PatientID = p_PatientID) THEN
        ROLLBACK; 
        signal sqlstate '45000' set message_text = "Patient ID not found";

    -- Check if Staff ID exists in the Staff table
    ELSEIF NOT EXISTS (SELECT * FROM Staff s WHERE s.StaffID = p_StaffID) THEN
        ROLLBACK;
        signal sqlstate '45000' set message_text = "Staff ID not found";

    -- Check for appointment conflicts for the same doctor
    ELSE
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
			select * from Appointments a where a.AppointmentID = p_AppointmentID;
            
        -- If there is a conflict, rollback
        ELSE
            ROLLBACK; 
			signal sqlstate '45000' set message_text = "The updated appointment time conflicts with another appointment for the same staff member";
        END IF;
    END IF;
END $$

-- cancel an appointment
CREATE PROCEDURE sp_delete_appointment(IN AppointmentID INT)
BEGIN
    -- Check if Appointment ID exists -> delete appointment
	if exists(SELECT * FROM Appointments a WHERE a.AppointmentID = AppointmentID) then
		delete from Appointments a where a.AppointmentID = AppointmentID;
		select concat("Appointment with id `",AppointmentID,"` deleted successfully") as output_msg;
    -- not exists -> error msg
	else
        signal sqlstate '45000' set message_text = "Appointment ID not found";
	end if;
END $$

DELIMITER ;