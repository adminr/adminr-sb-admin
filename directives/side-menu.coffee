mod = angular.module('adminr-sb-admin')

mod.controller('SideMenuCtrl',['$scope','AdminrBasicLayout',($scope,AdminrBasicLayout)->
  $scope.homePage = AdminrBasicLayout.homePage
])
