// uploadEvents.js - Version 3 (Smart Headers)
const fs = require('fs');
const csv = require('csv-parser');
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc, getDocs, writeBatch } = require("firebase/firestore");

// --- 1. PASTE YOUR REAL CONFIG HERE ---
const firebaseConfig = {
  apiKey: "AIzaSyAwupPhd2FFhiByYSVsXIAoLtVZir-kUlY",
  authDomain: "your-surgical-career.firebaseapp.com",
  projectId: "your-surgical-career",
  storageBucket: "your-surgical-career.firebasestorage.app",
  messagingSenderId: "99393292462",
  appId: "1:99393292462:web:c4557249d9b7d92bbb853f",
  measurementId: "G-3GHSPC7QWE"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- HELPER: Delete old events ---
async function clearEventsCollection() {
    console.log("Deleting old events...");
    const collectionRef = collection(db, "events");
    const snapshot = await getDocs(collectionRef);
    
    if (snapshot.size === 0) {
        console.log("Collection is already empty.");
        return;
    }

    const batch = writeBatch(db);
    let counter = 0;
    snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
        counter++;
    });
    await batch.commit();
    console.log(`Deleted ${counter} old events.`);
}

// --- 2. UPLOAD FUNCTION ---
const uploadCSV = async () => {
  await clearEventsCollection(); // Clear db first

  const eventsCollection = collection(db, "events");
  const results = [];

  console.log("Reading events.csv...");

  fs.createReadStream('events.csv')
    .pipe(csv())
    .on('data', (data) => {
        // --- SMART MAPPING ---
        // Checks for New Headers OR Old Headers
        
        const title = data['Event name'] || data['Event'] || "Untitled";
        const organizer = data['Organiser'] || data['Source'] || "Unknown";
        const type = data['Type'] || "General";
        const link = data['Link'] || "#"; // Use link if available
        
        // Date & Location (Use defaults if columns are missing)
        const date = data['Date'] || "TBD";
        const location = data['Location'] || organizer; // Default location to Organizer if missing

        results.push({
            title: title,
            date: date,
            location: location,
            type: type,
            source: organizer,
            link: link,
            category: "Professional Development",
            description: `Organized by ${organizer}`
        });
    })
    .on('end', async () => {
      console.log(`CSV processed. Found ${results.length} events.`);
      
      // Debug: Print first event to check data
      if (results.length > 0) {
          console.log("First event preview:", results[0]); 
      }

      console.log("Starting upload...");

      let count = 0;
      for (const event of results) {
        try {
          await addDoc(eventsCollection, event);
          count++;
          if (count % 50 === 0) console.log(`Uploaded ${count}...`);
        } catch (error) {
          console.error("Error uploading:", event.title, error);
        }
      }
      console.log(`🎉 DONE! Uploaded ${count} events.`);
    });
};

uploadCSV();