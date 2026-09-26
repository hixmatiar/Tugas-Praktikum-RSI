import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: { title: 'Review Kantin API', version: '1.0.0' },
  servers: [{ url: 'http://localhost:3000' }],
  definitions: {
    StallInput: {
      $ownerId: 2,
      $name: 'Warung Baru',
      category: 'Nasi',
      location: 'Kantin FK',
      description: '',
    },
    UserInput: {
      $name: 'John Doe',
      $email: 'john@example.com',
      $passwordHash: 'hashed_password',
      $role: 'customer',
    },
    MenuItemInput: {
      $stallId: 1,
      $name: 'Nasi Goreng',
      $price: 15000,
      $isAvailable: true,
    },
    ReviewInput: {
      $stallId: 1,
      $userId: 1,
      $rating: 5,
      comment: 'Enak sekali!',
    },
    LikeInput: {
      $reviewId: 1,
      $userId: 1,
    },
    FlagInput: {
      $reviewId: 1,
      $reportedBy: 1,
      $reason: 'Spam',
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
