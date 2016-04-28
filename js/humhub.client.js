/**
 * Manages the client/server communication. Handles humhub json api responses and
 * pjax requests.
 */
humhub.initModule('client', function (module, require, $) {
    var object = require('util').object;
    var scripts = require('scripts');
    
    var init = function() {
        /*$.ajaxPrefilter('html', function(options, originalOptions, jqXHR) {
            debugger;
            console.log(options);
            var pjaxHandler = options.success;
            options.success = function(result, textStatus, xhr) {
                console.log(result);
                pjaxHandler(result, textStatus, xhr);
            };
            options.error = function(err) {
                debugger;
            };
        });
        
        ///TEESSS 
        $.pjax.defaults.maxCacheLength = 0;
        $('a.dashboard').on('click', function(evt) {
            debugger;
            evt.preventDefault();
            $.pjax({url:$(this).attr('href'), container: '#main-content', maxCacheLength:0, timeout:2000});
        });*/
    }
    /**
     * Response Wrapper Object for easily accessing common data
     */
    var Response = function (data) {
        this.data = data;
        $.extend(this, data);
    };

    /**
     * Checks if the response is a confirmation of the request
     * @returns {Boolean}
     */
    Response.prototype.isConfirmation = function () {
        return this.getStatus() === 0;
    };

    //TODO: isValidationError status 2 

    /**
     * Checks if the response is marke
     * @returns {humhub.client_L5.Response.data.status|Boolean}
     */
    Response.prototype.isError = function () {
        return this.getStatus() > 0 || this.getErrors().length;
    };
    
     Response.prototype.getStatus = function () {
         return (this.status) ? this.status : -1;
     };
    
    Response.prototype.getFirstError = function() {
        var errors = this.getErrors();
        if(errors.length) {
            return errors[0];
        }
    };
    
    Response.prototype.setAjaxError = function(xhr, errorThrown, textStatus,data , status) {
        this.xhr = xhr;
        this.textStatus = textStatus;
        this.status = status || xhr.status;
        this.errors = [errorThrown];
    };

    /**
     * Returns an array of errors or an empty array so getErrors().length is always
     * safe.
     * @returns {array} error array or empty array
     */
    Response.prototype.getErrors = function () {
        var errors = this.errors || [];
        return (object.isString(errors)) ? [errors] : errors;
    };

    Response.prototype.toString = function () {
        return "{ status: " + this.getStatus() + " error: " + this.getErrors() + " data: " + this.getContent() + " }";
    };

    var submit = function ($form, cfg) {
        var cfg = cfg || {};
        $form = object.isString($form) ? $($form) : $form;
        cfg.type = $form.attr('method') || 'post';
        cfg.data = $form.serialize();
        ajax($form.attr('action'), cfg);
    };

    var post = function(path, cfg) {
        var cfg = cfg || {};
        cfg.type = 'POST';
        return ajax(path, cfg);
    };

    var ajax = function (path, cfg) {
        return new Promise(function(resolve, reject) {
            var cfg = cfg || {};
            var async = cfg.async || true;
            var dataType = cfg.dataType || "json";

            var error = function (xhr, textStatus, errorThrown, data, status) {
                //Textstatus = "timeout", "error", "abort", "parsererror", "application"
                if (cfg.error && object.isFunction(cfg.error)) {
                    var response = new Response();
                    response.setAjaxError(xhr, errorThrown, textStatus, data, status);
                    cfg.error(response);
                }
                reject(xhr, textStatus, errorThrown, data, status);
            };

            var success = function (json, textStatus, xhr) {
                var response = new Response(json);
                if (response.isError()) { //Application errors
                    return error(xhr, "application", response.getErrors(), json, response.getStatus() );
                } else if (cfg.success) {
                    response.textStatus = textStatus;
                    response.xhr = xhr;
                    cfg.success(response);
                }
                resolve(response);
            };

            $.ajax({
                url: path,
                data: cfg.data,
                type: cfg.type,
                beforeSend: cfg.beforeSend,
                processData: cfg.processData,
                contentType: cfg.contentType,
                async: async,
                dataType: dataType,
                success: success,
                error: error
            });
        });
    };

    module.export({
        ajax: ajax,
        post: post,
        submit: submit,
        init: init
    });
});

/**
 * 
        var handleResponse = function (json, callback) {
            var response = new Response(json);
            if (json.content) {
                response.$content = $('<div>' + json.content + '</div>');

                //Find all remote scripts and remove them from the partial
                var scriptSrcArr = [];
                response.$content.find('script[src]').each(function () {
                    scriptSrcArr.push($(this).attr('src'));
                    $(this).remove();
                });

                //Load the remote scripts synchronously only if they are not already loaded.
                scripts.loadOnceSync(scriptSrcArr, function () {
                    callback(response);
                });
            } else {
                callback(response);
            }
        };
 */