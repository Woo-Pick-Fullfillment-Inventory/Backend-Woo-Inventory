import logger from "../../../modules/create-logger.js";
import { isResponseTypeTrue } from "../../../modules/create-response-type-guard.js";
import {
  type UserAttributeType,
  UserFireStoreSchema,
  type UserFireStoreType,
} from "../models/user.type.js";

// todo: type check
export const getUserFactory = (firestoreClient: FirebaseFirestore.Firestore) => {
  return (userAttribute: UserAttributeType) => {
    return async (value: string): Promise<UserFireStoreType | undefined> => {
      const snapshot = await firestoreClient
        .collection("users")
        .where(userAttribute, "==", value)
        .get();
      if (
        snapshot.empty ||
        !snapshot ||
        !snapshot.docs[0] ||
        !snapshot.docs[0].data()
      ) {
        return undefined;
      }
      const isUserTypeValid = isResponseTypeTrue(
        UserFireStoreSchema,
        snapshot.docs[0].data(),
        true,
      );
      if (!isUserTypeValid.isValid) {
        logger.log(
          "warn",
          `***ERROR*** invalid user response type  ${isUserTypeValid.errorMessage} **Expected** ${JSON.stringify(
            UserFireStoreSchema,
          )} **RECEIVED** ${JSON.stringify(snapshot.docs[0].data())}`,
        );
        throw new Error("User Firestore Type Not Expected");
      }
      return snapshot.docs[0].data() as UserFireStoreType;
    };
  };
};
