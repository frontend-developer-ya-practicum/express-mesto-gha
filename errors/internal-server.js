class InternalServerError extends Error {
  constructor() {
    super('Internal server error');
    this.name = 'InternalServerError';
    this.statusCode = 400;
  }
}

module.exports = InternalServerError;
