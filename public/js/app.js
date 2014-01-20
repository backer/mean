'use strict';

angular.module('mean', ['ngCookies', 'ngResource', 'ngRoute', 'ui.bootstrap', 'ngGrid',
                         'ui.router', 'mean.system', 'mean.articles', 'mean.projects']);

angular.module('mean.system', []);
angular.module('mean.articles', []);
angular.module('mean.projects', []);