SELECT DISTINCT
    a.id,
    a.first_name as 'First Name',
    a.last_name as 'Last Name',
    b.title as 'Title',
    b.salary as 'Salary',
    c.name as 'Department',
    IFNULL(CONCAT(d.first_name,' ',d.last_name),
            'null') AS 'Manager'
FROM 
    employee as a 
    JOIN role as b ON a.role_id=b.id
    JOIN department as c ON b.department_id=c.id
    LEFT JOIN employee as d ON a.manager_id=d.id;