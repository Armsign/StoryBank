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
    $scope.flaggedStoriesCount = 0;    
    $scope.tagCount = 0;    
    $scope.staffCount = 0;    
    $scope.approvedStoriesCount = 0;
    $scope.deadStoriesCount = 0;    
    $scope.token = '';
    $scope.searchText = '';
    
    $scope.gridNewStoriesOptions = { data: [] };            
    $scope.gridFlaggedStoriesOptions = { data: [] };   
    $scope.gridApprovedStoriesOptions = { data: [] };            
    $scope.gridDeadStoriesOptions = { data: [] };                
    $scope.gridMembersOptions = { data: [] };      
    $scope.gridTagsOptions = { data: [] };         

    $scope.addDeposit = function(ev)
    {
        $rootScope.deposit = undefined;
        
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
            $scope.getApprovedStoryData();
            $scope.getDeadStoryData();            
 
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
                  .ok('Yes!')
                  .cancel('No!');

            $mdDialog.show(confirm).then(
                function() 
                {
                                //  Ok ... but how it actually needs to send these to an api ...        
                    var url = 'http://' + $location.host() 
                        + '/Vault/API.php?action=deposit&method=delete&token=' + $scope.token
                        + '&id=' + deposit.ID;

                    //  Call the login function appropriately
                    $http.get(url).then(
                        function (response)   
                        {                        
                            
                            //  Load up teh data grids!
                            $scope.getServerData();
                            $scope.getFlaggedServerData();
                            $scope.getApprovedStoryData();
                            $scope.getDeadStoryData();                            
                            
                        }); 
                    }, function() {
                        //  Do nothing
                    });  
                    
        }
    }
    
    //  ok        
    
    $scope.addStaff = function(ev)
    {
        $rootScope.staff = undefined;
        
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
        
    $scope.goHome = function()
    {
        $location.path("/");    
    }
    
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

}]);

