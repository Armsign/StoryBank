/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var myApp = angular.module('PLTravers');

myApp.controller('CharSelectCTRL', ['$scope', '$mdDialog', function($scope, $mdDialog) 
{ 

    $scope.returnImage = function(imageToReturn)
    {        
        $mdDialog.hide(imageToReturn);
    }
    
    $scope.hideModal = function()
    {
        $mdDialog.cancel();
    }    

}]);
