-- Populating JobChangeHistory with old and new job changes for staff
INSERT INTO JobChangeHistory (StaffID, OldJobType, NewJobType, Salary, DepartmentID, ChangeDate)
VALUES
    -- Nguyen Van Anh (Doctor) - Job type remains, Salary increase
    (1, 'Doctor', 'Doctor', 110000, 1, '2022-01-15'),
    (1, 'Doctor', 'Doctor', 120000, 1, '2023-03-10'),

    -- Tran Thi Bao (Nurse to Admin) - Job type and Salary change
    (2, 'Nurse', 'Admin', 65000, 1, '2023-02-15'),

    -- Le Minh Chau (Admin) - Salary increase
    (3, 'Admin', 'Admin', 48000, 1, '2020-11-22'),
    (3, 'Admin', 'Admin', 50000, 1, '2022-08-12'),

    -- Pham Quoc Dung (Doctor) - Salary increase
    (4, 'Doctor', 'Doctor', 100000, 2, '2021-03-17'),
    (4, 'Doctor', 'Doctor', 115000, 2, '2023-06-01'),

    -- Hoang Tuan Kiet (Lab Technician) - Salary increase
    (5, 'Lab Technician', 'Lab Technician', 42000, 2, '2020-12-10'),
    (5, 'Lab Technician', 'Lab Technician', 45000, 2, '2023-04-25'),

    -- Vo Phuong Linh (Nurse) - Salary increase
    (6, 'Nurse', 'Nurse', 59000, 3, '2022-05-14'),
    (6, 'Nurse', 'Nurse', 61000, 3, '2023-08-18'),

    -- Dang Van Manh (Surgeon) - Salary increase
    (7, 'Surgeon', 'Surgeon', 125000, 4, '2021-07-05'),
    (7, 'Surgeon', 'Surgeon', 130000, 4, '2023-01-20'),

    -- Bui Minh Hoa (Doctor) - Change in department and salary
    (8, 'Doctor', 'Doctor', 102000, 3, '2021-09-12'),
    (8, 'Doctor', 'Doctor', 110000, 4, '2023-03-27'),

    -- Do Quoc Thang (Admin) - Salary increase
    (9, 'Admin', 'Admin', 50000, 5, '2022-02-22'),
    (9, 'Admin', 'Admin', 52000, 5, '2023-05-14'),

    -- Ngo Thien Kim (Nurse to Admin) - Job change from Nurse to Admin and Salary increase
    (10, 'Nurse', 'Admin', 59000, 5, '2023-07-09'),

    -- Vu Van Quang (Doctor) - Salary increase
    (11, 'Doctor', 'Doctor', 115000, 1, '2022-06-14'),
    (11, 'Doctor', 'Doctor', 122000, 1, '2023-08-04'),

    -- Dinh Thi Lan (Nurse) - Salary increase
    (12, 'Nurse', 'Nurse', 59000, 1, '2021-11-18'),
    (12, 'Nurse', 'Nurse', 60200, 1, '2023-03-10'),

    -- Phan Minh Long (Admin) - Salary increase
    (13, 'Admin', 'Admin', 49000, 1, '2020-12-22'),
    (13, 'Admin', 'Admin', 50200, 1, '2022-07-30'),

    -- Cao Quoc Tuan (Doctor) - Salary increase
    (14, 'Doctor', 'Doctor', 110000, 2, '2021-02-12'),
    (14, 'Doctor', 'Doctor', 116000, 2, '2023-05-18'),

    -- Chu Tuan Anh (Lab Technician) - Salary increase
    (15, 'Lab Technician', 'Lab Technician', 44000, 2, '2022-01-25'),
    (15, 'Lab Technician', 'Lab Technician', 45200, 2, '2023-04-12'),

    -- Ly Phuong Thao (Nurse) - Salary increase
    (16, 'Nurse', 'Nurse', 60000, 3, '2021-05-17'),
    (16, 'Nurse', 'Nurse', 61200, 3, '2023-08-24'),

    -- Tran Van Duc (Surgeon) - Salary increase
    (17, 'Surgeon', 'Surgeon', 126000, 4, '2021-09-14'),
    (17, 'Surgeon', 'Surgeon', 132000, 4, '2023-02-18'),

    -- Nguyen Minh Khoa (Doctor) - Change in department and salary
    (18, 'Doctor', 'Doctor', 108000, 3, '2021-07-18'),
    (18, 'Doctor', 'Doctor', 112000, 4, '2023-04-20'),

    -- Le Quoc Huy (Admin) - Salary increase
    (19, 'Admin', 'Admin', 51200, 5, '2022-06-09'),
    (19, 'Admin', 'Admin', 52200, 5, '2023-06-21'),

    -- Pham Thien Bao (Nurse) - Salary increase
    (20, 'Nurse', 'Nurse', 57000, 5, '2021-12-08'),
    (20, 'Nurse', 'Nurse', 58200, 5, '2023-07-19');
