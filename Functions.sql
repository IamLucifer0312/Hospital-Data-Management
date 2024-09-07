drop function if exists getStaffSal;

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


DELIMITER ;