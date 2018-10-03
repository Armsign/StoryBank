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

myApp.controller('RoomCTRL', function ($rootScope, $scope, $routeParams, $location) 
{ 
    $scope.activeStory = '';
    $scope.activeArtefact = -1;
    $scope.screenSaverTimeout = '';
    
    $rootScope.timeInMilliSeconds = 360000;
    $rootScope.lastKeyPress = undefined;
    
    $scope.switchArtefact = function($event, room, artefact)
    {
        //  Something happened ...
        clearTimeout($scope.screenSaverTimeout);
        $scope.screenSaverTimeout = setTimeout(function(){ $scope.timeOut(); }, $rootScope.timeInMilliSeconds); 
        
        if ((artefact !== ($routeParams.artefact) * 1) && ( $rootScope.activeStory.length === 0 || ($rootScope.activeStory.length > 0 && confirm('Abandon this story?'))))
        {
            $scope.activeArtefact = artefact;
            $location.path('/Room/View/' + room + '/' + artefact);
        }
        
    }; 
    
    $scope.timeOut = function()
    {
        var myDate = new Date();
        if (myDate.getTime() - $rootScope.lastKeyPress >= $rootScope.timeInMilliSeconds)
        {
            $location.path('/Room/ScreenSaver');
            $scope.$apply();        
        } else {
            //  Reschedule, someone is using the keyboard
            $scope.screenSaverTimeout = setTimeout(function(){ $scope.timeOut(); }, $rootScope.timeInMilliSeconds);             
        }
    }    
    
    $scope.restoreSession = function()
    {
        window.history.back();                
    }
   
    angular.element(document).ready(function () 
    {                
        var myDate = new Date();
        $rootScope.lastKeyPress = myDate.getTime();
        
        clearTimeout($scope.screenSaverTimeout);
        $scope.screenSaverTimeout = setTimeout(function(){ $scope.timeOut(); }, $rootScope.timeInMilliSeconds); 
        
        $scope.activeArtefact = "00000" + $routeParams.artefact;               
        $scope.activeArtefact =  $scope.activeArtefact.substring($scope.activeArtefact.length - 2, $scope.activeArtefact.length);

        //  Add new one
        angular.element( document.querySelector( '#artefact' + $scope.activeArtefact ) ).addClass("animated tada selectedImage");
        
        $scope.activeArtefact *= 1;

        $scope.$digest();
    });  

});

myApp.controller('ChargenCTRL', function ($scope, $mdDialog) 
{ 
    $scope.activeStory = '';
    $scope.activeArtefact = -1;
    $scope.minutes = 0;

    $scope.randomiseFigure = function()
    {
        var myDate = new Date();
        $rootScope.lastKeyPress = myDate.getTime();        
        
        var srcHair = "Hair000" + Math.ceil(Math.random() * 8) + ".png";        
        var srcArms = "Arms000" + Math.ceil(Math.random() * 8) + ".png";        
        var srcHands = "Hands000" + Math.ceil(Math.random() * 8) + ".png";        
        var srcFaces = "Faces000" + Math.ceil(Math.random() * 8) + ".png";        
        var srcTorso = "Torso000" + Math.ceil(Math.random() * 8) + ".png";        
        var srcLegs = "Legs000" + Math.ceil(Math.random() * 8) + ".png";       
        var srcFeet = "Feet000" + Math.ceil(Math.random() * 8) + ".png";        
        
        document.getElementById("hairSelected").src="Images/CharacterAssets/Hair/" + srcHair;        
        document.getElementById("armsSelected").src="Images/CharacterAssets/Arms/" + srcArms;        
        document.getElementById("handsSelected").src="Images/CharacterAssets/Hands/" + srcHands;          
        document.getElementById("facesSelected").src="Images/CharacterAssets/Faces/" + srcFaces;            
        document.getElementById("torsoSelected").src="Images/CharacterAssets/Torso/" + srcTorso;               
        document.getElementById("legsSelected").src="Images/CharacterAssets/Legs/" + srcLegs;            
        document.getElementById("feetSelected").src="Images/CharacterAssets/Feet/" + srcFeet;                   
    }

    $scope.triggerChange = function(ev, modalToLoad)
    {       
        var myDate = new Date();
        $rootScope.lastKeyPress = myDate.getTime();                
        
        $mdDialog.show({
            controller: 'CharSelectCTRL',    
            templateUrl: 'Templates/Modals/CharGen/' + modalToLoad + '.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true,
            fullscreen: false,
        })
        .then(function(response) 
        {
            //  set it up yeah.
            switch (modalToLoad)
            {
                case 'Hair':
                    document.getElementById("hairSelected").src="Images/CharacterAssets/Hair/" + response;                    
                    break;
                case 'Arms':
                    document.getElementById("armsSelected").src="Images/CharacterAssets/Arms/" + response;                    
                    break;
                case 'Hands':
                    document.getElementById("handsSelected").src="Images/CharacterAssets/Hands/" + response;                                    
                    break;
                case 'Faces':
                    document.getElementById("facesSelected").src="Images/CharacterAssets/Faces/" + response;                                    
                    break;                                        
                case 'Torso':
                    document.getElementById("torsoSelected").src="Images/CharacterAssets/Torso/" + response;                                    
                    break;                                 
                case 'Legs':
                    document.getElementById("legsSelected").src="Images/CharacterAssets/Legs/" + response;                                    
                    break;                                                 
                case 'Feet':
                    document.getElementById("feetSelected").src="Images/CharacterAssets/Feet/" + response;                                    
                    break;                     
                default:
                    break;
            }
       
        });         
        
    };
    
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
        when('/Record', { 
            templateUrl: 'Templates/Record/record.html',
            controller: 'RecordCTRL'    
        }).                 
        when('/Playback', { 
            templateUrl: 'Templates/Playback/playback.html',
            controller: 'PlaybackCTRL'      
        });                
    
}]);
