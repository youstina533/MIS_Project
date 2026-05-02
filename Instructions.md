## MongoDB Project



**1**-run the my\_mongo container:



&#x20;                                               **docker restart my\_mongo**



**2**-to see the running containers (in CMD):



&#x20;                                                **docker ps**



**3**-go to VS code and write (line by line):



&#x20;                                                **cd mongodb\_project**



&#x20;                                                **node mongo.js**





**4**-go to the CMD and write (line by line):



&#x20;                                                **docker exec -it my\_mongo mongosh**



&#x20;                                                **use MIS\_DB**





**5**- continue in the CMD and write (all the lines in one time):



**db.enrollments.aggregate(\[**

&#x20; **{**

&#x20;   **$lookup: {**

&#x20;     **from: "students",**

&#x20;     **localField: "student\_id",**

&#x20;     **foreignField: "\_id",**

&#x20;     **as: "student\_info"**

&#x20;   **}**

&#x20; **},**

&#x20; **{**

&#x20;   **$lookup: {**

&#x20;     **from: "courses",**

&#x20;     **localField: "course\_id",**

&#x20;     **foreignField: "\_id",**

&#x20;     **as: "course\_info"**

&#x20;   **}**

&#x20; **},**

&#x20; **{**

&#x20;   **$project: {**

&#x20;     **\_id: 1,**

&#x20;     **student\_info: { $arrayElemAt: \["$student\_info", 0] },**

&#x20;     **course\_info:  { $arrayElemAt: \["$course\_info", 0] }**

&#x20;   **}**

&#x20; **}**

**])**







**6**- continue in the CMD to exit the container:



&#x20;                                                **exit**









## Cassandra Project



**1**-run my\_cassandra container:

&#x20;                                           **docker restart my\_cassandra**





**2**-to see the running containers (in CMD):



&#x20;                                            **docker ps**







**3**-go to VS code and write (line by line) in different Terminal :



&#x20;                                        **cd cassandra\_project**



&#x20;                                        **node cassandra.js**







**4**- go to the CMD and write (line by line):





&#x20;                                      **docker exec -it my\_cassandra cqlsh**



&#x20;                                      **USE mis\_keyspace;**



(if there is an error):

CREATE KEYSPACE IF NOT EXISTS mis\_keyspace

WITH replication = {'class': 'SimpleStrategy', 'replication\_factor': 1};





**5**- continue in the CMD and write (all the lines in one time):





**CREATE TABLE IF NOT EXISTS students (**

&#x20; **department TEXT,**

&#x20; **student\_id INT,**

&#x20; **name       TEXT,**

&#x20; **age        INT,**

&#x20; **grade      TEXT,**

&#x20; **PRIMARY KEY ((department), student\_id)**

**);**







**INSERT INTO students (department, student\_id, name, age, grade) VALUES ('CS', 1, 'Ahmed',  20, 'A');**

**INSERT INTO students (department, student\_id, name, age, grade) VALUES ('CS', 2, 'Sara',   22, 'B');**

**INSERT INTO students (department, student\_id, name, age, grade) VALUES ('CS', 3, 'Omar',   21, 'A');**

**INSERT INTO students (department, student\_id, name, age, grade) VALUES ('IT', 4, 'Layla',  23, 'C');**

**INSERT INTO students (department, student\_id, name, age, grade) VALUES ('IT', 5, 'Khaled', 20, 'B');**







**6**-continue in the same CMD (all lines in one time):



**SELECT \* FROM students**

**WHERE department = 'CS'**

**ORDER BY student\_id DESC;**







**7-** continue in the CMD and write (line by line):



&#x20;                                                **CREATE INDEX ON students (grade);**     (\*\*if there is a error cause it already exist)



&#x20;                                                **SELECT \* FROM students WHERE grade = 'A';**



**8-** continue in the CMD to exit the container:



&#x20;                                                **exit**











## **NEO4J Project**





**1-**Go to Neo4j Desktop and run the instance





**2-** go to VS code and write (line by line):



&#x20;                                                **cd neo4j\_project**



&#x20;                                                **node neo4j.js**





**3-** go to neo4j desktop, to the instance, click at connect dropdown and choose query

&#x20;

&#x20; to the query tab write this commands (line by line) to see the graph and the table:





&#x20;                                             **MATCH (n)-\[r]->(m) RETURN n, r, m**



&#x20;                                             **MATCH (c:Character) WHERE c.house = "Gryffindor" RETURN c**



&#x20;                                             **MATCH (a)-\[r:MENTORS]->(b) RETURN a, r, b**



