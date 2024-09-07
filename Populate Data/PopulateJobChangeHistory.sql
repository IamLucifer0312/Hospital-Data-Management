-- Populating JobChangeHistory with old and new job changes for staff
INSERT INTO JobChangeHistory (StaffID, OldJobType, NewJobType, OldSalary, NewSalary, OldDepartmentID, NewDepartmentID, ChangeDate, Reason)
VALUES
-- StaffID 1: Change within the same department but salary increase
(1, 'Doctor', 'Doctor', 110000, 120000, 1, 1, '2024-05-12', 'Salary increase for excellent performance'),
-- StaffID 2: Changed from Nurse to Admin
(2, 'Nurse', 'Admin', 60000, 65000, 1, 1, '2024-03-18', 'Changed job role from Nurse to Admin'),
-- StaffID 3: Department change, same job role
(3, 'Admin', 'Admin', 50000, 52000, 2, 3, '2024-04-25', 'Moved to a new department'),
-- StaffID 4: Change within the same department, salary increase
(4, 'Lab Technician', 'Lab Technician', 45000, 47000, 2, 2, '2024-07-01', 'Salary increase for additional qualifications'),
-- StaffID 5: Promotion from Lab Technician to Surgeon
(5, 'Lab Technician', 'Surgeon', 47000, 130000, 3, 4, '2024-01-19', 'Promotion from Lab Technician to Surgeon'),
-- StaffID 6: Transfer to a new department with salary increase
(6, 'Nurse', 'Nurse', 58000, 62000, 4, 5, '2024-02-10', 'Transferred to Orthopedics department with salary increase'),
-- StaffID 7: Job type change and department change
(7, 'Doctor', 'Surgeon', 115000, 135000, 2, 4, '2024-03-15', 'Changed job role from Doctor to Surgeon and moved to Oncology department'),
-- StaffID 8: Moved to a new department, no salary change
(8, 'Admin', 'Admin', 52000, 52000, 1, 2, '2024-06-12', 'Moved from Cardiology to Neurology with no salary change'),
-- StaffID 9: Promotion with a department change
(9, 'Nurse', 'Doctor', 60000, 120000, 3, 1, '2024-04-05', 'Promoted from Nurse to Doctor and moved to Cardiology'),
-- StaffID 10: Salary increase within the same department
(10, 'Surgeon', 'Surgeon', 130000, 140000, 5, 5, '2024-09-22', 'Salary increase due to high performance')
;
