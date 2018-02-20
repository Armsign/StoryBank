/*
 *      PL Travers Building
 *      
 *      Story Bank
 */

var myApp = angular.module('PLTravers', ['ngRoute', 'ngMaterial', 'ngCookies', 'dataGrid', 'pagination']);

myApp.controller('ContainerCTRL', ['$scope', '$location', function($scope, $location) 
{ 

    $scope.changeLocation = function(location)
    {        
        $location.path("/" + location);  
    }

    angular.element(document).ready(function () 
    {        
  
          
    });   

}]);

myApp.controller('AdminCTRL', ['$rootScope', '$scope', '$http', '$mdDialog', '$cookies', '$location', function($rootScope, $scope, $http, $mdDialog, $cookies, $location) 
{ 
    $scope.securedLogin = 0;    
    $scope.email = '';
    $scope.password = '';    
    $scope.displayName = '';
    
    $scope.gridNewStoriesOptions = {
       data: []
    };    
    
    $scope.gridFlaggedStoriesOptions = {
       data: []
    };   
    
    $scope.gridMembersOptions = {
       data: []
    };     
    
    $scope.getServerData = function() 
    {
       var token = $cookies.get('authenticationToken');
        
        if (token && token.length > 0)
        {
            //  Ok ... but how it actually needs to send these to an api ...        
            var url = 'http://' + $location.host() + '/Vault/API.php?action=administer&method=newStories&token=' + token;       
            
            //  Call the login function appropriately
            $http.get(url).then(
                function (response)   
                {
                    $scope.gridNewStoriesOptions.data = response.data;
                });   

        }
    };      

    $scope.getFlaggedServerData = function() 
    {
       var token = $cookies.get('authenticationToken');
        
        if (token && token.length > 0)
        {
            //  Ok ... but how it actually needs to send these to an api ...        
            var url = 'http://' + $location.host() + '/Vault/API.php?action=administer&method=flaggedStories&token=' + token;       
            
            //  Call the login function appropriately
            $http.get(url).then(
                function (response)   
                {
                    $scope.gridFlaggedStoriesOptions.data = response.data;                    
                });   

        }
    }; 

    $scope.getMemberServerData = function() 
    {
       var token = $cookies.get('authenticationToken');
        
        if (token && token.length > 0)
        {
            //  Ok ... but how it actually needs to send these to an api ...        
            var url = 'http://' + $location.host() + '/Vault/API.php?action=administer&method=members&token=' + token;       
            
            //  Call the login function appropriately
            $http.get(url).then(
                function (response)   
                {
                    $scope.gridMembersOptions.data = response.data;                    
                });   

        }
    }; 

    $scope.editDeposit = function(deposit, ev)
    {
        $rootScope.deposit = deposit;
        
        $mdDialog.show({
            controller: 'DepositCtrl',    
            templateUrl: 'Templates/Modals/deposit.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true,
            fullscreen: false,
        })
        .then(function() 
        {
            //  Load up teh data grids!
            $scope.getServerData();
            $scope.getFlaggedServerData();   
        });              
    }

    $scope.editMember = function(member, ev)
    {
        $mdDialog.show({
            controller: 'MemberCtrl',    
            templateUrl: 'Templates/Modals/members.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true,
            fullscreen: false,
            locals: {
                dataToPass: member
            }          
        })
        .then(function(member) 
        {
            //  Load up teh data grids!
            $scope.getMemberServerData();            
        });              
    }

    $scope.authenticate = function(ev)
    {
        if (this.email.length > 0 && this.password.length > 0)
        {        
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
                        
                        //  Load up teh data grids!
                        $scope.getServerData();
                        $scope.getFlaggedServerData();  
                        $scope.getMemberServerData();
                        
                    } else {
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
        var token = $cookies.get('authenticationToken');
        
        if (token && token.length > 0)
        {
            //  Ok ... but how it actually needs to send these to an api ...        
            var url = 'http://' + $location.host() + '/Vault/API.php?action=administer&method=relogin&token=' + token;       

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
                    }   
                    
                }, 
                function(response) 
                {
                    $cookies.remove("authenticationToken");
                });                                   
        }
          
    });  

}]);

myApp.controller('RecordCTRL', [ '$scope', '$timeout', function ($scope, $timeout) {

    $scope.recorder = null;    
    $scope.isRecording = 0;
    $scope.promise = null;
    $scope.downloadURL = null;

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
        
        if ($scope.recorder && $scope.isRecording == 1)
        {
            $scope.recorder.stop();
            $scope.isRecording = 2;
            $scope.createDownloadLink();
            
            $scope.recorder.exportWAV(function(blob) 
            {
                //  Ok all this then ... the blob looks like the wav
                $scope.downloadURL = URL.createObjectURL(blob);            
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

myApp.controller('DepositCtrl', function ($rootScope, $scope, $http, $mdDialog, $cookies, $location) 
{ 
    $scope.deposit = $rootScope.deposit;
    $scope.approved = 0;
    
    $scope.saveDialog = function()
    {
        $mdDialog.hide($scope.deposit);
    }
    
    $scope.closeDialog = function()
    {
        $mdDialog.hide($scope.deposit);
    }
            
    angular.element(document).ready(function () 
    {        
        var token = $cookies.get('authenticationToken');
        
        if (token && token.length > 0)
        {
            //  Ok ... but how it actually needs to send these to an api ...        
            var url = 'http://' + $location.host() + '/Vault/API.php?action=administer&method=flags&token=' + token + '&deposit=' + $scope.deposit.id;       

            //  Call the login function appropriately
            $http.get(url).then(
                function (response)   
                {
                   
                    
                }, 
                function(response) 
                {
                    
                });                                   
        }
        
    });      
    
});

myApp.controller('MemberCtrl', function ($scope, $mdDialog, dataToPass) 
{ 
    $scope.member = dataToPass.member;
    
    angular.element(document).ready(function () 
    {        
       return;
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
        when('/Record', { 
            templateUrl: 'Templates/Record/record.html',
            controller: 'RecordCTRL'    
        }).                 
        when('/Playback', { 
            templateUrl: 'Templates/Playback/playback.html',
            controller: 'PlaybackCTRL'      
        });                
    
}]);

/*
 
var recorder;
var audio_context;
var current_url;
var recorder;
var user_media;
var recorder;

function createDownloadLink() 
{
    
    if (recorder)
    {
        recorder.exportWAV(function(blob) 
        {
            var url = URL.createObjectURL(blob);
            var li = document.createElement('li');
            var br = document.createElement('br');
            var au = document.createElement('audio');
            var hf = document.createElement('a');

            au.controls = true;
            au.src = url;
            hf.href = url;
            hf.download = new Date().toISOString() + '.wav';
            hf.innerHTML = hf.download;
            li.appendChild(au);
            li.appendChild(au);
            li.appendChild(br);
            li.appendChild(hf);
            recordingslist.appendChild(li);
            
        });
        
        //  Clear the contents of the recorder buffer
        recorder.clear();
    }    

}



        



*/