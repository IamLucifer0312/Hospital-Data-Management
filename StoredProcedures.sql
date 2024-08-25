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
		select "Error: Email is not unique" as output_msg;
	else
		insert into Patients (FirstName, LastName, DateOfBirth, Gender, Address, PhoneNum, Email, Allergies)
		values (first_name, last_name, DateOfBirth, Gender, Address, PhoneNum, Email, Allergies);
        select concat("Patient with id `",LAST_INSERT_ID(),"` added successfully") as output_msg;
	end if;
END $$

-- add a new staff
CREATE PROCEDURE sp_add_new_staff(IN first_name VARCHAR(50), IN last_name VARCHAR(50), IN JobType VARCHAR(50), 
	IN Salary INT, IN Qualification VARCHAR(100), IN DepartmentID INT, IN ManagerID INT)
BEGIN
    -- Check if DepartmentID exists in the Department table
	if not exists(SELECT * FROM Department d WHERE d.DepartmentID = DepartmentID) then
		select "Error: Department ID not found" as output_msg;
	-- Check if ManagerID exists in the Staff table
	elseif (not exists(SELECT * FROM Staff s WHERE s.StaffID = ManagerID) and ManagerID is not null) then
		select "Error: Manager ID not found" as output_msg;
	else
		-- insert staff info
		insert into Staff (FirstName, LastName, JobType, Salary, Qualification, DepartmentID, ManagerID)
		values (first_name, last_name, JobType, Salary, Qualification, DepartmentID, ManagerID);
        select concat("Staff with id `",LAST_INSERT_ID(),"` added successfully") as output_msg;
	end if;
END $$

-- add new staff schedule
CREATE PROCEDURE sp_add_new_staff_schedule(IN StaffID INT,
	IN DayOfWeek ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
	IN StartTime TIME, IN EndTime TIME)
BEGIN
	-- Check if Staff ID exists in Staff table
	if not exists(SELECT * FROM Staff s WHERE s.StaffID = StaffID) then
		select "Error: Staff ID not found in Staff table" as output_msg;
	else
        -- insert staff schedule
        insert into Staff_Schedule (StaffID, DayOfWeek, StartTime, EndTime)
        values (StaffID, DayOfWeek, StartTime, EndTime);
        select concat("Staff_Schedule added for Staff with id `",StaffID,"`") as output_msg;
	end if;
END $$

-- add a new treatment history
CREATE PROCEDURE sp_add_new_treatment(IN PatientID INT, IN DoctorID INT, IN StartDate DATE, IN EndDate DATE,
    IN TreatmentType VARCHAR(100), IN BillingAmount INT, IN Status VARCHAR(50), IN Details TEXT)
BEGIN
    -- Check if Patient ID exists in the Patient table
	if not exists(SELECT * FROM Patients p WHERE p.PatientID = PatientID) then
		select "Error: Patient ID not found" as output_msg;
    -- Check if Doctor ID exists in the Staff table
	elseif not exists(SELECT * FROM Staff WHERE StaffID = DoctorID AND lower(JobType) = 'doctor') then
		select "Error: Staff ID not found or Staff is not doctor" as output_msg;
	else
		insert into TreatmentHistory (PatientID,DoctorID,StartDate,EndDate,TreatmentType,BillingAmount,Status,Details)
		values (PatientID,DoctorID,StartDate,EndDate,TreatmentType,BillingAmount,Status,Details);
        select concat("Treatment with id `",LAST_INSERT_ID(),"` added successfully") as output_msg;
	end if;
END $$

-- book an appointment
CREATE PROCEDURE sp_add_new_appointment(IN AppointmentDate DATE, IN AppointmentStartTime TIME, 
IN AppointmentEndTime TIME, IN AppointmentStatus VARCHAR(50), IN Purpose VARCHAR(255), IN PatientID INT, IN StaffID INT)
BEGIN
    -- Check if Patient ID exists in the Patient table
	if not exists(SELECT * FROM Patients p WHERE p.PatientID = PatientID) then
		select "Error: Patient ID not found" as output_msg;
    -- Check if Staff ID exists in the Staff table
	elseif not exists(SELECT * FROM Staff s WHERE s.StaffID = StaffID) then
		select "Error: Staff ID not found" as output_msg;
	else
		insert into Appointments (AppointmentDate,AppointmentStartTime,AppointmentEndTime,AppointmentStatus,Purpose,PatientID,StaffID)
		values (AppointmentDate,AppointmentStartTime,AppointmentEndTime,AppointmentStatus,Purpose,PatientID,StaffID);
        select concat("Treatment with id `",LAST_INSERT_ID(),"` added successfully") as output_msg;
	end if;
END $$

-- update staff schedule
CREATE PROCEDURE sp_update_staff_schedule(IN ScheduleID INT, IN StaffID INT,
	IN DayOfWeek ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
	IN StartTime TIME, IN EndTime TIME)
