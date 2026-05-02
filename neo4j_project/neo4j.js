const neo4j = require("neo4j-driver");

const driver = neo4j.driver(
  "neo4j://127.0.0.1:7687",
  neo4j.auth.basic("neo4j", "project123")
);
async function run() {
  const session = driver.session();

  try {
    console.log("Connected to Neo4j!");

  
    // Clean up old data first

    await session.run("MATCH (n) DETACH DELETE n");
    console.log("Old data cleared");

  
    // Create graph — nodes, relationships, properties
    // Dataset: Movie character interaction graph

    await session.run(`
      CREATE
        (harry:Character  {name: "Harry Potter",  house: "Gryffindor", age: 17}),
        (hermione:Character {name: "Hermione Granger", house: "Gryffindor", age: 17}),
        (ron:Character    {name: "Ron Weasley",    house: "Gryffindor", age: 17}),
        (draco:Character  {name: "Draco Malfoy",   house: "Slytherin",  age: 17}),
        (dumbledore:Character {name: "Dumbledore", house: "Gryffindor", age: 115}),
        (voldemort:Character  {name: "Voldemort",  house: "Slytherin",  age: 71}),

        (harry)-[:FRIENDS_WITH  {since: "Year 1", strength: 9}]->(ron),
        (harry)-[:FRIENDS_WITH  {since: "Year 1", strength: 10}]->(hermione),
        (ron)-[:FRIENDS_WITH    {since: "Year 1", strength: 8}]->(hermione),
        (harry)-[:ENEMY_OF      {reason: "prophecy"}]->(voldemort),
        (draco)-[:ENEMY_OF      {reason: "rivalry"}]->(harry),
        (dumbledore)-[:MENTORS  {subject: "magic"}]->(harry),
        (voldemort)-[:ENEMY_OF  {reason: "power"}]->(dumbledore)
    `);
    console.log("Graph created with nodes and relationships");

    
    // Delete some nodes and relationships
    
    // Delete a relationship
    await session.run(`
      MATCH (draco:Character {name: "Draco Malfoy"})-[r:ENEMY_OF]->(harry:Character {name: "Harry Potter"})
      DELETE r
    `);
    console.log("Deleted ENEMY_OF relationship between Draco and Harry");

    // Delete a node and all its relationships
    await session.run(`
      MATCH (v:Character {name: "Voldemort"})
      DETACH DELETE v
    `);
    console.log("Deleted Voldemort node");

    // Delete a property from a node
    await session.run(`
      MATCH (d:Character {name: "Draco Malfoy"})
      REMOVE d.house
    `);
    console.log("Removed 'house' property from Draco");

   
    //  Update properties of nodes and relationships
    
    await session.run(`
      MATCH (h:Character {name: "Harry Potter"})
      SET h.age = 18, h.status = "Chosen One"
    `);
    console.log("Updated Harry's properties");

    await session.run(`
      MATCH (h:Character {name: "Harry Potter"})-[r:FRIENDS_WITH]->(ron:Character {name: "Ron Weasley"})
      SET r.strength = 10
    `);
    console.log("Updated friendship strength relationship");

    
    //Find nodes based on a condition
    
    const gryffindorResult = await session.run(`
      MATCH (c:Character)
      WHERE c.house = "Gryffindor"
      RETURN c.name AS name, c.age AS age, c.house AS house
    `);
    console.log("\n Characters in Gryffindor:");
    gryffindorResult.records.forEach(r =>
      console.log(`  - ${r.get("name")}, Age: ${r.get("age")}, House: ${r.get("house")}`)
    );

   
    // TASK 5: Find relationships based on a condition
    
    const friendshipResult = await session.run(`
      MATCH (a:Character)-[r:FRIENDS_WITH]->(b:Character)
      WHERE r.strength >= 9
      RETURN a.name AS from, b.name AS to, r.strength AS strength, r.since AS since
    `);
    console.log("\nStrong Friendships (strength >= 9):");
    friendshipResult.records.forEach(r =>
      console.log(`  - ${r.get("from")} → ${r.get("to")} | Strength: ${r.get("strength")} | Since: ${r.get("since")}`)
    );

  } finally {
    await session.close();
    await driver.close();
  }
}

run().catch(console.error);