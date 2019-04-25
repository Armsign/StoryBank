<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

require_once("Logins.php"); 
require_once("Tags.php"); 
require_once("Deposits.php"); 

function Withdraw()
{    
    $deposits = new Deposits();

    $token = trim($_GET["token"]);                  
    $id = trim($_GET["id"]);      
    $promptId = trim($_GET["promptId"]);      
    $visitorID = trim($_GET["visitorID"]);    
    $email = trim($_GET["email"]);
    $nomDePlume = trim($_GET["nomDePlume"]);                
    $title = trim($_GET["title"]);
    $story = trim($_GET["story"]); 
    $emails = trim($_GET["emails"]);
    $comment = trim($_GET["comments"]);
    $charDesign = trim($_GET["charDesign"]);      
    $hasConsent = trim($_GET["hasConsent"]);
    $useEmail = trim($_GET["useEmail"]);        
    $isPlayable = trim($_GET["isPlayable"]);       
    
    switch ($_GET["method"])
    { 
        //  Admin functions
        case ("update"):                           
            echo $deposits->updateStory($token, $id, $promptId, $email, $nomDePlume, $title, $story, $charDesign, $hasConsent, $useEmail, $isPlayable);
            break;        
        case ("delete"):
            echo $deposits->deleteStory($token, $id);
            break;                          
        case ("storyTags"):
            echo $deposits->fetchStoryTags($token, $id);
            break;         
        
        //  Kiosk functions
        case ("email"):
            echo $deposits->sendEmails($visitorID, $emails);                        
            break;
        case ("withdrawal"):            
            $tag = trim($_GET["tag"]);                  
            $orderBy = trim($_GET["orderBy"]);      
            
            echo $deposits->fetchWithdrawalStory($tag, $orderBy);
            break;        
        case ("love"):         
            echo $deposits->loveStory($id, $visitorID);
            break;                     
        case ("comments"):         
            echo $deposits->depositComments($id);
            break;              
        case ("addComments"):         
            echo $deposits->addComments($id, $visitorID, $comment);
            break;      
        case ("storyID"):            
            echo $deposits->fetchWithdrawalStoryId($id);
            break;        
        case ("create"):
            echo $deposits->createStory($promptId, $visitorID, $email, $nomDePlume, $story, $charDesign, $hasConsent, $useEmail);
            break;        
        case ("nomdeplume"):
            echo $deposits->fetchNomDePlume($email);
            break;        
        case ("consent"):
            echo $deposits->hasConsent($email);
            break;        
        
        default: 
            echo "Withdraw Operation Attempted";
            break;
    }

    unset($deposits);

    return;
}

function Deposit()
{
    $deposits = new Deposits();

    $token = trim($_GET["token"]);                  
    $id = trim($_GET["id"]);      
    $promptId = trim($_GET["promptId"]);      
    $visitorID = trim($_GET["visitorID"]);    
    $email = trim($_GET["email"]);
    $nomDePlume = trim($_GET["nomDePlume"]);                
    $title = trim($_GET["title"]);
    $story = trim($_GET["story"]);  
    $charDesign = trim($_GET["charDesign"]);      
    $hasConsent = trim($_GET["hasConsent"]);
    $useEmail = trim($_GET["useEmail"]);        
    $isPlayable = trim($_GET["isPlayable"]);   
    
    switch ($_GET["method"])
    { 
        //  Admin functions
        case ("update"):    
                       
            echo $deposits->updateStory($token, $id, $promptId, $email, $nomDePlume, $title, $story, $charDesign, $hasConsent, $useEmail, $isPlayable);
            break;        
        case ("delete"):
            echo $deposits->deleteStory($token, $id);
            break;        
        case ("approvedStories"):
            echo $deposits->fetchApprovedStories($token);
            break;
        case ("unApprovedStories"):
            echo $deposits->fetchUnApprovedStories($token);
            break;          
        case ("singleStory"):
            echo $deposits->fetchSingularStory($token, $id);            
            break;        
        case ("storyTags"):
            echo $deposits->fetchStoryTags($token, $id);
            break;  
        case ("newComments"):
            echo $deposits->fetchNewComments($token);
            break;        
        case ("approveComment"):
            echo $deposits->approveComment($token, $id);
            break; 
        case ("deleteComment"):
            echo $deposits->deleteComment($token, $id);
            break; 
        
        //  Kiosk functions
        case ("create"):
            echo $deposits->createStory($promptId, $visitorID, $email, $nomDePlume, $story, $charDesign, $hasConsent, $useEmail);
            break;        
        case ("nomdeplume"):
            echo $deposits->fetchNomDePlume($email);
            break;        
        case ("consent"):
            echo $deposits->hasConsent($email);
            break;        
        
        default: 
            echo "Deposit Operation Attempted";
            break;
    }

    unset($deposits);

    return;
}