BEGIN
	-- Check if Schedule ID exists in Staff_Schedule table
	if not exists(SELECT * FROM Staff_Schedule ss WHERE ss.ScheduleID = ScheduleID) then
		select "Error: Schedule ID not found in Staff_Schedule table" as output_msg;
	-- Check if Staff ID exists in Staff table
	elseif not exists(SELECT * FROM Staff s WHERE s.StaffID = StaffID) then
		select "Error: Staff ID not found in Staff table" as output_msg;
	else
		update Staff_Schedule ss
		set ss.StaffID=StaffID, ss.DayOfWeek=DayOfWeek, ss.StartTime=StartTime, ss.EndTime=EndTime
        where ss.ScheduleID = ScheduleID;
        select concat("Staff Schedule with id `",ScheduleID,"` updated successfully") as output_msg;
	end if;
END $$

-- update staff info
CREATE PROCEDURE sp_update_staff(IN StaffID INT, IN first_name VARCHAR(50), IN last_name VARCHAR(50), 
	IN JobType VARCHAR(50), IN Salary INT, IN Qualification VARCHAR(100), IN DepartmentID INT, IN ManagerID INT)
BEGIN
	-- Check if Staff ID exists in Staff table
	if not exists(SELECT * FROM Staff s WHERE s.StaffID = StaffID) then
		select "Error: Staff ID not found in Staff table" as output_msg;
	-- Check if DepartmentID exists in the Department table
	elseif not exists(SELECT * FROM Department d WHERE d.DepartmentID = DepartmentID) then
		select "Error: Department ID not found" as output_msg;
	-- Check if ManagerID exists in the Staff table
	elseif (not exists(SELECT * FROM Staff s WHERE s.StaffID = ManagerID) and ManagerID is not null) then
		select "Error: Manager ID not found" as output_msg;
	else
		update Staff s
		set s.FirstName=first_name, s.LastName=last_name, 
        s.JobType=JobType, s.Salary=Salary, 
        s.Qualification=Qualification, s.DepartmentID=DepartmentID, s.ManagerID=ManagerID
        where s.StaffID = StaffID;
        select concat("Staff with id `",StaffID,"` updated successfully") as output_msg;
	end if;
END $$

-- update patient info
CREATE PROCEDURE sp_update_patient(IN PatientID INT, IN first_name VARCHAR(50), IN last_name VARCHAR(50), 
	IN DateOfBirth DATE, IN Gender VARCHAR(10), IN Address VARCHAR(255), IN PhoneNum VARCHAR(20), 
    IN Email VARCHAR(100), IN Allergies TEXT)
BEGIN
	-- Check if Patient ID exists
	if not exists(SELECT * FROM Patients p WHERE p.PatientID = PatientID) then
		select "Error: Patient ID not found" as output_msg;
	-- Check if updated email unique
	elseif exists(SELECT * FROM Patients p WHERE p.Email = Email AND p.PatientID != PatientID) then
		select "Error: Email is not unique" as output_msg;
	else
		update Patients p
		set FirstName=first_name, LastName=last_name, p.DateOfBirth=DateOfBirth, p.Gender=Gender, 
        p.Address=Address, p.PhoneNum=PhoneNum, p.Email=Email, p.Allergies=Allergies
        where p.PatientID = PatientID;
        select concat("Patient with id `",PatientID,"` updated successfully") as output_msg;
	end if;
END $$

-- update appointment info
CREATE PROCEDURE sp_update_appointment(IN AppointmentID INT, IN AppointmentDate DATE, 
IN AppointmentStartTime TIME, IN AppointmentEndTime TIME, IN AppointmentStatus VARCHAR(50), 
IN Purpose VARCHAR(255), IN PatientID INT, IN StaffID INT)
BEGIN
	-- Check if Appointment ID exists
	if not exists(SELECT * FROM Appointments a WHERE a.AppointmentID = AppointmentID) then
		select "Error: Appointment ID not found" as output_msg;
	-- Check if Patient ID exists in the Patient table
	elseif not exists(SELECT * FROM Patients p WHERE p.PatientID = PatientID) then
		select "Error: Patient ID not found" as output_msg;
    -- Check if Staff ID exists in the Staff table
	elseif not exists(SELECT * FROM Staff s WHERE s.StaffID = StaffID) then
		select "Error: Staff ID not found" as output_msg;
	else
		update Appointments a
		set a.AppointmentDate=AppointmentDate, a.AppointmentStartTime=AppointmentStartTime, 
        a.AppointmentEndTime=AppointmentEndTime, a.AppointmentStatus=AppointmentStatus, 
        a.Purpose=Purpose, a.PatientID=PatientID, a.StaffID=StaffID
        where a.AppointmentID = AppointmentID;
        select concat("Appointment with id `",AppointmentID,"` updated successfully") as output_msg;
	end if;
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
		select "Error: Appointment ID not found" as output_msg;
	end if;
END $$

DELIMITER ;