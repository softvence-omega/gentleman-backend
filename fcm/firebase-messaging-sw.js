// firebase-messaging-sw.js
importScripts(
  'https://www.gstatic.com/firebasejs/9.6.11/firebase-app-compat.js',
);
importScripts(
  'https://www.gstatic.com/firebasejs/9.6.11/firebase-messaging-compat.js',
);

firebase.initializeApp({
  apiKey: 'AIzaSyAIscbIXS5LaxCovtPhc82_Kx1swoljV0o',
  authDomain: 'test-73504.firebaseapp.com',
  projectId: 'test-73504',
  storageBucket: 'test-73504.firebasestorage.app',
  messagingSenderId: '1072812350910',
  appId: '1:1072812350910:web:7791995753797f26bf2def',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload,
  );
  // Customize notification
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: '/icon.png',
  });
});
