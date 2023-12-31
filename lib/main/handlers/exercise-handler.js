const { Handler } = require("./handler");
const db = require('../util/sqlconnector.js');
const ErrorHandler = require('../util/error-handler.js');
const {generateShortUUID, getUserID, getTypeID} = require('../util/util.js');
const { getClientToken, getTokenFromCache } = require('../constants/server-constants');

const {
    ValidationException,
    ResourceNotFoundException,
    AccessDeniedException,
	InternalServerException,
	ConflictException
} = require('../util/exceptions.js');

const { 
    CompletedResponse
} = require('../util/response');

const { enumList, isValidDateFormat, isValidEnumValue , isValidTimeFormat} = require('../constants/enumConstants.js');

class ExerciseHandler extends Handler {

	async handle(req) {
        try {

			await req.on('data', chunk => {super.accumulateChunkData(chunk);});
        	await req.on('end', () => {});
			// if (getTokenFromCache(getUserID(req.url)) !== getClientToken()) {
			// 	console.log(getTokenFromCache(getUserID(req.url)));
			// 	console.log(getClientToken());
            //     throw new AccessDeniedException("Access denied: Invalid token");
            // }


          	switch (req.method) {
				case "POST":	
					return this.CreateExercise(getUserID(req.url));
				case "GET":
				if (req.url.split('/').length == 4) {
					return this.GetExercise(getUserID(req.url), getTypeID(req.url));
				} else {
					var resp =  this.ListExercise(getUserID(req.url));
					console.log(resp);
					return resp;
				}
				case "PUT":
				return this.UpdateExercise(getUserID(req.url), getTypeID(req.url));
				case "DELETE":
				return this.DeleteExercise(getUserID(req.url), getTypeID(req.url));
				default:
					throw new ValidationException("Invalid HTTP method");
          }
        } catch (error) {
            return ErrorHandler.handleError(error);
        }
    }

