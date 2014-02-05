'use strict';

angular.module('mean.projects').controller('ProjectsController', ['$scope', '$routeParams', '$location', 'Global', 'Projects', function ($scope, $routeParams, $location, Global, Projects) {
    $scope.global = Global;

    $scope.statuses = ['Rates','Credit','Rates+Credit'];
    $scope.groups = ['TPM','Credit','iTrac','Connectors'];
    $scope.priorities = ['Critcal','High','Medium','Low','Undefined'];

    $scope.linkCellTemplate = '<div class="ngCellText" ng-class="col.colIndex()"><span ng-cell-text><a href=/#!/projects/{{row.getProperty(col.field)}}><i class="icon-info-sign"></i></a></span></div>';
    $scope.cellStatusTemplate = '<select ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-change="updateEntity(row)"><option ng-repeat="st in statuses">{{st}}</option></select>';
    $scope.cellGroupTemplate = '<select ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-change="updateEntity(row)"><option ng-repeat="st in groups">{{st}}</option></select>';
    $scope.cellPriorityTemplate = '<select ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-change="updateEntity(row)"><option ng-repeat="st in priorities">{{st}}</option></select>';
    $scope.cellEditDateTemplate = '<input ng-class="\'colt\' + col.index"  ui-date ui-date-format ng-model="COL_FIELD" >';
    $scope.cellDateTemplate = '<div  ng-class="\'colt\' + col.index" ng-model="COL_FIELD" >';

//    $scope.cellDateTemplate = '<input ui-date="{ dateFormat: \'dd mm yyyy\' }" ui-date-format="dd mm yyyy"  ng-model="COL_FIELD" ng-change="updateEntity(row)">';
//    $scope.rowTemplate='<div id={{row.getProperty("_id")}} ng-style="{ cursor: row.cursor }" ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell {{col.cellClass}}"><div class="ngVerticalBar" ng-style="{height: rowHeight}" ng-class="{ ngVerticalBarVisible: !$last }">&nbsp;</div><div ng-cell></div></div>';
//    $scope.rowTemplate='<div id={{row.getProperty("_id")}} ng-style="{ cursor: row.cursor }" ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell {{col.cellClass}}"><div class="ngVerticalBar" ng-style="{height: rowHeight}" ng-class="{ ngVerticalBarVisible: !$last }">&nbsp;</div><div ng-cell></div></div>';

//    $scope.selectedProjects = [];
    $scope.gridOptions = {
        plugins: [new ngGridFlexibleHeightPlugin(),new ngGridCsvExportPlugin(), new ngGridReorderable()],
        data: 'projects',
        showGroupPanel: true,
        jqueryUIDraggable: true,
        enableCellSelection: true,
        enableCellEdit: true,
//        enablePinning: false,
        enableColumnResize: true,
        enableRowReordering:false,
        enableRowSelection:false,
//        enableColumnReordering:true,
        multiSelect: false,
        showFooter: true,
        showColumnMenu:true,
        //keepLastSelected: true,
        enableCellEditOnFocus: true,
        enableSorting: true,
        showFilter:true,
//        canSelectRows: false,

//        selectedItems: $scope.selectedProjects,
//        rowTemplate: $scope.rowTemplate,

        columnDefs: [
            {field:'_id', displayName:'', enableCellEdit: false, width:"26px",cellTemplate: $scope.linkCellTemplate},
            {field:'category', displayName:'Category', width:"10%", enableCellEdit: true},
            {field:'title', displayName:'Project', width:"10%", enableCellEdit: true},
            {field:'asset', displayName:'Asset', width:"10%", enableCellEdit: true, enableCellEditOnFocus: true,  editableCellTemplate: $scope.cellStatusTemplate},
            {field:'group', displayName:'Group', width:"10%", enableCellEdit: true, enableCellEditOnFocus: true,  editableCellTemplate: $scope.cellGroupTemplate},
            {field:'businessArea', displayName:'businessArea', width:"10%", enableCellEdit: true, enableCellEditOnFocus: true} ,
            {field:'businessPriority', displayName:'businessPriority', width:"10%", enableCellEdit: true, enableCellEditOnFocus: true,  editableCellTemplate: $scope.cellPriorityTemplate},
            {field:'businessMoM', displayName:'businessMoM', width:"10%", enableCellEdit: true, enableCellEditOnFocus: true},
            {field:'release.date', displayName:'releaseDate', width:"10%", enableCellEdit: true, enableCellEditOnFocus: true, cellFilter:'date:\'dd MMM, yyyy\'', editableCellTemplate:$scope.cellEditDateTemplate},
            {field:'release.name', displayName:'releaseName', width:"10%", enableCellEdit: true, enableCellEditOnFocus: true}
        ]
    }

    $scope.$on('ngGridEventStartCellEdit', function(evt){
        $scope.OriginalRow = angular.copy(evt.targetScope.row.entity);
//        console.log("OriginalRow", $scope.OriginalRow);
//        console.log("test:"+$scope.selectedProjects[0]._id);
//        console.log("html:"+angular.element("div#"+$scope.selectedProjects[0]._id).css("background-color:yellow"));

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
                console.log("project id:"+project._id);
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