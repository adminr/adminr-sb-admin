var mod = angular.module('adminr-core-test',['adminr-sb-admin','adminr-sb-admin']);

mod.config(function(AdminrDataSourcesProvider,AdminrLoginProvider,AdminrSBAdminProvider){
    AdminrSBAdminProvider.setAsRootContainerWithLogin()
    AdminrLoginProvider.usernameType = AdminrLoginProvider.TEXT
    var datasource = AdminrDataSourcesProvider.createDataSource('Test','https://adminr-test-api.herokuapp.com')
    datasource.addResource('Me','/me')
})

//mod.run(function($templateCache){
//    $templateCache.put('logged-view.html','<div ng-controller="TestCtrl"><h1>Hello {{me.loading ? \'...\' : me.data.username}} <br /><small>You are now logged!</small></h1><button ng-click="datasource.logout()">logout</button></div>')
//})

mod.config(function(AdminrSBAdminProvider) {
    AdminrSBAdminProvider.setHomePage('Dashboard', 'dashboard.html')
    AdminrSBAdminProvider.addPage('users', 'Users', '/users', 'users.html').setIcon('users')
})

mod.controller('TestCtrl',function($scope,AdminrDataSources){
    $scope.datasource = DataSources.getDataSource('Test')
    $scope.me = $scope.datasource.getResource('Me').get()
})