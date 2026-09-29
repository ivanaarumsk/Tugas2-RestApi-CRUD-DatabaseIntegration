import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: { title: 'Review Kantin API - Tugas 2', version: '1.0.0' },
  servers: [{ url: 'http://localhost:3000' }],
  definitions: {
    UserInput: {
      $name: 'Bagas Pratama',
      $email: 'bagas2@student.test',
      $passwordHash: 'hash_contoh',
      $role: 'customer',
    },
    StallInput: {
      $ownerId: 2,
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
