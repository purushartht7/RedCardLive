// Firebase Configuration and Fallback Mock Store - Red Card Live World Cup 2026

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, getDoc, getDocs, setDoc, addDoc, deleteDoc, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Placeholders for your Firebase Project Credentials.
// Replace these with your actual Firebase project settings:
const firebaseConfig = {
    apiKey: "AIzaSyC3LDO18UZAxFfCqks2CNuLIRpynw0pTWo",
    authDomain: "redcardlive-74678.firebaseapp.com",
    projectId: "redcardlive-74678",
    storageBucket: "redcardlive-74678.firebasestorage.app",
    messagingSenderId: "606434853340",
    appId: "1:606434853340:web:76fb8c51d475f25d6e8f19",
    measurementId: "G-8N8K5BS2RE"
};

// Check if credentials are still placeholder values
const isPlaceholder = !firebaseConfig.apiKey || firebaseConfig.apiKey.includes("YOUR_");

let app = null;
let db = null;
let auth = null;
let useFirebase = false;

if (!isPlaceholder) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    useFirebase = true;
    console.log("Firebase initialized successfully.");
  } catch (error) {
    console.warn("Failed to initialize Firebase, falling back to Local Mock Store:", error);
    useFirebase = false;
  }
} else {
  console.log("Firebase credentials are placeholder. Using Local Mock Store (localStorage).");
  useFirebase = false;
}

// Set global flags
window.useFirebase = useFirebase;
window.firebaseDb = db;
window.firebaseAuth = auth;

// --- ELEGANT CLIENT-SIDE MOCK STORE IMPLEMENTATION ---
// This acts as a drop-in replacement for Firebase Auth and Firestore if Firebase is not active.
class MockDbStore {
  constructor() {
    this.listeners = {};
    // Listen to localStorage changes across tabs to update UI in real-time
    window.addEventListener('storage', (e) => {
      if (e.key && e.key.startsWith('rc_')) {
        const parts = e.key.split('_');
        const collection = parts[1];
        const docId = parts.slice(2).join('_');
        this.trigger(collection, docId);
      }
    });
  }

