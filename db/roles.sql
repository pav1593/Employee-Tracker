SELECT 
    r.id,
    r.title as 'Title',
    r.salary as 'Salary',
    d.name as 'Department'
FROM
    role as r
    JOIN department as d ON r.department_id=d.id;