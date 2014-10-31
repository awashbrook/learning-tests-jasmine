var _ = require("lodash");
var sandboxedModule = require("sandboxed-module");

function toObject(items) {
    var result = {};
    for (var i = 0; i < items.length; i++) {
        result[items[i]] = true;
    }
    return result;
}

var defaultOptions = {
    xhtml: false,
    transforms: []
};

var voidTags = toObject([
    "area", "base", "br", "col", "command", "embed",
    "hr", "img", "input", "keygen", "link", "meta",
    "param", "source", "track", "wbr"
]);

var booleanAttributes = toObject([
    "checked", "selected", "disabled"
]);

function render(current, scope, options) {
    var result = [];

    scope = _.extend({}, scope);

    if (_.isArray(current)) {
        scope.type = "array";
    }
    else if (_.isPlainObject(current)) {
        scope.type = "object"
    }
    else if (current !== undefined && current !== null && !_.isBoolean(current)) {
        scope.type = "primitive";
    }
    else {
        scope.type = "unsupported";
    }

    for (var i = 0; i < options.transforms.length; i++) {
        current = options.transforms[i](current, scope, options);
    }

    if (scope.type === "array") {
        for (var i = 0; i < current.length; i++) {
            result.push(render(current[i], scope, options));
        }
    }

    else if (scope.type === "object") {
        var tag = current.tag || "div";
        var attr = current.attr || current.attrs || {};

        if (current.class) {
            attr.class = attr.class ? current.class + " " + attr.class : current.class;
        }

        result.push("<" + tag);
        for (var attrName in attr) {
            var attrValue = attr[attrName];
            if (attrValue === undefined || attrValue === null) {
                continue;
            }

            var isBoolean = attrName in booleanAttributes;

            if (_.isPlainObject(attrValue)) {
                attrValue = JSON.stringify(attrValue);
            }
            else if (isBoolean && attrValue === true) {
                attrValue = options.xhtml ? attrName : "";
            }

            if (!isBoolean || attrValue !== false) {
                result.push(" " + attrName + (attrValue !== "" || options.xhtml ? "=\"" + _.escape(attrValue) + "\"" : ""));
            }
        }

        if (tag in voidTags) {
            result.push(options.xhtml ? " />" : ">");
        }
        else {
            result.push(">");
            result.push(render(current.content, scope, options));
            result.push("</" + tag + ">");
        }
    }

    else if (scope.type === "primitive") {
        result.push(current);
    }

    return result.join("");
}

function renderTemplate(template, options) {
    options = _.defaults({}, options, defaultOptions);
    return render(template, {}, options);
}

var expressCache = {};

module.exports = {
    render: renderTemplate,

    __express: function (options) {
        options = _.extend({}, options);
        return function (templatePath, data, callback) {
            try {
                var template;
                var cacheEnabled = data.settings && data.settings["view cache"];
                if (cacheEnabled && templatePath in expressCache) {
                    template = expressCache[templatePath];
                }
                else {
                    template = sandboxedModule.require(templatePath);
                    if (cacheEnabled) {
                        expressCache[templatePath] = template;
                    }
                }
                var compiledTemplate = template(data);
                callback(null, renderTemplate(compiledTemplate, options));
            }
            catch (e) {
                callback(e, null);
            }
        }
    }
};