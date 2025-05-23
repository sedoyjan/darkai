import admin from "firebase-admin";
import { decodeConfig } from "../../utils";

const FIREBASE_CONFIG = process.env.FIREBASE_CONFIG as string;
const firebaseConfig = decodeConfig(FIREBASE_CONFIG);

const config = {
  credential: admin.credential.cert({
    clientEmail: firebaseConfig.client_email,
    privateKey: firebaseConfig.private_key,
    projectId: firebaseConfig.project_id,
  }),
};

export const firebase = admin.apps.length
  ? admin.app()
  : admin.initializeApp(config);

export const validate = async (token: string) => {
  if (!token) {
    throw new Error("No token provided.");
  }
  const decodedToken = await admin.auth().verifyIdToken(token, true);
  return decodedToken;
};

export const sendNotification = async ({
  fcmToken,
  message,
  title,
  data,
}: {
  fcmToken: string;
  title: string;
  message: string;
  data?: any;
}) => {
  await admin.messaging().send({
    token: fcmToken,
    data: data || {},
    apns: {
      headers: {
        "apns-priority": "10",
      },
      payload: {
        aps: {
          sound: "default",
        },
      },
    },
    android: {
      priority: "high",
      notification: {
        sound: "default",
      },
    },
    notification: {
      title,
      body: message,
    },
  });
};
