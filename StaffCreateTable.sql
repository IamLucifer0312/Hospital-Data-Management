DROP TABLE IF EXISTS `Staff`, `Department`,`Staff_Schedule`;

CREATE TABLE Department (
    DepartmentID INT PRIMARY KEY AUTO_INCREMENT,
    DepartmentName VARCHAR(50) NOT NULL
);
CREATE TABLE Staff (
    StaffID INT PRIMARY KEY AUTO_INCREMENT,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    JobType VARCHAR(50) NOT NULL,
	Salary DECIMAL(10,2),
    Qualification VARCHAR(100),
    DepartmentID INT,
    ManagerID INT,
    FOREIGN KEY (DepartmentID) REFERENCES Department(DepartmentID),
    FOREIGN KEY (ManagerID) REFERENCES Staff(StaffID)
);
CREATE TABLE Staff_Schedule (
    ScheduleID INT PRIMARY KEY AUTO_INCREMENT,
    StaffID INT NOT NULL,
    WorkingDate DATE NOT NULL,
    StartTime TIME NOT NULL,
    EndTime TIME NOT NULL,
    FOREIGN KEY (StaffID) REFERENCES Staff(StaffID)
);