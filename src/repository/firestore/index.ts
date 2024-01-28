import admin from "firebase-admin";

let db: FirebaseFirestore.Firestore;

if (process.env["NODE_ENV"] !== "test") {
  db = admin.firestore();
}

const getDb = () => {
  return db;
};

const setDb = (database: FirebaseFirestore.Firestore) => {
  db = database;
};

type dataType = {
  name: string;
  created: string;
  type: string;
  description: string;
  url: string;
  id: string;
};

const listItems = async (userId: string): Promise<dataType[]> => {
  const collection = db.collection("test-collection");
  let snapshot;
  if (userId) {
    snapshot = await collection.where("userId", "==", userId).get();
  } else {
    snapshot = await collection.get();
  }

  const result: dataType[] = [];
  snapshot.forEach((doc) => {
    const {
      name,
      created,
      type,
      description,
      url,
    } = doc.data();

    result.push({
      name,
      created,
      type,
      description,
      url,
      id: doc.id,
    });
  });
  return result;
};

export {
  getDb,
  setDb,
  listItems,
};