const admin = require('firebase-admin');
require('dotenv').config();

try {
  admin.initializeApp({
    credential: admin.credential.cert({
      type: process.env.TYPE,
      project_id: process.env.PROJECT_ID,
      private_key_id: process.env.PRIVATE_KEY_ID,
      private_key: process.env.PRIVATE_KEY,
      client_email: process.env.CLIENT_EMAIL

      // ... other properties
    }),
    // Add other configuration options if needed
  });

  // Initialize the Firebase Realtime Database or Firestore
  // For example, if using Firestore:
  // const db = admin.firestore();
  

  console.log('Firebase Admin SDK initialized successfully!');
} catch (error) {
  console.error('Error initializing Firebase Admin SDK:', error);
}

module.exports = admin;
