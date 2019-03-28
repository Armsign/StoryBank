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
        //  Influences room disablement disappointment ... bleh.
    $scope.booksDisabled = false;
    $scope.musicDisabled = false;
    $scope.natureDisabled = false;
    $scope.historyDisabled = false;
    $scope.travelDisabled = false;    
    $scope.dreamsDisabled = false;
    $scope.foodDisabled = false;
    $scope.artDisabled = false;    
    $scope.peopleDisabled = false; 
    
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
        
        $rootScope.openDialog = true;
        
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
    
    $scope.returnImage = function(imageToReturn)
    {        
        $mdDialog.hide(imageToReturn);
    }
    
    $scope.hideModal = function()
    {
        $mdDialog.cancel();
        $rootScope.openDialog = false;
    }
    
    $scope.triggerCloud = function($event, inspireToLoad)
    {       
        clearTimeout($rootScope.screenSaverTimeout);
        $rootScope.screenSaverTimeout = setTimeout(function(){ $rootScope.timeOut(); }, $rootScope.timeInMilliSeconds);        
        
        if ($scope.switchEnablements(inspireToLoad)) return;

        var childrens = angular.element($event.currentTarget).parent().parent().children();
        
        angular.element(childrens[0]).removeClass("animated fadeIn");         
        angular.element(childrens[0]).addClass("animated fadeOut"); 
        
        angular.element(childrens[1]).css('display', 'inline'); 
        angular.element(childrens[1]).addClass("animated fadeIn");
        
        window.setTimeout(function() { $scope.hideGif(childrens[0], inspireToLoad); }, 600);
        
    };  
    
    $scope.triggerCloudGif = function($event, inspireToLoad)
    {       
        clearTimeout($rootScope.screenSaverTimeout);
        $rootScope.screenSaverTimeout = setTimeout(function(){ $rootScope.timeOut(); }, $rootScope.timeInMilliSeconds);        
        
        if ($scope.switchEnablements(inspireToLoad)) return;     
        
        var childrens = angular.element($event.currentTarget).parent().parent().children();
        
        angular.element(childrens[0]).css('display', 'inline'); 
        angular.element(childrens[0]).addClass("animated fadeIn"); 
                
        angular.element(childrens[1]).removeClass("animated fadeIn"); 
        angular.element(childrens[1]).addClass("animated fadeOut"); 
        
        window.setTimeout(function() { $scope.hideGif(childrens[1], inspireToLoad); }, 600);
        
    };    
    
    $scope.switchEnablements = function(inspireToLoad)
    {
        switch (inspireToLoad)
        {
            case'Books':
                if ($scope.booksDisabled) return true;
                $scope.booksDisabled = true;     
                break;
            case 'Music':
                if ($scope.musicDisabled) return true;
                $scope.musicDisabled = true;                   
                break;
            case 'Nature':
                if ($scope.natureDisabled) return true;
                $scope.natureDisabled = true;                   
                break;
            case 'History':
                if ($scope.historyDisabled) return true;
                $scope.historyDisabled = true;                   
                break;
            case 'Travel':
                if ($scope.travelDisabled) return true;
                $scope.travelDisabled = true;                   
                break;
            case 'Dreams':
                if ($scope.dreamsDisabled) return true;
                $scope.dreamsDisabled = true;                   
                break;
            case 'Food':
                if ($scope.foodDisabled) return true;
                $scope.foodDisabled = true;                   
                break;
            case 'Art':
                if ($scope.artDisabled) return true;
                $scope.artDisabled = true;                   
                break;
            case 'People':                
                if ($scope.peopleDisabled) return true;
                $scope.peopleDisabled = true;                   
                break;
            default:
                break;
        }   
        
        return false;
    }    
    
    $scope.switchEnablementsOff = function(inspireToLoad)
    {
        switch (inspireToLoad)
        {
            case'Books':
                $scope.booksDisabled = false;     
                break;
            case 'Music':
                $scope.musicDisabled = false;                   
                break;
            case 'Nature':
                $scope.natureDisabled = false;                   
                break;
            case 'History':
                $scope.historyDisabled = false;                   
                break;
            case 'Travel':
                $scope.travelDisabled = false;                   
                break;
            case 'Dreams':
                $scope.dreamsDisabled = false;                   
                break;
            case 'Food':
                $scope.foodDisabled = false;                   
                break;
            case 'Art':
                $scope.artDisabled = false;                   
                break;
            case 'People':                
                $scope.peopleDisabled = false;                   
                break;
            default:
                break;
        }   
        
        return false;
    }    
    
    $scope.hideGif = function(el, inspireToLoad)
    {
        $scope.switchEnablementsOff(inspireToLoad);
        
        angular.element(el).removeClass("animated fadeOut"); 
        angular.element(el).css('display', 'none'); 
    }    

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
        if ($location.path().includes("View/E/") && $rootScope.openDialog === false)
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