myApp.controller('DepositCtrl', function ($rootScope, $scope, $http, $mdDialog, $cookies, $location) 
{ 
    $scope.deposit = $rootScope.deposit;
    $scope.approved = 0;
    $scope.storyTags = new Array();
    $scope.storyTagsSuperSet = new Array();
    $scope.token = '';
    $scope.reflectStory = '';    
    $scope.jsonDeposit = {
                TOKEN: '',
                ID: '', 
                PROMPTID: '',
                NOMDEPLUME: '',
                ISPLAYABLE: '',
                TITLE: '',
                EMAIL: '',
                HASCONSENT: '',
                USEEMAIL: '',
                STORY: ''
            };    
    
    $scope.loadTags = function(query) 
    {       
        var returnArray = new Array();
        
        for (var i=0; i < $scope.storyTagsSuperSet.length; i++)
        {
            
            if ($scope.storyTagsSuperSet[i].TITLE.toUpperCase().includes(query.toUpperCase()))
            {
                returnArray.push($scope.storyTagsSuperSet[i]);
            }
            
        }
        
        return returnArray;
    };    
    
    $scope.fetchTags = function()
    {
        //  Ok ... but how it actually needs to send these to an api ...        
        var url = 'http://' + $location.host() + '/Vault/API.php?action=tags&method=fetch';       

        //  Call the tags function appropriately
        $http.get(url).then(
            function (response)   
            {
                $scope.storyTagsSuperSet = response.data;
            }, 
            function(response) 
            {
                //  That's ok, no tags, we don't even need them.
            });         
       return;        
        
    }
    
    $scope.fetchStoryTags = function()
    {
        //  Ok ... but how it actually needs to send these to an api ...        
        var url = 'http://' + $location.host() + '/Vault/API.php?action=deposit&method=storyTags&token=' + $scope.token
                + '&id=' + $scope.deposit.ID;

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
    }
    
    $scope.changeApproval = function(value)
    {
        $scope.approved = value;
        $scope.deposit.IS_PLAYABLE = value;
    }
    
    $scope.saveDialog = function()
    {        
        //  That's easy, but we need an update here ...
        var url = 'http://' + $location.host() + '/Vault/API.php'; 

        //  Compile data
        $scope.jsonDeposit.TOKEN = $scope.token;
        $scope.jsonDeposit.ID = $scope.deposit.ID;
        $scope.jsonDeposit.PROMPTID = $scope.deposit.PROMPT_ID;
        $scope.jsonDeposit.NOMDEPLUME = $scope.deposit.STORED_AS;
        $scope.jsonDeposit.ISPLAYABLE = $scope.deposit.IS_PLAYABLE;
        $scope.jsonDeposit.TITLE = $scope.deposit.TITLE;
        $scope.jsonDeposit.EMAIL = $scope.deposit.STORED_BY;
        $scope.jsonDeposit.HASCONSENT = $scope.deposit.HAS_CONSENT;
        $scope.jsonDeposit.USEEMAIL = $scope.deposit.USE_EMAIL;
        $scope.jsonDeposit.STORY = $scope.reflectStory;        
        
        //  Compile json
        var payload= JSON.stringify($scope.jsonDeposit);

        //  Call the tags function appropriately        
        $http.post(url, payload).then(
            function (response)   
            {               
                //  A big deal about it because we need to save the tags now too ... so we ought to get an id back at least right?
                if ((response.data * 1) > 0)
                {
                    //  Successful save, let's save the tags if they're about
                    $scope.saveStoryTags(response.data);
                }
                
            }, 
            function(response) 
            {
                //  That's ok, no tags, we don't even need them.
            });         
        
        $mdDialog.hide($scope.deposit);
        
    }
    
    $scope.saveStoryTags = function(id)
    {
        
        for (var i=0; i < $scope.storyTags.length; i++)
        {

            //  That's easy, but we need an update here ...
            var url = 'http://' + $location.host() 
                    + '/Vault/API.php?action=tags&method=bridge&token=' + $scope.token
                    + '&storyID=' + id
                    + '&tagID=' + $scope.storyTags[i].ID;
            
            $http.get(url).then(
                function (response)   
                {               
                    //  That's ok, tags are a on-way street.
                }, 
                function(response) 
                {
                    //  That's ok, no tags, we don't even need them.
                });                          
        }        
    }
    
    $scope.closeDialog = function()
    {
        $mdDialog.hide($scope.deposit);
    }
            
    angular.element(document).ready(function () 
    {        
        $scope.fetchTags();
        
        $scope.token = $cookies.get('authenticationToken');
        
        //  Did we get a tag? if not we need to instanciate one.
        if (typeof $scope.deposit === "undefined")
        {
            $scope.deposit = {
                ID:"0", 
                PROMPT_ID:0,
                TITLE: "Title", 
                VISITOR_ID: 0,
                STORED_BY: "anon@storybank.com.au",
                STORED_AS:"Anon",
                STORED_AT:"N/A",
                STORED_ON: new Date(),
                AUDIO_TYPE:"",
                AUDIO_LENGTH:0,
                IS_PLAYABLE:0,
                IS_TRANSCRIBED:1,
                TRANSCRIPTION:"Story",
                HAS_CONSENT:0,
                USE_EMAIL:0,                
                REVIEWED_BY:0,
                REVIEWED_ON:new Date(),                
            };        
            
        } else {
            
            $scope.reflectStory = $scope.deposit.TRANSCRIPTION;
            $scope.approved = $scope.deposit.IS_PLAYABLE * 1;   // Reset to integral
            $scope.fetchStoryTags();
            
        } 
        
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
                + '/Vault/API.php?action=members&method=update&token=' + $scope.token
                + '&id=' + $scope.staff.ID
                + '&email=' + $scope.staff.EMAIL 
                + '&preferredName=' + $scope.staff.PREFERRED_NAME 
                + '&isActive=' + $scope.staff.IS_ACTIVE; 

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
        $mdDialog.hide($scope.staff);
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