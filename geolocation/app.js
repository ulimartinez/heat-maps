// ADD THIS PART TO YOUR CODE
const CosmosClient = require('@azure/cosmos').CosmosClient;

const config = require('./config');

const endpoint = config.endpoint;
const key = config.key;

const client = new CosmosClient({ endpoint, key });

const HttpStatusCodes = { NOTFOUND: 404 };

const databaseId = config.database.id;
const containerId = config.container.id;
const partitionKey = { kind: "Hash", paths: ["/Country"] };

/**
 * Create the database if it does not exist
 */
async function createDatabase() {
    const { database } = await client.databases.createIfNotExists({ id: databaseId });
    console.log(`Created database:\n${database.id}\n`);
}

/**
* Read the database definition
*/
async function readDatabase() {
   const { resource: databaseDefinition } = await client.database(databaseId).read();
   console.log(`Reading database:\n${databaseDefinition.id}\n`);
}

/**
* Create the container if it does not exist
*/

async function createContainer() {

 const { container } = await client.database(databaseId).containers.createIfNotExists({ id: containerId, partitionKey }, { offerThroughput: 400 });
 console.log(`Created container:\n${config.container.id}\n`);
}

/**
 * Read the container definition
*/
async function readContainer() {
   const { resource: containerDefinition } = await client.database(databaseId).container(containerId).read();
 console.log(`Reading container:\n${containerDefinition.id}\n`);
}

/**
* Create family item
*/
async function createFamilyItem(itemBody) {
   const { item } = await client.database(databaseId).container(containerId).items.upsert(itemBody);
   console.log(`Created family item with id:\n${itemBody.id}\n`);
};

async function replaceFamilyItem(itemBody) {
   console.log(`Replacing item:\n${itemBody.id}\n`);
   // Change property 'grade'
   itemBody.children[0].grade = 6;
  const { item } = await client.database(databaseId).container(containerId).item(itemBody.id, itemBody.Country).replace(itemBody);
};

async function deleteFamilyItem(itemBody) {
  await client.database(databaseId).container(containerId).item(itemBody.id, itemBody.Country).delete(itemBody);
   console.log(`Deleted item:\n${itemBody.id}\n`);
};

async function cleanup() {
  await client.database(databaseId).delete();
}

/**
* Query the container using SQL
 */
async function queryContainer() {
  console.log(`Querying container:\n${config.container.id}`);

  // query to return all children in a family
  const querySpec = {
     query: "SELECT VALUE r.children FROM root r WHERE r.lastName = @lastName",
     parameters: [
         {
             name: "@lastName",
             value: "Andersen"
         }
     ]
 };


 const { resources } = await client.database(databaseId).container(containerId).items.query(querySpec, {enableCrossPartitionQuery:true}).fetchAll();
 for (var queryResult of resources) {
     let resultString = JSON.stringify(queryResult);
     console.log(`\tQuery returned ${resultString}\n`);
 }
};

// ADD THIS PART TO YOUR CODE
function exit(message) {
   console.log(message);
   console.log('Press any key to exit');
   process.stdin.setRawMode(true);
   process.stdin.resume();
   process.stdin.on('data', process.exit.bind(process, 0));
};

createDatabase()
  .then(() => readDatabase())
  .then(() => createContainer())
  .then(() => readContainer())
  .then(() => createFamilyItem(config.items.Andersen))
  .then(() => createFamilyItem(config.items.Wakefield))
  .then(() => queryContainer())
  .then(() => replaceFamilyItem(config.items.Andersen))
  .then(() => queryContainer())
  // .then(() => deleteFamilyItem(config.items.Andersen))
  // .then(() => queryContainer())
  // .then(() => cleanup())
  .then(() => { exit(`Completed successfully`); })
  .catch((error) => { exit(`Completed with error \${JSON.stringify(error)}`) });
