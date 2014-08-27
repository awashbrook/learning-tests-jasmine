var viewJson = require("../src");

describe("ViewJson", function () {

    describe("Primitive Renderer", function () {

        it("must render string as string", function () {
            expect(viewJson.render("string")).toEqual("string");
        });

        it("must render number as string", function () {
            expect(viewJson.render(0)).toEqual("0");
        });

        it("must not render undefined", function () {
            expect(viewJson.render(undefined)).toEqual("");
        });

        it("must not render null", function () {
            expect(viewJson.render(null)).toEqual("");
        });

        it("must not render boolean", function () {
            expect(viewJson.render(true)).toEqual("");
            expect(viewJson.render(false)).toEqual("");
        });

    });

    describe("Object Renderer", function () {

        it("must render object as tag", function () {
            expect(viewJson.render({})).toEqual("<div></div>");
        });

        it("must render object with tag as specified tag", function () {
            expect(viewJson.render({ tag: "p" })).toEqual("<p></p>");
        });

        it("must render void tags without closing tag", function () {
            expect(viewJson.render({ tag: "area" })).toEqual("<area>");
            expect(viewJson.render({ tag: "base" })).toEqual("<base>");
            expect(viewJson.render({ tag: "br" })).toEqual("<br>");
            expect(viewJson.render({ tag: "col" })).toEqual("<col>");
            expect(viewJson.render({ tag: "embed" })).toEqual("<embed>");
            expect(viewJson.render({ tag: "hr" })).toEqual("<hr>");
            expect(viewJson.render({ tag: "img" })).toEqual("<img>");
            expect(viewJson.render({ tag: "input" })).toEqual("<input>");
            expect(viewJson.render({ tag: "keygen" })).toEqual("<keygen>");
            expect(viewJson.render({ tag: "link" })).toEqual("<link>");
            expect(viewJson.render({ tag: "meta" })).toEqual("<meta>");
            expect(viewJson.render({ tag: "param" })).toEqual("<param>");
            expect(viewJson.render({ tag: "source" })).toEqual("<source>");
            expect(viewJson.render({ tag: "track" })).toEqual("<track>");
            expect(viewJson.render({ tag: "wbr" })).toEqual("<wbr>");
        });

        it("must alias attrs to attr", function () {
            expect(viewJson.render({ attrs: { style: "string" } }))
                .toEqual("<div style=\"string\"></div>");
        });

        it("must prefer attr over attrs", function () {
            expect(viewJson.render({ attr: { style: "attr" }, attrs: { style: "attrs" } }))
                .toEqual("<div style=\"attr\"></div>");
        });

        it("must render attribute string value as string", function () {
            expect(viewJson.render({ attr: { style: "string" } }))
                .toEqual("<div style=\"string\"></div>");
        });

        it("must render attribute string value as encoded string", function () {
            expect(viewJson.render({ attr: { style: "\"string\"" } }))
                .toEqual("<div style=\"&quot;string&quot;\"></div>");
        });

        it("must render attribute number value as string", function () {
            expect(viewJson.render({ attr: { style: 0 } }))
                .toEqual("<div style=\"0\"></div>");
        });

        it("must render attribute object value as JSON-string", function () {
            expect(viewJson.render({ attr: { style: { test0: 0, test2: "string" } } }))
                .toEqual("<div style=\"{&quot;test0&quot;:0,&quot;test2&quot;:&quot;string&quot;}\"></div>");
        });

        it("must not render attribute undefined value", function () {
            expect(viewJson.render({ attr: { style: undefined } }))
                .toEqual("<div></div>");
        });

        it("must not render attribute null value", function () {
            expect(viewJson.render({ attr: { style: null } }))
                .toEqual("<div></div>");
        });

        it("must render attribute bool value as string", function () {
            expect(viewJson.render({ attr: { style1: true, style2: false } }))
                .toEqual("<div style1=\"true\" style2=\"false\"></div>");
        });

        it("must render boolean attribute as just present/absent", function () {
            expect(viewJson.render({ attr: { checked: true, selected: true, disabled: true } }))
                .toEqual("<div checked selected disabled></div>");
            expect(viewJson.render({ attr: { checked: false, selected: false, disabled: false } }))
                .toEqual("<div></div>");
        });

        it("must render class property as class attribute", function () {
            expect(viewJson.render({ class: "testClass" }))
                .toEqual("<div class=\"testClass\"></div>");
        });

        it("must render class property in concatenation with class attribute", function () {
            expect(viewJson.render({ class: "testClass", attr: { class: "existingClass" } }))
                .toEqual("<div class=\"testClass existingClass\"></div>");
        });

        it("must render content as default renderer call does", function () {
            expect(viewJson.render({ content: "string" })).toEqual("<div>string</div>");
            expect(viewJson.render({ content: 0 })).toEqual("<div>0</div>");
            expect(viewJson.render({ content: undefined })).toEqual("<div></div>");
            expect(viewJson.render({ content: null })).toEqual("<div></div>");
            expect(viewJson.render({ content: true })).toEqual("<div></div>");
            expect(viewJson.render({ content: false })).toEqual("<div></div>");
            expect(viewJson.render({ content: {} })).toEqual("<div><div></div></div>");
        });

        describe("in XHTML mode", function () {

            var options = { xhtml: true };

            it("must render void tags as self-closing tag", function () {
                expect(viewJson.render({ tag: "area" }, options)).toEqual("<area />");
                expect(viewJson.render({ tag: "base" }, options)).toEqual("<base />");
                expect(viewJson.render({ tag: "br" }, options)).toEqual("<br />");
                expect(viewJson.render({ tag: "col" }, options)).toEqual("<col />");
                expect(viewJson.render({ tag: "embed" }, options)).toEqual("<embed />");
                expect(viewJson.render({ tag: "hr" }, options)).toEqual("<hr />");
                expect(viewJson.render({ tag: "img" }, options)).toEqual("<img />");
                expect(viewJson.render({ tag: "input" }, options)).toEqual("<input />");
                expect(viewJson.render({ tag: "keygen" }, options)).toEqual("<keygen />");
                expect(viewJson.render({ tag: "link" }, options)).toEqual("<link />");
                expect(viewJson.render({ tag: "meta" }, options)).toEqual("<meta />");
                expect(viewJson.render({ tag: "param" }, options)).toEqual("<param />");
                expect(viewJson.render({ tag: "source" }, options)).toEqual("<source />");
                expect(viewJson.render({ tag: "track" }, options)).toEqual("<track />");
                expect(viewJson.render({ tag: "wbr" }, options)).toEqual("<wbr />");
            });

            it("must render boolean attribute as self-valued attribute", function () {
                expect(viewJson.render({ attr: { checked: true, selected: true, disabled: true } }, options))
                    .toEqual("<div checked=\"checked\" selected=\"selected\" disabled=\"disabled\"></div>");
                expect(viewJson.render({ attr: { checked: false, selected: false, disabled: false } }, options))
                    .toEqual("<div></div>");
            });

        });

    });

    describe("Array Renderer", function () {

        it("must render array as concatenation of all supported types", function () {
            expect(viewJson.render(["string", 0, null, undefined, {}, ["string", 0, null, undefined, {}]]))
                .toEqual("string0<div></div>string0<div></div>");
        })

    });
});