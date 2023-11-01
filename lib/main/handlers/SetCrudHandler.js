const BaseHandler = require('./handler.js'); // Base class
const Response = require('../util/response.js'); //link to response here
const connection = require('../util/sqlconnector.js'); //link to sql file here

class SetCRUDHandler extends BaseHandler {
    #request = null;
    #parsedJson = null;
    #splitUrl = null;
    #connection = null;

    constructor(request) {
        super();
        this.#request = request;
        this.content_type = 'application/json';
        this.#connection = connection;
    }

    #isValidURL() {
        this.#splitUrl = this.#request.url.split('/').filter(Boolean); // Filter out empty strings from the split array
        // Expecting URLs like:
        // /{user-id}/set/
        // /{user-id}/set/{set_id}
        const validUrlPattern = /^[\d]+\/set(\/[\d]+)?$/; // Regex pattern to match the expected URL
        const pathWithoutBase = this.#splitUrl.slice(1).join('/'); // Remove the leading empty item due to split on first '/'
        return validUrlPattern.test(pathWithoutBase);
    }

    #validateIdInUrl() {
        if (this.#splitUrl.length === 2 || this.#splitUrl.length === 4) {
            // URL is either /{user-id}/set/ or /{user-id}/set/{set_id}
            return { 
                userId: this.#splitUrl[1], // The user-id part of the URL
                setId: this.#splitUrl.length === 4 ? this.#splitUrl[3] : null // The set_id if present
            };
        } else {
            throw new Response.ValidationException("URL does not match expected pattern for resource");
        }
    }

    #parseJson() {
        if (this.#request.postValue.length === 0) {
            throw new Response.ValidationException("Empty json");
        }
        this.#parsedJson = JSON.parse(this.#request.postValue);
    }

    #validateJSONContentType() {
        let headerType = this.#request.headers['content-type'];
        if (headerType !== "application/json") {
            throw new Response.ValidationException("Content Type should be json");
        }
    }

    #getSet() {
      return new Promise((resolve, reject) => {
          this.#isValidURL();
          let getQuery = `SELECT * FROM set WHERE set_id = ?;`;

          this.#connection.query(getQuery, [this.#splitUrl[3]], (err, result) => {
              if (err) reject(new Response.InternalServerException(err));
              console.log("Got result");
              if (result.length == 0) {
                  console.log("Unable to find");
                  reject(new Response.ResourceNotFoundException(`Unable to find record with set_id ${this.#splitUrl[3]}`));
              } else {
                  resolve(JSON.stringify(result[0]));
              }
          });
      });
    }

    #postSet() {
      return new Promise((resolve, reject) => {
          this.#validateJSONContentType();
          this.#parseJson();

          let postQuery = `INSERT INTO set (exercise_id, user_id, workout_id, Date, num_of_times, weight, weight_metric, distance, distance_metric, rep_time, rest_period, difficulty, time_start, time_end) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;

          this.#connection.query(postQuery, [
              this.#parsedJson.exercise_id,
              this.#parsedJson.user_id,
              this.#parsedJson.workout_id,
              this.#parsedJson.Date,
              this.#parsedJson.num_of_times,
              this.#parsedJson.weight,
              this.#parsedJson.weight_metric,
              this.#parsedJson.distance,
              this.#parsedJson.distance_metric,
              this.#parsedJson.rep_time,
              this.#parsedJson.rest_period,
              this.#parsedJson.difficulty,
              this.#parsedJson.time_start,
              this.#parsedJson.time_end
          ], (err, result) => {
              if (err) reject(new Response.InternalServerException(err));
              console.log("1 record inserted");
              resolve(this.#parsedJson.set_id);
          });
      });
    }

    #putSet() {
      return new Promise((resolve, reject) => {
          this.#validateIdInUrl();
          this.#validateJSONContentType();
          this.#parseJson();

          let updateData = this.#parsedJson;
          let columns = [];
          let values = [];

          for (const [key, value] of Object.entries(updateData)) {
              columns.push(`${key} = ?`);
              values.push(value);
          }

          let sql = `UPDATE set SET ${columns.join(', ')} WHERE set_id = ?;`;
          values.push(this.#splitUrl[3]); // The set_id is expected to be the last part of the URL

          this.#connection.query(sql, values, (err, result) => {
              if (err) reject(new Response.InternalServerException(err));
              console.log("Updated entity");
              resolve(this.#splitUrl[3]);
          });
      });
    }

    #deleteSet() {
      return new Promise((resolve, reject) => {
          this.#validateIdInUrl();
          let deleteQuery = `DELETE FROM set WHERE set_id = ?;`;

          this.#connection.query(deleteQuery, [this.#splitUrl[3]], (err, result) => { 
              if (err) reject(new Response.InternalServerException(err));
              console.log("Deleted entity");
              resolve(this.#splitUrl[3]);
          });
      });
    }

    #errHandle(e) {
        let resp;
        if (e instanceof Response.ValidationError) {
            resp = new Response.ValidationError("Validation Exception: " + e.message);
        } else if (e instanceof Response.ConflictError) {
            resp = new Response.ConflictError("Conflict Exception: " + e.message);
        } else if (e instanceof Response.ResourceNotFoundError) {
            resp = new Response.ResourceNotFoundError("Resource Not Found Exception: " + e.message);
        } else {
            resp = new Response.InternalServerError("Internal Server Exception: " + e.message);
            console.error(e);
        }
        return resp;
    }


     handle() {
        return new Promise((resolve) => {
            try {
                if (this.#request == null) {
                    throw new Response.ValidationError("request was null");
                }

                this.#splitUrl = this.#request.url.split("/");
                
                if (!this.#isValidURL()) {
                    throw new Response.ValidationError("request url has an incorrect path");
                }

                let method = this.#request.method;
                switch (method) {
                    case "GET":
                        this.#getSet()
                            .then(res => resolve(new Response.CompletedResponse(res, "application/json")))
                            .catch(err => resolve(this.#errHandle(err)));
                        break;
                    case "POST":
                        this.#postSet()
                            .then(res => resolve(new Response.CompletedResponse(res, "text/plain")))
                            .catch(err => resolve(this.#errHandle(err)));
                        break;
                    case "PUT":
                        this.#putSet()
                            .then(() => resolve(new Response.CompletedResponse("", "text/plain")))
                            .catch(err => resolve(this.#errHandle(err)));
                        break;
                    case "DELETE":
                        this.#deleteSet()
                            .then(() => resolve(new Response.CompletedResponse("", "text/plain")))
                            .catch(err => resolve(this.#errHandle(err)));
                        break;
                    default:
                        resolve(new Response.ValidationError("Invalid HTTP request method; server only supports GET, DELETE, POST, PUT", "text/plain"));
                }
            } catch (err) {
                resolve(this.#errHandle(err));
            }
        });
    }
}

module.exports = SetCRUDHandler;