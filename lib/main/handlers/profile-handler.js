class ProfileHandler {
    static async ListProfiles(req, res) {
      const userID = req.params.userID;
  
      if (!userID) {
        return res.status(400).json({ error: "Invalid userID" });
      }
  
      try {
        // const userProfiles = await queryDatabase('SELECT * FROM profile WHERE user_id = :userID', { userID });
  
        return res.status(200).json(userProfiles);
      } catch (error) {
        return res.status(500).json({ error: 'An error occurred while listing profiles.' });
      }
    }
  
    static async GetProfile(req, res) {
      const userID = req.params.userID;
  
      if (!userID) {
        return res.status(400).json({ error: "Invalid userID" });
      }
  
      try {
        const userProfiles = await queryDatabase('SELECT * FROM profile WHERE user_id = :userID', { userID });
        const userProfile = getUserProfile(userProfiles, userID);
  
        if (!userProfile) {
          return res.status(404).json({ error: "Profile not found" });
        }
  
        return res.json(userProfile);
      } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
  
    static async CreateProfile(req, res) {
      const { userId, username, height, weight, age, profileId, bmi } = req.body;
  
      if (!userId || !username || !height || !weight || !age || !profileId || !bmi) {
        return res.status(400).json({ error: "Invalid input data" });
      }
  
      try {
        const createdAt = getCurrentTimestamp();
        const userProfile = new Profile(profileId, userId, username, createdAt, height, weight, bmi, age);
  
        saveUserProfileToDatabase(userProfile);
  
        return res.status(201).json(userProfile);
      } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
  
    static async UpdateProfile(req, res) {
      const { userId, profileId, updatedData } = req.body;
  
      if (!userId || !profileId || !updatedData) {
        return res.status(400).json({ error: "Invalid input data" });
      }
  
      try {
        const existingProfile = getProfileFromDatabase(userId, profileId);
  
        if (!existingProfile) {
          return res.status(404).json({ error: "Profile not found" });
        }
  
        const updatedProfile = updateProfileData(existingProfile, updatedData);
        saveUserProfileToDatabase(updatedProfile);
  
        return res.status(200).json(updatedProfile);
      } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
  
    static async DeleteProfile(req, res) {
      const userID = req.params.userID;
  
      if (!userID) {
        return res.status(400).json({ error: "Invalid userID" });
      }
  
      try {
        const success = deleteUserProfile(userID);
  
        if (success) {
          return res.status(200).json({ success: true });
        } else {
          return res.status(404).json({ success: false, message: 'User profile not found' });
        }
      } catch (error) {
        return res.status(500).json({ error: 'An error occurred while deleting the user profile.' });
      }
    }
  }
  
  class Profile {
    constructor(profileId, userId, username, createdAt, height, weight, bmi, age) {
      this.profileId = profileId;
      this.userId = userId;
      this.username = username;
      this.createdAt = createdAt;
      this.height = height;
      this.weight = weight;
      this.bmi = bmi;
      this.age = age;
    }
  }
  
  module.exports = { ProfileHandler};
  