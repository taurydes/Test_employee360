module.exports = {
  async up(db, client) {
    await db.createCollection('questions', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['text', 'evaluationId'],
          properties: {
            _id: {
              bsonType: 'objectId',
              description: 'Debe ser un ObjectId y es requerido'
            },
            text: {
              bsonType: 'string',
              description: 'Debe ser una cadena de texto y es requerido'
            },
            answers: {
              bsonType: ['array'],
              items: {
                bsonType: 'objectId',
                description: 'Debe ser un ObjectId y referirse a una Respuesta'
              },
              description: 'Array de IDs de respuestas'
            },
            evaluationId: {
              bsonType: 'objectId',
              description: 'Debe ser un ObjectId y referirse a una Evaluación'
            }
          }
        }
      }
    });


    await db.collection('questions').createIndex({ evaluationId: 1 });
  },

  async down(db, client) {
    await db.collection('questions').drop();
  }
};
