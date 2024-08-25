module.exports = {
  async up(db, client) {
    await db.createCollection('users', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['username', 'email', 'password', 'role'],
          properties: {
            _id: {
              bsonType: 'objectId',
              description: 'must be an ObjectId and is required'
            },
            username: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            email: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            password: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            role: {
              enum: ['admin', 'manager', 'employee'],
              description: 'must be one of the predefined roles and is required'
            },
            createdAt: {
              bsonType: 'date',
              description: 'must be a date and is required'
            },
            updatedAt: {
              bsonType: 'date',
              description: 'must be a date and is required'
            }
          }
        }
      }
    });

    // Crear índice único en el campo "email"
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
  },

  async down(db, client) {
    // Eliminar la colección "users" en caso de rollback
    await db.collection('users').drop();
  }
};
