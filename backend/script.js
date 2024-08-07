const fs = require('fs');
const { MongoClient } = require('mongodb');


const courses = JSON.parse(fs.readFileSync('courses.json', 'utf8'));


const url = 'mongodb+srv://pratikdhamepawar:FSNDsl9kP5YZPolA@cluster0.shsdb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const dbName = 'coursesDB1';
const collectionName = 'courses';

const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

async function main() {
  try {
    await client.connect();
    console.log('Connected successfully to MongoDB Atlas');

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    await collection.createIndex({ name: 1 });

    const result = await collection.insertMany(courses);
    console.log(`${result.insertedCount} courses were inserted`);

  } catch (err) {
    console.error(err.stack);
  } finally {
    await client.close();
  }
}
main().catch(console.error);
