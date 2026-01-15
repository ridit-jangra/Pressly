import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { app } from "./firebase";
import { AuthService } from "./authService";

export const db = getFirestore(app);

type StorageKey = string;

interface StorageValue<T> {
  data: T;
  timestamp: number;
}

export class Storage {
  private static async getUserId(): Promise<string> {
    const user = await AuthService.getCurrentUser();
    if (!user) {
      return Promise.reject("User not authenticated");
    }
    return user.id;
  }

  private static sanitizeData<T>(data: T): T {
    if (data === null || data === undefined) {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map((item) => this.sanitizeData(item)) as T;
    }

    if (typeof data === "object") {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(data)) {
        if (value !== undefined) {
          sanitized[key] = this.sanitizeData(value);
        }
      }
      return sanitized as T;
    }

    return data;
  }

  static async setItem<T>(
    collectionName: string,
    key: StorageKey,
    value: T
  ): Promise<void> {
    try {
      const studentId = await this.getUserId();

      const sanitizedValue = this.sanitizeData(value);

      const storageValue: StorageValue<T> = {
        data: sanitizedValue,
        timestamp: Date.now(),
      };

      console.log("Storing sanitized data:", sanitizedValue);

      const docRef = doc(db, collectionName, studentId, "items", key);
      await setDoc(docRef, storageValue);
    } catch (e) {
      console.error(`Error storing data in ${collectionName}:`, e);
      throw e;
    }
  }

  static async getItem<T>(
    collectionName: string,
    key: StorageKey,
    defaultValue?: T
  ): Promise<T | null> {
    try {
      const userId = await this.getUserId();
      const docRef = doc(db, collectionName, userId, "items", key);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return defaultValue ?? null;
      }

      const parsed = docSnap.data() as StorageValue<T>;
      return parsed.data;
    } catch (e) {
      console.error(`Error retrieving data from ${collectionName}:`, e);
      return defaultValue ?? null;
    }
  }

  static async removeItem(
    collectionName: string,
    key: StorageKey
  ): Promise<void> {
    try {
      const studentId = await this.getUserId();
      const docRef = doc(db, collectionName, studentId, "items", key);
      await deleteDoc(docRef);
    } catch (e) {
      console.error(`Error removing data from ${collectionName}:`, e);
      throw e;
    }
  }

  static async getUserInfo() {
    return await AuthService.getCurrentUser();
  }
}
