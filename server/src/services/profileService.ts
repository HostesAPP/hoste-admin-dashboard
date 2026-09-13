import { findProfileByUserId, upsertProfile } from '../repositories/profileRepository';

export class ProfileService {
  static async getProfile(userId: string) {
    const profile = await findProfileByUserId(userId);
    if (!profile) {
      throw new Error('Profile not found');
    }
    return profile;
  }

  static async updateProfile(userId: string, fullName: string, metadata: any) {
    return upsertProfile(userId, fullName, metadata);
  }
}

export default ProfileService;
