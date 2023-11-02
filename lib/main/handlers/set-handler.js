const { Handler } = require("./handler");
const db = require('../util/sqlconnector.js')
const ErrorHandler = require('../util/error-handler.js')

const {
    ValidationException,
    ResourceNotFoundException,
    AccessDeniedException
} = require('../util/error-handler');
  
const { 
    CompletedResponse
} = require('../util/response');
  

class SetHandler extends Handler {

    static async handle(req) {
        try {
          switch (req.method) {
            case "POST":
              return this.CreateSet(req);
            case "GET":
              if (req.params.setID) {
                return this.GetSet(req);
              } else {
                return this.ListSets(req);
              }
            case "PUT":
              return this.UpdateSet(req);
            case "DELETE":
              return this.DeleteSet(req);
            default:
                throw new ValidationException("Invalid HTTP method");
          }
        } catch (error) {
            return ErrorHandler.handleError(err);
        }
    }
    
    static async GetSet(req) {
        const userID = req.params['userID'];
        const setID = req.params['setID'];

        if (!userID || !setID) {
            throw new ValidationException("Invalid userID or setID");
        }

        try {
            const connection = await db.getConnection();
            const query = `SELECT * FROM \`set\` WHERE userID = ? AND setID = ?`;
            const [result] = await connection.execute(query, [userID, setID]);
            connection.release();

            if (!result || result.length === 0) {
                throw new ResourceNotFoundException("Set not found");
            }

            if (result[0].user_id !== parseInt(userID)) {
                throw new AccessDeniedException("Unauthorized userID");
            }

            return new CompletedResponse(result[0], 'application/json');

        } catch (error) {
            return ErrorHandler.handleError(err);
        }
    }

    static async ListSets(req) {
        const userID = req.params['userID'];

        if (!userID) {
            throw new ValidationException("Invalid userID or exerciseID");
        }
    
        try {            
            const connection = await db.getConnection();
            const query = "SELECT * FROM `set` WHERE userID = ?";
            const [results] = await connection.execute(query, [userID]);
            connection.release();
    
            if (!results || results.length === 0) {
                throw new ResourceNotFoundException("Not found: No sets associated with the given exerciseID");
            }
    
            return new CompletedResponse(results, 'application/json');
    
        } catch (error) {
            return ErrorHandler.handleError(err);
        }
    }


    static async CreateSet(req) {
        const userID = req.params['userID'];
    
        if (!userID) {
            throw new ValidationException("Invalid userID");
        }
    
        const {
            exerciseID, workoutID, Date, num_of_times, weight, weight_metric,
            distance, distance_metric, rep_time, rest_period, difficulty, time_start, time_end
        } = req.body;
    
        if (!exerciseID || !workoutID || !Date || !difficulty || !time_start) {
            throw new ValidationException("Bad request: Incomplete set data");

        }
    
        const validDifficulties = ['easy', 'medium', 'hard', 'near_maximum', 'limit', 'failure'];
        const validWeightMetrics = ['lbs', 'kg', 'ton', 'tonne'];
        const validDistanceMetrics = ['feet', 'yards', 'miles', 'meters', 'kilometers'];
    
        if (!validDifficulties.includes(difficulty) || 
            (weight_metric && !validWeightMetrics.includes(weight_metric)) ||
            (distance_metric && !validDistanceMetrics.includes(distance_metric))) {
                throw new ValidationException("Bad request: Invalid difficulty, weight metric, or distance metric value");
            }
    
        try {    
            const connection = await db.getConnection();
            const query = "INSERT INTO `set` (userID, exerciseID, workoutID, date, num_of_times, weight, weight_metric, distance, distance_metric, rep_time, rest_period, difficulty, time_start, time_end) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            const [result] = await connection.execute(query, [userID, exerciseID, workoutID, Date, num_of_times, weight, weight_metric, distance, distance_metric, rep_time, rest_period, difficulty, time_start, time_end]);
            connection.release();

            //generated setID here???
    
            return new CompletedResponse({ setID: newSetID }, 'application/json');
        } catch (error) {
            return ErrorHandler.handleError(err);
        }
    }

    static async UpdateSet(req) {
        const userID = req.params['userID'];
        const setID = req.params['setID'];
    
        if (!userID || !setID) {
            throw new ValidationException("Invalid userID");
        }
    
        try {
            const connection = await db.getConnection();
            const selectQuery = 'SELECT * FROM `set` WHERE userID = ? AND setID = ?';
            const [result] = await connection.execute(selectQuery, [userID, setID]);

            if (!result || result.length === 0) {
                throw new ResourceNotFoundException("Set Entry Not Found");
            }
            if (
                result[0].userID !== parseInt(userID) ||
                result[0].setID !== parseInt(setID)
            ) {
                throw new AccessDeniedException("Unauthorized User");
            }
            
            const updateFields = {
                exerciseID: req.body.exerciseID,
                workoutID: req.body.workoutID,
                date: req.body.date,
                num_of_times: req.body.num_of_times,
                weight: req.body.weight,
                weight_metric: req.body.weight_metric,
                distance: req.body.distance,
                distance_metric: req.body.distance_metric,
                rep_time: req.body.rep_time,
                rest_period: req.body.rest_period,
                difficulty: req.body.difficulty,
                time_start: req.body.time_start,
                time_end: req.body.time_end
            };
            
            Object.entries(updateFields).forEach(([key, value]) => {
                if (value !== undefined) {
                    result[key] = value;
                }
            });
    
            return new CompletedResponse({ setID: setID }, 'application/json');
    
        } catch (error) {
            return ErrorHandler.handleError(err);
        }
    }

    static async DeleteSet(req) {
        const userID = req.params['userID'];
        const setID = req.params['setID'];

        if (!userID || !setID) {
            throw new ValidationException("Invalid userID or setID");
        }
    
        try {
            const connection = await db.getConnection();
            const selectQuery = 'SELECT * FROM `set` WHERE userID = ? AND setID = ?';
            const [result] = await connection.execute(selectQuery, [userID, setID]);
            
            if (!result || result.length === 0) {
                throw new ResourceNotFoundException("Set Entry Not Found");
            }
            if (
                result[0].userID !== parseInt(userID) ||
                result[0].setID !== parseInt(setID)
            ) {
                throw new AccessDeniedException("Unauthorized User");
            }
            const deleteQuery = 'DELETE FROM `set` WHERE userID = ? AND setID = ?';
            await connection.execute(deleteQuery, [userID, setID]);
            connection.release();
    
            return new CompletedResponse({ setID: setID }, 'application/json');
        } catch (error) {
            return ErrorHandler.handleError(err);
        }
    }
}

module.exports = { SetHandler };
