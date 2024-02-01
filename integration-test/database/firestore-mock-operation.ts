type dataType = {
  name: string;
  created: string;
  type: string;
  description: string;
  url: string;
  id: string;
};

export const listItemsFactory = (dbClient: FirebaseFirestore.Firestore) => {
  return async (userId: string): Promise<dataType[]> => {
    const collection = dbClient.collection("test-collection");
    let snapshot;
    if (userId) {
      snapshot = await collection.where("userId", "==", userId).get();
    } else {
      snapshot = await collection.get();
    }

    const result: dataType[] = [];
    snapshot.forEach((doc) => {
      const { name, created, type, description, url } = doc.data();

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
};
