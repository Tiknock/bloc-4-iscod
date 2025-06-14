const mockingoose = require('mockingoose');

// Configuration globale pour mockingoose
beforeAll(() => {
  // Désactiver les connexions MongoDB réelles
  process.env.NODE_ENV = 'test';
});

beforeEach(() => {
  // Reset tous les mocks avant chaque test
  mockingoose.resetAll();
});

afterAll(() => {
  // Nettoyage final
  mockingoose.resetAll();
}); 