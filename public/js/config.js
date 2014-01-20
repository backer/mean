'use strict';

//Setting up route
angular.module('mean').config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/projects', {
                templateUrl: 'views/projects/list.html'
            }).
            when('/projects/create', {
                templateUrl: 'views/projects/create.html'
            }).
            when('/projects/:projectId/edit', {
                templateUrl: 'views/projects/edit.html'
            }).
            when('/projects/:projectId', {
                templateUrl: 'views/projects/view.html'
            }).
        when('/articles', {
            templateUrl: 'views/articles/list.html'
        }).
        when('/articles/create', {
            templateUrl: 'views/articles/create.html'
        }).
        when('/articles/:articleId/edit', {
            templateUrl: 'views/articles/edit.html'
        }).
        when('/articles/:articleId', {
            templateUrl: 'views/articles/view.html'
        }).
        when('/', {
            templateUrl: 'views/index.html'
        }).
        otherwise({
            redirectTo: '/'
        });
    }
]);

//Setting HTML5 Location Mode
angular.module('mean').config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.hashPrefix('!');
    }
]);