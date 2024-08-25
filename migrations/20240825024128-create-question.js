module.exports = {
  async up(db, client) {
    await db.createCollection('questions', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['text', 'evaluationId'],
          properties: {
            text: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            answers: {
              bsonType: ['array'],
              items: {
                bsonType: 'objectId',
                description: 'must be an objectId and refer to an Answer'
              }
            },
            evaluationId: {
              bsonType: 'objectId',
              description: 'must be an objectId and refer to an Evaluation'
            }
          }
        }
      }
    });
  },

  async down(db, client) {
    await db.collection('questions').drop();
  }
};
