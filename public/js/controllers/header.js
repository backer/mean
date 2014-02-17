'use strict';

angular.module('mean.system').controller('HeaderController', ['$scope', 'Global', function ($scope, Global) {
    $scope.global = Global;

    $scope.menu = [
        {
            'title': 'Projects',
            'link': 'projects'
        },
        {
            'title': 'Projects Metro',
            'link': 'projects-metro'
        },
        {
            'title': 'Create Project',
            'link': 'projects/create'
        },
        {
            'title': 'Articles',
            'link': 'articles'
        },
        {
            'title': 'Create New Article',
            'link': 'articles/create'
    }];
    
    $scope.isCollapsed = false;
}]);