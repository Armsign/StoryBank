/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var myApp = angular.module('PLTravers');

myApp.controller('KeyboardCTRL', ['$rootScope', '$scope', function($rootScope, $scope) 
{ 
    $scope.capsLock = false;
    $scope.activeStory = '';

    $scope.keyClick = function($event, keyClicked)
    {
        if (keyClicked === 'BACKSPACE')
        {
            $scope.activeStory = $scope.activeStory.slice(0, -1);
        } else if (keyClicked === 'SHIFT') {
            $scope.capsLock = !$scope.capsLock;
        } else if (keyClicked === 'DEPOSIT') {            
            $scope.capsLock = true;
            $scope.activeStory = $scope.activeStory + keyClicked;
        } else {        
            $scope.activeStory = $scope.activeStory + keyClicked;
        }
        
        //  SET GLOBAL FOR TRANSITION PROMPTS
        $rootScope.activeStory = $scope.activeStory;
        
        
        /*
        angular.element($event.currentTarget).removeClass("animated pulse");
        angular.element($event.currentTarget)
                .removeClass()
                .addClass("animated pulse")
                .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
                    $(this).removeClass(); 
                } );
        */

        
        //         angular.element( document.querySelector( '#artefact0' + $scope.activeArtefact ) ).addClass("animated tada selectedImage");
        
    };
    
}]);
