const mysql = require("mysql");

const config = {
  app: {
    port: 8000,
    host: 'localhost'
  },
  db: {
    host: "mysql-3d532cd0-testvapp.a.aivencloud.com", // Replace with your remote database host
    user: "avnadmin", // Replace with your database username
    password: "AVNS_rpXTNpZ2xrc8dNe-ih6", // Replace with your database password
    database: "defaultdb", // Replace with your database name
    port: "20550" // Replace with your database port
  }
};

(async () => {
  console.log('Starting the async function');
  const knex = require('knex')({
    client: 'mysql',
    connection: {
      host: config.db.host,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
      port: config.db.port
    },
  });

  // Define the table schemas
  const tables = [
   ////////////////
   const mysql = require("mysql");

const config = {
  app: {
    port: 8000,
    host: 'localhost'
  },
  db: {
    host: "mysql-3d532cd0-testvapp.a.aivencloud.com", // Replace with your remote database host
    user: "avnadmin", // Replace with your database username
    password: "AVNS_rpXTNpZ2xrc8dNe-ih6", // Replace with your database password
    database: "defaultdb", // Replace with your database name
    port: "20550" // Replace with your database port
  }
};

(async () => {
  console.log('Starting the async function');
  const knex = require('knex')({
    client: 'mysql',
    connection: {
      host: config.db.host,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
      port: config.db.port
    },
  });

  // Define the table schemas for default exercises
  const tables = [
    {
      name: 'pushups',
      schema: (table) => {
        table.increments('userid').primary();
        table.string('name').notNullable().defaultTo('push-ups');
        table.integer('reps').notNullable();
      },
    },
    {
      name: 'situps',
      schema: (table) => {
        table.increments('userid').primary();
        table.string('name').notNullable().defaultTo('sit-ups');
        table.integer('reps').notNullable();
      },
    },
    {
      name: 'jog',
      schema: (table) => {
        table.increments('userid').primary();
        table.string('name').notNullable().defaultTo('jog');
        table.integer('distance').notNullable();
        table.enu('distance_metric', ['feet', 'miles']).notNullable();
      },
    },
  ];

  // Function to create tables
  async function createTables() {
    for (const { name, schema } of tables) {
      // Comment out the creation code
      try {
      await knex.schema.createTable(name, schema);
      } catch (error){
        console.log(error);
      }

      // Uncomment this line to delete the table before creating it
     //await knex.schema.dropTableIfExists(name);

      console.log(`Table ${name} created.`);
    }
  }

  // Function to delete tables (if needed)
  async function deleteTables() {
    for (const { name } of tables) {
      await knex.schema.dropTableIfExists(name);
      console.log(`Table ${name} deleted.`);
    }
  }

  // Function to generate database documentation
  function generateDocumentation() {
    const documentation = tables.map(({ name, schema }) => {
      const tableSchema = knex.schema.createTable(name, schema).toString();
      return `**Table: ${name}**\n\n${tableSchema}`;
    }).join('\n\n');

    console.log(documentation);
  }

  try {
    // Create tables
    await createTables();
   
    // Delete tables (if needed)
    //await deleteTables();

    // Generate database documentation
    generateDocumentation();
  } catch (error) {
    console.error("Error:", error);
  } finally {
    // Close the database connection
    knex.destroy();
  }

  console.log('Exiting the async function');
})();