/*
 *      PL Travers Building
 *      
 *      Story Bank
 */

var myApp = angular.module('PLTravers', ['ngRoute', 'ngMaterial', 'ngAria', 'ngAnimate', 'ngCookies', 'dataGrid', 'pagination', 'ngTagsInput', 'textAngular']);

myApp.controller('ContainerCTRL', function($rootScope, $scope, $location) 
{ 
    //  Timeout functionality
    $rootScope.screenSaverTimeout = '';    
    $rootScope.timeInMilliSeconds = 360000;
    $rootScope.lastKeyPress = undefined;   
    $rootScope.openDialog = undefined;

    $rootScope.timeOut = function()
    {
        var myDate = new Date();
        if (myDate.getTime() - $rootScope.lastKeyPress >= $rootScope.timeInMilliSeconds)
        {
            if ($rootScope.openDialog && $rootScope.openDialog != false)
            {
                $mdDialog.cancel();
                $rootScope.openDialog = false;
            }
            
            clearTimeout($rootScope.screenSaverTimeout);
            $location.path('/Room/ScreenSaver');
            
            $scope.$apply();        
        } else {
            //  Reschedule, someone is using the keyboard
            $rootScope.screenSaverTimeout = setTimeout(function(){ $rootScope.timeOut(); }, $rootScope.timeInMilliSeconds);             
        }
    };

    //  General navigation
    $scope.changeLocation = function(location)
    {        
        $location.path("/" + location);  
    };

    angular.element(document).ready(function () 
    {        
        //  Nothing good to go in here ;p
    });   

});

myApp.controller('DepositsCTRL', function($rootScope, $scope, $location, $routeParams) 
{ 
    $scope.activeArtefact = -1;
    
    $scope.switchArtefact = function($event, room, artefact)
    {
        clearTimeout($rootScope.screenSaverTimeout);
        $rootScope.screenSaverTimeout = setTimeout(function() { $rootScope.timeOut(); }, $rootScope.timeInMilliSeconds);         
        
        //  Should we allow it?
        if (artefact !== $scope.activeArtefact)              
        {
            $scope.activeArtefact = artefact;
            $location.path('/Room/View/' + room + '/' + artefact);
        } 
    }     

    angular.element(document).ready(function () 
    {        
        //  Handle timeout stuff
        var myDate = new Date();
        $rootScope.lastKeyPress = myDate.getTime();
        
        clearTimeout($rootScope.screenSaverTimeout);
        $rootScope.screenSaverTimeout = setTimeout(function(){ $rootScope.timeOut(); }, $rootScope.timeInMilliSeconds);        
        
        //  Nothing good to go in here ;p
        $scope.activeArtefact = "00000" + $routeParams.artefact;               
        $scope.activeArtefact =  $scope.activeArtefact.substring($scope.activeArtefact.length - 2, $scope.activeArtefact.length);

        //  Add new one
        angular.element( document.querySelector( '#artefact' + $scope.activeArtefact ) ).addClass("animated tada selectedImage");
        
        //  Make sure the arctiveArtefact is in the correct data type
        $scope.activeArtefact *= 1;        
        
        $scope.$digest();
        
    });   

});

