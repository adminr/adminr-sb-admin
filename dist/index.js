(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var mod;

mod = angular.module('adminr-sb-admin');

mod.directive('adminrPagination', [
  'uibPaginationConfig', function(uibPaginationConfig) {
    uibPaginationConfig.firstText = '<<';
    uibPaginationConfig.lastText = '>>';
    uibPaginationConfig.previousText = '<';
    uibPaginationConfig.nextText = '>';
    uibPaginationConfig.maxSize = 10;
    return {
      template: '<uib-pagination ng-change="dataChanged()" ng-model="data.page" total-items="data.count" items-per-page="data.limit" boundary-links="true" rotate="false"></uib-pagination>',
      scope: {
        adminrResource: '='
      },
      link: function(scope) {
        scope.data = {};
        scope.$watch('adminrResource.range', function(newRange) {
          if (newRange) {
            scope.data.count = newRange.count;
            scope.data.page = Math.floor(newRange.offset / newRange.limit) + 1;
            return scope.data.limit = newRange.limit;
          }
        }, true);
        return scope.dataChanged = function() {
          var range;
          range = scope.adminrResource.range;
          range.limit = scope.data.limit;
          return range.offset = (scope.data.page - 1) * range.limit;
        };
      }
    };
  }
]);


},{}],2:[function(require,module,exports){
var mod;

mod = angular.module('adminr-sb-admin');

mod.directive('adminrPanel', function() {
  return {
    compile: function(elm, attributes) {
      var body, heading, newBody, newHeading, panel;
      panel = angular.element('<div class="panel panel-default"></div>');
      body = elm.find('panel-body');
      if (body.length === 0) {
        body = angular.element('<div class="panel-body"></div>');
        body.append(elm.contents());
      } else {
        newBody = angular.element('<div class="panel-body"></div>');
        newBody.append(body.contents());
        body = newBody;
      }
      heading = elm.find('panel-heading');
      if (body.length !== 0) {
        newHeading = angular.element('<div class="panel-heading"></div>');
        newHeading.append(heading.contents());
        heading = newHeading;
      }
      panel.append(heading);
      panel.append(body);
      return elm.replaceWith(panel);
    }
  };
});


},{}],3:[function(require,module,exports){
var mod;

mod = angular.module('adminr-sb-admin');

mod.controller('SideMenuCtrl', [
  '$scope', 'AdminrSBAdmin', function($scope, AdminrSBAdmin) {
    return $scope.homePage = AdminrSBAdmin.homePage;
  }
]);


},{}],4:[function(require,module,exports){
var mod;

mod = angular.module('adminr-sb-admin');

mod.directive('adminrTable', function() {
  return {
    compile: function(elm, attributes) {
      var body, bodyResource, cell, header, headerCell, i, j, len, len1, ref, ref1, results, row, sortColumn, text;
      elm.addClass('table table-bordered table-hover table-striped dataTable');
      ref = elm.find('tbody');
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        body = ref[i];
        if (angular.element(body).attr('body-generate-header') === void 0) {
          continue;
        }
        body = angular.element(body);
        bodyResource = body.attr('body-resource');
        header = angular.element('<thead header-resource="' + bodyResource + '"></thead>');
        row = angular.element('<tr></tr>');
        header.append(row);
        ref1 = body.find('td');
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          cell = ref1[j];
          cell = angular.element(cell);
          text = cell.attr('header') || '';
          headerCell = angular.element('<th>' + text + '</th>');
          sortColumn = cell.attr('sort-column');
          if (sortColumn) {
            headerCell.attr('sort-column', sortColumn);
          }
          row.append(headerCell);
          cell.removeAttr('header');
        }
        results.push(body.parent()[0].insertBefore(header[0], body[0]));
      }
      return results;
    }
  };
});

