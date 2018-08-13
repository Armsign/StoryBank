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
    $scope.newStoriesCount = 0;
    $scope.token = '';
    
    $scope.gridNewStoriesOptions = { data: [] };        
    $scope.gridFlaggedStoriesOptions = { data: [] };       
    $scope.gridMembersOptions = { data: [] };     
    $scope.gridTagsOptions = { data: [] };         
    
    $scope.getServerData = function() 
    {
        if ($scope.token && $scope.token.length > 0)
        {
            //  Ok ... but how it actually needs to send these to an api ...        
            var url = 'http://' + $location.host() + '/Vault/API.php?action=administer&method=newStories&token=' + $scope.token;       
            
            //  Call the login function appropriately
            $http.get(url).then(
                function (response)   
                {
                    $scope.gridNewStoriesOptions.data = response.data;
                    $scope.newStoriesCount = response.data.length;
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
            var url = 'http://' + $location.host() + ':'+ $location.port() + '/Vault/API.php?action=members&method=fetch&token=' + token;       
            
            //  Call the login function appropriately
            $http.get(url).then(
                function (response)   
                {
                    $scope.gridMembersOptions.data = response.data;                    
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
                }, 
                function(response) 
                {
                    //  That's ok, no tags, we don't even need them.
                });         
           return; 

        }
    };     

    $scope.addDeposit = function()
    {
        
        
    }

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
 
        });              
    }
    
    $scope.deleteDeposit = function(deposit,ev)
    {
        if ($scope.token && $scope.token.length > 0)
        {        
        
            var confirm = $mdDialog.confirm()
                  .title('Delete this story?')
                  .textContent('This is a permanent action.')
                  .ariaLabel('Delete')
                  .targetEvent(ev)
                  .ok('Yaaaasssss!')
                  .cancel('No!');

            $mdDialog.show(confirm).then(
                function() 
                {
                                //  Ok ... but how it actually needs to send these to an api ...        
                    var url = 'http://' + $location.host() 
                        + '/Vault/API.php?action=administer&method=delete&token=' + $scope.token
                        + '&id=' + deposit.ID;

                    //  Call the login function appropriately
                    $http.get(url).then(
                        function (response)   
                        {                        
                            //  ReLoad up teh data grids!
                            $scope.getServerData();
                            $scope.getFlaggedServerData();   
                            $scope.getMemberServerData();                            
                        }); 
                    }, function() {
                        //  Do nothing
                    });  
                    
        }
    }
    
    $scope.addStaff = function()
    {
        
    }

    $scope.editMember = function(member, ev)
    {
        $rootScope.staff = member;
        
        $mdDialog.show({
            controller: 'MemberCtrl',    
            templateUrl: 'Templates/Modals/members.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true,
            fullscreen: false,
        })
        .then(function() 
        {
            
            //  Load up teh data grids!
            $scope.getMemberServerData();
 
        });               
    }
    
    $scope.passwordMember = function(member, ev)
    {
  
        if ($scope.token && $scope.token.length > 0)
        {        
        
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.prompt()
                .title('Set Password?')
                .textContent('Please enter a password for this staff member.')
                .placeholder('Password')
                .ariaLabel('Password')
                .initialValue('AG00dPassw0rd')
                .targetEvent(ev)
                .required(true)
                .ok('Save')
                .cancel('Cancel');

           $mdDialog.show(confirm).then(function(result) {
             
                var url = 'http://' + $location.host() 
                        + '/Vault/API.php?action=members&method=password&token=' + $scope.token
                        + '&id=' + member.ID
                        + '&password=' + result;

                    //  Call the login function appropriately
                    $http.get(url).then(
                        function (response)   
                        {                         
                            //  ReLoad up teh data grids!
                            $scope.getMemberServerData();
            
                        });              
             
                //   Update the password
                member.ID
               
                $scope.status = 'You decided to name your dog ' + result + '.';
             
           }, function() {
               
               //   Fail, cancel do nothing
             
           });
                    
        }        
                     
    }    

    $scope.addTag = function(ev)
    {
        $rootScope.tag = undefined;
        
        $mdDialog.show({
            controller: 'TagCtrl',    
            templateUrl: 'Templates/Modals/tags.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true,
            fullscreen: false,
        })
        .then(function() 
        {
            
            //  Load up teh data grids!
            $scope.getTagServerData();
 
        });        
    }
        
    $scope.editTag = function(tag, ev)
    {
        $rootScope.tag = tag;
        
        $mdDialog.show({
            controller: 'TagCtrl',    
            templateUrl: 'Templates/Modals/tags.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true,
            fullscreen: false,
        })
        .then(function() 
        {
            
            //  Load up teh data grids!
            $scope.getTagServerData();
 
        });                      
    }    
    
    $scope.deleteTag = function(tag, ev)
    {
        
        if ($scope.token && $scope.token.length > 0)
        {        
        
            var confirm = $mdDialog.confirm()
                  .title('Delete this tag?')
                  .textContent('This is a permanent action.')
                  .ariaLabel('Delete')
                  .targetEvent(ev)
                  .ok('Yaaaasssss!')
                  .cancel('No!');

            $mdDialog.show(confirm).then(
                function() 
                {
                                //  Ok ... but how it actually needs to send these to an api ...        
                    var url = 'http://' + $location.host() 
                        + '/Vault/API.php?action=tags&method=delete&token=' + $scope.token
                        + '&id=' + tag.ID;

                    //  Call the login function appropriately
                    $http.get(url).then(
                        function (response)   
                        {                         
                            //  ReLoad up teh data grids!
                            $scope.getTagServerData();
            
                        }); 
                    }, function() {
                        //  Do nothing
                    });  
                    
        }        
        
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
                        $scope.getTagServerData();
                        
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
                    }   
                    
                }, 
                function(response) 
                {
                    $cookies.remove("authenticationToken");
                });                                   
        }
          
    });  

}]);

