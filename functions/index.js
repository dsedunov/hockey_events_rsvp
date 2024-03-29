const functions = require('firebase-functions');
// Import and initialize the Firebase Admin SDK.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.sendMessageOnCreateEvent = functions.firestore.document('events/{eventName}').onCreate((change,context) => {

  const {gameDay, gameType, where} = change.data() ;

  const date= new Date(gameDay);

  const payload = {
    'notification': {
      'title': `У тебя новая ${gameType}! Откликайся скорее!`,
      'body': `Она состоится ${date.getUTCDate()}/${date.getUTCMonth()+1}/${date.getUTCFullYear()} ${date.getUTCHours()+3}:${date.getUTCMinutes()} ${where}`,
      'icon': 'https://firebasestorage.googleapis.com/v0/b/dc-lepers-4edc7.appspot.com/o/1470760630-removebg-preview.png?alt=media&token=a7fdd83d-ea9d-4e90-b26d-547f6a0a7cc2',
      'vibrate':'[100, 50, 100]',
      'sound': 'default',
      'requireInteraction': 'true',
      'renotify': 'true',
      'click_action' : 'https://dclepers.web.app',
    }
  };

  admin.database()
    .ref('/fcmTokens')
    .once('value')
    .then(snap => {
      const newSnap=[]
      snap.forEach(childSnap => {
        newSnap.push({val: childSnap.val()});
      })

      newSnap.reduce((result,childSnap)=>{
        const token = childSnap.val;
        return result.find(({val}) => val === token)? result : [...result,{val:token}]
      },[])
      .forEach(childSnap => {
        const token = childSnap.val;
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
