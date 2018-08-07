/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var myApp = angular.module('PLTravers');

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
            var url = 'http://' + $location.host() + ':'+ $location.port() + '/Vault/API.php?action=administer&method=newStories&token=' + token;       
            
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
            var url = 'http://' + $location.host() + ':'+ $location.port() + '/Vault/API.php?action=administer&method=flaggedStories&token=' + token;       
            
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
            var url = 'http://' + $location.host() + ':'+ $location.port() + '/Vault/API.php?action=administer&method=members&token=' + token;       
            
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
                        
                        //  Load up teh data grids!
                        $scope.getServerData();
                        $scope.getFlaggedServerData();  
                        $scope.getMemberServerData();
                        
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
    
    $scope.backToMenu = function(ev)
    {
        $location.path('');
    }
    
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