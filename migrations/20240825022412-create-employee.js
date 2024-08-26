module.exports = {
  async up(db, client) {

    await db.createCollection('employees', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['name', 'email', 'role', 'position', 'department', 'startDate'],
          properties: {
            _id: {
              bsonType: 'objectId',
              description: 'Debe ser un ObjectId y es requerido'
            },
            name: {
              bsonType: 'string',
              description: 'Debe ser una cadena de texto y es requerido'
            },
            email: {
              bsonType: 'string',
              description: 'Debe ser una cadena de texto y es requerido'
            },
            role: {
              enum: ['admin', 'manager', 'employee'],
              description: 'Solo puede ser uno de los valores predefinidos y es requerido'
            },
            position: {
              bsonType: 'string',
              description: 'Debe ser una cadena de texto y es requerido'
            },
            department: {
              bsonType: 'string',
              description: 'Debe ser una cadena de texto y es requerido'
            },
            startDate: {
              bsonType: 'date',
              description: 'Debe ser una fecha y es requerido'
            },
            evaluations: {
              bsonType: ['array'],
              items: {
                bsonType: 'objectId',
                description: 'Debe ser un ObjectId y referirse a una Evaluación'
              },
              description: 'Array de IDs de evaluaciones'
            }
          }
        }
      }
    });

    // Crear índice único en el campo "email"
    await db.collection('employees').createIndex({ email: 1 }, { unique: true });
  },

  async down(db, client) {

    await db.collection('employees').drop();
  }
};
