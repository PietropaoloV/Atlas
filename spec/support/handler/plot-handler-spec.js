
const exercise_testing_util = require("../utils/exercise-testing-utils.js");
const {PlotHandler, TimeSeries, Plot} = require("../../../lib/main/handlers/plot-handler.js");
const { generateRandomSet } = require("../utils/set-testing-utils.js");
const { generateShortUUID } = require("../../../lib/main/util/util.js");
const jasmine = require("jasmine");
const { momentDateFormat } = require("../../../lib/main/constants/server-constants.js");
const { CompletedResponse } = require("../../../lib/main/util/response.js");

const ph = new PlotHandler();

describe("PlotHandler", () => {
    describe("PlotExercise", () => {
        it("test normal range inclusive ", async () => {
            const userId = generateShortUUID();
                        const exerciseId = generateShortUUID();
                        const otherId = generateShortUUID();
                        const url = `/${userId}/plot/?exerciseId=${exerciseId}&startDate=10/22/2023&numOfDays=4`
                       
                        let sets = [];
                        sets.push(generateRandomSet(userId, exerciseId, otherId, otherId, "10/22/2023", "01:01:35", "02:02:25"));
                        sets.push(generateRandomSet(userId, exerciseId, otherId, otherId, "10/23/2023", "01:02:35", "01:03:25"));
                        sets.push(generateRandomSet(userId, exerciseId, otherId, otherId, "10/24/2023", "03:03:35", "03:06:24"));
                        sets.push(generateRandomSet(userId, exerciseId, otherId, otherId, "10/25/2023", "03:15:35", "03:17:25"));
                        spyOn(ph.sh, 'ListSets').withArgs(userId).and.returnValue(sets);
                
                        let actual_resp = (await ph.getExercisePlot(url)).getMessage();
                        actual_resp = JSON.parse(actual_resp);
                        expect(actual_resp.timeSeriesDistance.length).toEqual(3);
                        expect(actual_resp.timeSeriesWeight.length).toEqual(3);
            });

            it("test normal range outside ", async () => {
                const userId = generateShortUUID();
                            const exerciseId = generateShortUUID();
                            const otherId = generateShortUUID();
                            const url = `/${userId}/plot/?exerciseId=${exerciseId}&startDate=10/22/2023&numOfDays=4`
                           
                            let sets = [];
                            sets.push(generateRandomSet(userId, exerciseId, otherId, otherId, "10/9/2023", "01:01:35", "02:02:25"));
                            sets.push(generateRandomSet(userId, exerciseId, otherId, otherId, "10/31/2023", "01:02:35", "01:03:25"));
                            sets.push(generateRandomSet(userId, exerciseId, otherId, otherId, "10/30/2023", "03:03:35", "03:06:24"));
                            sets.push(generateRandomSet(userId, exerciseId, otherId, otherId, "10/29/2023", "03:15:35", "03:17:25"));
                            spyOn(ph.sh, 'ListSets').withArgs(userId).and.returnValue(sets);
                    
                            let actual_resp = (await ph.getExercisePlot(url)).getMessage();
                            actual_resp = JSON.parse(actual_resp);
                            expect(actual_resp.timeSeriesDistance.length).toEqual(0);
                            expect(actual_resp.timeSeriesWeight.length).toEqual(0);
                });

                it("test normal range outside partial ", async () => {
                    const userId = generateShortUUID();
                                const exerciseId = generateShortUUID();
                                const otherId = generateShortUUID();
                                const url = `/${userId}/plot/?exerciseId=${exerciseId}&startDate=10/22/2023&numOfDays=2`
                               
                                let sets = [];
                                sets.push(generateRandomSet(userId, exerciseId, otherId, otherId, "10/22/2023", "01:01:35", "02:02:25"));
                                sets.push(generateRandomSet(userId, exerciseId, otherId, otherId, "10/23/2023", "01:02:35", "01:03:25"));
                                sets.push(generateRandomSet(userId, exerciseId, otherId, otherId, "10/29/2023", "03:03:35", "03:06:24"));
                                sets.push(generateRandomSet(userId, exerciseId, otherId, otherId, "10/24/2023", "03:15:35", "03:17:25"));
                                spyOn(ph.sh, 'ListSets').withArgs(userId).and.returnValue(sets);
                        
                                let actual_resp = (await ph.getExercisePlot(url)).getMessage();
                                actual_resp = JSON.parse(actual_resp);
                                expect(actual_resp.timeSeriesDistance.length).toEqual(2);
                                expect(actual_resp.timeSeriesWeight.length).toEqual(2);
                    });

                it("test negative days ", async () => {
                    const userId = generateShortUUID();
                                const exerciseId = generateShortUUID();
                                const otherId = generateShortUUID();
                                const url = `/${userId}/plot/?exerciseId=${exerciseId}&startDate=10/22/2023&numOfDays=-1`
                                
                                let sets = [];
                                sets.push(generateRandomSet(userId, exerciseId, otherId, otherId, "10/22/2023", "01:01:35", "02:02:25"));
                                sets.push(generateRandomSet(userId, exerciseId, otherId, otherId, "10/23/2023", "01:02:35", "01:03:25"));
                                sets.push(generateRandomSet(userId, exerciseId, otherId, otherId, "10/29/2023", "03:03:35", "03:06:24"));
                                sets.push(generateRandomSet(userId, exerciseId, otherId, otherId, "10/24/2023", "03:15:35", "03:17:25"));
                                
                                spyOn(ph.sh, 'ListSets').withArgs(userId).and.returnValue(sets);
                        
                                let resp = await ph.getExercisePlot(url)
                                console.log(resp);
                                expect(resp.getCode()).toBe(400);
                               
                    });

                    it("test invalid exercise id ", async () => {
                        const userId = generateShortUUID();
                                    const exerciseId = generateShortUUID();
                                    const otherId = generateShortUUID();
                                    const url = `/${userId}/plot/?exerciseId=823791&startDate=10/22/2023&numOfDays=-1`
                                    
                                    let sets = [];
                                    sets.push(generateRandomSet(userId, exerciseId, otherId, otherId, "10/22/2023", "01:01:35", "02:02:25"));
                                    sets.push(generateRandomSet(userId, exerciseId, otherId, otherId, "10/23/2023", "01:02:35", "01:03:25"));
                                    sets.push(generateRandomSet(userId, exerciseId, otherId, otherId, "10/29/2023", "03:03:35", "03:06:24"));
                                    sets.push(generateRandomSet(userId, exerciseId, otherId, otherId, "10/24/2023", "03:15:35", "03:17:25"));
                                    
                                    spyOn(ph.sh, 'ListSets').withArgs(userId).and.returnValue(sets);
                            
                                    let resp = await ph.getExercisePlot(url)
                                    console.log(resp);
                                    expect(resp.getCode()).toBe(400);
                                   
                        });
                    
                    it("test invalid start date ", async () => {
                        const userId = generateShortUUID();
                                    const exerciseId = generateShortUUID();
                                    const otherId = generateShortUUID();
                                    const url = `/${userId}/plot/?exerciseId=${exerciseId}&startDate=10/2asd/2023&numOfDays=-1`
                                    
                                    let sets = [];
                                    sets.push(generateRandomSet(userId, exerciseId, otherId, otherId, "10/22/2023", "01:01:35", "02:02:25"));
                                    sets.push(generateRandomSet(userId, exerciseId, otherId, otherId, "10/23/2023", "01:02:35", "01:03:25"));
                                    sets.push(generateRandomSet(userId, exerciseId, otherId, otherId, "10/29/2023", "03:03:35", "03:06:24"));
                                    sets.push(generateRandomSet(userId, exerciseId, otherId, otherId, "10/24/2023", "03:15:35", "03:17:25"));
                                    
                                    spyOn(ph.sh, 'ListSets').withArgs(userId).and.returnValue(sets);
                            
                                    let resp = await ph.getExercisePlot(url)
                                    console.log(resp);
                                    expect(resp.getCode()).toBe(400);
                                    
                        });

                        it("test empty sets ", async () => {
                            const userId = generateShortUUID();
                                        const exerciseId = generateShortUUID();
                                        const otherId = generateShortUUID();
                                        const url = `/${userId}/plot/?exerciseId=${exerciseId}&startDate=10/2asd/2023&numOfDays=-1`
                                        
                                        let sets = [];
                                    
                                        spyOn(ph.sh, 'ListSets').withArgs(userId).and.returnValue(sets);
                                
                                        let resp = await ph.getExercisePlot(url)
                                        console.log(resp);
                                        expect(resp.getCode()).toBe(400);         
                            });
    });
});
