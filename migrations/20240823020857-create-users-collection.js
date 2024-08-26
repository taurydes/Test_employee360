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
              description: 'Debe ser un ObjectId y es requerido'
            },
            username: {
              bsonType: 'string',
              description: 'Debe ser una cadena de texto y es requerido'
            },
            email: {
              bsonType: 'string',
              description: 'Debe ser una cadena de texto y es requerido'
            },
            password: {
              bsonType: 'string',
              description: 'Debe ser una cadena de texto y es requerido'
            },
            role: {
              enum: ['admin', 'manager', 'employee'],
              description: 'Debe ser uno de los roles predefinidos y es requerido'
            },
            createdAt: {
              bsonType: 'date',
              description: 'Debe ser una fecha y es requerido'
            },
            updatedAt: {
              bsonType: 'date',
              description: 'Debe ser una fecha y es requerido'
            }
          }
        }
      }
    });


    await db.collection('users').createIndex({ email: 1 }, { unique: true });
  },

  async down(db, client) {

    await db.collection('users').drop();
  }
};
