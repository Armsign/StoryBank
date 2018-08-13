/*
 *      PL Travers Building
 *      
 *      Story Bank
 */

var myApp = angular.module('PLTravers', ['ngRoute', 'ngMaterial', 'ngAria', 'ngAnimate', 'ngCookies', 'dataGrid', 'pagination', 'ngTagsInput']);

myApp.controller('ContainerCTRL', ['$scope', '$location', function($scope, $location) 
{ 

    $scope.changeLocation = function(location)
    {        
        $location.path("/" + location);  
    }

    angular.element(document).ready(function () 
    {        
        //  Nothing good to go in here ;p
    });   

}]);

myApp.controller('RecordCTRL', [ '$scope', '$timeout', function ($scope, $timeout) 
{

    $scope.recorder = null;    
    $scope.isRecording = 0;
    $scope.promise = null;
    $scope.downloadURL = null;
    
    $scope.collatedData = {
        
        'title' : '',
        'storedBy' : '',
        'audioType' : '',
        'audioLength' : '',
        'transcription' : '',
        'daBlob' : ''
        
    };

    $scope.startRecording = function() 
    {
        if ($scope.recorder)
        {
            $scope.recorder.record();        
            $scope.isRecording = 1;
            
            //  Make syre to switch it off ...
            $scope.promise = $timeout($scope.stopRecording, 180000);
        }
        
    };    
    
    $scope.stopRecording = function() 
    {
        
        //  Clear a timeout if one exists
        if ($scope.promise)
        {
            $timeout.cancel($scope.promise);
        }
        
        if ($scope.recorder && $scope.isRecording === 1)
        {
            $scope.recorder.stop();
            $scope.isRecording = 2;
            
            $scope.recorder.exportWAV(function(blob) 
            {
                //  Ok all this then ... the blob looks like the wav
                $scope.downloadURL = URL.createObjectURL(blob);            
                
                $scope.$digest();
            });
            
            //  Clear the contents of the recorder buffer
            $scope.recorder.clear();
        }

    }    

    angular.element(document).ready(function () 
    {        
        //  Authenticate and wait? Yes
        //  Let's get it started
        $scope.audio_context = new AudioContext();    
        $scope.user_media = window.navigator.getUserMedia || window.navigator.webkitGetUserMedia;        
        $scope.current_url = window.URL || window.webkitURL;

        //  This requires a SSL layer to work effectively in chrome
        window.navigator.mediaDevices.getUserMedia({ audio: true })
            .then(function(stream) {

                //  Time to make a stream, hooray
                window.source = $scope.audio_context.createMediaStreamSource(stream);

                //  Instanciate the mic recorder with the stream
                $scope.recorder = new Recorder(window.source);

            });        
          
    });  

}]);

myApp.controller('PlaybackCTRL', function () { });

myApp.controller('MenuCtrl', function () { });

myApp.controller('MemberCtrl', function ($scope, $mdDialog, dataToPass) 
{ 
    $scope.member = dataToPass.member;
    
    angular.element(document).ready(function () 
    {        
       return;
    });     
    
});

myApp.controller('RoomCTRL', function ($rootScope, $scope, $routeParams, $location) 
{ 
    $scope.activeStory = '';
    $scope.activeArtefact = -1;
    $scope.minutes = 0;
    
    $scope.switchArtefact = function($event, room, artefact)
    {
        //  Something happened ...
        $scope.minutes = 0; 
        
        if ((artefact !== ($routeParams.artefact) * 1) && ( $rootScope.activeStory.length === 0 || ($rootScope.activeStory.length > 0 && confirm('Abandon this story?'))))
        {
            $scope.activeArtefact = artefact;
            $location.path('/Room/View/' + room + '/' + artefact);
        }
        
    }; 
    
    $scope.timeOut = function()
    {        
        if($scope.minutes < 3) 
        {
            $scope.minutes++;
            window.setTimeout($scope.timeOut, 6000); /* this checks the flag every 6000 milliseconds*/
        } else { 
            //  Empty out the story ... 

            // $location.path('/Room/ScreenSaver');
        }
        
        $scope.$digest();         
    };
    
    $scope.keyClick = function(keyClicked)
    {
        $scope.activeStory = $scope.activeStory + keyClicked;
    };    
    
    angular.element(document).ready(function () 
    {                       
        $scope.activeArtefact = ($routeParams.artefact) * 1;               
        $scope.timeOut();

        //  Add new one
        angular.element( document.querySelector( '#artefact0' + $scope.activeArtefact ) ).addClass("animated tada selectedImage");
        
        $scope.$digest();
    });  

});

myApp.config(['$routeProvider', function($routeProvider) 
{      
    
    $routeProvider.  
        when('/', {                     
            templateUrl: 'Templates/Menu/menu.html',
            controller:'MenuCtrl'
        }).
        when('/Admin', { 
            templateUrl: 'Templates/Admin/admin.html',
            controller: 'AdminCTRL'    
        }). 
        when('/Room/ScreenSaver', { 
            templateUrl: 'Templates/Rooms/screenSaver.html',
            controller: 'RoomCTRL'    
        }).                 
        when('/Room/View/C/:artefact', { 
            templateUrl: 'Templates/Rooms/roomC.html',
            controller: 'RoomCTRL'    
        }).                 
        when('/Room/View/D/:artefact', { 
            templateUrl: 'Templates/Rooms/roomD.html',
            controller: 'RoomCTRL'    
        }).                 
        when('/Room/View/E/:artefact', { 
            templateUrl: 'Templates/Rooms/roomE.html',
            controller: 'RoomCTRL'    
        }).                                 
        when('/Room/View/I/:artefact', { 
            templateUrl: 'Templates/Rooms/roomI.html',
            controller: 'RoomCTRL'    
        }).                  
        when('/Room/View/L/:artefact', { 
            templateUrl: 'Templates/Rooms/roomL.html',
            controller: 'RoomCTRL'    
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
