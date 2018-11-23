/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var myApp = angular.module('PLTravers');

myApp.controller('KeyboardCTRL', ['$rootScope', '$scope', '$routeParams', '$location', '$http', '$mdDialog', function($rootScope, $scope, $routeParams, $location, $http, $mdDialog) 
{ 
    $scope.capsLock = false;
    $scope.activeStory = '';
    $rootScope.activeStory = $scope.activeStory;
    $rootScope.openDialog = false;
    $scope.artefact = 0;
    $scope.question = 'No question found'; 
    $scope.visitorID = '';
    $scope.email = '';
    $scope.nomDePlume = '';
    $scope.consentGiven = 0;
    $scope.useEmail = 0;
    $scope.depositStage = 0;
    $scope.charGen = {
                ARM: '',
                FACE: '', 
                FEET: '',
                HAIR: '',
                HAND: '',
                LEG: '',
                TORSO: ''     
            };  
            
    $scope.inspiredBy = {
                BOOKS: false,
                MUSIC: false, 
                NATURE: false,
                HISTORY: false,
                TRAVEL: false,
                DREAMS: false,
                FOOD: false,
                ART: false,
                PEOPLE: false
            };              
    
    $scope.completeDeposit = function()
    {        
        var jsonCharGen = '';

        if ($scope.artefact === 15) //  Handle the Character generator special case
        {
            jsonCharGen = $scope.collateChargen();
        } else if ($scope.artefact === 16) {
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
                if (response.data.length === 0)
                {

                    $scope.depositStage = 0; // Fail State
                    
                } else {

                    $scope.depositStage = 4; // Fetch consent

                }
            }, 
            function(response) 
            {
                alert('Failure to connect to StoryVault');
            });  
            
        $scope.visitorID = '';
        $scope.activeStory = '';
        $rootScope.activeStory = $scope.activeStory;
        $scope.email = '';    
        $scope.nomDePlume = '';             
        
        window.setTimeout(function() { $scope.reopenStoryTeller(); }, 10000);
    }
    
    $scope.reopenStoryTeller = function()
    {
        $scope.depositStage = 0;        
        $scope.$digest();
    }
    
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
    
    $scope.collateInspirations = function()
    {
        //  How am I gonna check this one ...
        var gifs = document.getElementsByClassName("gifContainer");
        var displayState = '';
        var style = '';
        var imageInQuestion = '';
       
        for (var i = 0; i < gifs.length; i++)
        {
            style = window.getComputedStyle(gifs[i]);
            displayState = style.getPropertyValue('display');    
            
            if (displayState !== 'none')
            {
                //  Something is on? Hooray ...
                imageInQuestion = angular.element(gifs[i]).children();
                
                if (imageInQuestion.attr('src').includes('Books')) 
                {
                    $scope.inspiredBy.BOOKS = true;
                } else if (imageInQuestion.attr('src').includes('Music')) {
                    $scope.inspiredBy.MUSIC = true;
                } else if (imageInQuestion.attr('src').includes('Nature')) {
                    $scope.inspiredBy.NATURE = true;
                } else if (imageInQuestion.attr('src').includes('History')) {
                    $scope.inspiredBy.HISTORY = true;
                } else if (imageInQuestion.attr('src').includes('Travel')) {
                    $scope.inspiredBy.TRAVEL = true;
                } else if (imageInQuestion.attr('src').includes('Dreams')) {
                    $scope.inspiredBy.DREAMS = true;
                } else if (imageInQuestion.attr('src').includes('Food')) {
                    $scope.inspiredBy.FOOD = true;
                } else if (imageInQuestion.attr('src').includes('Art')) {
                    $scope.inspiredBy.ART = true;
                } else if (imageInQuestion.attr('src').includes('People')) {
                    $scope.inspiredBy.PEOPLE = true;
                }
                    
            }
        }
        
        return JSON.stringify($scope.inspiredBy);
        
    }
    
    $scope.completeConsent = function()
    {
        $scope.depositStage = 3;
    }
    
    $scope.changeConsent = function(value)
    {
        $scope.consentGiven = value;
    }
    
    $scope.changeEmail = function(value)
    {
        $scope.useEmail = value;
    }
    
    $scope.collectVisitorID = function(ev)
    {
        
        //  Abstract the deposit into a dialog ... templated, yes.
        $rootScope.openDialog = $mdDialog.show({
            templateUrl: 'Templates/Keyboard/depositCollectID.html',
            controller: 'DepositCTRL',         
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true
        })
        .then(function(answer) {
            
            //  It's anon
            $scope.visitorID = answer;            
            $scope.email = 'anon@storybank.com.au';
            $scope.nomDePlume = 'Anon';
            $scope.completeDeposit();      
    
            $rootScope.openDialog = false;
  
        }, function() {
            
            //    No action
            $rootScope.openDialog = false;
          
        });         
        
    }

    $scope.beginDepositProcess = function(ev)
    {
        
        //  Abstract the deposit into a dialog ... templated, yes.
        $rootScope.openDialog = $mdDialog.show({
            templateUrl: 'Templates/Keyboard/depositProcess.html',
            controller: 'DepositCTRL',         
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true
        })
        .then(function(answer) {
            
            switch (answer)
            {
                case 'ANON':
                    //  It's anon
                    $scope.visitorID = 0;
                    $scope.email = 'anon@storybank.com.au';
                    $scope.nomDePlume = 'Anon';
                    $scope.completeDeposit();                                    
                    break;
                case 'FULLID':
                    window.setTimeout(function() { $scope.collectVisitorID(ev); }, 6);
                    break;
                default:
                    break;
            }
            
            $rootScope.openDialog = false;
  
        }, function() {
            
            $rootScope.openDialog = false;
          
        });        
        
    }

    $scope.keyClick = function($event, keyClicked)
    {
        var myDate = new Date();
        $rootScope.lastKeyPress = myDate.getTime();
        
        if (keyClicked === 'SHIFT') 
        {
            
            $scope.capsLock = !$scope.capsLock;
            
        } else if ($scope.depositStage === 0) { //  Regular writing a story
        
            if (keyClicked === 'BACKSPACE')
            {
                
                $scope.activeStory = $scope.activeStory.slice(0, -1);
                
            } else if (keyClicked === 'DEPOSIT' && $scope.activeStory.length > 0) {                        
                
                //  This should do the popup instead of the state change
                
                //  $scope.depositStage = 1;    //  Switch stage
                $scope.beginDepositProcess($event);
                
            } else if (keyClicked !== 'DEPOSIT') {                                        
                
                $scope.activeStory = $scope.activeStory + keyClicked;
                
            } 

            //  SET GLOBAL FOR TRANSITION PROMPTS
            $rootScope.activeStory = $scope.activeStory;
            
        } else if ($scope.depositStage === 1) { //  Time to collect an email address
            
            if (keyClicked === 'BACKSPACE')
            {
                
                $scope.email = $scope.email.slice(0, -1);
                
            } else {     
                
                $scope.email = $scope.email + keyClicked;
                
            }            
            
        } else if ($scope.depositStage === 2) { 
            
            //  Need to collect consent
            
            //  Loading ....
            
        } else if ($scope.depositStage === 3) {
            
            if (keyClicked === 'BACKSPACE')
            {
                
                $scope.nomDePlume = $scope.nomDePlume.slice(0, -1);
                
            }  else {     
                
                $scope.nomDePlume = $scope.nomDePlume + keyClicked;
                
            }
            
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
    
}]);

myApp.controller('DepositCTRL', ['$rootScope', '$scope', '$location', '$http', '$mdDialog', function($rootScope, $scope, $location, $http, $mdDialog) 
{
    $scope.collectedID = 'XXXXX';
    $scope.validID = false;
    
    $scope.anonymousDeposit = function()
    {
        $mdDialog.hide('ANON');
    }
    
    $scope.fullDeposit = function()
    {        
        $mdDialog.hide('FULLID');
    }    
    
    $scope.cancelDeposit = function()
    {
        $mdDialog.cancel();
    }    
    
    $scope.completeEmail = function()
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
    
}]);