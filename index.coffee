mod = angular.module('adminr-sb-admin',['adminr-login','adminr-datasources','adminr-bootstrap','adminr-basic-layout','ui.bootstrap','ui.router'])

require('./directives/side-menu.coffee')
require('./directives/top-menu.coffee')

mod.run(['$state', angular.noop]);

mod.run(['$templateCache',($templateCache)->
  $templateCache.put('adminr-sb-admin-layout',require('./views/layout.html'))
  $templateCache.put('adminr-sb-admin-side-menu',require('./views/side-menu.html'))
  $templateCache.put('adminr-sb-admin-top-menu',require('./views/top-menu.html'))
])


mod.provider('AdminrSBAdmin',['AdminrContainerManagerProvider','AdminrLoginProvider',(AdminrContainerManagerProvider,AdminrLoginProvider)->

  class AdminrSBAdminStructure

    setAsRootContainer:()->
      AdminrContainerManagerProvider.setViewForRootContainer('adminr-sb-admin-layout')
    setAsRootContainerWithLogin:()->
      AdminrLoginProvider.setAsRootContainerView()
      AdminrLoginProvider.setLoggedView('adminr-sb-admin-layout')

    $get:()->
      return @

  return new AdminrSBAdminStructure()
])
