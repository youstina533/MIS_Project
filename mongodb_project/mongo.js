const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");

    const db = client.db("MIS_DB");

    // ─────────────────────────────────────────────
    // PART 1 - TASK 1: Create 2 collections with 3 docs each
    // ─────────────────────────────────────────────
    const students = db.collection("students");
    const courses = db.collection("courses");

    // Clear old data first (so you can re-run safely)
    await students.deleteMany({});
    await courses.deleteMany({});

    await students.insertMany([
      { _id: 1, name: "Ahmed",   age: 20, grade: "A" },
      { _id: 2, name: "Sara",    age: 22, grade: "B" },
      { _id: 3, name: "Mohamed", age: 21, grade: "C" },
    ]);
    console.log("Students inserted");

    await courses.insertMany([
      { _id: 1, title: "Databases",   credit: 3 },
      { _id: 2, title: "Networking",  credit: 3 },
      { _id: 3, title: "AI Basics",   credit: 2 },
    ]);
    console.log("Courses inserted");

    // ─────────────────────────────────────────────
    // PART 1 - TASK 2: Delete one document from each collection
    // ─────────────────────────────────────────────
    await students.deleteOne({ name: "Mohamed" });
    console.log("Deleted one student");

    await courses.deleteOne({ title: "AI Basics" });
    console.log("Deleted one course");

    // ─────────────────────────────────────────────
    // PART 1 - TASK 3: Update 2 docs in each — add a 'Score' array
    // ─────────────────────────────────────────────
    await students.updateMany(
      { _id: { $in: [1, 2] } },
      { $set: { Score: [10, 20, 30, 40, 50] } }
    );
    console.log("Score array added to students");

    await courses.updateMany(
      { _id: { $in: [1, 2] } },
      { $set: { Score: [10, 20, 30, 40, 50] } }
    );
    console.log("Score array added to courses");

    // ─────────────────────────────────────────────
    // PART 1 - TASK 4:
    // If _id == 1 → put 5 in the 3rd position (index 2)
    // If _id != 1 → put 6 in the 4th position (index 3)
    // ─────────────────────────────────────────────
    await students.updateOne(
      { _id: 1 },
      { $set: { "Score.2": 5 } }
    );
    await students.updateMany(
      { _id: { $ne: 1 } },
      { $set: { "Score.3": 6 } }
    );
    console.log("Score positions updated for students");

    await courses.updateOne(
      { _id: 1 },
      { $set: { "Score.2": 5 } }
    );
    await courses.updateOne(
      { _id: { $ne: 1 } },
      { $set: { "Score.3": 6 } }
    );
    console.log("Score positions updated for courses");

    // ─────────────────────────────────────────────
    // PART 1 - TASK 5: Multiply each element in Score by 20
    // ─────────────────────────────────────────────
    await students.updateMany(
      {},
      { $mul: { "Score.0": 20, "Score.1": 20, "Score.2": 20, "Score.3": 20, "Score.4": 20 } }
    );
    console.log("Score multiplied by 20 for students");

    await courses.updateMany(
      {},
      { $mul: { "Score.0": 20, "Score.1": 20, "Score.2": 20, "Score.3": 20, "Score.4": 20 } }
    );
    console.log("Score multiplied by 20 for courses");

    // ─────────────────────────────────────────────
    // PART 2 - TASK 1: One-to-Many relationship
    // A student can enroll in many courses
    // ─────────────────────────────────────────────
    const enrollments = db.collection("enrollments");
    await enrollments.deleteMany({});

    await enrollments.insertMany([
      { _id: 1, student_id: 1, course_id: 1 },
      { _id: 2, student_id: 1, course_id: 2 },
      { _id: 3, student_id: 2, course_id: 1 },
    ]);
    console.log("Enrollments (One-to-Many) inserted");

    // Print final state of all collections
    console.log("\nFinal Students:");
    console.log(await students.find().toArray());

    console.log("\nFinal Courses:");
    console.log(await courses.find().toArray());

    console.log("\nEnrollments:");
    console.log(await enrollments.find().toArray());

  } finally {
    await client.close();
  }
}

run().catch(console.error);
