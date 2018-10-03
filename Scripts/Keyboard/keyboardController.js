/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var myApp = angular.module('PLTravers');

myApp.controller('KeyboardCTRL', ['$rootScope', '$scope', '$routeParams', '$location', '$http', function($rootScope, $scope, $routeParams, $location, $http) 
{ 
    $scope.capsLock = false;
    $scope.activeStory = '';
    $rootScope.activeStory = $scope.activeStory;
    $scope.artefact = 0;
    $scope.question = 'No question found';   
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
    
    $scope.completeDeposit = function()
    {        
        var jsonCharGen = '';

        if ($scope.artefact === 15)
        {
            jsonCharGen = $scope.collateChargen();
        }
        
        var url = 'http://' + $location.host() 
                + '/Vault/API.php?action=deposit&method=create&promptId=' + $scope.artefact
                + '&email=' + $scope.email 
                + '&nomDePlume=' + $scope.nomDePlume
                + '&story=' + $scope.activeStory 
                + '&charDesign=' + jsonCharGen 
                + '&hasConsent=' + $scope.consentGiven + '&useEmail=' + $scope.useEmail;

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
            
        $scope.activeStory = '';
        $rootScope.activeStory = $scope.activeStory;
        $scope.email = '';    
        $scope.nomDePlume = '';             
        
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
    
    $scope.cancelDeposit = function()
    {
        $scope.depositStage = 0;
    }
    
    //  Stage Two
    $scope.completeEmail = function()
    {
        //  Ok, is it anon or not?
        if ($scope.email !== '' && $scope.email !== 'anon@storybank.com.au')
        {
                //  We're gonna need to check for this emails nom de plume ....
                var url = 'http://' + $location.host() + '/Vault/API.php?action=deposit&method=nomdeplume&email=' + $scope.email;       

                //  Call the login function appropriately
                $http.get(url).then(
                    function (response)   
                    {
                        if (response.data.length === 0)
                        {

                            $scope.depositStage = 2; // Fetch consent
                            
                        } else {
                            
                            //  Assumed consent
                            $scope.nomDePlume = response.data[0].NOMDEPLUME;
                            $scope.depositStage = 3; // Confirm NomDePlume
                            
                        }
                    }, 
                    function(response) 
                    {
                        alert('Failure to connect to StoryVault');
                    });                    
            
        } else {
            
            //  It's anon
            $scope.email = 'anon@storybank.com.au';
            $scope.nomDePlume = 'Anon';
            $scope.completeDeposit();
            
        }
        
    }


    $scope.keyClick = function($event, keyClicked)
    {
        var myDate = new Date();
        $rootScope.lastKeyPress = myDate.getTime();
        
        //  clearTimeout($rootScope.screenSaverTimeout);
        //  $rootScope.screenSaverTimeout = setTimeout(function(){ $rootScope.timeOut(); }, $rootScope.timeInMilliSeconds); 
        
        if (keyClicked === 'SHIFT') 
        {
            
            $scope.capsLock = !$scope.capsLock;
            
        } else if ($scope.depositStage === 0) { //  Regular writing a story
        
            if (keyClicked === 'BACKSPACE')
            {
                
                $scope.activeStory = $scope.activeStory.slice(0, -1);
                
            } else if (keyClicked === 'DEPOSIT' && $scope.activeStory.length > 0) {                        
                
                $scope.depositStage = 1;    //  Switch stage
                
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
        angular.element($event.currentTarget).addClass("animated zoomIn");    
        
        //  Let's test this one huh
        window.setTimeout(function() { $scope.removeClasses(); }, 250);
        
    };
    
    $scope.removeClasses = function()
    {
        var result = document.getElementsByClassName("animated zoomIn");
        
        angular.element(result).removeClass("animated zoomIn");    
    }
    
    $scope.fetchQuestion = function() 
    {
        if ($scope.artefact >= 0)
        {
            switch ($scope.artefact)
            {
                case 1:
                    $scope.question = 'to take a moment to write a small story detailing your childhood home and the fictional characters that might inhabit it?';
                    break;                        
                case 2:                
                    $scope.question = 'to imagine you are having dinner with your role model, what might happen?';                           
                    break;
                case 3:
                    $scope.question = 'to relate a story you told through your childhood toys? ';
                    break;
                case 4:
                    $scope.question = 'to write about your creative process? What tools do you use to create?';
                    break;                                        
                case 5:
                    $scope.question = 'to reflect upon your own beliefs and how they have shaped the person you are today?';                
                    break;                    
                case 6: //  Vase of Roses
                    $scope.question = 'to share a story that illuminates something otherwise unknown about yourself?';
                    break;
                case 8:
                    $scope.question = 'to tell a tale that you created with your peers in school?'; 
                    break; 
                case 10:
                case 11:
                case 12:
                case 13:
                case 14:
                    $scope.question = 'Can you think of a person in your life who would make a good character in a story? Describe your character with 3 words';
                    break;
                case 15:
                    $scope.question = 'to write a story about your character?';
                    break;
                default:
                    $scope.question = 'to begin your story ...?';
                    break; 
            }
        }
        
        $scope.$digest();
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
