const { Handler } = require("./handler");
const db = require('../util/sqlconnector.js')
const ErrorHandler = require('../util/error-handler.js')
const genUUID = require('../util/util.js')

const {
    ValidationException,
    ResourceNotFoundException,
    InternalServerException,
    AccessDeniedException
} = require('../util/exceptions.js');
  
const { 
    CompletedResponse
} = require('../util/response.js');
  
const { enumList, isValidDateFormat, isValidEnumValue , isValidTimeFormat} = require('../constants/enumConstants.js');


class SetHandler extends Handler {

   async handle(req) {
        try {
          switch (req.method) {
            case "POST":
              return this.processBodyCreate(req);
            case "GET":
              if (req.url.split('/').filter(Boolean).length === 3) {
                return this.GetSet(req);
              } else {
                return this.ListSets(req);
              }
            case "PUT":
              return this.processBodyPush(req);
            case "DELETE":
              return this.DeleteSet(req);
            default:
                throw new ValidationException("Invalid HTTP method");
          }
        } catch (error) {
            return ErrorHandler.handleError(error);
        }
    }
    
    async GetSet(req) {
		try {
			const userURL = req.url.split('/');
			const userID = userURL[1];
			const setID = userURL[3];
            
			if (!userID || !setID) {
				throw new ValidationException("Invalid userID or setID");
			}
           
            const connectionDB = await db.connection;
            const query = `SELECT * FROM sets WHERE userID = '${userID}' AND setID = '${setID}'`;
			var response = null;
            var listPromise = new Promise ((resolve,reject) => {
				connectionDB.query(query, function (err, result) {
					if (err) 
						reject (new InternalServerException(err));
					console.log("Got result");
					console.log(result.length);
					if (result.length == 0){
						console.log("Unable to find");
						reject(new ResourceNotFoundException(`Unable to find record with name ${setID}`));
					} else {
	
					var string= JSON.stringify(result);
					console.log('>> string: ', string );
            		resolve(new CompletedResponse(string, 'application/json'));			
					}
				 });
			});

			return await listPromise.then(resp => {
				return resp;
			}).catch(err => {
				return ErrorHandler.handleError(err);
			})
    
        } catch (error) {
            return ErrorHandler.handleError(error);
        }
	}

    async ListSets(req) {
		try {
			const userURL = req.url.split('/');
			const userID = userURL[1];

			if (!userID) {
				throw new ValidationException("Invalid userID");
			}
           
            const connectionDB = await db.connection;
            const query = `SELECT * FROM sets WHERE userID = '${userID}'`;
			var response = null;
            var listPromise = new Promise ((resolve,reject) => {
				connectionDB.query(query, function (err, result) {
					if (err) 
						reject (new InternalServerException(err));
					console.log("Got result");
					console.log(result.length);
					if (result.length == 0){
						console.log("Unable to find");
						reject(new ResourceNotFoundException(`Unable to find record with name ${setID}`));
					} else {
	
					var string= JSON.stringify(result);
					console.log('>> string: ', string );
            		resolve(new CompletedResponse(string, 'application/json'));			
					}
				 });
			});

			return await listPromise.then(resp => {
				return resp;
			}).catch(err => {
				return ErrorHandler.handleError(err);
			})
    
        } catch (error) {
            return ErrorHandler.handleError(error);
        }
	}