myApp.controller('DepositCtrl', function ($rootScope, $scope, $http, $mdDialog, $cookies, $location) 
{ 
    $scope.deposit = $rootScope.deposit;
    $scope.approved = 0;
    $scope.storyTags = new Array();
    $scope.token = '';
    
    $scope.loadTags = function(query) 
    {
        //  Ok ... but how it actually needs to send these to an api ...        
        var url = 'http://' + $location.host() + '/Vault/API.php?action=tags&method=fetch';       

        //  Call the tags function appropriately
        $http.get(url).then(
            function (response)   
            {
                $scope.storyTags = response.data;
            }, 
            function(response) 
            {
                //  That's ok, no tags, we don't even need them.
            });         
       return;
    };    
    
    $scope.changeApproval = function(value)
    {
        $scope.approved = value;
    }
    
    $scope.saveDialog = function()
    {        
        //  That's easy, but we need an update here ...
        var url = 'http://' + $location.host() 
                + '/Vault/API.php?action=administer&method=update&token=' + $scope.token
                + '&id=' + $scope.deposit.ID
                + '&nomDePlume=' + $scope.deposit.STORED_AS
                + '&isPlayable=' + $scope.deposit.IS_PLAYABLE        
                + '&title=' + $scope.deposit.TITLE 
                + '&story=' + $scope.deposit.TRANSCRIPTION; 

        //  Call the tags function appropriately
        $http.get(url).then(
            function (response)   
            {
                //  Should probably make a big deal out of it ...
            }, 
            function(response) 
            {
                //  That's ok, no tags, we don't even need them.
            });         
        
        
        
        
        $mdDialog.hide($scope.deposit);
    }
    
    $scope.closeDialog = function()
    {
        $mdDialog.hide($scope.deposit);
    }
            
    angular.element(document).ready(function () 
    {        
        //  Nothing on load
        $scope.token = $cookies.get('authenticationToken');
        
    });      
    
});

myApp.controller('TagCtrl', function ($rootScope, $scope, $http, $mdDialog, $cookies, $location) 
{ 
    $scope.tag = $rootScope.tag;
    $scope.token = '';
    
    $scope.saveDialog = function()
    {                        
        //  That's easy, but we need an update here ...
        var url = 'http://' + $location.host() 
                + '/Vault/API.php?action=tags&method=update&token=' + $scope.token
                + '&id=' + $scope.tag.ID
                + '&title=' + $scope.tag.TITLE 
                + '&description=' + $scope.tag.DESCRIPTION; 

        //  Call the tags function appropriately
        $http.get(url).then(
            function (response)   
            {
                //  Should probably make a big deal out of it ...
            }, 
            function(response) 
            {
                //  That's ok, no tags, we don't even need them.
            });         
       
       
        $mdDialog.hide($scope.tag);
    }
    
    $scope.closeDialog = function()
    {
        $mdDialog.hide($scope.tag);
    }
            
    angular.element(document).ready(function () 
    {        
        //  Nothing on load
        $scope.token = $cookies.get('authenticationToken');
        
        //  Did we get a tag? if not we need to instanciate one.
        if (typeof $scope.tag === "undefined")
        {
            $scope.tag = {ID:"0", TITLE:"Tag Title", DESCRIPTION:"Tag Description"};            
        }
                
    });      
    
});

myApp.controller('MemberCtrl', function ($rootScope, $scope, $http, $mdDialog, $cookies, $location) 
{ 
    $scope.staff = $rootScope.staff;
    $scope.token = '';
    $scope.approved = 0;    
    
    $scope.saveDialog = function()
    {                        
        //  That's easy, but we need an update here ...
        var url = 'http://' + $location.host() 
                + '/Vault/API.php?action=tags&method=update&token=' + $scope.token
                + '&id=' + $scope.tag.ID
                + '&title=' + $scope.tag.TITLE 
                + '&description=' + $scope.tag.DESCRIPTION; 

        //  Call the tags function appropriately
        $http.get(url).then(
            function (response)   
            {
                //  Should probably make a big deal out of it ...
            }, 
            function(response) 
            {
                //  That's ok, no tags, we don't even need them.
            });         
       
       
        $mdDialog.hide($scope.tag);
    }
    
    $scope.closeDialog = function()
    {
        $mdDialog.hide($scope.tag);
    }
    
    $scope.changeApproval = function(value)
    {
        $scope.staff.IS_ACTIVE = value;
    }    
            
    angular.element(document).ready(function () 
    {        
        //  Nothing on load
        $scope.token = $cookies.get('authenticationToken');
        
        //  Did we get a tag? if not we need to instanciate one.
        if (typeof $scope.staff === "undefined")
        {
            $scope.staff = {ID:"0", EMAIL:"", PASSWORD:"", PREFERRED_NAME: "", SESSION: "", IS_ACTIVE: 0 };            
        } else {
            //  Set the active datatype to work with checkboxes
            $scope.staff.IS_ACTIVE *= 1;            
        }
                
    });      
    
});