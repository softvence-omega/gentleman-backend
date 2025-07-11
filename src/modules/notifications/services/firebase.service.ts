import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as serviceAccount from "../json/firebase.json"


@Injectable()
export class FirebaseService implements OnModuleInit {
onModuleInit() {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
            clientEmail: serviceAccount.client_email,
            privateKey: serviceAccount.private_key,
            projectId: serviceAccount.project_id
        } as admin.ServiceAccount),
        projectId: serviceAccount.project_id,
      });
    }
  }

  getMessaging(): admin.messaging.Messaging {
    return admin.messaging();
  }
}