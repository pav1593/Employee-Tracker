INSERT INTO department (name)
VALUES  ('Sales'),
        ('Finance'),
        ('Marketing'),
        ('Manufacturing');


INSERT INTO role (title,salary,department_id)
VALUES  ('VP','50000.00',1),
        ('Manager','30000.00',1),
        ('VP','50000.00',3),
        ('VP','50000.00',4);

INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES  ('Jane','Doe',1,NULL), 
        ('Dave','Smith',2,1);

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;  