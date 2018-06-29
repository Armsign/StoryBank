/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var myApp = angular.module('PLTravers');

myApp.controller('KeyboardCTRL', ['$scope', function($scope) 
{ 
    $scope.ctrlTextArea = null;
    $scope.capsLock = 0;

    $scope.keyClick = function(keyClicked)
    {
    
        alert('Key cliecked ' + keyClicked);
        
    };

        //  Upon load ... no need
    
}]);
