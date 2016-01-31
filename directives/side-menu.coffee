mod = angular.module('adminr-sb-admin')

mod.controller('SideMenuCtrl',['$scope','AdminrBasicLayout',($scope,AdminrBasicLayout)->
  console.log(AdminrBasicLayout.homePage)
  $scope.homePage = AdminrBasicLayout.homePage
])
