import {
    collection,
    getDocs,
} from "firebase/firestore";

import { db } from "./config";

export async function getSubscriptions() {
    const snapshot = await getDocs(
    collection(db, "suscripciones")
    );

    return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    }));
}