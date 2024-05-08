mongodb has 16mb limit per document

One-to-One - Prefer key value pairs within the document
One-to-Few - Prefer embedding
One-to-Many - Prefer embedding
One-to-Squillions - Prefer Referencing
Many-to-Many - Prefer Referencing

Rule 1: Favor embedding unless there is a compelling reason not to.
Rule 2: Needing to access an object on its own is a compelling reason not to embed it.
Rule 3: Avoid joins and lookups if possible, but don't be afraid if they can provide a better schema design.
Rule 4: Arrays should not grow without bound. If there are more than a couple of hundred documents on the many side, don't embed them; if there are more than a few thousand documents on the many side, don't use an array of ObjectID references. High-cardinality arrays are a compelling reason not to embed.
Rule 5: As always, with MongoDB, how you model your data depends entirely on your particular application's data access patterns. You want to structure your data to match the ways that your application queries and updates it.

MongoDB Atlas makes it simple to vertically scale up or down as needed. You can even enable auto-scaling so your available resources always meet your needs.

upsert = update + insert

bulkWrite vs initialize(Un)orderedBulkOp

- bulkWrite executes immidiately 
- it doesnt fit when you have complex business logic and want to make change to your input array

1000 writes are allowed in a single batch operation, defined by a single request to the server.

64 indexes per collection

Use find().upsert().updateOne() When Updating or Upserting: If you need to update existing documents or add new ones if they don't exist, this approach is best. It ensures that each document with a specific ID is unique and updated if already present.

Use bulk.insert() for New Insertions Only: If you're sure that the documents you're inserting don't conflict with existing ones (i.e., there's no risk of duplicates), this method can be used for bulk insertion.


Write Command Batch Limit Size
100,000 writes are allowed in a single batch operation, defined by a single request to the server.

Changed in version 3.6: The limit raises from 1,000 to 100,000 writes. This limit also applies to legacy OP_INSERT messages.

The Bulk() operations in mongosh and comparable methods in the drivers do not have this limit.