myApp.controller('AdminCTRL', function($rootScope, $scope, $http, $mdDialog, $cookies, $location)
{ 
    $scope.securedLogin = 0;    
    $scope.email = '';
    $scope.password = '';    
    $scope.displayName = '';
    $scope.newStoriesCount = 0;
    $scope.flaggedStoriesCount = 0;    
    $scope.tagCount = 0;    
    $scope.staffCount = 0;    
    $scope.approvedStoriesCount = 0;
    $scope.deadStoriesCount = 0;    
    $scope.token = '';
    $scope.searchText = '';
    
    $scope.gridNewStoriesOptions = { data: [], pagination: { itemsPerPage: '10' } };            
    $scope.gridFlaggedStoriesOptions = { data: [], pagination: { itemsPerPage: '10' } };
    $scope.gridApprovedStoriesOptions = { data: [], pagination: { itemsPerPage: '10' } };
    $scope.gridDeadStoriesOptions = { data: [], pagination: { itemsPerPage: '10' } };
    $scope.gridMembersOptions = { data: [], pagination: { itemsPerPage: '10' } };
    $scope.gridTagsOptions = { data: [], pagination: { itemsPerPage: '10' } };

    $scope.getServerData = function() 
    {
        if ($scope.token && $scope.token.length > 0)
        {
            //  Ok ... but how it actually needs to send these to an api ...        
            var url = 'http://' + $location.host() + '/Vault/API.php?action=deposit&method=newStories&token=' + $scope.token;       
            
            //  Call the login function appropriately
            $http.get(url).then(
                function (response)   
                {
                    $scope.gridNewStoriesOptions.data = response.data;
                    $scope.newStoriesCount = response.data.length;
                });   

        }
    };   
    
    $scope.getApprovedStoryData = function() 
    {
        if ($scope.token && $scope.token.length > 0)
        {
            //  Ok ... but how it actually needs to send these to an api ...        
            var url = 'http://' + $location.host() + '/Vault/API.php?action=deposit&method=oldStories&token=' + $scope.token;       
            
            //  Call the login function appropriately
            $http.get(url).then(
                function (response)   
                {
                    $scope.gridApprovedStoriesOptions.data = response.data;
                    $scope.approvedStoriesCount = response.data.length;
                });   

        }
    };   
    
    $scope.getDeadStoryData = function() 
    {
        if ($scope.token && $scope.token.length > 0)
        {
            //  Ok ... but how it actually needs to send these to an api ...        
            var url = 'http://' + $location.host() + '/Vault/API.php?action=deposit&method=deadStories&token=' + $scope.token;       
            
            //  Call the login function appropriately
            $http.get(url).then(
                function (response)   
                {
                    $scope.gridDeadStoriesOptions.data = response.data;
                    $scope.deadStoriesCount = response.data.length;
                });   

        }
    };       

    $scope.getFlaggedServerData = function() 
    {
       var token = $cookies.get('authenticationToken');
        
        if (token && token.length > 0)
        {
            //  Ok ... but how it actually needs to send these to an api ...        
            var url = 'http://' + $location.host() + ':'+ $location.port() + '/Vault/API.php?action=deposit&method=flaggedStories&token=' + token;       
            
            //  Call the login function appropriately
            $http.get(url).then(
                function (response)   
                {
                    $scope.gridFlaggedStoriesOptions.data = response.data;   
                    $scope.flaggedStoriesCount = response.data.length;
                });   

        }
    }; 

    $scope.getMemberServerData = function() 
    {
       var token = $cookies.get('authenticationToken');
        
        if (token && token.length > 0)
        {
            //  Ok ... but how it actually needs to send these to an api ...        
            var url = 'http://' + $location.host() + ':'+ $location.port() + '/Vault/API.php?action=members&method=fetch&token=' + token;       
            
            //  Call the login function appropriately
            $http.get(url).then(
                function (response)   
                {
                    for (var i = 0; i < response.data.length; i++)
                    {

                        if (response.data[i].IS_ACTIVE === '1')
                        {
                            response.data[i].ACTIVE = 'Yes';
                        } else {
                            response.data[i].ACTIVE = 'No';                            
                        }
                        
                    }
                    
                    $scope.gridMembersOptions.data = response.data;  
                    $scope.staffCount = response.data.length;
                });   

        }
    }; 
    
    $scope.getTagServerData = function() 
    {
       var token = $cookies.get('authenticationToken');
        
        if (token && token.length > 0)
        {
            //  Ok ... but how it actually needs to send these to an api ...        
            var url = 'http://' + $location.host() + '/Vault/API.php?action=tags&method=fetch';       

            //  Call the tags function appropriately
            $http.get(url).then(
                function (response)   
                {
                    $scope.gridTagsOptions.data = response.data;
                    $scope.tagCount = response.data.length;
                }, 
                function(response) 
                {
                    //  That's ok, no tags, we don't even need them.
                });         
           return; 

        }
    }; 
    
    $scope.authenticate = function(ev)
    {
        if (this.email.length > 0 && this.password.length > 0)
        {        
            $scope.securedLogin = -1;
            
            var url = 'http://' + $location.host() + '/Vault/API.php?action=administer&method=login&email=' + this.email + '&password=' + this.password;       

            //  Call the login function appropriately
            $http.get(url).then(
                function (response)   
                {
                    if (response.data.ID > 0)
                    {
                        //  We have a real person, let's setup the token ..
                        var expireDate = new Date();
                        expireDate.setDate(expireDate.getDate() + 1);
                        $cookies.put('authenticationToken', response.data.SESSION, { expires: expireDate } );                           

                        $scope.securedLogin = 1;                        
                        $scope.displayName = response.data.PREFERRED_NAME;
                        $scope.token = response.data.SESSION;
                        
                        //  Load up teh data grids!
                        $scope.getServerData();
                        $scope.getFlaggedServerData();   
                        $scope.getMemberServerData();
                        $scope.getTagServerData();
                        $scope.getApprovedStoryData();
                        $scope.getDeadStoryData();
                        
                    } else {
                        
                        $scope.securedLogin = 0;
                        
                         $mdDialog.show(
                            $mdDialog.alert()
                              .parent(angular.element(document.querySelector('#popupContainer')))
                              .clickOutsideToClose(true)
                              .title('Login error')
                              .textContent('The email address or password you have supplied are not recognised.')
                              .ariaLabel('Login alert!')
                              .ok('Awww!')
                              .targetEvent(ev)
                          );
                    }                              
                });   
        } 
    };
    
    $scope.logOut = function()
    {
        $cookies.remove("authenticationToken");
        location.reload();
    }    
    
    angular.element(document).ready(function () 
    {        
        $scope.token = $cookies.get('authenticationToken');
        
        if ($scope.token && $scope.token.length > 0)
        {
            //  Ok ... but how it actually needs to send these to an api ...        
            var url = 'http://' + $location.host() + '/Vault/API.php?action=administer&method=relogin&token=' + $scope.token;       

            //  Call the login function appropriately
            $http.get(url).then(
                function (response)   
                {
                    if (response.data.ID > 0)
                    {
                        $scope.securedLogin = 1;     
                        
                        $scope.displayName = response.data.PREFERRED_NAME;
                        
                        //  Load up teh data grids!
                        $scope.getServerData();
                        $scope.getFlaggedServerData();   
                        $scope.getMemberServerData();
                        $scope.getTagServerData();
                        $scope.getApprovedStoryData();
                        $scope.getDeadStoryData();
                        
                    }   
                    
                }, 
                function(response) 
                {
                    $cookies.remove("authenticationToken");
                });                                   
        }
    });   

});

