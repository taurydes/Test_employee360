module.exports = {
  async up(db, client) {
    await db.createCollection('answers', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['text', 'type', 'questionId', 'respondentId', 'score'],
          properties: {
            text: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            type: {
              enum: ['text', 'multiple_choice'],
              description: 'can only be one of the enum values and is required'
            },
            questionId: {
              bsonType: 'objectId',
              description: 'must be an objectId and refer to a Question'
            },
            respondentId: {
              bsonType: 'objectId',
              description: 'must be an objectId and refer to an Employee'
            },
            score: {
              bsonType: 'int',
              minimum: 1,
              maximum: 5,
              description: 'must be an integer between 1 and 5 representing the score'
            }
          }
        }
      }
    });
  },

  async down(db, client) {
    await db.collection('answers').drop();
  }
};
