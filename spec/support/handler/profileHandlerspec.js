const ProfileHandler = require('../../../lib/main/handlers/setHandler.js');
const { spyOn } = require('jasmine');

describe('ProfileHandler', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: (code) => {
        return {
          json: (data) => data, 
        };
      },
    };
  });

  describe('ListProfiles', () => {
    it('should return 400 with invalid userID', async () => {
      req.params = { userID: null }; // Invalid userID

      const result = await ProfileHandler.ListProfiles(req, res);

      expect(result).toEqual({ error: 'Invalid userID' });
    });

    it('should return 500 on database error', async () => {
      spyOn(ProfileHandler, 'queryDatabase').and.throwError('Database error');
      req.params = { userID: 123 }; // Valid userID

      const result = await ProfileHandler.ListProfiles(req, res);

      expect(result).toEqual({ error: 'An error occurred while listing profiles.' });
    });

    it('should return user profiles on success', async () => {
      spyOn(ProfileHandler, 'queryDatabase').and.returnValue([
        { userID: 123, username: 'John' },
        { userID: 456, username: 'Jane' },
      ]);
      req.params = { userID: 123 }; // Valid userID

      const result = await ProfileHandler.ListProfiles(req, res);

      expect(result).toEqual([
        { userID: 123, username: 'John' },
        { userID: 456, username: 'Jane' },
      ]);
    });
  });

  describe('GetProfile', () => {
    it('should return 400 with invalid userID', async () => {
      req.params = { userID: null }; // Invalid userID

      const result = await ProfileHandler.GetProfile(req, res);

      expect(result).toEqual({ error: 'Invalid userID' });
    });

    it('should return 404 if profile not found', async () => {
      spyOn(ProfileHandler, 'queryDatabase').and.returnValue([]);
      req.params = { userID: 123 }; // Valid userID

      const result = await ProfileHandler.GetProfile(req, res);

      expect(result).toEqual({ error: 'Profile not found' });
    });

    it('should return 500 on database error', async () => {
      spyOn(ProfileHandler, 'queryDatabase').and.throwError('Database error');
      req.params = { userID: 123 }; // Valid userID

      const result = await ProfileHandler.GetProfile(req, res);

      expect(result).toEqual({ error: 'Internal Server Error' });
    });

    it('should return user profile on success', async () => {
      spyOn(ProfileHandler, 'queryDatabase').and.returnValue([
        { userID: 123, username: 'John' },
        { userID: 456, username: 'Jane' },
      ]);
      req.params = { userID: 123 }; // Valid userID

      const result = await ProfileHandler.GetProfile(req, res);

      expect(result).toEqual({ userID: 123, username: 'John' });
    });
  });

  describe('CreateProfile', () => {
    it('should return 400 with invalid input data', async () => {
      req.body = {
        userId: 123,
        username: 'JohnDoe',
        height: 175,
        weight: 70,
        age: 30,
        profileId: null, // Invalid profileId
        bmi: 23.5,
      };

      const result = await ProfileHandler.CreateProfile(req, res);

      expect(result).toEqual({ error: 'Invalid input data' });
    });

    it('should return 500 on database error', async () => {
      spyOn(ProfileHandler, 'getCurrentTimestamp').and.throwError('Timestamp error');
      req.body = {
        userId: 123,
        username: 'JohnDoe',
        height: 175,
        weight: 70,
        age: 30,
        profileId: 456,
        bmi: 23.5,
      };

      const result = await ProfileHandler.CreateProfile(req, res);

      expect(result).toEqual({ error: 'Internal Server Error' });
    });

    it('should return user profile on success', async () => {
      spyOn(ProfileHandler, 'getCurrentTimestamp').and.returnValue('2023-10-26T12:00:00Z');
      req.body = {
        userId: 123,
        username: 'JohnDoe',
        height: 175,
        weight: 70,
        age: 30,
        profileId: 456,
        bmi: 23.5,
      };

      const result = await ProfileHandler.CreateProfile(req, res);

      expect(result).toEqual({
        profileId: 456,
        userId: 123,
        username: 'JohnDoe',
        createdAt: '2023-10-26T12:00:00Z',
        height: 175,
        weight: 70,
        bmi: 23.5,
        age: 30,
      });
    });
  });

  describe('UpdateProfile', () => {
    it('should return 400 with invalid input data', async () => {
      req.body = {
        userId: 123,
        profileId: null, // Invalid profileId
        updatedData: {
          username: 'JohnDoe',
          weight: 90,
          bmi: 28.5,
          age: 30,
        },
      };
  
      const result = await ProfileHandler.UpdateProfile(req, res);
  
      expect(result).toEqual({ error: 'Invalid input data' });
    });
  
    it('should return 404 if profile not found', async () => {
      spyOn(ProfileHandler, 'getProfileFromDatabase').and.returnValue(null);
      req.body = {
        userId: 123,
        profileId: 456, // Valid profileId
        updatedData: {
          username: 'JohnDoe',
          weight: 90,
          bmi: 28.5,
          age: 30,
        },
      };
  
      const result = await ProfileHandler.UpdateProfile(req, res);
  
      expect(result).toEqual({ error: 'Profile not found' });
    });
  
    it('should return 500 on database error', async () => {
      spyOn(ProfileHandler, 'updateProfileData').and.throwError('Database error');
      req.body = {
        userId: 123,
        profileId: 456, // Valid profileId
        updatedData: {
          username: 'JohnDoe',
          weight: 90,
          bmi: 28.5,
          age: 30,
        },
      };
  
      const result = await ProfileHandler.UpdateProfile(req, res);
  
      expect(result).toEqual({ error: 'Internal Server Error' });
    });
  
    it('should return updated user profile on success', async () => {
      spyOn(ProfileHandler, 'getProfileFromDatabase').and.returnValue({
        profileId: 456,
        userId: 123,
        username: 'JohnDoe',
        createdAt: '2023-10-26T12:00:00Z',
        height: 175,
        weight: 70,
        bmi: 23.5,
        age: 30,
      });
  
      // Specify what the spy should return when updateProfileData is called
      spyOn(ProfileHandler, 'updateProfileData').and.returnValue({
        profileId: 456,
        userId: 123,
        username: 'UpdatedName',
        createdAt: '2023-10-26T12:00:00Z',
        height: 180,
        weight: 75,
        bmi: 24.0,
        age: 31,
      });
  
      req.body = {
        userId: 123,
        profileId: 456, // Valid profileId
        updatedData: {
          username: 'UpdatedName',
          height: 180,
          weight: 75,
          bmi: 24.0,
          age: 31,
        },
      };
  
      const result = await ProfileHandler.UpdateProfile(req, res);
  
      expect(result).toEqual({
        profileId: 456,
        userId: 123,
        username: 'UpdatedName',
        createdAt: '2023-10-26T12:00:00Z',
        height: 180,
        weight: 75,
        bmi: 24.0,
        age: 31,
      });
    });
  });

  describe('DeleteProfile', () => {
    it('should return 400 with invalid userID', async () => {
      req.params = { userID: null }; // Invalid userID
  
      const result = await ProfileHandler.DeleteProfile(req, res);
  
      expect(result).toEqual({ error: 'Invalid userID' });
    });
  
    it('should return 200 when user profile is successfully deleted', async () => {
      spyOn(ProfileHandler, 'deleteUserProfile').and.returnValue(true);
      req.params = { userID: 'validUserID' }; // Valid userID
  
      const result = await ProfileHandler.DeleteProfile(req, res);
  
      expect(result).toEqual({ success: true });
    });
  
    it('should return 404 when user profile is not found', async () => {
      spyOn(ProfileHandler, 'deleteUserProfile').and.returnValue(false);
      req.params = { userID: 'nonExistentUserID' }; // Non-existent userID
  
      const result = await ProfileHandler.DeleteProfile(req, res);
  
      expect(result).toEqual({ success: false, message: 'User profile not found' });
    });
  
    it('should return 500 on database error', async () => {
      spyOn(ProfileHandler, 'deleteUserProfile').and.throwError('Database error');
      req.params = { userID: 'validUserID' }; // Valid userID
  
      const result = await ProfileHandler.DeleteProfile(req, res);
  
      expect(result).toEqual({ error: 'An error occurred while deleting the user profile.' });
    });
  });
})