    #validateJson(key, value){
        try {
            if(key == "name"){
                return String(value);
            }
            if(key == "target_muscle_group"){
                return String(value);
            }
            if(key == "forces"){
                return String(value);
            }
            if(key == "rest_interval"){
                return Date(value);
            }
            if(key == "progression"){
                return String(value);
            }
            if(key == "link"){
                return String(value);
            }
        }
        catch(err){
            throw new Response.ValidationException("Error validating exercise json :" + err);
        }
    }
	
	async CreateExercise(userID) {
		try {   
		
			if (!userID) {
				throw new ValidationException("Invalid userID");
			}
	
			var req_body = JSON.parse(this.postValue, this.#validateJson());
		
			if (!req_body.progression || !req_body.name || !req_body.forces || !req_body.rest_interval || !req_body.target_muscle_group) {
				throw new ValidationException("Bad request: Incomplete exercise data");

			}
			
		
			isValidEnumValue("targetMuscleEnum", req_body.target_muscle_group,true);
			isValidEnumValue("forceEnum", req_body.forces,true);
			isValidEnumValue("progressionEnum", req_body.progression,true);
			isValidTimeFormat(req_body.rest_interval);
			isValidEnumValue("restIntervalMetricEnum", req_body.rest_interval_metric,true);
			  
			
			  const connectionDB = await db.connection;
            
			  var checkQuery = 'SELECT * FROM exercise WHERE userID = ? AND name = ? AND target_muscle_group = ? AND forces = ? AND rest_interval = ? AND progression = ? AND rest_interval_metric = ?';
			  var getPromise = new Promise ((resolve,reject) => {
			   connectionDB.query(checkQuery,[userID,req_body.name, req_body.target_muscle_group, req_body.forces, req_body.rest_interval,req_body.progression,req_body.rest_interval_metric ],function (err, result) {
				  if (err)
						  reject (new InternalServerException(err));
					
					console.log(result);
					if(result == null)
						reject (new InternalServerException("unable to post to database"));
				   const resultFinal = JSON.stringify(result);
				   
				  if (resultFinal != null && resultFinal.length > 2){
					  reject( new ConflictException("Repeat Values "));
				  } else {
			  var exerciseID = generateShortUUID();
			
			  const query = "INSERT INTO exercise VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
			 
			 
			console.log( connectionDB.query(query, [exerciseID, userID, req_body.name, req_body.target_muscle_group, req_body.forces, req_body.rest_interval,req_body.rest_interval_metric, req_body.progression, req_body.link]));
		
			  resolve(new CompletedResponse(String(exerciseID), 'text/plain'));           
				  }
				});
			   });
			   return await getPromise.then(resp => {
				  return resp;
			  }).catch(err => {
				  return ErrorHandler.handleError(err);
			  })
			  
  
		  } catch (error) {
			  console.error(error);
			  return ErrorHandler.handleError(error);
		  }
	  }
	
async ListExercise(userID) {
		try {
	
			if (!userID) {
				throw new ValidationException("Invalid userID");
			}
	
			const connectionDB = await db.connection;
			const exerciseQuery = `SELECT * FROM exercise WHERE userID = '${userID}'`;
			const defaultExerciseQuery = `SELECT * FROM defaultexercise`;
	
			const userExercises = await new Promise((resolve, reject) => {
				connectionDB.query(exerciseQuery, function (err, result) {
					if (err) reject(new Response.InternalServerException(err));
					resolve(result);
				});
			});
	
			const defaultExercises = await new Promise((resolve, reject) => {
				connectionDB.query(defaultExerciseQuery, function (err, result) {
					if (err) reject(new Response.InternalServerException(err));
					resolve(result);
				});
			});
			const combinedJSONdefault = JSON.stringify(defaultExercises);
			const combinedJSONuser = JSON.stringify(userExercises);
			console.log(combinedJSONuser);
			console.log(combinedJSONdefault);
			const combinedExercises = [...userExercises, ...defaultExercises];
			const combinedJSON = JSON.stringify(combinedExercises);
	
			if (combinedExercises.length === 0) {
				return new CompletedResponse("No exercises found", 'text/plain');
			} else {
				return new CompletedResponse(combinedJSON, 'application/json');
			}
		} catch (error) {
			return ErrorHandler.handleError(error);
		}
	}
	
	

	async GetExercise(userID, exerciseID) {
		try {
			if (!userID || !exerciseID) {
				throw new ValidationException("Invalid userID or exerciseID");
			}
	
			const connectionDB = await db.connection;
	
			// Check if the exercise exists in the custom exercise table
			const customExerciseQuery = `SELECT * FROM exercise WHERE userID = '${userID}' AND exerciseID = '${exerciseID}' LIMIT 1`;
			const customExerciseResult = await new Promise((resolve, reject) => {
				connectionDB.query(customExerciseQuery, function (err, result) {
					if (err) reject(new InternalServerException(err));
					resolve(result);
				});
			});
	
			if (customExerciseResult && customExerciseResult.length > 0) {
				// Exercise found in custom exercise table, return it
				return new CompletedResponse(JSON.stringify(customExerciseResult), 'application/json');
			}
	
			// If exercise is not in custom exercise table, check the default exercise table
			const defaultExerciseQuery = `SELECT * FROM defaultexercise WHERE exerciseID = '${exerciseID}' LIMIT 1`;
			const defaultExerciseResult = await new Promise((resolve, reject) => {
				connectionDB.query(defaultExerciseQuery, function (err, result) {
					if (err) reject(new InternalServerException(err));
					resolve(result);
				});
			});
	
			if (defaultExerciseResult && defaultExerciseResult.length > 0) {
				// Exercise found in default exercise table, return it
				return new CompletedResponse(JSON.stringify(defaultExerciseResult), 'application/json');
			}
	
			// Exercise not found in either table
			throw new ResourceNotFoundException(`Unable to find exercise with id: ${exerciseID}`);
		} catch (error) {
			return ErrorHandler.handleError(error);
		}
	}
	

	async UpdateExercise(userID, exerciseID) {
		
		try {
			if (!userID || !exerciseID) {
				throw new ValidationException("Invalid userID or exerciseID");
			}
	
			var req_body = JSON.parse(this.postValue);
	
			const updates = [];


			//Checks
			  isValidEnumValue("targetMuscleEnum", req_body.target_muscle_group,false);
			  isValidEnumValue("forceEnum", req_body.forces,false);
			  isValidEnumValue("progressionEnum", req_body.progression,false);
			  isValidTimeFormat(req_body.rest_interval);
			  isValidEnumValue("restIntervalMetricEnum", req_body.rest_interval_metric,false);

	
			for (const key of Object.keys(req_body)) {
				if (req_body[key] !== null && key !== 'exerciseID' && key !== 'userID') {
					updates.push(`${key}='${req_body[key]}'`);
				}
			}
			
			if (updates.length === 0) {
				throw new ValidationException("Bad request: No valid fields to update");
			}
	
			const updateQuery = `UPDATE exercise SET ${updates.join(', ')} WHERE userID='${userID}' AND exerciseID='${exerciseID}'`;	
			
			const connectionDB = await db.connection;
			await connectionDB.query(updateQuery, function (err, result) {
				console.log(err);
				console.log(result);
			 });
			
	
			console.log(`Record with exerciseID ${exerciseID} updated successfully`);
			return new CompletedResponse(`Record with exerciseID ${exerciseID} updated successfully`, 'text/plain');
	
		} catch (error) {
			return ErrorHandler.handleError(error);
		}
	}
	
	
	async DeleteExercise(userID, exerciseID) {
		try {
			
			if (!userID || !exerciseID) {
				throw new ValidationException("Invalid userID or exerciseID");
			}
	
			const connectionDB = await db.connection;
			const query = `DELETE FROM exercise WHERE userID = '${userID}' AND exerciseID = ${exerciseID}`;
			console.log(query);
			var response = null;
			var deletePromise = new Promise((resolve, reject) => {
				connectionDB.query(query, function (err, result) {
					if (err) {
						reject(new InternalServerException(err));
					} else if (result.affectedRows == 0) {
						reject(new ResourceNotFoundException(`No record found with exerciseID ${exerciseID} to delete`));
					} else {
						resolve(new CompletedResponse(`Record with exerciseID ${exerciseID} deleted successfully`, 'text/plain'));
						console.log("e");
					}
				});
			});
	
			return await deletePromise.then(resp => {
				return resp;
			}).catch(err => {
				return ErrorHandler.handleError(err);
			});
	
		} catch (error) {
			return ErrorHandler.handleError(error);
		}
	}
	
}

module.exports = { ExerciseHandler };
