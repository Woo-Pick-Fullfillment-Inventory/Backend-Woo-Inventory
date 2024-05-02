https://aloa.co/blog/as-a-startup-should-use-firestore-for-my-app

https://www.fullstack.com/labs/resources/blog/mongodb-and-firestore-differences-and-scenarios

firestore offers more complex data structure through nested sub docs and sub col

firestore offers offline support => not a concern in backed app

firestore offers real time db => can only be triggered in client side

=> backed app still needs socket

firestore has document size limit of 1MB => only 20k rows can be written => big problems

=> to overcome you have to shard the document

firestore has index limit of 40k 

=> to overcome you have to shard the document

firestore doesnt support backup

firestore doesnt expand through continents