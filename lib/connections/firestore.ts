import admin from "firebase-admin";

var serviceAccount = JSON.parse(process.env.FIREBASE_CONNECTION);
console.log(serviceAccount);
if (admin.app.length == 1) {
  console.log("todook");
} else {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("data admin", admin.app.length);
}

const firestore = admin.firestore();
export { firestore };
