import { FIRESTORE_ALLOWED_BATCH_SIZE } from "../constants/size.constant.js";
import { firestoreRepository } from "../repository/firestore/index.js";

import type {
  OrdersFirestoreInputType,
  ProductCategoriesFirestoreInputType,
  ProductsFirestoreInputType,
} from "../repository/firestore/index.js";

const writeAllDataToFirestore = async ({
  data,
  usecase,
  userId,
}: {
  data:
    | ProductsFirestoreInputType
    | OrdersFirestoreInputType
    | ProductCategoriesFirestoreInputType;
  usecase: "orders" | "products" | "productCategories";
  userId: string;
}) => {
  let currentChunkIndex = 0;
  const totalChunks = Math.ceil(data.length / FIRESTORE_ALLOWED_BATCH_SIZE);
  // eslint-disable-next-line
  let functionToBeInvoked: Function | null = null;

  switch (usecase) {
    case "orders":
      functionToBeInvoked = firestoreRepository.order.batchWriteOrders;
      break;
    case "products":
      functionToBeInvoked = firestoreRepository.product.batchWriteProducts;
      break;
    case "productCategories":
      functionToBeInvoked =
        firestoreRepository.productCategory.batchWriteProductsCategories;
      break;
    default:
      throw new Error(`Unknown usecase: ${usecase}`);
  }

  if (!functionToBeInvoked) {
    throw new Error("Function to be invoked is not set.");
  }

  while (currentChunkIndex < data.length) {
    const numBatches = Math.min(4, totalChunks - currentChunkIndex);

    if (numBatches === 0) {
      break;
    }

    const promises: Promise<void>[] = [];

    for (let i = 0; i < numBatches; i++) {
      const batchStart = currentChunkIndex * FIRESTORE_ALLOWED_BATCH_SIZE;
      const batchEnd = Math.min(
        batchStart + FIRESTORE_ALLOWED_BATCH_SIZE,
        data.length,
      );

      promises.push(
        functionToBeInvoked(data.slice(batchStart, batchEnd), userId),
      );

      currentChunkIndex += 1;
    }
    await Promise.all(promises);
  }
};

export default writeAllDataToFirestore;
