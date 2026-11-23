
const { MongoClient } = require('mongodb');

let client;
let db;

async function connectDatabase() {
  if (db) return db;

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is missing');
  }

  client = new MongoClient(process.env.MONGO_URI);

  await client.connect();

  db = client.db(
    process.env.MONGO_DB_NAME || 'smart_medicine'
  );

  await indexes();

  console.log('MongoDB connected:', db.databaseName);

  return db;
}

async function indexes() {
  await db.collection('users').createIndex(
    { email: 1 },
    { unique: true }
  );

  await db.collection('caregiver_patient_links').createIndex(
    { caregiverId: 1, patientId: 1 },
    { unique: true }
  );

  await db.collection('medications').createIndex(
    { patientId: 1, slot: 1 }
  );

  await db.collection('schedules').createIndex(
    { patientId: 1, enabled: 1 }
  );

  // Fixed: removed unsupported $ne operator.
  await db.collection('dose_events').createIndex(
    {
      patientId: 1,
      scheduleId: 1,
      scheduledDateKey: 1
    },
    {
      unique: true,
      partialFilterExpression: {
        scheduleId: { $exists: true }
      }
    }
  );

  await db.collection('dose_events').createIndex(
    { status: 1, scheduledTime: 1 }
  );

  await db.collection('devices').createIndex(
    { deviceId: 1 },
    { unique: true }
  );

  await db.collection('notifications').createIndex(
    { recipientUserId: 1, createdAt: -1 }
  );

  await db.collection('prescriptions').createIndex(
    { patientId: 1, createdAt: -1 }
  );
}

function getDatabase() {
  if (!db) {
    throw new Error('Database is not connected');
  }

  return db;
}

async function closeDatabase() {
  if (client) {
    await client.close();
  }

  client = null;
  db = null;
}

module.exports = {
  connectDatabase,
  getDatabase,
  closeDatabase
};
