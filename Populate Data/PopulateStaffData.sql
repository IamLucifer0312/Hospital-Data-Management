INSERT INTO Department (DepartmentName)
VALUES
    ('Cardiology'),
    ('Neurology'),
    ('Pediatrics'),
    ('Oncology'),
    ('Orthopedics');

INSERT INTO Staff (FirstName, LastName, JobType, StaffSalary, Qualification, DepartmentID, ManagerID)
VALUES
    ('Nguyen', 'Van Anh', 'Doctor', 120000, 'MD Cardiology', 1, NULL),
    ('Tran', 'Thi Bao', 'Nurse', 60000, 'BSN', 1, 1),
    ('Le', 'Minh Chau', 'Admin', 50000, 'MBA Healthcare', 1, 1),
    ('Pham', 'Quoc Dung', 'Doctor', 115000, 'MD Neurology', 2, NULL),
    ('Hoang', 'Tuan Kiet', 'Lab Technician', 45000, 'AS Clinical Lab', 2, 4),
    ('Vo', 'Phuong Linh', 'Nurse', 61000, 'BSN', 3, NULL),
    ('Dang', 'Van Manh', 'Surgeon', 130000, 'MS Orthopedics', 4, NULL),
    ('Bui', 'Minh Hoa', 'Doctor', 110000, 'MD Oncology', 4, 7),
    ('Do', 'Quoc Thang', 'Admin', 52000, 'MBA Healthcare', 5, 7),
    ('Ngo', 'Thien Kim', 'Nurse', 58000, 'BSN', 5, 8),

    ('Vu', 'Van Quang', 'Doctor', 122000, 'MD Cardiology', 1, NULL),
    ('Dinh', 'Thi Lan', 'Nurse', 60200, 'BSN', 1, 11),
    ('Phan', 'Minh Long', 'Admin', 50200, 'MBA Healthcare', 1, 11),
    ('Cao', 'Quoc Tuan', 'Doctor', 116000, 'MD Neurology', 2, NULL),
    ('Chu', 'Tuan Anh', 'Lab Technician', 45200, 'AS Clinical Lab', 2, 14),
    ('Ly', 'Phuong Thao', 'Nurse', 61200, 'BSN', 3, NULL),
    ('Tran', 'Van Duc', 'Surgeon', 132000, 'MS Orthopedics', 4, NULL),
    ('Nguyen', 'Minh Khoa', 'Doctor', 112000, 'MD Oncology', 4, 17),
    ('Le', 'Quoc Huy', 'Admin', 52200, 'MBA Healthcare', 5, 17),
    ('Pham', 'Thien Bao', 'Nurse', 58200, 'BSN', 5, 18),

    ('Nguyen', 'Van Phuoc', 'Doctor', 124000, 'MD Cardiology', 1, NULL),
    ('Tran', 'Thi Mai', 'Nurse', 60400, 'BSN', 1, 21),
    ('Le', 'Minh Duy', 'Admin', 50400, 'MBA Healthcare', 1, 21),
    ('Pham', 'Quoc Binh', 'Doctor', 118000, 'MD Neurology', 2, NULL),
    ('Hoang', 'Tuan Long', 'Lab Technician', 45400, 'AS Clinical Lab', 2, 24),
    ('Vo', 'Phuong Nam', 'Nurse', 61400, 'BSN', 3, NULL),
    ('Dang', 'Van Tai', 'Surgeon', 134000, 'MS Orthopedics', 4, NULL),
    ('Bui', 'Minh Tuan', 'Doctor', 114000, 'MD Oncology', 4, 27),
    ('Do', 'Quoc Khanh', 'Admin', 52400, 'MBA Healthcare', 5, 27),
    ('Ngo', 'Thien Thanh', 'Nurse', 58400, 'BSN', 5, 28);
    
    select * from staff;