mod.directive('tableResource', function() {
  return {
    compile: function(elm, attributes) {
      var bodies;
      elm.addClass('table table-bordered table-hover table-striped');
      bodies = elm.find('tbody');
      if (bodies.length === 0) {
        bodies = angular.element('<tbody></tbody>');
        elm.append(bodies);
      }
      bodies.attr('body-resource', attributes.tableResource);
      if (attributes.tableResourcePath) {
        return bodies.attr('body-resource-path', attributes.tableResourcePath);
      }
    }
  };
});

mod.directive('bodyResource', function() {
  return {
    compile: function(elm, attributes) {
      var row;
      row = elm.find('tr');
      if (row.length === 0) {
        row = angular.element('<tr></tr>');
        elm.append(row);
      }
      return row.attr('ng-repeat', 'row in ' + attributes.bodyResource + (attributes.bodyResourcePath ? '.' + attributes.bodyResourcePath : ''));
    }
  };
});

mod.directive('headerResource', function() {
  return {
    compile: function(elm, attrs) {
      var cell, cells, i, len, resource, sortColumn;
      cells = elm.find('th');
      resource = attrs['headerResource'];
      for (i = 0, len = cells.length; i < len; i++) {
        cell = cells[i];
        cell = angular.element(cell);
        sortColumn = cell.attr('sort-column');
        if (sortColumn) {
          cell.addClass('{{sortClass(\'' + sortColumn + '\')}}');
          cell.attr('ng-click', 'sort(\'' + sortColumn + '\')');
        }
      }
      return function($scope) {
        $scope.sortClass = function(sortColumn) {
          var order;
          order = $scope.$eval(resource + '.params.order');
          if (order === sortColumn) {
            return 'sorting_asc';
          } else if (order === '-' + sortColumn) {
            return 'sorting_desc';
          }
          return 'sorting';
        };
        return $scope.sort = function(sortColumn) {
          var order;
          order = $scope.$eval(resource + '.params.order');
          if (order === '-' + sortColumn) {
            return $scope.$eval(resource + '.params.order = undefined');
          } else if (order === sortColumn) {
            return $scope.$eval(resource + '.params.order = \'-' + sortColumn + '\'');
          } else {
            return $scope.$eval(resource + '.params.order = \'' + sortColumn + '\'');
          }
        };
      };
    }
  };
});


},{}],5:[function(require,module,exports){
var mod;

mod = angular.module('adminr-sb-admin');


},{}],6:[function(require,module,exports){
var mod;

mod = angular.module('adminr-sb-admin', ['adminr-login', 'adminr-datasources', 'ui.bootstrap', 'ui.router']);

require('./directives/pagination.coffee');

require('./directives/panel.coffee');

require('./directives/side-menu.coffee');

require('./directives/table.coffee');

require('./directives/top-menu.coffee');

mod.run(['$state', angular.noop]);

mod.run([
  '$templateCache', function($templateCache) {
    $templateCache.put('adminr-sb-admin-layout', require('./views/layout.html'));
    $templateCache.put('adminr-sb-admin-side-menu', require('./views/side-menu.html'));
    return $templateCache.put('adminr-sb-admin-top-menu', require('./views/top-menu.html'));
  }
]);

mod.config([
  '$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    return $urlRouterProvider.otherwise('/');
  }
]);

mod.provider('AdminrSBAdmin', [
  '$stateProvider', 'AdminrContainerManagerProvider', 'AdminrLoginProvider', function($stateProvider, AdminrContainerManagerProvider, AdminrLoginProvider) {
    var AdminrSBAdminStructure, Page;
    Page = (function() {
      Page.prototype.children = [];

      Page.prototype.icon = 'angle-right';

      function Page(stateName, name1, url1, templateUrl1) {
        var options;
        this.stateName = stateName != null ? stateName : 'index';
        this.name = name1;
        this.url = url1;
        this.templateUrl = templateUrl1;
        options = {
          url: this.url
        };
        if (this.templateUrl) {
          options.templateUrl = this.templateUrl;
        } else {
          options.template = '<div ui-view></div>';
        }
        options.controller = function($scope, $state) {
          return $scope.$state = $state;
        };
        this.state = $stateProvider.state(this.stateName, options);
      }

      Page.prototype.addPage = function(state, name, url, templateUrl) {
        var page;
        page = new Page(this.stateName + '.' + state, name, url, templateUrl);
        this.children.push(page);
        return page;
      };

      Page.prototype.setIcon = function(icon) {
        this.icon = icon;
        return this;
      };

      Page.prototype.getIcon = function() {
        return this.icon;
      };

      return Page;

    })();
    AdminrSBAdminStructure = (function() {
      function AdminrSBAdminStructure() {}

      AdminrSBAdminStructure.prototype.homePage = new Page();

      AdminrSBAdminStructure.prototype.brandTitle = null;

      AdminrSBAdminStructure.prototype.setAsRootContainer = function() {
        return AdminrContainerManagerProvider.setViewForRootContainer('adminr-sb-admin-layout');
      };

      AdminrSBAdminStructure.prototype.setAsRootContainerWithLogin = function() {
        AdminrLoginProvider.setAsRootContainerView();
        return AdminrLoginProvider.setLoggedView('adminr-sb-admin-layout');
      };

      AdminrSBAdminStructure.prototype.setBrandTitle = function(title) {
        return this.brandTitle = title;
      };

      AdminrSBAdminStructure.prototype.setHomePage = function(name, templateUrl) {
        return this.addPage('home', name, '/', templateUrl).setIcon('dashboard');
      };

      AdminrSBAdminStructure.prototype.addPage = function(state, name, url, templateUrl) {
        if (!this.homePage) {
          throw new Error('AdminrSBAdmin set home page before adding another pages');
        }
        return this.homePage.addPage(state, name, url, templateUrl);
      };

      AdminrSBAdminStructure.prototype.$get = function() {
        return this;
      };

      return AdminrSBAdminStructure;

    })();
    return new AdminrSBAdminStructure();
  }
]);

mod.controller('SBAdminCtrl', [
  '$scope', '$state', 'AdminrSBAdmin', function($scope, $state, AdminrSBAdmin) {
    $scope.$state = $state;
    return $scope.brandTitle = AdminrSBAdmin.brandTitle;
  }
]);


},{"./directives/pagination.coffee":1,"./directives/panel.coffee":2,"./directives/side-menu.coffee":3,"./directives/table.coffee":4,"./directives/top-menu.coffee":5,"./views/layout.html":7,"./views/side-menu.html":8,"./views/top-menu.html":9}],7:[function(require,module,exports){
module.exports = '<div id="wrapper" ng-controller="SBAdminCtrl">\n\n    <!-- Navigation -->\n    <nav class="navbar navbar-default navbar-static-top" role="navigation" style="margin-bottom: 0">\n        <div class="navbar-header">\n            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">\n                <span class="sr-only">Toggle navigation</span>\n                <span class="icon-bar"></span>\n                <span class="icon-bar"></span>\n                <span class="icon-bar"></span>\n            </button>\n            <a class="navbar-brand" ui-sref="index.home">{{brandTitle || \'SB Admin v2.0\'}}</a>\n        </div>\n        <!-- /.navbar-header -->\n\n        <div ng-include="\'adminr-sb-admin-top-menu\'"></div>\n        <!-- /.navbar-top-links -->\n\n        <div class="navbar-default sidebar" role="navigation">\n            <div class="sidebar-nav navbar-collapse" ng-include="\'adminr-sb-admin-side-menu\'">\n            </div>\n            <!-- /.sidebar-collapse -->\n        </div>\n        <!-- /.navbar-static-side -->\n\n    </nav>\n\n    <div id="page-wrapper" ui-view>\n    </div>\n    <!-- /#page-wrapper -->\n\n\n</div>\n<!-- /#wrapper -->\n';
},{}],8:[function(require,module,exports){
module.exports = '<ul class="nav" id="side-menu" ng-controller="SideMenuCtrl">\n  <!--<li class="sidebar-search">-->\n    <!--<div class="input-group custom-search-form">-->\n      <!--<input type="text" class="form-control" placeholder="Search...">-->\n                                <!--<span class="input-group-btn">-->\n                                <!--<button class="btn btn-default" type="button">-->\n                                  <!--<i class="fa fa-search"></i>-->\n                                <!--</button>-->\n                            <!--</span>-->\n    <!--</div>-->\n    <!--&lt;!&ndash; /input-group &ndash;&gt;-->\n  <!--</li>-->\n\n  <!--<li>-->\n    <!--<a href="{{homePage.url}}"><i class="fa fa-dashboard fa-fw"></i> {{homePage.name}}</a>-->\n  <!--</li>-->\n  <li ng-repeat="page in homePage.children">\n    <a ui-sref="{{page.stateName}}"><i class="fa fa-{{page.getIcon()}} fa-fw"></i> {{page.name}}</a>\n  </li>\n\n  <!--<li>-->\n    <!--<a href="#"><i class="fa fa-sitemap fa-fw"></i> Multi-Level Dropdown<span class="fa arrow"></span></a>-->\n    <!--<ul class="nav nav-second-level">-->\n      <!--<li>-->\n        <!--<a href="#">Second Level Item</a>-->\n      <!--</li>-->\n      <!--<li>-->\n        <!--<a href="#">Second Level Item</a>-->\n      <!--</li>-->\n      <!--<li>-->\n        <!--<a href="#">Third Level <span class="fa arrow"></span></a>-->\n        <!--<ul class="nav nav-third-level">-->\n          <!--<li>-->\n            <!--<a href="#">Third Level Item</a>-->\n          <!--</li>-->\n          <!--<li>-->\n            <!--<a href="#">Third Level Item</a>-->\n          <!--</li>-->\n          <!--<li>-->\n            <!--<a href="#">Third Level Item</a>-->\n          <!--</li>-->\n          <!--<li>-->\n            <!--<a href="#">Third Level Item</a>-->\n          <!--</li>-->\n        <!--</ul>-->\n        <!--&lt;!&ndash; /.nav-third-level &ndash;&gt;-->\n      <!--</li>-->\n    <!--</ul>-->\n    <!--&lt;!&ndash; /.nav-second-level &ndash;&gt;-->\n  <!--</li>-->\n\n  <!--<li>-->\n    <!--<a href="#"><i class="fa fa-bar-chart-o fa-fw"></i> Charts<span class="fa arrow"></span></a>-->\n    <!--<ul class="nav nav-second-level">-->\n      <!--<li>-->\n        <!--<a href="flot.html">Flot Charts</a>-->\n      <!--</li>-->\n      <!--<li>-->\n        <!--<a href="morris.html">Morris.js Charts</a>-->\n      <!--</li>-->\n    <!--</ul>-->\n    <!--&lt;!&ndash; /.nav-second-level &ndash;&gt;-->\n  <!--</li>-->\n  <!--<li>-->\n    <!--<a href="tables.html"><i class="fa fa-table fa-fw"></i> Tables</a>-->\n  <!--</li>-->\n  <!--<li>-->\n    <!--<a href="forms.html"><i class="fa fa-edit fa-fw"></i> Forms</a>-->\n  <!--</li>-->\n  <!--<li>-->\n    <!--<a href="#"><i class="fa fa-wrench fa-fw"></i> UI Elements<span class="fa arrow"></span></a>-->\n    <!--<ul class="nav nav-second-level">-->\n      <!--<li>-->\n        <!--<a href="panels-wells.html">Panels and Wells</a>-->\n      <!--</li>-->\n      <!--<li>-->\n        <!--<a href="buttons.html">Buttons</a>-->\n      <!--</li>-->\n      <!--<li>-->\n        <!--<a href="notifications.html">Notifications</a>-->\n      <!--</li>-->\n      <!--<li>-->\n        <!--<a href="typography.html">Typography</a>-->\n      <!--</li>-->\n      <!--<li>-->\n        <!--<a href="icons.html"> Icons</a>-->\n      <!--</li>-->\n      <!--<li>-->\n        <!--<a href="grid.html">Grid</a>-->\n      <!--</li>-->\n    <!--</ul>-->\n    <!--&lt;!&ndash; /.nav-second-level &ndash;&gt;-->\n  <!--</li>-->\n  <!--<li>-->\n    <!--<a href="#"><i class="fa fa-sitemap fa-fw"></i> Multi-Level Dropdown<span class="fa arrow"></span></a>-->\n    <!--<ul class="nav nav-second-level">-->\n      <!--<li>-->\n        <!--<a href="#">Second Level Item</a>-->\n      <!--</li>-->\n      <!--<li>-->\n        <!--<a href="#">Second Level Item</a>-->\n      <!--</li>-->\n      <!--<li>-->\n        <!--<a href="#">Third Level <span class="fa arrow"></span></a>-->\n        <!--<ul class="nav nav-third-level">-->\n          <!--<li>-->\n            <!--<a href="#">Third Level Item</a>-->\n          <!--</li>-->\n          <!--<li>-->\n            <!--<a href="#">Third Level Item</a>-->\n          <!--</li>-->\n          <!--<li>-->\n            <!--<a href="#">Third Level Item</a>-->\n          <!--</li>-->\n          <!--<li>-->\n            <!--<a href="#">Third Level Item</a>-->\n          <!--</li>-->\n        <!--</ul>-->\n        <!--&lt;!&ndash; /.nav-third-level &ndash;&gt;-->\n      <!--</li>-->\n    <!--</ul>-->\n    <!--&lt;!&ndash; /.nav-second-level &ndash;&gt;-->\n  <!--</li>-->\n  <!--<li>-->\n    <!--<a href="#"><i class="fa fa-files-o fa-fw"></i> Sample Pages<span class="fa arrow"></span></a>-->\n    <!--<ul class="nav nav-second-level">-->\n      <!--<li>-->\n        <!--<a href="blank.html">Blank Page</a>-->\n      <!--</li>-->\n      <!--<li>-->\n        <!--<a href="login.html">Login Page</a>-->\n      <!--</li>-->\n    <!--</ul>-->\n    <!--&lt;!&ndash; /.nav-second-level &ndash;&gt;-->\n  <!--</li>-->\n</ul>\n';
},{}],9:[function(require,module,exports){
module.exports = '<ul class="nav navbar-top-links navbar-right">\n  <!--<li class="dropdown">-->\n    <!--<a class="dropdown-toggle" data-toggle="dropdown" href="#">-->\n      <!--<i class="fa fa-envelope fa-fw"></i>  <i class="fa fa-caret-down"></i>-->\n    <!--</a>-->\n    <!--<ul class="dropdown-menu dropdown-messages">-->\n      <!--<li>-->\n        <!--<a href="#">-->\n          <!--<div>-->\n            <!--<strong>John Smith</strong>-->\n                                    <!--<span class="pull-right text-muted">-->\n                                        <!--<em>Yesterday</em>-->\n                                    <!--</span>-->\n          <!--</div>-->\n          <!--<div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque eleifend...</div>-->\n        <!--</a>-->\n      <!--</li>-->\n      <!--<li class="divider"></li>-->\n      <!--<li>-->\n        <!--<a href="#">-->\n          <!--<div>-->\n            <!--<strong>John Smith</strong>-->\n                                    <!--<span class="pull-right text-muted">-->\n                                        <!--<em>Yesterday</em>-->\n                                    <!--</span>-->\n          <!--</div>-->\n          <!--<div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque eleifend...</div>-->\n        <!--</a>-->\n      <!--</li>-->\n      <!--<li class="divider"></li>-->\n      <!--<li>-->\n        <!--<a href="#">-->\n          <!--<div>-->\n            <!--<strong>John Smith</strong>-->\n                                    <!--<span class="pull-right text-muted">-->\n                                        <!--<em>Yesterday</em>-->\n                                    <!--</span>-->\n          <!--</div>-->\n          <!--<div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque eleifend...</div>-->\n        <!--</a>-->\n      <!--</li>-->\n      <!--<li class="divider"></li>-->\n      <!--<li>-->\n        <!--<a class="text-center" href="#">-->\n          <!--<strong>Read All Messages</strong>-->\n          <!--<i class="fa fa-angle-right"></i>-->\n        <!--</a>-->\n      <!--</li>-->\n    <!--</ul>-->\n    <!--&lt;!&ndash; /.dropdown-messages &ndash;&gt;-->\n  <!--</li>-->\n  <!--&lt;!&ndash; /.dropdown &ndash;&gt;-->\n  <!--<li class="dropdown">-->\n    <!--<a class="dropdown-toggle" data-toggle="dropdown" href="#">-->\n      <!--<i class="fa fa-tasks fa-fw"></i>  <i class="fa fa-caret-down"></i>-->\n    <!--</a>-->\n    <!--<ul class="dropdown-menu dropdown-tasks">-->\n      <!--<li>-->\n        <!--<a href="#">-->\n          <!--<div>-->\n            <!--<p>-->\n              <!--<strong>Task 1</strong>-->\n              <!--<span class="pull-right text-muted">40% Complete</span>-->\n            <!--</p>-->\n            <!--<div class="progress progress-striped active">-->\n              <!--<div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width: 40%">-->\n                <!--<span class="sr-only">40% Complete (success)</span>-->\n              <!--</div>-->\n            <!--</div>-->\n          <!--</div>-->\n        <!--</a>-->\n      <!--</li>-->\n      <!--<li class="divider"></li>-->\n      <!--<li>-->\n        <!--<a href="#">-->\n          <!--<div>-->\n            <!--<p>-->\n              <!--<strong>Task 2</strong>-->\n              <!--<span class="pull-right text-muted">20% Complete</span>-->\n            <!--</p>-->\n            <!--<div class="progress progress-striped active">-->\n              <!--<div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" style="width: 20%">-->\n                <!--<span class="sr-only">20% Complete</span>-->\n              <!--</div>-->\n            <!--</div>-->\n          <!--</div>-->\n        <!--</a>-->\n      <!--</li>-->\n      <!--<li class="divider"></li>-->\n      <!--<li>-->\n        <!--<a href="#">-->\n          <!--<div>-->\n            <!--<p>-->\n              <!--<strong>Task 3</strong>-->\n              <!--<span class="pull-right text-muted">60% Complete</span>-->\n            <!--</p>-->\n            <!--<div class="progress progress-striped active">-->\n              <!--<div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 60%">-->\n                <!--<span class="sr-only">60% Complete (warning)</span>-->\n              <!--</div>-->\n            <!--</div>-->\n          <!--</div>-->\n        <!--</a>-->\n      <!--</li>-->\n      <!--<li class="divider"></li>-->\n      <!--<li>-->\n        <!--<a href="#">-->\n          <!--<div>-->\n            <!--<p>-->\n              <!--<strong>Task 4</strong>-->\n              <!--<span class="pull-right text-muted">80% Complete</span>-->\n            <!--</p>-->\n            <!--<div class="progress progress-striped active">-->\n              <!--<div class="progress-bar progress-bar-danger" role="progressbar" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100" style="width: 80%">-->\n                <!--<span class="sr-only">80% Complete (danger)</span>-->\n              <!--</div>-->\n            <!--</div>-->\n          <!--</div>-->\n        <!--</a>-->\n      <!--</li>-->\n      <!--<li class="divider"></li>-->\n      <!--<li>-->\n        <!--<a class="text-center" href="#">-->\n          <!--<strong>See All Tasks</strong>-->\n          <!--<i class="fa fa-angle-right"></i>-->\n        <!--</a>-->\n      <!--</li>-->\n    <!--</ul>-->\n    <!--&lt;!&ndash; /.dropdown-tasks &ndash;&gt;-->\n  <!--</li>-->\n  <!--&lt;!&ndash; /.dropdown &ndash;&gt;-->\n  <!--<li class="dropdown">-->\n    <!--<a class="dropdown-toggle" data-toggle="dropdown" href="#">-->\n      <!--<i class="fa fa-bell fa-fw"></i>  <i class="fa fa-caret-down"></i>-->\n    <!--</a>-->\n    <!--<ul class="dropdown-menu dropdown-alerts">-->\n      <!--<li>-->\n        <!--<a href="#">-->\n          <!--<div>-->\n            <!--<i class="fa fa-comment fa-fw"></i> New Comment-->\n            <!--<span class="pull-right text-muted small">4 minutes ago</span>-->\n          <!--</div>-->\n        <!--</a>-->\n      <!--</li>-->\n      <!--<li class="divider"></li>-->\n      <!--<li>-->\n        <!--<a href="#">-->\n          <!--<div>-->\n            <!--<i class="fa fa-twitter fa-fw"></i> 3 New Followers-->\n            <!--<span class="pull-right text-muted small">12 minutes ago</span>-->\n          <!--</div>-->\n        <!--</a>-->\n      <!--</li>-->\n      <!--<li class="divider"></li>-->\n      <!--<li>-->\n        <!--<a href="#">-->\n          <!--<div>-->\n            <!--<i class="fa fa-envelope fa-fw"></i> Message Sent-->\n            <!--<span class="pull-right text-muted small">4 minutes ago</span>-->\n          <!--</div>-->\n        <!--</a>-->\n      <!--</li>-->\n      <!--<li class="divider"></li>-->\n      <!--<li>-->\n        <!--<a href="#">-->\n          <!--<div>-->\n            <!--<i class="fa fa-tasks fa-fw"></i> New Task-->\n            <!--<span class="pull-right text-muted small">4 minutes ago</span>-->\n          <!--</div>-->\n        <!--</a>-->\n      <!--</li>-->\n      <!--<li class="divider"></li>-->\n      <!--<li>-->\n        <!--<a href="#">-->\n          <!--<div>-->\n            <!--<i class="fa fa-upload fa-fw"></i> Server Rebooted-->\n            <!--<span class="pull-right text-muted small">4 minutes ago</span>-->\n          <!--</div>-->\n        <!--</a>-->\n      <!--</li>-->\n      <!--<li class="divider"></li>-->\n      <!--<li>-->\n        <!--<a class="text-center" href="#">-->\n          <!--<strong>See All Alerts</strong>-->\n          <!--<i class="fa fa-angle-right"></i>-->\n        <!--</a>-->\n      <!--</li>-->\n    <!--</ul>-->\n    <!--&lt;!&ndash; /.dropdown-alerts &ndash;&gt;-->\n  <!--</li>-->\n  <!-- /.dropdown -->\n  <li uib-dropdown class="dropdown">\n    <a uib-dropdown-toggle class="dropdown-toggle" data-toggle="dropdown" href="#">\n      <i class="fa fa-user fa-fw"></i>  <i class="fa fa-caret-down"></i>\n    </a>\n    <ul uib-dropdown-menu class="dropdown-menu dropdown-user">\n      <!--<li><a href="#"><i class="fa fa-user fa-fw"></i> User Profile</a>-->\n      <!--</li>-->\n      <!--<li><a href="#"><i class="fa fa-gear fa-fw"></i> Settings</a>-->\n      <!--</li>-->\n      <!--<li class="divider"></li>-->\n      <li><a ng-click="dataSource.logout()" href="#"><i class="fa fa-sign-out fa-fw"></i> Logout</a>\n      </li>\n    </ul>\n    <!-- /.dropdown-user -->\n  </li>\n  <!-- /.dropdown -->\n</ul>\n';
},{}]},{},[6]);
