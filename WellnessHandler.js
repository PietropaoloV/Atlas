const { Handler } = require("./handler");
const db = require('../util/sqlconnector.js');

class WellnessHandler extends Handler {
  static async handleRequest(req) {
    try {
      switch (req.method) {
        case "POST":
          return this.CreateWellness(req);
        case "GET":
          if (req.params.wellnessID) {
            return this.GetWellness(req);
          } else {
            return this.ListWellness(req);
          }
        case "PUT":
          return this.UpdateWellness(req);
        case "DELETE":
          return this.DeleteWellness(req);
        default:
          return this.errorResponse("Invalid HTTP method", 400);
      }
    } catch (error) {
      return this.errorResponse("Internal Server Error", 500);
    }
  }

  static successResponse(data) {
    return { status: 200, message: "Success", data };
  }

  static errorResponse(message, status) {
    throw { status, message };
  }

  static async CreateWellness(req) {
    const userID = req.params['userID'];

    if (!userID) {
      throw { status: 403, message: "UserID Invalid" };
    }

    const { date, mood, stress, sleep, motivation, hydration, soreness } = req.body;

    if (!date || !mood || !stress || !sleep || !motivation || !hydration || !soreness) {
      throw { status: 400, message: "Bad Request: Missing Fields" };
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
      throw { status: 400, message: "Bad Request: Invalid Mood, Stress, Sleep, Motivation, Hydration, or Soreness" };
    }

    try {
      const connection = await db.getConnection();
      const query =
        'INSERT INTO Wellness (userID, date, mood, stress, sleep, motivation, hydration, soreness) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
      await connection.execute(query);
      connection.release();
      return this.successResponse("Creation Successful: " + wellnessID);
    } catch (error) {
      throw { status: 500, message: "Internal Server Error" };
    }
  }

  static async ListWellness(req) {
    const userID = req.param['userID'];
    if (!userID) {
      throw { status: 400, message: "UserID Invalid" };
    }
    try {
      const connection = await db.getConnection();
      const query = "SELECT * FROM Wellness WHERE user_id = ${userId}";
      const [wellnessEntries] = await connection.execute(query, [userID]);
      connection.release();

      if (!wellnessEntries || wellnessEntries.length === 0) {
        throw { status: 404, message: "Not found: No wellness entries associated with the given userID" };
      }
      return this.successResponse(wellnessEntries);
    } catch (error) {
      throw { status: 500, message: "Internal Server Error" };
    }
  }

  static async GetWellness(req) {
    const userID = req.params['userID'];
    const wellnessID = req.params['wellnessID'];
    if (!userID || !wellnessID) {
      throw { status: 400, message: "UserID or WellnessID Invalid" };
    }
    try {
      const connection = await db.getConnection();
      const query = 'SELECT * FROM wellness WHERE user_id = ? AND wellness_id = ?';
      const [result] = await connection.execute(query, [userID, wellnessID]);
      connection.release();

      if (!result || result.length === 0) {
        throw { status: 404, message: "Wellness Entry Not Found" };
      }
      if (result[0].user_ID !== parseInt(userID)) {
        throw { status: 401, message: "Unauthorized UserID" };
      }
      return this.successResponse(result[0]);
    } catch (error) {
      throw { status: 500, message: "Internal Server Error" };
    }
  }

  static async UpdateWellness(req) {
    const userID = req.params['userID'];
    const wellnessID = req.params['wellnessID'];
    if (!userID || !wellnessID) {
      throw { status: 400, message: "UserID or WellnessID Invalid" };
    }
    try {
      const connection = await db.getConnection();
      const selectQuery = 'SELECT * FROM wellness WHERE user_id = ? AND wellness_id = ?';
      const [result] = await connection.execute(selectQuery, [userID, wellnessID]);

      if (!result || result.length === 0) {
        throw { status: 404, message: "Wellness Entry Not Found" };
      }
      if (
        result[0].user_id !== parseInt(userID) ||
        result[0].wellness_id !== parseInt(wellnessID)
      ) {
        throw { status: 401, message: "Unauthorized User" };
      }
      const {
        newDate,
        newMood,
        newStress,
        newSleep,
        newMotivation,
        newHydration,
        newSoreness,
      } = req.body;

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
      return this.successResponse("Update Successful");
    } catch (error) {
      throw { status: 500, message: "Internal Server Error" };
    }
  }

  static async DeleteWellness(req) {
    const userID = req.params['userID'];
    const wellnessID = req.params['wellnessID'];
    if (!userID || !wellnessID) {
      throw { status: 400, message: "UserID or WellnessID Invalid" };
    }
    try {
      const connection = await db.getConnection();
      const selectQuery = 'SELECT * FROM wellness WHERE user_id = ? AND wellness_id = ?';
      const [result] = await connection.execute(selectQuery, [userID, wellnessID]);

      if (!result || result.length === 0) {
        throw { status: 404, message: "Wellness Entry Not Found" };
      }
      if (
        result[0].user_id !== parseInt(userID) ||
        result[0].wellness_id !== parseInt(wellnessID)
      ) {
        throw { status: 401, message: "Unauthorized User" };
      }
      const deleteQuery = 'DELETE FROM wellness WHERE userID = ? AND wellnessID = ?';
      await connection.execute(deleteQuery, [userID, wellnessID]);
      connection.release();
      return this.successResponse("Delete Successful");
    } catch (error) {
      throw { status: 500, message: "Internal Server Error" };
    }
  }
}

module.exports = { WellnessHandler };
