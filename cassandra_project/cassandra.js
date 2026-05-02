const cassandra = require("cassandra-driver");

const client = new cassandra.Client({
  contactPoints: ["localhost"],
  localDataCenter: "datacenter1",
});

async function run() {
  await client.connect();
  console.log("Connected to Cassandra!");

  // ─────────────────────────────────────────────
  // Create Keyspace (like a database in Cassandra)
  // ─────────────────────────────────────────────
  await client.execute(`
    CREATE KEYSPACE IF NOT EXISTS mis_keyspace
    WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1}
  `);
  console.log(" Keyspace created");

  await client.execute("USE mis_keyspace");

  // ─────────────────────────────────────────────
  // PART 1 - TASK 1: Create table with composite primary key
  // Composite key = partition key + clustering key
  // ─────────────────────────────────────────────
  await client.execute(`
    CREATE TABLE IF NOT EXISTS students (
      department TEXT,
      student_id INT,
      name       TEXT,
      age        INT,
      grade      TEXT,
      PRIMARY KEY ((department), student_id)
    )
  `);
  console.log("Table created");

  // Clear old data
  await client.execute("TRUNCATE students");

  // ─────────────────────────────────────────────
  // PART 1 - TASK 2: Add at least 5 rows
  // ─────────────────────────────────────────────
  const insertQuery = `
    INSERT INTO students (department, student_id, name, age, grade)
    VALUES (?, ?, ?, ?, ?)
  `;
  await client.execute(insertQuery, ["CS", 1, "Ahmed",   20, "A"], { prepare: true });
  await client.execute(insertQuery, ["CS", 2, "Sara",    22, "B"], { prepare: true });
  await client.execute(insertQuery, ["CS", 3, "Omar",    21, "A"], { prepare: true });
  await client.execute(insertQuery, ["IT", 4, "Layla",   23, "C"], { prepare: true });
  await client.execute(insertQuery, ["IT", 5, "Khaled",  20, "B"], { prepare: true });
  console.log(" 5 rows inserted");

  // ─────────────────────────────────────────────
  // PART 1 - TASK 3: Update a column value
  // ─────────────────────────────────────────────
  await client.execute(`
    UPDATE students SET grade = 'A+'
    WHERE department = 'CS' AND student_id = 2
  `);
  console.log(" Row updated");

  // ─────────────────────────────────────────────
  // PART 1 - TASK 4: Delete a row
  // ─────────────────────────────────────────────
  await client.execute(`
    DELETE FROM students
    WHERE department = 'IT' AND student_id = 5
  `);
  console.log(" Row deleted");

  // Show final table
  const result = await client.execute("SELECT * FROM students");
  console.log("\n Final table:");
  result.rows.forEach(row => console.log(row));

  await client.shutdown();
}

run().catch(console.error);