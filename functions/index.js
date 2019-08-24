const functions = require('firebase-functions');
// Import and initialize the Firebase Admin SDK.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.sendMessageOnCreateEvent = functions.firestore.document('events/{eventName}').onCreate((change, context) => {

  const payload = {
    notification: {
      title: 'title',
      body: 'test',
      icon: "https://placeimg.com/250/250/people"
    }
  };

  admin.database()
    .ref('/fcmTokens')
    .once('value')
    .then(snap => {
      snap.forEach(childSnap => {
        const key = childSnap.key;
        const token = childSnap.val();
        admin.messaging().sendToDevice(token, payload)
          .then(res => {
            console.log("Sent Successfully", res);
          })
          .catch(err => {
            console.log(err);
          });
      })
    })
});
