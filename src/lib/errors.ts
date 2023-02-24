export class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AppError';
  }
}

export class ImportedKeyProfileNotVerifiedError extends AppError {
  constructor(message: string) {
    super(message);
    this.name = 'ImportedKeyProfileNotVerifiedError';
  }
}

export class KeyError extends AppError {
  constructor(message: string) {
    super(message);
    this.name = 'KeyError';
  }
}
