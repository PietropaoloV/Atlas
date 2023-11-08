const Util = require("../../../lib/main/util/util.js");
const ServerUtil = require("../../../lib/main/util/server-utils.js");
const { ValidationException } = require("../../../lib/main/util/exceptions.js");

describe("UtilTester", () => {

    it("IDs should be number", () => {
        var id1 = Util.generateShortUUID();
        var id2 = Util.generateShortUUID();

        expect(typeof id1).toEqual(typeof Number(0));
        expect(typeof id2).toEqual(typeof Number(0));
    });

    it("Ids should be 22 length number", () => {
        var id1 = "12313123123";
        var id2 = "1234567890123456789012";
        var id3 = "13248970000000823094871293847";

        expect(ServerUtil.validateAndConvertId(id2)).toEqual(1234567890123456789012);
        expect(function(){ServerUtil.validateAndConvertId(id1)}).toThrow(new ValidationException(`Id ${id1} is not valid id`));
        expect(function(){ServerUtil.validateAndConvertId(id3)}).toThrow(new ValidationException(`Id ${id3} is not valid id`));
    })


});