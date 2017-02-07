var requireDir = require('require-dir');
var path = require('path');
var routes = require('../routes');
var express = require('express');


module.exports = {

    registerAPIRoutes: function (app, pathRoutes) {
        /* GET home page. */
        //use the router api 
        var routerapi = express.Router();
        var dir = requireDir(pathRoutes);
        console.log("registerAPIRoutes DIR  " + JSON.stringify(dir) + "pathRoutes " + pathRoutes);


        //list every controllers in folder
        Object.keys(dir).forEach(function (item) {
            var controllerName = (item.substring(0, item.length - 10)).toLowerCase();

            //current controller functions
            var current = dir[item];
            if (item.charAt(0) != "_") {

                //list every function in the current controller
                Object.keys(current).forEach(function (item) {
                    var baseapi = "/" + controllerName + "/";
                    if (item != "index") {
                        console.log("base API  " + (baseapi + item));
                        // routerapi.all(baseapi + item, current[item]);
                        baseapi = baseapi + item;
                    } else {
                        console.log("base API  " + baseapi);
                        //  routerapi.all(baseapi, current[item]);
                    }
                    //console.log(controllerName + " ______E")
                    registerRouteType(routerapi, baseapi, current[item], "all")
                });
            }
        });
        //new routes for /api
        app.use(routes.prefix, routerapi);
    },

    registerCustomRoutes: function (app, pathRoutes) {
        var dir = requireDir(pathRoutes);
        var allcustomroutes = routes.customroutes;

        Object.keys(allcustomroutes).forEach(function (item) {

            var configs = allcustomroutes[item].split(".");
            var configs_req_type = item.split(" ");
            /* function to call */
            var route = configs_req_type[1];
            var type_req = configs_req_type[0];

            /* function to call */
            var controller = configs[0];
            var controlle_function = configs[1];

            var current = dir[controller];
            console.log(current[controlle_function]);

            registerRouteType(app, route, current[controlle_function], type_req)
        })
    }
}

function registerRouteType(app, route, function_register, type_req) {
    switch (type_req) {
        case "get":
            app.get(route, function_register);
            break;
        case "post":
            app.post(route, function_register);
            break;
        case "all":
            app.all(route, function_register);
        default:
            break;
    }
}