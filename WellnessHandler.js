const {Handler} = require("./handler");
const errorHandler = require('../util/error-handler.js'); 
const {ValidationException, ResourceNotFoundException, AccessDeniedException} = require('../util/error-handler.js');
const {CompletedResponse} = require('../util/response.js');
const db = require('../util/sqlconnector.js');

class WellnessHandler extends Handler {
  static async handle(req) {
    try {
      switch (req.method) {
        case "POST":
          return this.CreateWellness(req);
        case "GET":
          if (req.params['wellnessID']) {
            return this.GetWellness(req);
          } else {
            return this.ListWellness(req);
          }
        case "PUT":
          return this.UpdateWellness(req);
        case "DELETE":
          return this.DeleteWellness(req);
        default:
            throw new UnsupportedOperationError("Invalid HTTP method");
      }
    } catch (error) {
        return errorHandler.handleError(error);
    }
  }

  static async CreateWellness(req) {
    const userID = req.params['userID'];

    if (!userID) {
        throw new ValidationException("UserID Invalid");
    }

    const { date, mood, stress, sleep, motivation, hydration, soreness } = req.body;

    if (!date || !mood || !stress || !sleep || !motivation || !hydration || !soreness) {
        throw new ValidationException("Bad Request: Missing Fields");
    }

    const ValidMood = ['worst', 'worse', 'normal', 'better', 'best'];
    const ValidStress = ['extreme', 'high', 'moderate', 'mild', 'relaxed'];
    const ValidSleep = ['terrible', 'poor', 'fair', 'good', 'excellent'];
    const ValidMotivation = ['lowest', 'lower', 'normal', 'higher', 'highest'];
    const ValidHydration = ['brown', 'orange', 'yellow', 'light', 'clear'];
    const ValidSoreness = ['severe', 'strong', 'moderate', 'mild', 'none'];

    if(
      !ValidMood.includes(mood) ||
      !ValidStress.includes(stress) ||
      !ValidSleep.includes(sleep) ||
      !ValidMotivation.includes(motivation) ||
      !ValidHydration.includes(hydration) ||
      !ValidSoreness.includes(soreness)
    ) {
        throw new ValidationException("Bad Request: Invalid Mood, Stress, Sleep, Motivation, Hydration, or Soreness");
    }

    try {
        const connection = await db.getConnection();
        const wellness_id = wellness.length +1;
        const query = 'INSERT INTO Wellness (wellness_id, user_id, date, mood, stress, sleep, motivation, hydration, soreness) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        await connection.execute(query,[wellness_id, userID, date, mood, stress, sleep, motivation, hydration, soreness]);
        connection.release();
        return new CompletedResponse({newWellnesID: wellness_id}, "application/json");
    } catch (error) {
        return errorHandler.handleError(error);
    }
  }

  static async ListWellness(req) {
    const userID = req.param['userID'];
    if (!userID) {
        throw new ValidationException("UserID Invalid");
    }
    try {
        const connection = await db.getConnection();
        const query = "SELECT * FROM Wellness WHERE user_id = ?";
        const [wellnessEntries] = await connection.execute(query,[userID]);
        connection.release();
        if (!wellnessEntries || wellnessEntries.length === 0) {
            throw new ResourceNotFoundException("No wellness entries asscoiated with the given userID");
        }
        return new CompletedResponse(wellnessEntries, "application/json");
    } catch (error) {
        return errorHandler.handleError(error);
    }
  }

  static async GetWellness(req) {
    const userID = req.params['userID'];
    const wellnessID = req.params['wellnessID'];
    if (!userID || !wellnessID) {
        throw new ValidationException("UserID or WellnessID Invalid");
    }
    try {
      const connection = await db.getConnection();
      const query = 'SELECT * FROM Wellness WHERE user_id = ? AND wellness_id = ?';
      const [result] = await connection.execute(query, [userID, wellnessID]);
      connection.release();
      if (!result || result.length === 0) {
        throw new ResourceNotFoundException("Wellness Entry not found");
      }
      if (result[0].user_ID !== parseInt(userID)) {
        throw new AccessDeniedException("Unauthorized User");
      }
      return new CompletedResponse(result[0], "application/json");
    } catch (error) {
        return errorHandler.handleError(error);
    }
  }

  static async UpdateWellness(req) {
    const userID = req.params['userID'];
    const wellnessID = req.params['wellnessID'];
    if (!userID || !wellnessID) {
        throw new ValidationException("UserID or WellnessID Invalid");
    }
    try {
      const connection = await db.getConnection();
      const selectQuery = 'SELECT * FROM Wellness WHERE user_id = ? AND wellness_id = ?';
      const[result] = await connection.execute(selectQuery, [userID, wellnessID]);

      if (!result || result.length === 0) {
        throw new ResourceNotFoundException("Wellness Entry not found");
      }
      if (result[0].user_id !== parseInt(userID) || result[0].wellness_id !== parseInt(wellnessID)){
        throw new AccessDeniedException("Unauthorized User");
      }
      const{newDate, newMood, newStress, newSleep, newMotivation, newHydration, newSoreness} = req.body;

      if (newDate !== undefined) {
        result.date = newDate;
      }
      if (newMood !== undefined) {
        result.mood = newMood;
      }
      if (newStress !== undefined) {
        result.stress = newStress;
      }
      if (newSleep !== undefined) {
        result.sleep = newSleep;
      }
      if (newMotivation !== undefined) {
        result.motivation = newMotivation;
      }
      if (newHydration !== undefined) {
        result.hydration = newHydration;
      }
      if (newSoreness !== undefined) {
        result.soreness = newSoreness;
      }
      connection.release();
      return new CompletedResponse("Update Succesful", "text/plain");
    }catch (error) {
        return errorHandler.handleError(error);
    }
  }

  static async DeleteWellness(req) {
    const userID = req.params['userID'];
    const wellnessID = req.params['wellnessID'];
    if (!userID || !wellnessID) {
        throw new ValidationException("UserID or WellnessID Invalid");
    }
    try {
        const connection = await db.getConnection();
        const selectQuery = 'SELECT * FROM Wwellness WHERE user_id = ? AND wellness_id = ?';
        const [result] = await connection.execute(selectQuery, [userID, wellnessID]);

        if (!result || result.length === 0) {
            throw new ResourceNotFoundException("Wellness Entry not found");
        }
        if(result[0].user_id !== parseInt(userID) ||result[0].wellness_id !== parseInt(wellnessID)){
            throw new AccessDeniedException("Unauthorized User");
        }
        const deleteQuery = 'DELETE FROM Wellness WHERE userID = ? AND wellnessID = ?';
        await connection.execute(deleteQuery, [userID, wellnessID]);
        connection.release();
        return new CompletedResponse("Delete Succesful", "text/plain");
    }catch (error) {
        return errorHandler.handleError(error);
    }
  }
}

module.exports = {WellnessHandler};
