const functions = require('firebase-functions');
// Import and initialize the Firebase Admin SDK.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.addWelcomeMessages = functions.auth.user().onCreate((user) => {
  console.log('A new user signed in for the first time.');
  const fullName = user.displayName || 'Anonymous';

  // Saves the new welcome message into the database
  // which then displays it in the FriendlyChat clients.
  return admin.database().ref('messages').push({
    name: 'Lepers Bot',
    photoUrl: '/assets/icons/apple-icon-152x152.png', // Firebase logo
    text: `${fullName} signed in for the first time! Welcome!`
  });
});