  get(collection, docId) {
    const key = `rc_${collection}_${docId}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  set(collection, docId, data) {
    const key = `rc_${collection}_${docId}`;
    const current = this.get(collection, docId) || {};
    const updated = { ...current, ...data, id: docId, lastUpdated: new Date().toISOString() };
    localStorage.setItem(key, JSON.stringify(updated));
    this.trigger(collection, docId);
    return updated;
  }

  delete(collection, docId) {
    const key = `rc_${collection}_${docId}`;
    localStorage.removeItem(key);
    this.trigger(collection, docId);
  }

  getAll(collectionName) {
    const items = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(`rc_${collectionName}_`)) {
        items.push(JSON.parse(localStorage.getItem(key)));
      }
    }
    return items;
  }

  trigger(collection, docId) {
    const path = `${collection}/${docId}`;
    const collectionPath = collection;
    
    // Trigger specific document listeners
    if (this.listeners[path]) {
      const data = this.get(collection, docId);
      this.listeners[path].forEach(cb => cb({
        exists: () => !!data,
        data: () => data,
        id: docId
      }));
    }

    // Trigger collection listeners
    if (this.listeners[collectionPath]) {
      const docs = this.getAll(collection).map(doc => ({
        exists: () => true,
        data: () => doc,
        id: doc.id
      }));
      this.listeners[collectionPath].forEach(cb => cb({
        docs: docs,
        forEach: (iterator) => docs.forEach(iterator)
      }));
    }
  }

  subscribeDoc(collection, docId, callback) {
    const path = `${collection}/${docId}`;
    if (!this.listeners[path]) this.listeners[path] = [];
    this.listeners[path].push(callback);

    // Initial trigger
    const data = this.get(collection, docId);
    callback({
      exists: () => !!data,
      data: () => data,
      id: docId
    });

    // Return unsubscribe function
    return () => {
      this.listeners[path] = this.listeners[path].filter(cb => cb !== callback);
    };
  }

  subscribeCollection(collectionName, callback) {
    const path = collectionName;
    if (!this.listeners[path]) this.listeners[path] = [];
    this.listeners[path].push(callback);

    // Initial trigger
    const docs = this.getAll(collectionName).map(doc => ({
      exists: () => true,
      data: () => doc,
      id: doc.id
    }));
    callback({
      docs: docs,
      forEach: (iterator) => docs.forEach(iterator)
    });

    // Return unsubscribe function
    return () => {
      this.listeners[path] = this.listeners[path].filter(cb => cb !== callback);
    };
  }
}

const mockStore = new MockDbStore();
window.mockStore = mockStore;

// Define Mock Auth State
class MockAuth {
  constructor() {
    this.authStateListeners = [];
    this.currentUser = JSON.parse(localStorage.getItem("rc_current_user")) || null;
  }

  onAuthStateChanged(callback) {
    this.authStateListeners.push(callback);
    callback(this.currentUser);
    return () => {
      this.authStateListeners = this.authStateListeners.filter(cb => cb !== callback);
    };
  }

  async signInWithEmailAndPassword(email, password) {
    let adminKeys = mockStore.get("settings", "admin_credentials");
    if (!adminKeys) {
      adminKeys = {
        email: "admin@redcardlive.com",
        passwordHash: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8" // SHA256 of "password"
      };
      mockStore.set("settings", "admin_credentials", adminKeys);
    }

    const msgUint8 = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const inputHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    if (email === adminKeys.email && inputHash === adminKeys.passwordHash) {
      this.currentUser = { email: email, uid: "mock_admin_uid" };
      localStorage.setItem("rc_current_user", JSON.stringify(this.currentUser));
      this.authStateListeners.forEach(cb => cb(this.currentUser));
      return this.currentUser;
    } else {
      throw new Error("Invalid admin credentials.");
    }
  }

  signOut() {
    this.currentUser = null;
    localStorage.removeItem("rc_current_user");
    this.authStateListeners.forEach(cb => cb(null));
    return Promise.resolve();
  }
}

window.mockAuth = new MockAuth();

// --- UNIFIED API wrapper to call Firestore or Mock Store seamlessly ---
export const dbGetDoc = async (coll, docId) => {
  if (useFirebase) {
    const snapshot = await getDoc(doc(db, coll, docId));
    return snapshot.exists() ? snapshot.data() : null;
  } else {
    return mockStore.get(coll, docId);
  }
};

export const dbSetDoc = async (coll, docId, data) => {
  if (useFirebase) {
    await setDoc(doc(db, coll, docId), data, { merge: true });
    return { id: docId, ...data };
  } else {
    return mockStore.set(coll, docId, data);
  }
};

export const dbAddDoc = async (coll, data) => {
  if (useFirebase) {
    const docRef = await addDoc(collection(db, coll), data);
    return { id: docRef.id, ...data };
  } else {
    const docId = `doc_${Math.random().toString(36).substr(2, 9)}`;
    return mockStore.set(coll, docId, data);
  }
};

export const dbDeleteDoc = async (coll, docId) => {
  if (useFirebase) {
    await deleteDoc(doc(db, coll, docId));
  } else {
    mockStore.delete(coll, docId);
  }
};

export const dbGetDocs = async (collName) => {
  if (useFirebase) {
    const querySnapshot = await getDocs(collection(db, collName));
    const docs = [];
    querySnapshot.forEach(doc => {
      docs.push({ id: doc.id, ...doc.data() });
    });
    return docs;
  } else {
    return mockStore.getAll(collName);
  }
};

export const dbOnSnapshotDoc = (coll, docId, callback) => {
  if (useFirebase) {
    return onSnapshot(doc(db, coll, docId), (snapshot) => {
      callback(snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null);
    });
  } else {
    return mockStore.subscribeDoc(coll, docId, (snapshot) => {
      callback(snapshot.exists() ? snapshot.data() : null);
    });
  }
};

export const dbOnSnapshotCollection = (collName, callback) => {
  if (useFirebase) {
    return onSnapshot(collection(db, collName), (snapshot) => {
      const items = [];
      snapshot.forEach(doc => {
        items.push({ id: doc.id, ...doc.data() });
      });
      callback(items);
    });
  } else {
    return mockStore.subscribeCollection(collName, (snapshot) => {
      const items = [];
      snapshot.forEach(doc => {
        items.push(doc.data());
      });
      callback(items);
    });
  }
};

export const authOnAuthStateChanged = (callback) => {
  if (useFirebase) {
    return onAuthStateChanged(auth, callback);
  } else {
    return window.mockAuth.onAuthStateChanged(callback);
  }
};

export const authSignIn = async (email, password) => {
  if (useFirebase) {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return credential.user;
  } else {
    return window.mockAuth.signInWithEmailAndPassword(email, password);
  }
};

export const authSignOut = async () => {
  if (useFirebase) {
    await signOut(auth);
  } else {
    await window.mockAuth.signOut();
  }
};
