mod = angular.module('adminr-sb-admin',['adminr-login','adminr-datasources','ui.bootstrap','ui.router'])

require('./directives/pagination.coffee')
require('./directives/panel.coffee')
require('./directives/side-menu.coffee')
require('./directives/table.coffee')
require('./directives/top-menu.coffee')
require('./directives/table-panel.coffee')

mod.run(['$state', angular.noop]);

mod.run(['$templateCache',($templateCache)->
  $templateCache.put('adminr-sb-admin-layout',require('./views/layout.html'))
  $templateCache.put('adminr-sb-admin-side-menu',require('./views/side-menu.html'))
  $templateCache.put('adminr-sb-admin-top-menu',require('./views/top-menu.html'))
])

mod.config(['$stateProvider', '$urlRouterProvider',($stateProvider, $urlRouterProvider)->
  $urlRouterProvider.otherwise('/')
])

mod.provider('AdminrSBAdmin',['$stateProvider','AdminrContainerManagerProvider','AdminrLoginProvider',($stateProvider,AdminrContainerManagerProvider,AdminrLoginProvider)->

  class Page
    children: []
    icon: 'angle-right'
    constructor:(@stateName = 'index',@name,@url,@templateUrl)->
      options = {
        url:@url
      }
      if @templateUrl
        options.templateUrl = @templateUrl
      else
        options.template = '<div ui-view></div>'

      options.controller = ($scope,$state)->
        $scope.$state = $state

      @state = $stateProvider.state(@stateName,options)

    addPage:(state,name,url,templateUrl)->
      page = new Page(@stateName + '.' + state,name,url,templateUrl)
      @children.push(page)
      return page

    setIcon:(icon)->
      @icon = icon
      return @
    getIcon:()->
      return @icon

  class AdminrSBAdminStructure

    homePage: new Page()
    brandTitle: null

    setAsRootContainer:()->
      AdminrContainerManagerProvider.setViewForRootContainer('adminr-sb-admin-layout')
    setAsRootContainerWithLogin:()->
      AdminrLoginProvider.setAsRootContainerView()
      AdminrLoginProvider.setLoggedView('adminr-sb-admin-layout')

    setBrandTitle:(title)->
      @brandTitle = title


    setHomePage: (name,templateUrl)->
      return @addPage('home',name,'/',templateUrl).setIcon('dashboard')

    addPage: (state,name,url,templateUrl)->
      if not @homePage
        throw new Error('AdminrSBAdmin set home page before adding another pages')
      return @homePage.addPage(state,name,url,templateUrl)

    $get:()->
      return @

  return new AdminrSBAdminStructure()
])


mod.controller('SBAdminCtrl',['$scope','$state','AdminrSBAdmin',($scope,$state,AdminrSBAdmin)->
  $scope.$state = $state
  $scope.brandTitle = AdminrSBAdmin.brandTitle
])