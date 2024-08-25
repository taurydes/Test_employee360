module.exports = {
  async up(db, client) {
    await db.createCollection('evaluations', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['period', 'status', 'type'],
          properties: {
            period: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            status: {
              enum: ['pending', 'in_progress', 'completed'],
              description: 'can only be one of the enum values and is required'
            },
            type: {
              enum: ['self', 'peer', 'manager'],
              description: 'can only be one of the enum values and is required'
            },
            questions: {
              bsonType: ['array'],
              items: {
                bsonType: 'objectId',
                description: 'must be an objectId and refer to a Question'
              },
              description: 'Array of question IDs'
            },
            employeeId: {
              bsonType: 'objectId',
              description: 'must be an objectId and refer to an Employee'
            },
            reviewerIds: {
              bsonType: ['array'],
              items: {
                bsonType: 'objectId',
                description: 'must be an objectId and refer to a User who is reviewing'
              },
              description: 'Array of reviewer IDs'
            },
            submittedAt: {
              bsonType: 'date',
              description: 'must be a date and is optional'
            },
            score: {
              bsonType: 'double',
              description: 'Evaluation score, calculated based on answers'
            }
          }
        }
      }
    });

    // Crear índices necesarios, por ejemplo, para las evaluaciones basadas en el estado y el tipo
    await db.collection('evaluations').createIndex({ status: 1 });
    await db.collection('evaluations').createIndex({ type: 1 });
  },

  async down(db, client) {
    // Eliminar la colección de evaluaciones en caso de rollback
    await db.collection('evaluations').drop();
  }
};
