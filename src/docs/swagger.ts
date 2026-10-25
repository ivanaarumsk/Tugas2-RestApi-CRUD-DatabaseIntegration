import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: { title: 'Review Kantin API - Tugas 3', version: '1.0.0' },
  securityDefinitions: {
    bearerAuth: { type: 'apiKey', in: 'header', name: 'Authorization', description: 'Isi: Bearer <token>' },
  },
  servers: [{ url: 'http://localhost:3000' }],
  definitions: {
    RegisterInput: {
      $name: 'Ivana Chen',
      $email: 'ivana@student.test',
      $password: 'rahasia123',
    },

    LoginInput: {
      $email: 'admin@kantin.test',
      $password: 'rahasia123',
    },

    UserInput: {
      $name: 'Bagas Pratama',
      $email: 'bagas2@student.test',
      $passwordHash: 'hash_contoh',
      $role: 'customer',
    },
    StallInput: {
      ReviewCreateInput: { $rating: 5, comment: 'Enak banget' },
      $name: 'Warung Baru',
      category: 'Nasi',
      location: 'Kantin FK',
      description: '',
    },
    MenuItemInput: {
      $stallId: 1,
      $name: 'Menu Baru',
      $price: 15000,
      isAvailable: true,
    },
    ReviewInput: {
      $stallId: 1,
      $userId: 12,
      $rating: 5,
      comment: 'Enak banget',
    },
    LikeInput: {
      $reviewId: 1,
      $userId: 13,
    },
    FlagStatusInput: {
      $status: 'resolved',
    },
    AuditLogInput: {
      $userId: 1,
      $action: 'CREATE',
      $targetTable: 'STALLS',
      $targetId: 1,
      metadata: '{}',
    },
  },
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./src/index.ts'];

swaggerAutogen()(outputFile, endpointsFiles, doc);
