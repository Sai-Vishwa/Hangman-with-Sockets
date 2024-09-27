const admin  = require('firebase-admin');

const serviceAccount = require('./saivishwa-5001c-firebase-adminsdk-1ccj3-5b6c4f73f5.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = db;