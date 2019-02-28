/*
 *      PL Travers Building
 *      
 *      Story Bank
 */

var myApp = angular.module('PLTravers', ['ngRoute', 'ngMaterial', 'ngAria', 'ngAnimate', 'ngCookies', 'dataGrid', 'pagination', 'ngTagsInput', 'textAngular']);

myApp.controller('MenuCTRL', function($scope, $location) 
{ 

    $scope.changeLocation = function(location)
    {        
        $location.path("/" + location);  
    }

});

myApp.controller('DepositsCTRL', function($scope, $location) 
{ 

    $scope.changeLocation = function(location)
    {        
        $location.path("/" + location);  
    }

    angular.element(document).ready(function () 
    {        
        //  Nothing good to go in here ;p
    });   

});

myApp.config(['$routeProvider', function($routeProvider) 
{      
    
    $routeProvider.  
        when('/', {                     
            templateUrl: 'Templates/Menu/menu.html',
            controller:'MenuCTRL'
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
