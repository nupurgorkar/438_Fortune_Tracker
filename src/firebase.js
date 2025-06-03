// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, orderBy, Timestamp } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDg4obvKv4HhqHYA3jKfOU9oKVYQ0QKDs8",
  authDomain: "fortunetracker-304b7.firebaseapp.com",
  projectId: "fortunetracker-304b7",
  storageBucket: "fortunetracker-304b7.firebasestorage.app",
  messagingSenderId: "44941718551",
  appId: "1:44941718551:web:d828af112557652d3bd852",
  measurementId: "G-C2GST4H0MF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const fortuneCollection = collection(db, "fortunes");

// Function to add a fortune
export const addFortune = async (fortune) => {
  try {
    const fortuneWithTimestamp = {
      ...fortune,
      createdAt: Timestamp.now(),
    };
    const docRef = await addDoc(fortuneCollection, fortuneWithTimestamp);
    console.log("Fortune added with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding fortune: ", e);
    throw e;
  }
};

// Function to get all fortunes
export const getFortunes = async () => {
  try {
    const q = query(fortuneCollection, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (e) {
    console.error("Error getting fortunes: ", e);
    throw e;
  }
};

// Function to delete a fortune
export const deleteFortune = async (fortuneId) => {
  try {
    await deleteDoc(doc(db, "fortunes", fortuneId));
    console.log("Fortune deleted successfully");
  } catch (e) {
    console.error("Error deleting fortune: ", e);
    throw e;
  }
};

// Function to update a fortune
export const updateFortune = async (fortuneId, updatedData) => {
  try {
    const fortuneRef = doc(db, "fortunes", fortuneId);
    await updateDoc(fortuneRef, updatedData);
    console.log("Fortune updated successfully");
  } catch (e) {
    console.error("Error updating fortune: ", e);
    throw e;
  }
};

// Function to update fortune reflection
export const updateFortuneReflection = async (fortuneId, reflection) => {
  try {
    const fortuneRef = doc(db, "fortunes", fortuneId);
    await updateDoc(fortuneRef, {
      reflection: reflection,
      updatedAt: Timestamp.now()
    });
    console.log("Reflection updated successfully");
  } catch (e) {
    console.error("Error updating reflection: ", e);
    throw e;
  }
};

//function to favorite a fortune
export const favoriteFortune = async (fortuneId) => {
  try {
    const fortuneRef = doc(db, "fortunes", fortuneId);
    await updateDoc(fortuneRef, {
      isFavorite: true,
      updatedAt: Timestamp.now()
    });
    console.log("Fortune favorited successfully");
  } catch (e) {
    console.error("Error favoriting fortune: ", e);
    throw e;
  }
};

// Function to add fortune to favorites
export const addToFavorites = async (fortuneId) => {
  try {
    const fortuneRef = doc(db, "fortunes", fortuneId);
    await updateDoc(fortuneRef, {
      isFavorite: true,
      favoritedAt: Timestamp.now()
    });
    console.log("Added to favorites successfully");
  } catch (e) {
    console.error("Error adding to favorites: ", e);
    throw e;
  }
};

// Function to get favorite fortunes
export const getFavoriteFortunes = async () => {
  try {
    const q = query(
      fortuneCollection,
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      .filter(fortune => fortune.isFavorite === true);
  } catch (e) {
    console.error("Error getting favorite fortunes: ", e);
    throw e;
  }
};

// Function to remove fortune from favorites
export const removeFromFavorites = async (fortuneId) => {
  try {
    const fortuneRef = doc(db, "fortunes", fortuneId);
    await updateDoc(fortuneRef, {
      isFavorite: false,
      favoritedAt: null
    });
    console.log("Removed from favorites successfully");
  } catch (e) {
    console.error("Error removing from favorites: ", e);
    throw e;
  }
};

export default db;