function BankDeposit($jsonPayLoad)
{
    $deposits = new Deposits();

    //  Parse the payload
    $token = $jsonPayLoad->TOKEN;                  
    $id = $jsonPayLoad->ID;
    $promptId = $jsonPayLoad->PROMPTID;      
    $email = $jsonPayLoad->EMAIL;
    $nomDePlume = $jsonPayLoad->NOMDEPLUME;
    $title = $jsonPayLoad->TITLE;
    $story = $jsonPayLoad->STORY;    
    $charDesign = '';    
    $hasConsent = $jsonPayLoad->HASCONSENT;
    $useEmail = $jsonPayLoad->USEEMAIL;
    $isPlayable = $jsonPayLoad->ISPLAYABLE;
    
    echo $deposits->updateStory($token, $id, $promptId, $email, $nomDePlume, $title, $story, $charDesign, $hasConsent, $useEmail, $isPlayable);    
    
    unset($deposits);
    
    return;
}

function Administer()
{    
    $login = new Logins();                    

    switch ($_GET["method"])
    {       
        case ("login"):
            echo $login->Authenticate($_GET["email"], $_GET["password"]);
            break;
        case ("relogin"):
            echo $login->ReAuthenticate($_GET["token"]);
            break;
        default:
            echo 'Administration Attempted';
            break;       
    }
    
    unset($login);
    
    return;
}

function Members()
{    

    switch ($_GET["method"])
    {
        case ("password"):
            $logins = new Logins();

            $token = trim($_GET["token"]);              
            $id = trim($_GET["id"]);              
            $password = trim($_GET["password"]);   
            
            echo $logins->updatePassword($token, $id, $password);
            
            unset($logins);
            break;
        case ("update"):
            $logins = new Logins();

            $token = trim($_GET["token"]);              
            $id = trim($_GET["id"]);              
            $email = trim($_GET["email"]);            
            $preferredName = trim($_GET["preferredName"]);
            $isActive = trim($_GET["isActive"]);                            
            
            echo $logins->updateMember($token, $id, $email, $preferredName, $isActive);
            
            unset($logins);
            break;                
        case ("fetch"):
            $logins = new Logins();                        
           
            echo $logins->fetchMembers($_GET["token"]);                        
            
            unset($logins);
            break;
        default:
            echo 'Members Attempted';
            break;       
    }
    
    return;
}

function Tags()
{
    //  I'll need a valid token to proceed with anything ... not true, the storyteller will still need to know ;(            
    
    switch ($_GET["method"])
    {
        case ("delete"):
            $mySafe = new DaSafe();

            $token = trim($_GET["token"]);              
            $id = trim($_GET["id"]);              
            
            echo json_encode($mySafe->deleteTags($token, $id));
            
            unset($mySafe);            
            break;
        case ("update"):
            $mySafe = new DaSafe();

            $token = trim($_GET["token"]);              
            $id = trim($_GET["id"]);              
            $title = trim($_GET["title"]);
            $description = trim($_GET["description"]);
            
            echo json_encode($mySafe->updateTags($token, $id, $title, $description));
            
            unset($mySafe);            
            break;        
        case ("fetch"):
            $mySafe = new DaSafe();
            
            echo json_encode($mySafe->fetchTags());            
            
            unset($mySafe);
            break; 
        case ("bridge"):
            $tags = new Tags();
            
            $token = trim($_GET["token"]);                  
            $storyID = trim($_GET["storyID"]);      
            $tagID = trim($_GET["tagID"]);             
            
            echo $tags->createBridge($token, $storyID, $tagID);
            
            unset($tags);
            break;
        default:
            echo 'Tags Attempted';
            break;       
    }
    
    return;   
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') 
{

    $payLoad = file_get_contents("php://input");
    
    //  Turn it into data
    $jsonPayLoad = json_decode($payLoad);
    
    //  Now do something with it
    BankDeposit($jsonPayLoad);

    
} else {

    //  This switch effectively maps to the API calls ... 
    switch($_GET["action"])
    {
        case ("deposit"):
            Deposit();
            break;
        case ("withdraw"):
            Withdraw();
            break;    
        case ("administer"):
            Administer();
            break;     
        case ("members"):
            Members();
            break;     
        case ("tags"):
            Tags();
            break;
        default: 
            echo "GET: Bad API Call";
            break;
    }    
    
}