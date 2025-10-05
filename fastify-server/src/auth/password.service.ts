import { HashService } from '../utils/hash';
import { ValidationService } from '../utils/validation';
import { EncryptionService } from '../utils/encryption';

export class PasswordService {
  static async hashPassword(password: string): Promise<string> {
    if (!ValidationService.isValidPassword(password)) {
      throw new Error('Password does not meet requirements');
    }
    return HashService.hashPassword(password);
  }

  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return HashService.comparePassword(password, hashedPassword);
  }

  static generateResetToken(): string {
    return EncryptionService.generateRandomToken(32);
  }

  static generateVerificationToken(): string {
    return EncryptionService.generateRandomToken(16);
  }

  static async changePassword(
    currentPassword: string, 
    newPassword: string, 
    hashedCurrentPassword: string
  ): Promise<string> {
    // Verify current password
    const isCurrentPasswordValid = await this.verifyPassword(currentPassword, hashedCurrentPassword);
    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Validate new password
    if (!ValidationService.isValidPassword(newPassword)) {
      throw new Error('New password does not meet requirements');
    }

    // Hash new password
    return this.hashPassword(newPassword);
  }

  static validatePasswordStrength(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
