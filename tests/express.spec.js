var path = require("path");

var viewJson = require("../src");

describe("ViewJson Express renderer", function () {

    it("must render provided template", function (done) {
        var renderer = viewJson.__express();
        renderer(path.join(__dirname, "express", "template.js"), {}, function (_, result) {
            expect(result).toBe("<p></p><br>");
            done();
        });
    });

    it("must pass data to template", function (done) {
        var renderer = viewJson.__express();
        renderer(path.join(__dirname, "express", "template.js"), { test: "test" }, function (_, result) {
            expect(result).toBe("<p>test</p><br>");
            done();
        });
    });

    it("must pass options to renderer", function (done) {
        var renderer = viewJson.__express({ xhtml: true });
        renderer(path.join(__dirname, "express", "template.js"), {}, function (_, result) {
            expect(result).toBe("<p></p><br />");
            done();
        });
    });

    it("must reload template every time", function (done) {
        var renderer = viewJson.__express();
        var templatePath = path.join(__dirname, "express", "reload.js");
        renderer(templatePath, {}, function (_, result1) {
            renderer(templatePath, {}, function (_, result2) {
                expect(result2).not.toBe(result1);
                done();
            });
        });
    });

    it("must reload template dependencies every time", function (done) {
        var renderer = viewJson.__express();
        var templatePath = path.join(__dirname, "express", "reloadWithDependencies.js");
        renderer(templatePath, {}, function (_, result1) {
            renderer(templatePath, {}, function (_, result2) {
                expect(result2).not.toBe(result1);
                done();
            });
        });
    });

    it("must not reload template every time if cache is on", function (done) {
        var renderer = viewJson.__express();
        var templatePath = path.join(__dirname, "express", "reload.js");
        var data = { settings: { "view cache": true } };
        renderer(templatePath, data, function (_, result1) {
            renderer(templatePath, data, function (_, result2) {
                expect(result2).toBe(result1);
                done();
            });
        });
    });

    it("must not reload template dependencies every time if cache is on", function (done) {
        var renderer = viewJson.__express();
        var templatePath = path.join(__dirname, "express", "reloadWithDependencies.js");
        var data = { settings: { "view cache": true } };
        renderer(templatePath, data, function (_, result1) {
            renderer(templatePath, data, function (_, result2) {
                expect(result2).toBe(result1);
                done();
            });
        });
    });

});