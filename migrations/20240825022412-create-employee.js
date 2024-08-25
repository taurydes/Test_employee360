module.exports = {
  async up(db, client) {
    // Crear la colección "employees" con el esquema definido
    await db.createCollection('employees', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['name', 'email', 'role', 'position', 'department', 'startDate'],
          properties: {
            name: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            email: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            role: {
              enum: ['admin', 'manager', 'employee'],
              description: 'can only be one of the enum values and is required'
            },
            position: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            department: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            startDate: {
              bsonType: 'date',
              description: 'must be a date and is required'
            },
            evaluations: {
              bsonType: ['array'],
              items: {
                bsonType: 'objectId',
                description: 'must be an objectId'
              },
              description: 'Array of evaluation IDs'
            }
          }
        }
      }
    });

    // Crear índice único en el campo "email"
    await db.collection('employees').createIndex({ email: 1 }, { unique: true });
  },

  async down(db, client) {
    // Eliminar la colección "employees" en caso de rollback
    await db.collection('employees').drop();
  }
};
