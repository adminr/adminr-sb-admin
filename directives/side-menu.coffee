mod = angular.module('adminr-sb-admin')

mod.controller('SideMenuCtrl',['$scope','AdminrSBAdmin',($scope,AdminrSBAdmin)->
  $scope.homePage = AdminrSBAdmin.homePage
])
