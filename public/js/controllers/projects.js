'use strict';

angular.module('mean.projects').controller('ProjectsController', ['$scope', '$routeParams', '$location', 'Global', 'Projects', function ($scope, $routeParams, $location, Global, Projects) {
    $scope.global = Global;

    var cellClassTemplate = '<div class="ngCellText" ng-class="row.entity.Level2Array[col.index-2].cssClass"><span ng-cell-text>{{row.getProperty(col.field)}}</span></div>';

    $scope.gridOptions = {
        data: 'projects',
        showGroupPanel: true,
        jqueryUIDraggable: true,
        enableCellSelection: true,
        enableCellEdit: true,
        enablePinning: false,
        enableColumnResize: true,
        enableRowReordering:true,
        enableRowSelection:true,
        multiSelect: false,
        enableColumnReordering:true,
        showFilter:true,
        canSelectRows: false,
        selectWithCheckboxOnly: true,
        displaySelectionCheckbox: true,
        columnDefs: [
            {field:'ver', displayName:'v', enableCellEdit: false,width: "*", pinned: true },
            {field:'updated', displayName:'u', enableCellEdit: false,width: "*", pinned: true },
            {field:'created', displayName:'c', enableCellEdit: false,width: "*", pinned: true },
            {field:'updatedBy', displayName:'ub', enableCellEdit: false,width: "*", pinned: true },
            {field:'createdBy', displayName:'cb', enableCellEdit: false,width: "*", pinned: true },
            {field:'user.name', displayName:'user', enableCellEdit: false,width: "*", pinned: true },
            {field:'category', displayName:'Category', enableCellEdit: true,width: "*", pinned: false },
            {field:'title', displayName:'Project', enableCellEdit: true, width: "*", pinned: false, cellTemplate: cellClassTemplate},
            {field:'asset', displayName:'Asset', enableCellEdit: true, width: "*", pinned: false }
        ]
    }

    $scope.$on('ngGridEventStartCellEdit', function(evt){
        $scope.OriginalRow = angular.copy(evt.targetScope.row.entity);
        console.log("OriginalRow", $scope.OriginalRow);
    });

    $scope.$on('ngGridEventEndCellEdit', function(evt){
        $scope.UpdatedRow = evt.targetScope.row.entity;
        console.log('UpdatedRow', $scope.UpdatedRow, $scope.OriginalRow);
        if(!(JSON.stringify($scope.OriginalRow) == JSON.stringify($scope.UpdatedRow))){
            //save the object
            $scope.project = $scope.UpdatedRow;
            var project = $scope.project;
            project.updated = new Date().getTime();

            project.$update(function() {
                //$location.path('projects/' + project._id);
                console.log(project._id);
            });
        }
    });

    $scope.create = function() {
        var project = new Projects({
            title: this.title,
            description: this.description,
            category: this.category
        });
        if (!project.created) {
            project.created = [];
        }
        project.created.push(new Date().getTime());

        project.$save(function(response) {
            $location.path('projects/' + response._id);
        });

        this.title = '';
        this.category = '';
        this.description = '';
    };

    $scope.remove = function(project) {
        if (project) {
            project.$remove();

            for (var i in $scope.projects) {
                if ($scope.projects[i] === project) {
                    $scope.projects.splice(i, 1);
                }
            }
        }
        else {
            $scope.project.$remove();
            $location.path('projects');
        }
    };

    $scope.update = function() {
        var project = $scope.project;

        project.updated = new Date().getTime();

        project.$update(function() {
            $location.path('projects/' + project._id);
        });
    };

    $scope.find = function() {
        Projects.query(function(projects) {
            $scope.projects = projects;


        });
    };

    $scope.findOne = function() {
        Projects.get({
            projectId: $routeParams.projectId
        }, function(project) {
            $scope.project = project;
        });
    };
}]);