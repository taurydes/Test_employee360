module.exports = {
  async up(db, client) {
    await db.createCollection('answers', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['questionId', 'respondentId', 'score'],
          properties: {
            _id: {
              bsonType: 'objectId',
              description: 'Debe ser un ObjectId y es requerido'
            },
            questionId: {
              bsonType: 'objectId',
              description: 'Debe ser un ObjectId y referirse a una Pregunta'
            },
            respondentId: {
              bsonType: 'objectId',
              description: 'Debe ser un ObjectId y referirse a un Usuario'
            },
            score: {
              bsonType: 'int',
              minimum: 1,
              maximum: 5,
              description: 'Debe ser un número entero entre 1 y 5 representando la puntuación'
            }
          }
        }
      }
    });


    await db.collection('answers').createIndex({ questionId: 1 });

    await db.collection('answers').createIndex({ respondentId: 1 });
  },

  async down(db, client) {
    await db.collection('answers').drop();
  }
};
