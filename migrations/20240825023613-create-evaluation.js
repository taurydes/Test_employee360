module.exports = {
  async up(db, client) {
    await db.createCollection('evaluations', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['period', 'status', 'type'],
          properties: {
            _id: {
              bsonType: 'objectId',
              description: 'Debe ser un ObjectId y es requerido'
            },
            period: {
              bsonType: 'string',
              description: 'Debe ser una cadena de texto y es requerido'
            },
            status: {
              enum: ['pending', 'in_progress', 'completed'],
              description: 'Solo puede ser uno de los valores predefinidos y es requerido'
            },
            type: {
              enum: ['self', 'peer', 'manager'],
              description: 'Solo puede ser uno de los valores predefinidos y es requerido'
            },
            questions: {
              bsonType: ['array'],
              items: {
                bsonType: 'objectId',
                description: 'Debe ser un ObjectId y referirse a una Pregunta'
              },
              description: 'Array de IDs de preguntas'
            },
            employeeId: {
              bsonType: 'objectId',
              description: 'Debe ser un ObjectId y referirse a un Empleado'
            },
            reviewerIds: {
              bsonType: ['array'],
              items: {
                bsonType: 'objectId',
                description: 'Debe ser un ObjectId y referirse a un Usuario que está revisando'
              },
              description: 'Array de IDs de revisores'
            },
            submittedAt: {
              bsonType: 'date',
              description: 'Debe ser una fecha y es opcional'
            },
            score: {
              bsonType: 'double',
              description: 'Puntuación de la evaluación, calculada en base a las respuestas'
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
