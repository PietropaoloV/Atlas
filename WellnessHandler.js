const {Handler} = require("./handler");

class WellnessHandler extends Handler{

static async CreateWellness(req,res){
    const userID = req.params['userID'];

    if(!userID){
        return res.status(403).json({error: "UserID Invalid"});
    }

    const{date, mood, stress, sleep, motivation, hydration, soreness} = req.body;
    
    if(!date || !mood || !stress || !sleep || !motivation || !hydration || !soreness) {
            return res.status(400).json({ error: "Bad Request: Missing Fields" });
        }
    
    const ValidMood = ['worst', 'worse', 'normal','better', 'best'];
    const ValidStress = ['extreme', 'high', 'moderate', 'mild', 'relaxed'];
    const ValidSleep = ['terrible', 'poor', 'fair', 'good', 'excellent'];
    const ValidMotivation = ['lowest', 'lower','normal','higher', 'highest'];
    const ValidHydration = ['brown', 'orange', 'yellow', 'light', 'clear'];
    const ValidSoreness = ['severe', 'strong', 'moderate', 'mild', 'none'];
    
    if(!ValidMood.includes(mood) || !ValidStress.includes(stress) || !ValidSleep.includes(sleep) || 
    !ValidMotivation.includes(motivation) || !ValidHydration.includes(hydration) || !ValidSoreness.includes(soreness)){
        return res.status(400).json({error: "Bad Request: Invalid Mood, Stress, Sleep, Motivation, Hydration, or Soreness"});
    }

    try{
        const wellnessEntry = {
            wellnessID: wellness.length + 1,
            userID,
            date,
            mood,
            stress,
            sleep,
            motivation,
            hydration,
            soreness,
        };
        wellness.push(wellnessEntry); 
        // connection.queryDatabase('INSERT INTO wellness SET?', wellnessEntry);
        return res.status(200).json({error:"Creation Successful:" + wellnessID}); 
    }catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
      
}

static async ListWellness(req,res){
    const userID = req.param['userID'];
    if(!userID){
        return res.status(400).json({error: "UserID Invalid"});
    }
    try{
        //const wellnessEntries = await queryDatabase(`SELECT * FROM Wellness WHERE user_id = ${userId}');
        const wellnessEntries = [
            {
                wellness_id: 1,
                user_id: 123,
                date: "2023-10-23",
                mood: "normal",
                stress: 'moderate',
                sleep: 'fair',
                motivation: 'normal',
                hydration: 'yellow',
                soreness: 'moderate',  
            },
            {
                wellness_id: 2,
                user_id: 123,
                date: "2023-10-24",
                mood: "best",
                stress: 'relaxed',
                sleep: 'excellent',
                motivation: 'normal',
                hydration: 'clear',
                soreness: 'none',  
            },
            {
                wellness_id: 3,
                user_id: 123,
                date: "2023-10-25",
                mood: "worst",
                stress: 'extreme',
                sleep: 'terrible',
                motivation: 'lowest',
                hydration: 'brown',
                soreness: 'severe',  
            },
        ];
        if(!wellnessEntries || wellnessEntries.length === 0){
            return res.status(404).json({error: "Not found: No wellness entries associated with the given userID"})
        }
            return res.json(wellnessEntries);

    }catch(error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

static async GetWellness(req,res){
    const userID = req.params['userID'];
    const wellnessID = req.params['wellnessID'];
    if(!userID || !wellnessID){
        return res.status(400).json({error: "UserID or WellnessID Invalid"});
    }
    try{
    //const result = await queryDatabase(`SELECT * FROM Wellness WHERE user_id = ${userId} AND wellness_id = ${wellnessID}`);
    const result = [
        {
            wellness_ID: 1,
            user_ID: 123,
            date: "2023-24-10",
            mood: "normal",
            stress: 'moderate',
            sleep: 'poor',
            motivation: 'higher',
            hydration: 'orange',
            soreness: 'mild',
        }
    ]
    if(!result || result.length === 0){
        return res.status(404).json({error: "Wellness Entry Not Found"});
    } 
    if(result[0].user_ID !== parseInt(userID)){
        return res.status(401).json({error: "Unauthorized UserID"});
    } 
    return res.json(result[0]);
    }catch(error){
        return res.status(500).json({ error: "Internal Server Error" }); 
    }
}

static async UpdateWellness(req,res){
    const userID = req.params['userID'];
    const wellnessID = req.params['wellnessID'];
    if(!userID || !wellnessID){
        return res.status(400).json({error: "UserID or WellnessID Invalid"});
    }
    try{
        //const result = await queryDatabase(`SELECT * FROM wellness WHERE user_id = ${userId} AND wellness_id = ${wellnessId}`);
        const result = [
            {
                wellness_id: 1,
                user_id: 123,
                date: "2023-24-10",
                mood: "normal",
                stress: 'moderate',
                sleep: 'poor',
                motivation: 'higher',
                hydration: 'orange',
                soreness: 'mild',
            }
        ]
        if(!result || result.length === 0){
            return res.status(404).json({error: "Wellness Entry Not Found"});
        } 
        if(result[0].user_id !== parseInt(userID) || result[0].wellness_id !== parseInt(wellnessID)){
            return res.status(401).json({error: "Unauthorized User"});
        } 
        const{ date, mood, stress, sleep, motivation, hydration, soreness } = req.body;
         
        if(date !== undefined){
            result.date = date;
        }
        if(mood !== undefined){
            result.mood = mood;
        }
        if(stress !== undefined){
            result.stress = stress;
        } 
        if(sleep !== undefined){
            result.sleep = sleep;
        }
        if(motivation !== undefined){
            result.motivation = motivation;
        }
        if(hydration !== undefined) {
            result.hydration = hydration;
        }
        if(soreness !== undefined){
            result.soreness = soreness;
        }
        return res.status(200).json({error:" Update Successful"}); 
    }catch(error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

static async DeleteWellness(req,res){
    const userID = req.params['userID'];
    const wellnessID = req.params['wellnessID'];
    if(!userID || !wellnessID){
        return res.status(400).json({error: "UserID or WellnessID Invalid"});
    }
    try{
    //const result = await queryDatabase(`SELECT * FROM wellness WHERE user_id = ${userId} AND wellness_id = ${wellnessId}`);
    const result = [
        {
            wellness_id: 1,
            user_id: 123,
            date: "2023-10-24",
            mood: "normal",
            stress: 'moderate',
            sleep: 'poor',
            motivation: 'higher',
            hydration: 'orange',
            soreness: 'mild',
        }
    ]
    if(!result || result.length === 0){
        return res.status(404).json({error: "Wellness Entry Not Found"});
    } 
    if(result[0].user_id !== parseInt(userID) || result[0].wellness_id !== parseInt(wellnessID)){
        return res.status(401).json({error: "Unauthorized User"});
    }
    // await queryDatabase(`DELETE FROM wellness WHERE wellness_id = ${wellnessID} AND user_id = ${userID}`);
        return res.status(200).json({error: "Delete Successful"});
    }catch(error) {
        return res.status(500).json({ error: "Internal Server Error" }); 
    }
}

}
module.exports = {WellnessHandler};