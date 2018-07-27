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
    
    $scope.completeDeposit = function()
    {        
        var url = 'http://' + $location.host() + ':'+ $location.port() + 
                '/Vault/API.php?action=deposit&method=create&email=' + $scope.email 
                + '&nomDePlume=' + $scope.nomDePlume
                + '&story=' + $scope.activeStory + '&hasConsent=' + $scope.consentGiven + '&useEmail=' + $scope.useEmail;

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
    
    $scope.completeConsent = function()
    {
        $scope.depositStage = 3;
    }
    
    $scope.cancelDeposit = function()
    {
        $scope.depositStage = 0;
    }
    
    $scope.completeEmail = function()
    {
        //  Ok, is it anon or not?
        if ($scope.email !== '' && $scope.email !== 'anon@storybank.com.au')
        {
                //  We're gonna need to check for this emails nom de plume ....
                var url = 'http://' + $location.host() + ':'+ $location.port() + '/Vault/API.php?action=deposit&method=nomdeplume&email=' + $scope.email;       

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
        
        angular.element($event.currentTarget).addClass("animated pulse");        
    };
    
    $scope.fetchQuestion = function() 
    {
        if ($scope.artefact > 0)
        {
            switch ($scope.artefact)
            {
                case 1:
                    $scope.question = 'Consider your own childhood home. \n\
\n\
Did you have eccentric neighbours? \n\
\n\
Take a moment to write a small story detailing your childhood home, how a stranger to your neighbourhood might find their way to your very own front-door and the characters they might meet on the way.';
                    break;                        
                case 2:                
                    $scope.question = 'Imagine you are having dinner with your role model, what might happen?';                           
                    break;
                case 3:
                    $scope.question = 'Some of the first stories we ever told were with our toys. \n\
\n\
We sat to one side, an invisible puppeteer, breathing imagination into these otherwise inanimate objects, waking them to wonderful life. \n\
\n\
What stories did you tell through your childhood toys? ';
                    break;
                case 4:
                    $scope.question = 'For PL Travers, this initial phase of pouring out her creativity by hand and then moving it to her typewriter was an important part of her process. \n\
\n\
As a writer, do you have a creative process? What tools do you use to create?';
                    break;                                        
                case 5:
                    $scope.question = 'Many people have a spiritual framework, a set of beliefs, traditions and rituals which form the basis of a personal relationship with the universe and the divine. \n\
\n\
Mary Poppins, for example, arrives and leaves with the East Wind … as Hanuman was birthed with help from Vayu, God of the East Wind. \n\
\n\
Our beliefs can shape our creativity in ways that we may not consciously realise. Take a moment to write a small story that reflect your own beliefs and how they have shaped the person you are today.';                
                    break;                    
                case 6: //  Vase of Roses
                    $scope.question = 'Everybody keeps some things about themselves private.\n\
\n\
This secrecy can build mystery, perhaps protect our vulnerabilities, or simply make it possible to walk with confidence in the world. \n\
\n\
Those things we never say, never share, which can only be inferred, are a core part of our personality and character. \n\
\n\
Perhaps you feel inspired to share a small story that illuminates something otherwise unknown about yourself?';
                    break;
                case 8:
                    $scope.question = 'The roots of education are bitter, but the fruit is sweet. Aristotle. \n\
\n\
Education is the most powerful weapon which you can use to change the world. Nelson Mandela. How did you \n\
\n\
learn to read and write? How do you believe that your early educational experiences shaped your creative writing?'; 
                    break;                                        
                default:
                    $scope.question = 'Your story begins here ...';
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
