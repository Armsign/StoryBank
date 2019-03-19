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

myApp.controller('DepositsCTRL', function($rootScope, $scope, $location, $routeParams, $mdDialog) 
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

    $scope.randomiseFigure = function()
    {
        clearTimeout($rootScope.screenSaverTimeout);
        $rootScope.screenSaverTimeout = setTimeout(function() { $rootScope.timeOut(); }, $rootScope.timeInMilliSeconds);       
        
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
        clearTimeout($rootScope.screenSaverTimeout);
        $rootScope.screenSaverTimeout = setTimeout(function() { $rootScope.timeOut(); }, $rootScope.timeInMilliSeconds); 
        
        $rootScope.openDialog = $mdDialog.show({
            controller: 'DepositsCTRL',    
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
            
            $rootScope.openDialog = false;
       
        }, function() {
            
            $rootScope.openDialog = false;
          
        });         
        
    };    

    angular.element(document).ready(function () 
    {        
        //  Handle timeout stuff
        clearTimeout($rootScope.screenSaverTimeout);
        $rootScope.screenSaverTimeout = setTimeout(function(){ $rootScope.timeOut(); }, $rootScope.timeInMilliSeconds);        
        
        //  Nothing good to go in here ;p
        $scope.activeArtefact = "00000" + $routeParams.artefact;               
        $scope.activeArtefact =  $scope.activeArtefact.substring($scope.activeArtefact.length - 2, $scope.activeArtefact.length);

        //  Add new one
        angular.element( document.querySelector( '#artefact' + $scope.activeArtefact ) ).addClass("animated tada selectedImage");
        
        //  Make sure the arctiveArtefact is in the correct data type
        $scope.activeArtefact *= 1;        
        
        //  Randomise for chargen if appropes
        if ($location.path().includes("View/E/"))
        {
            $scope.randomiseFigure();
        }
        
        $scope.$digest();
        
    });   

});

myApp.controller('KeyboardCTRL', function($rootScope, $scope, $routeParams, $location, $http, $mdDialog) 
{ 
    $scope.capsLock = false;
    $scope.question = 'No question found'; 
    $scope.activeStory = '';    
    $scope.email = 'anon@storybank.com.au';
    $scope.nomDePlume = 'Anon';  
    $scope.charGen = {
                ARM: '',
                FACE: '', 
                FEET: '',
                HAIR: '',
                HAND: '',
                LEG: '',
                TORSO: ''     
            };    
       
    $scope.collateChargen = function()
    {
        $scope.charGen.ARM = document.getElementById("armsSelected").src;
        $scope.charGen.FACE = document.getElementById("facesSelected").src;
        $scope.charGen.FEET = document.getElementById("feetSelected").src;
        $scope.charGen.HAIR = document.getElementById("hairSelected").src;
        $scope.charGen.HAND = document.getElementById("handsSelected").src;
        $scope.charGen.LEG = document.getElementById("legsSelected").src;
        $scope.charGen.TORSO = document.getElementById("torsoSelected").src; 
        
        return JSON.stringify($scope.charGen);
    }       
       
    $scope.completeDeposit = function()
    {        
        var jsonCharGen = '';

        if ($scope.artefact === 15) //  Handle the Character generator special case
        {
            jsonCharGen = $scope.collateChargen();
        } else if ($scope.artefact === 16) {    /// Handle inspirations special case ... boooo
            jsonCharGen = $scope.collateInspirations();            
        }            
        
        var url = 'http://' + $location.host() 
                + '/Vault/API.php?action=deposit&method=create'
                + '&promptId=' + $scope.artefact
                + '&visitorID=' + $scope.visitorID   
                + '&email=' + $scope.email 
                + '&nomDePlume=' + $scope.nomDePlume
                + '&story=' + '<p>' + $scope.activeStory + '</p>'
                + '&charDesign=' + jsonCharGen 
                + '&hasConsent=' + $scope.consentGiven 
                + '&useEmail=' + $scope.useEmail;

        //  Call the login function appropriately
        $http.get(url).then(
            function (response)   
            {               

                //  What do I care if the save failed or not?
                
            }, 
            function(response) 
            {
                alert('Failure to connect to StoryVault');
            });  
            
        //  Resets ;p
        $scope.visitorID = '';
        $scope.activeStory = '';
        $rootScope.activeStory = $scope.activeStory;
        $scope.email = '';    
        $scope.nomDePlume = '';             

        $scope.$digest();
    }       

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
                
                //  Collect their id
                 $rootScope.openDialog = $mdDialog.show({
                     templateUrl: 'Templates/Keyboard/numberPad.html',
                     controller: 'NumPadCTRL',         
                     parent: angular.element(document.body),
                     targetEvent: $event,
                     clickOutsideToClose:true
                 })
                 .then(function(answer) {

                     //  It's always anon
                     $scope.visitorID = answer;            
                     $scope.email = 'anon@storybank.com.au';
                     $scope.nomDePlume = 'Anon';
                     
                     // Make deposit
                     $scope.completeDeposit();      

                     $rootScope.openDialog = false;

                 }, function() {

                     //    No action
                     $rootScope.openDialog = false;

                 });                  
                
            } else if (keyClicked !== 'DEPOSIT') {                                        
                
                $scope.activeStory = $scope.activeStory + keyClicked;
                
            } 
            
        }

        //  Keep it visible please
        var textarea = document.getElementById('textForStory');
        textarea.scrollTop = textarea.scrollHeight;            
        
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

myApp.controller('NumPadCTRL', function($rootScope, $scope, $mdDialog) 
{
    $scope.collectedID = 'XXXXX';
    $scope.validID = false;    
    
    $scope.cancelDeposit = function()
    {        
        $mdDialog.cancel();
    }    
    
    $scope.completeDeposit = function()
    {
        $mdDialog.hide($scope.collectedID);
    }         
    
    $scope.keyClick = function($event, keyClicked)
    {
        var myDate = new Date();
        $rootScope.lastKeyPress = myDate.getTime();

        if (keyClicked === 'BACKSPACE')
        {
            
            if ($scope.collectedID !== 'XXXXX')
            {
                $scope.collectedID = $scope.collectedID.slice(0, -1);
            }
            
            if ($scope.collectedID === '')
            {
                $scope.collectedID = 'XXXXX';
            } 
            
            $scope.validID = false;
            angular.element(document.getElementById("readyGoNext")).css("display", "none");            

        } else if ($scope.collectedID.length < 5 || $scope.collectedID === 'XXXXX') {

            if ($scope.collectedID === 'XXXXX')
            {
                $scope.collectedID = '';
            }

            $scope.collectedID = $scope.collectedID + keyClicked;
            
            if ($scope.collectedID.length === 5)
            {
                $scope.validID = true;                
                
                angular.element(document.getElementById("readyGoNext")).css("display", "inline");
                
            }
            
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
            templateUrl: 'Templates/Menu/screenSaver.html',
            controller: 'ScreenSaverCTRL'    
        }).                       
        when('/Room/View/C/:artefact', { 
            templateUrl: 'Templates/Deposits/roomC.html',
            controller: 'DepositsCTRL'    
        }).                                 
        when('/Room/View/D/:artefact', { 
            templateUrl: 'Templates/Deposits/roomD.html',
            controller: 'DepositsCTRL'    
        }).                 
        when('/Room/View/E/:artefact', { 
            templateUrl: 'Templates/Deposits/roomE.html',
            controller: 'DepositsCTRL'    
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
