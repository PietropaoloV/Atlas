const { Handler } = require("./handler");
const db = require('../util/sqlconnector.js');
const Response = require('../util/response.js'); 
const Exception = require('../util/exceptions.js'); 

class WellnessHandler extends Handler {
  static async handleRequest(req) {
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
            throw new Response.UnsupportedOperationError();
      }
    } catch (error) {
        throw new Response.InternalServerError("Internal Server Error");
    }
  }

  static async CreateWellness(req) {
    const userID = req.params['userID'];

    if (!userID) {
        throw new Response.ResourceNotFoundError("UserID Invalid");
    }

    const { date, mood, stress, sleep, motivation, hydration, soreness } = req.body;

    if (!date || !mood || !stress || !sleep || !motivation || !hydration || !soreness) {
        throw new Response.ValidationError("Bad Request: Missing Fields");
    }

    const ValidMood = ['worst', 'worse', 'normal', 'better', 'best'];
    const ValidStress = ['extreme', 'high', 'moderate', 'mild', 'relaxed'];
    const ValidSleep = ['terrible', 'poor', 'fair', 'good', 'excellent'];
    const ValidMotivation = ['lowest', 'lower', 'normal', 'higher', 'highest'];
    const ValidHydration = ['brown', 'orange', 'yellow', 'light', 'clear'];
    const ValidSoreness = ['severe', 'strong', 'moderate', 'mild', 'none'];

    if (
      !ValidMood.includes(mood) ||
      !ValidStress.includes(stress) ||
      !ValidSleep.includes(sleep) ||
      !ValidMotivation.includes(motivation) ||
      !ValidHydration.includes(hydration) ||
      !ValidSoreness.includes(soreness)
    ) {
        throw new Response.ValidationError("Bad Request: Invalid Mood, Stress, Sleep, Motivation, Hydration, or Soreness");
    }

    try {
        const connection = await db.getConnection();
        const wellness_id = wellness.length +1;
        const query = 'INSERT INTO Wellness (wellness_id, user_id, date, mood, stress, sleep, motivation, hydration, soreness) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        await connection.execute(query,[wellness_id, userID, date, mood, stress, sleep, motivation, hydration, soreness]);
        connection.release();
        return new Response.CompletedResponse(wellness_id, "text/plain");
    } catch (error) {
        throw new Response.InternalServerError("Internal Server Error");
    }
  }

  static async ListWellness(req) {
    const userID = req.param['userID'];
    if (!userID) {
        throw new Response.ResourceNotFoundError("UserID Invalid");
    }
    try {
        const connection = await db.getConnection();
        const query = "SELECT * FROM Wellness WHERE user_id = ${userID}";
        const [wellnessEntries] = await connection.execute(query, [userID]);
        connection.release();

        if (!wellnessEntries || wellnessEntries.length === 0) {
            throw new Response.ResourceNotFoundError("No wellness entries asscoiated with the given userID");
        }
        return new Response.CompletedResponse(wellnessEntries, "application/json");
    } catch (error) {
        throw new Response.InternalServerError("Internal Server Error");
    }
  }

  static async GetWellness(req) {
    const userID = req.params['userID'];
    const wellnessID = req.params['wellnessID'];
    if (!userID || !wellnessID) {
        throw new Response.ResourceNotFoundError("UserID or WellnessID Invalid");
    }
    try {
      const connection = await db.getConnection();
      const query = 'SELECT * FROM Wellness WHERE user_id = ? AND wellness_id = ?';
      const [result] = await connection.execute(query, [userID, wellnessID]);
      connection.release();

      if (!result || result.length === 0) {
        throw new Response.ResourceNotFoundError("Wellness Entry not found");
      }
      if (result[0].user_ID !== parseInt(userID)) {
        throw new Exception.AccessDeniedException("Unauthorized User");
      }
      return new Response.CompletedResponse(result[0], "application/json");
    } catch (error) {
        throw new Response.InternalServerError("Internal Server Error");
    }
  }

  static async UpdateWellness(req) {
    const userID = req.params['userID'];
    const wellnessID = req.params['wellnessID'];
    if (!userID || !wellnessID) {
        throw new Response.ResourceNotFoundError("UserID or WellnessID Invalid");
    }
    try {
      const connection = await db.getConnection();
      const selectQuery = 'SELECT * FROM Wellness WHERE user_id = ? AND wellness_id = ?';
      const [result] = await connection.execute(selectQuery, [userID, wellnessID]);

      if (!result || result.length === 0) {
        throw new Response.ResourceNotFoundError("Wellness Entry not found");
      }
      if (
        result[0].user_id !== parseInt(userID) || result[0].wellness_id !== parseInt(wellnessID)
      ) {
        throw new Exception.AccessDeniedException("Unauthorized User");
      }
      const {newDate, newMood, newStress, newSleep, newMotivation, newHydration, newSoreness} = req.body;

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
      return new Response.CompletedResponse("Update Succesful", "text/plain");
    }catch (error) {
        throw new Response.InternalServerError("Internal Server Error");
    }
  }

  static async DeleteWellness(req) {
    const userID = req.params['userID'];
    const wellnessID = req.params['wellnessID'];
    if (!userID || !wellnessID) {
        throw new Response.ResourceNotFoundError("UserID or WellnessID Invalid");
    }
    try {
        const connection = await db.getConnection();
        const selectQuery = 'SELECT * FROM Wwellness WHERE user_id = ? AND wellness_id = ?';
        const [result] = await connection.execute(selectQuery, [userID, wellnessID]);

        if (!result || result.length === 0) {
            throw new Response.ResourceNotFoundError("Wellness Entry not found");
        }
        if(result[0].user_id !== parseInt(userID) ||result[0].wellness_id !== parseInt(wellnessID)){
            throw new Exception.AccessDeniedException("Unauthorized User");
        }
        const deleteQuery = 'DELETE FROM Wellness WHERE userID = ? AND wellnessID = ?';
        await connection.execute(deleteQuery, [userID, wellnessID]);
        connection.release();
        return new Response.CompletedResponse("Delete Succesful", "text/plain");
    }catch (error) {
        throw new Response.InternalServerError("Internal Server Error");
    }
  }
}

module.exports = {WellnessHandler};