myApp.controller('WithdrawalsCTRL', function ($rootScope, $scope, $routeParams, $location, $mdDialog, $http) 
{ 
    $scope.activeCategory = '';
    $scope.sortBy = 'NEWEST';
    $scope.withdrawals = undefined;
    $scope.withdrawalsCount = 0;
    $scope.activeStory = undefined;
    $scope.showStory = 1;    
    $scope.visitorID = 0;
    $scope.isLoved = false;
    
    $scope.switchStory = function(story)
    {
        $location.path("/Room/View/L/Story/Display/" + story);   
    }
   
    $scope.loadWithdrawals = function()
    {
 
        //  Ok ... but how it actually needs to send these to an api ...        
        var url = 'http://' + $location.host() + '/Vault/API.php?action=withdraw&method=withdrawal&tag=' + $scope.activeCategory + '&orderBy=' + $scope.sortBy;       

        //  Call the login function appropriately
        $http.get(url).then(
            function (response)   
            {
                $scope.withdrawals = response.data;
                $scope.withdrawalsCount = response.data.length;
            });   
        
    }    
    
    $scope.resetHeadings = function()
    {
        
        var result = document.getElementsByTagName('h3');
        angular.element(result).removeClass('underline');
        angular.element(result).removeClass('red');         
        angular.element(result).addClass('blue');         
        
    }
    
    $scope.switchCategory = function($event, artefact)
    {
        //  Something happened ...
        clearTimeout($scope.screenSaverTimeout);
        $scope.screenSaverTimeout = setTimeout(function(){ $scope.timeOut(); }, $rootScope.timeInMilliSeconds); 

        //  Ok, switch to withdrawal mode
        $location.path('/Room/View/L/Story/' + artefact);
      
    };       
    
    $scope.switchOrderBy = function(category)
    {
        var result = undefined;

        $scope.resetHeadings();

        switch (category)
        {
            case "POPULAR":
                result = document.getElementById('popularStory');
                $scope.sortBy = "POPULAR";
                break;
            case "AUTHOR":
                result = document.getElementById('authorStory');                               
                $scope.sortBy = "AUTHOR";
                break;
            case "TITLE":
                result = document.getElementById('azStory');                
                $scope.sortBy = "TITLE";
                break;
            default:    //  Newest
                result = document.getElementById('newestStory');                
                $scope.sortBy = "NEWEST";
                break;            
        }     
        
        angular.element(result).addClass("underline red");

        $scope.loadWithdrawals();   
        
    }
    
    $scope.backToCategories = function()
    {
        
        window.history.back();       
        
    }
    
    $scope.loadStory = function(id)
    {
        
        //  Ok ... but how it actually needs to send these to an api ...        
        var url = 'http://' + $location.host() + '/Vault/API.php?action=withdraw&method=storyID&id=' + id;       

        //  Call the login function appropriately
        $http.get(url).then(
            function (response)   
            {
                if (response.data.length === 1)
                {
                        $scope.activeStory = response.data[0];
                }

            });           
        
    }    
   
    $scope.changeStory = function(shower)
    {        
        $scope.resetHeadings();
        
        $scope.showStory = shower;
        
        if ($scope.showStory === 1)
        {                    
            angular.element(document.getElementById("daStory")).addClass("underline red");            
        } else {
            
            angular.element(document.getElementById("daDiscussion")).addClass("underline red");
        }

    }   
    
    /*
     *  Open the account?
     */
    
    $scope.openAccount = function(ev)
    {

        //  Abstract the deposit into a dialog ... templated, yes.
        $rootScope.openDialog = $mdDialog.show({
            templateUrl: 'Templates/Keyboard/numberPad.html',
            controller: 'NumPadCTRL',         
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true
        })
        .then(function(answer) {
            
            //  Store response
            $scope.visitorID = answer * 1;
            
            //  Alrighty, now that it's closing, we need to open the email bit ;p            
            window.setTimeout(function() { $scope.openEmail(); }, 100);
            
            $rootScope.openDialog = false;
  
        }, function() {
            
            //    No action
            $rootScope.openDialog = false;
          
        }); 
        
    }    
    
    $scope.lovingIt = function(ev)
    {
        
        //  Abstract the deposit into a dialog ... templated, yes.
        $rootScope.openDialog = $mdDialog.show({
            templateUrl: 'Templates/Keyboard/numberPad.html',
            controller: 'NumPadCTRL',         
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true
        })
        .then(function(answer) {
            
            //  Store response
            $scope.visitorID = answer * 1;
            
            if ($scope.visitorID > 0)
            {
                
                //  Ok ... but how it actually needs to send these to an api ...        
                var url = 'http://' + $location.host() + '/Vault/API.php?action=withdraw&method=love&id=' + $scope.activeStory.ID + '&visitorID=' + $scope.visitorID;       

                //  Call the login function appropriately
                $http.get(url).then(
                    function (response)   
                    {
                        //  Really it just doesn't do anything now ...
                        //  But we'll need some authentication
                        $scope.isLoved = true;

                    }, 
                    function(response) 
                    {
                        
                    });                          
                
            } 
            
            $rootScope.openDialog = false;
  
        }, function() {
            
            //    No action
            $rootScope.openDialog = false;
          
        });         
        
    }
    
    $scope.openEmail = function(ev)
    {

        //  Abstract the deposit into a dialog ... templated, yes.
        $rootScope.openDialog = $mdDialog.show({
            templateUrl: 'Templates/Keyboard/emailCollector.html',
            controller: 'KeyboardCTRL',         
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true,
            data: $scope.visitorID
           
        })
        .then(function(answer) {
            
            //  Store response
            $scope.visitorID = answer * 1;
            
            //  Alrighty, now that it's closing, we need to open the email bit ;p

            
            $rootScope.openDialog = false;
  
        }, function() {
            
            //    No action
            $rootScope.openDialog = false;
          
        });         
        
        
        
    }
   
    angular.element(document).ready(function () 
    {                
        //  This here        
        if ($location.path().includes('Display'))
        {
            
            $scope.loadStory($routeParams.id);
            
        } else {
            
            $scope.activeCategory = $routeParams.category;               
            $scope.loadWithdrawals();
            
        }        
        
        $scope.$digest();
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
            templateUrl: 'Templates/Curation/admin.html',
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
            templateUrl: 'Templates/Deposits/roomI.html',
            controller: 'DepositsCTRL'    
        }).                  
        when('/Room/View/L/:artefact', { 
            templateUrl: 'Templates/Withdrawal/roomL.html',
            controller: 'WithdrawalsCTRL'    
        }).                                                 
        when('/Room/View/L/Story/:category', { 
            templateUrl: 'Templates/Withdrawal/withdrawals.html',
            controller: 'WithdrawalsCTRL'    
        }).     
        when('/Room/View/L/Story/Display/:id', { 
            templateUrl: 'Templates/Withdrawal/story.html',
            controller: 'WithdrawalsCTRL'    
        });                
    
}]);

myApp.config(['$provide', function($provide)
{
    // this demonstrates how to register a new tool and add it to the default toolbar
    $provide.decorator('taOptions', ['$delegate', function(taOptions){
            // $delegate is the taOptions we are decorating
            // here we override the default toolbars and classes specified in taOptions.
            taOptions.toolbar = [
                    ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote'],
                    ['bold', 'italics', 'underline', 'ul', 'ol', 'clear'],
                    ['justifyLeft','justifyCenter','justifyRight', 'justifyFull'],
                    ['html', 'insertLink', 'wordcount', 'charcount']
            ];
            return taOptions; // whatever you return will be the taOptions
    }]);
}]);