myApp.controller('KeyboardCTRL', function($rootScope, $scope, $routeParams, $location, $http, $mdDialog) 
{ 
    $scope.capsLock = false;
    $scope.question = 'No question found'; 
    $scope.activeStory = '';    
       
    $scope.keyClick = function($event, keyClicked)
    {
        var myDate = new Date();
        $rootScope.lastKeyPress = myDate.getTime();
        
        if (keyClicked === 'SHIFT') 
        {
            
            $scope.capsLock = !$scope.capsLock;
            
        } else {
        
            if (keyClicked === 'BACKSPACE')
            {
                
                $scope.activeStory = $scope.activeStory.slice(0, -1);
                
            } else if (keyClicked === 'DEPOSIT' && $scope.activeStory.length > 0) {                        
                
                //  This should do the popup instead of the state change
                
                //  $scope.depositStage = 1;    //  Switch stage
                //  $scope.beginDepositProcess($event);
                
            } else if (keyClicked !== 'DEPOSIT') {                                        
                
                $scope.activeStory = $scope.activeStory + keyClicked;
                
            } 

            //  SET GLOBAL FOR TRANSITION PROMPTS
            $rootScope.activeStory = $scope.activeStory;
            
        }
        
        if ($scope.depositState === 0)
        {
            var textarea = document.getElementById('textForStory');
            textarea.scrollTop = textarea.scrollHeight;            
        }        
        
        //  This is the animated section ... once animation is added, run it needs to be removed ...        
        angular.element($event.currentTarget).addClass("animated pulse"); 
        
        //  Let's test this one huh
        window.setTimeout(function() { $scope.removeClasses(); }, 250);
        
    };
    
    $scope.removeClasses = function()
    {
        var result = document.getElementsByClassName("animated pulse");
        
        angular.element(result).removeClass("animated pulse");    
    }    
       
    $scope.fetchQuestion = function() 
    {
        if ($scope.artefact >= 0)
        {
            switch ($scope.artefact)
            {
                case 1:               
                case 2:                
                case 3:
                case 4:
                case 5:         
                case 6: 
                case 8:
                    $scope.question = 'to think of a magical moment, special place or person related to Maryborough? The bond of people to Maryborough and their powerful sense of place and community, is bound by stories. Share your story of Maryborough to the Story Bank.'; 
                    break; 
                case 10:
                case 11:
                case 12:
                case 13:
                case 14:
                    $scope.question = 'to start to think about a story you would like to write. Who is the main character? Write one or two sentences describing them. You might include their appearance as well as their personality; their goals or their fears.';
                    break;
                case 15:
                    $scope.question = 'to write a story about your character?';
                    break;
                case 16:
                    $scope.question = 'to write a story about your selections?';
                    break;                                        
                default:
                    $scope.question = 'to begin your story ...?';
                    break; 
            }
        }        
    }    
    
    angular.element(document).ready(function () 
    {        
        if ($routeParams && $routeParams.artefact)
        {        
            $scope.artefact = 1 * ($routeParams.artefact);                  
        }
        
        $scope.fetchQuestion();        
    });   

});

myApp.config(['$routeProvider', function($routeProvider) 
{      
    
    $routeProvider.  
        when('/', {                     
            templateUrl: 'Templates/Menu/menu.html',
            controller:''
        }).
        when('/Admin', { 
            templateUrl: 'Templates/Admin/admin.html',
            controller: 'AdminCTRL'    
        }). 
        when('/Room/ScreenSaver', { 
            templateUrl: 'Templates/Rooms/screenSaver.html',
            controller: 'ScreenSaverCTRL'    
        }).       
                
        when('/Room/View/C/:artefact', { 
            templateUrl: 'Templates/Deposits/roomC.html',
            controller: 'DepositsCTRL'    
        }).                 
                
        when('/Room/View/D/:artefact', { 
            templateUrl: 'Templates/Rooms/roomD.html',
            controller: 'RoomCTRL'    
        }).                 
        when('/Room/View/E/:artefact', { 
            templateUrl: 'Templates/Rooms/roomE.html',
            controller: 'ChargenCTRL'    
        }).                                 
        when('/Room/View/I/:artefact', { 
            templateUrl: 'Templates/Rooms/roomI.html',
            controller: 'RoomCTRL'    
        }).                  
        when('/Room/View/L/:artefact', { 
            templateUrl: 'Templates/Rooms/roomL.html',
            controller: 'RoomCTRL'    
        }).                                                 
        when('/Room/View/L/Story/:category', { 
            templateUrl: 'Templates/Withdrawal/withdrawals.html',
            controller: 'WithdrawalsCTRL'    
        }).     
        when('/Room/View/L/Story/Display/:id', { 
            templateUrl: 'Templates/Withdrawal/story.html',
            controller: 'StoryReaderCTRL'    
        }).                   
        when('/Record', { 
            templateUrl: 'Templates/Record/record.html',
            controller: 'RecordCTRL'    
        }).                 
        when('/Playback', { 
            templateUrl: 'Templates/Playback/playback.html',
            controller: 'PlaybackCTRL'      
        });                
    
}]);