    async CreateSet(req) {
        
      
        try {
          const userURL = req.url.split('/');
          const userID = userURL[1];
      
          if (!userID) {
            throw new ValidationException("Invalid userID");
          }
      
          var req_body = JSON.parse(this.postValue, this.#validateJson());
      
          if (!req_body.exerciseID || !req_body.workoutID || !req_body.Date || !req_body.difficulty || !req_body.time_start) {
            throw new ValidationException("Bad request: Incomplete set data");
          }
      isValidDateFormat(req_body.Date);
      isValidEnumValue("setsDifficultyEnum", req_body.difficulty,true);
      isValidTimeFormat(req_body.time_start);
      isValidTimeFormat(req_body.time_end);
      isValidEnumValue("weightMetricEnum", req_body.weight_metric,true);
      
         
      
          var setID = genUUID.generateShortUUID();
      
          const connectionDB = await db.connection;
          const query = "INSERT INTO sets VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
          const result = await connectionDB.query(query, [
            setID,
            req_body.exerciseID,
            userID,
            req_body.workoutID,
            req_body.Date,
            req_body.num_of_times,
            req_body.weight,
            req_body.weight_metric,
            req_body.distance,
            req_body.distance_metric,
            req_body.rep_time,
            req_body.rest_period,
            req_body.difficulty,
            req_body.time_start,
            req_body.time_end
          ]);
      
          var string = JSON.stringify(result[0]);
      
          return new CompletedResponse(setID, 'text/plain');
        } catch (error) {
          return ErrorHandler.handleError(error);
        }
      }
      
      async UpdateSet(req) {
        const userURL = req.url.split('/');
        const userID = userURL[1];
        const setID = userURL[3];
    
        try {
            if (!userID || !setID) {
                throw new ValidationException("Invalid userID or setID");
            }
    
            var req_body = JSON.parse(this.postValue, this.#validateJson());
    
            const updates = [];
            isValidDateFormat(req_body.Date,false);
            isValidEnumValue("setsDifficultyEnum", req_body.difficulty,false);
            isValidTimeFormat(req_body.time_start,false);
            isValidTimeFormat(req_body.rep_time,false);
            isValidTimeFormat(req_body.rest_period,false);
            isValidEnumValue("weightMetricEnum", req_body.weight_metric,false);
            isValidEnumValue("distanceMetricenum", req_body.distance_metric,false);
    
            // Constructing the update statement based on the fields provided in the JSON
            for (const key of Object.keys(req_body)) {
                if (key !== 'setID' && key !== 'userID') {
                    updates.push(`${key} = '${req_body[key]}'`);
                }
            }
    
            if (updates.length === 0) {
                throw new ValidationException("Bad request: No valid fields to update");
            }
    
            const updateQuery = `UPDATE sets SET ${updates.join(', ')} WHERE userID = '${userID}' AND setID = '${setID}'`;
            const connectionDB = await db.connection;
            const result = await connectionDB.query(updateQuery);
    
            if (result.affectedRows === 0) {
                throw new ResourceNotFoundException(`No record found with setID ${setID} to update`);
            }
    
            console.log(`Record with setID ${setID} updated successfully`);
            return new CompletedResponse(`Record with setID ${setID} updated successfully`, 'text/plain');
        } catch (error) {
            return ErrorHandler.handleError(error);
        }
    }
    

    async DeleteSet(req) {
        try {
            const userURL = req.url.split('/');
            const userID = userURL[1];
            const setID = userURL[3];
    
            if (!userID || !setID) {
                throw new ValidationException("Invalid userID or setID");
            }
    
            const connectionDB = await db.connection;
            const query = `DELETE FROM sets WHERE userID = '${userID}' AND setID = '${setID}'`;
            var response = null;
            var deletePromise = new Promise ((resolve, reject) => {
                connectionDB.query(query, function (err, result) {
                    if (err) {
                        reject(new InternalServerException(err));
                    } else if (result.affectedRows == 0) {
                        reject(new ResourceNotFoundException(`No record found with setID ${setID} to delete`));
                    } else {
                        resolve(new CompletedResponse(`Record with setID ${setID} deleted successfully`, 'text/plain'));
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

    async processBodyCreate(req){    
        await req.on('data', chunk => {
            super.accumulateChunkData(chunk);
        });

        await req.on('end', () => {

        });
        return this.CreateSet(req);
    }

    async processBodyPush(req){    
        await req.on('data', chunk => {
            super.accumulateChunkData(chunk);
        });

        await req.on('end', () => {

        });
        return this.UpdateSet(req);
    }

    #validateJson(key, value){
        try {
            if(key == "exerciseID"){
                return String(value);
            }
            if(key == "workoutID"){
                return String(value)
            }
            if(key == "Date"){
                return Date(value);
            }
            if(key == "num_of_times"){
                return Number(value);
            }
            if(key == "weight"){
                return Number(value);
            }
            if(key == "weight_metric"){
                return String(value);
            }
            if(key == "distance"){
                return Number(value);
            }
            if(key == "distance_metric"){
                return String(value);
            }
            if(key == "rep_time"){
                return Date(value);
            }
            if(key == "rest_period"){
                return String(value);
            }
            if(key == "time_start"){
                return Date(value);
            }
            if(key == "time_end"){
                return Date(value);
            }
        }
        catch(err){
            throw new Response.ValidationException("Error validating json :" + err);
        }
    }

}

module.exports = { SetHandler };
