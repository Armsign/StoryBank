<?php

require_once("Emails.php"); 

/**
 * Description of Deposit
 *
 * @author PaulDunn
 */
class Deposits
{
    
    /*
     *      Admin functions
     */
    public function updateStory($token, $id, $promptId, $email, $nomDePlume, $title, $story, $charDesign, $hasConsent = 0, $useEmail = 0, $isPlayable = 0)
    {
        //  Need to check if this is a user
        $returnValue = '';
        
        $daSafe = new DaSafe();
        
        $staffData = $daSafe->fetchToken($token);
        
        if (count($staffData) == 1)
        {           
            //  Get the user's id           
            if (strlen($email) > 0 && strlen($nomDePlume) > 0 && strlen($story) > 0)
            {                
                $returnValue = json_encode($daSafe->updateStory($staffData[0]['ID'] * 1, $id, $promptId, 0, $email, $nomDePlume, $title, $story, $charDesign, $hasConsent, $useEmail, $isPlayable));
            }
        }
        unset($daSafe);
        
        return $returnValue;
    }    
    
    public function deleteStory($token, $id)
    {
        $returnArray = '';
        
        //  Need to check if this is a user
        $daSafe = new DaSafe();       
        if ($daSafe->IsValidToken($token))
        {
            $returnArray = json_encode($daSafe->deleteStory($id));
        }        
        unset($daSafe);

        return $returnArray;                
    }
    
    public function fetchApprovedStories($token)
    {
        $returnArray = '';
        
        //  Need to check if this is a user
        $daSafe = new DaSafe();       
        if ($daSafe->IsValidToken($token))
        {
            $returnArray = json_encode($daSafe->fetchApprovedStories());
        }        
        unset($daSafe);

        return $returnArray;
    }  
    
    public function fetchUnApprovedStories($token)
    {
        $returnArray = '';
        
        //  Need to check if this is a user
        $daSafe = new DaSafe();       
        if ($daSafe->IsValidToken($token))
        {
            $returnArray = json_encode($daSafe->fetchUnApprovedStories());
        }        
        unset($daSafe);

        return $returnArray;
    }       
    
    public function fetchStoryTags($token, $id)
    {
        $returnArray = '';
        
        //  Need to check if this is a user
        $daSafe = new DaSafe();       
        if ($daSafe->IsValidToken($token))
        {
            $returnArray = json_encode($daSafe->fetchStoryTags($id));
        }        
        unset($daSafe);

        return $returnArray;                
    }  
    
    public function fetchSingularStory($token, $id)
    {
        $returnArray = '';
        
        //  Need to check if this is a user
        $daSafe = new DaSafe();       
        if ($daSafe->IsValidToken($token))
        {
            $returnArray = json_encode($daSafe->fetchSingularStory($id));
        }        
        unset($daSafe);

        return $returnArray;                       
    }    
        
    /*
     *      Kiosk Functions
     */
    public function sendEmails($visitorID, $email)
    {
        $mailer = new ArmsignEmails();
        echo $mailer->CreateAccountStatement($visitorID, $email);        
        unset($mailer);
    }
    
    public function createStory($promptID, $email, $visitorID, $nomDePlume, $story, $charDesign, $hasConsent = 0, $useEmail = 0)
    {
        $returnValue = '';
        
        if (strlen($email) > 0 && strlen($nomDePlume) > 0 && strlen($story) > 0)
        {
            $mySafe = new DaSafe();
            
            $returnValue = json_encode($mySafe->updateStory(0, 0, $promptID, $email, $visitorID, $nomDePlume, 'Anon', $story, $charDesign, $hasConsent, $useEmail, 0));
            unset($mySafe);
        }
        
        return $returnValue;
    }    
    
    public function loveStory($deposit, $visitorID)
    {
        $returnValue = '';
        
        if ($deposit > 0 && strlen($visitorID) > 0)
        {   
            $mySafe = new DaSafe();                    
            
            //  Have I already made a deposit?            
            if ($mySafe->IsValidVisitorID($visitorID) &&  $mySafe->IsValidDeposit($deposit))
            {

                if (!$mySafe->IsLovedDeposit($deposit, $visitorID))
                {                
                    //  I havent even liked it once but I have made a deposit
                    $returnValue = json_encode($mySafe->updateMetrics($deposit, $visitorID));                                        
                }
                
            } else {
                
                $returnValue = "Invalid Visitor ID: " . $visitorID . " - " . $deposit;                                        
                
            }
            
            unset($mySafe);
        }
     
        return $returnValue;
    }    
    
    public function addComments($deposit, $visitorID, $comment)
    {
        $returnValue = '';
        
        if ($deposit > 0)
        {   
            $mySafe = new DaSafe();  
            
            //  Have I already made a deposit?            
            if ($mySafe->IsValidVisitorID($visitorID) && $mySafe->IsValidDeposit($deposit))
            {

                $returnValue = json_encode($mySafe->addComment($deposit, $visitorID, $comment));  
                
            } else {
                
                $returnValue = "Invalid Visitor ID: " . $visitorID . " - " . $deposit;                                        
                
            }            
            
            unset($mySafe);
        }
     
        return $returnValue;                
    }    
    
    public function depositComments($deposit)
    {
        $returnValue = '';
        
        if ($deposit > 0)
        {   
            $mySafe = new DaSafe();                    
            
            $returnValue = json_encode($mySafe->fetchComments($deposit));                                        
            
            unset($mySafe);
        }
     
        return $returnValue;                
    }
    
    public function fetchNewComments($token)
    {
        $returnValue = '';
        
        //  Need to check if this is a user
        $daSafe = new DaSafe();       
        if ($daSafe->IsValidToken($token))
        {                              
            $returnValue = json_encode($daSafe->fetchNewComments());                                        
        }
        unset($daSafe);
                    
        return $returnValue;         
    }
    
    public function deleteComment($token, $id)
    {
        $returnValue = '';
        
        //  Need to check if this is a user
        $daSafe = new DaSafe();       
        if ($daSafe->IsValidToken($token))
        {                              
            $returnValue = json_encode($daSafe->deleteComment($id));                                        
        }
        unset($daSafe);
                    
        return $returnValue;           
    }
    
    public function approveComment($token, $id)
    {
        $returnValue = '';
        
        //  Need to check if this is a user
        $daSafe = new DaSafe();
        
        $staffData = $daSafe->fetchToken($token);
        
        if (count($staffData) == 1)
        {                  
            $returnValue = json_encode($daSafe->approveComment($id, $staffData[0]['ID'] * 1));
        }
        
        unset($daSafe);
                    
        return $returnValue;                   
    }
    
    public function fetchNomDePlume($email)
    {
        $returnValue = '';
        
        if (strlen($email) > 0)
        {        
            $mySafe = new DaSafe();        
            $returnValue = json_encode($mySafe->fetchStoryNomDePlume($email));                        
            unset($mySafe);
        }

        return $returnValue;      
    }    
    
    public function hasConsent($email)
    {   
        $returnValue = '';
        
        if (strlen($email) > 0)
        {        
            $mySafe = new DaSafe();        
            $returnValue = json_encode($mySafe->fetchStoryCount($email));            
            unset($mySafe);
        }
        
        return $returnValue;      
    }

    public function fetchWithdrawalStory($tag, $orderBy)
    {
        $returnArray = '';
        
        if (strlen($tag) > 0 && strlen($orderBy) > 0)
        {
            //  Need to check if this is a user
            $daSafe = new DaSafe();       
            $returnArray = json_encode($daSafe->fetchWithdrawalStory($tag, $orderBy));
            unset($daSafe);
        
        }

        return $returnArray;                
    }        
    
    public function fetchWithdrawalStoryId($id)
    {
        $returnArray = '';
        
        if ($id > 0)
        {
            //  Need to check if this is a user
            $daSafe = new DaSafe();       
            $returnArray = json_encode($daSafe->fetchWithdrawalStoryId($id));
            unset($daSafe);
        
        }

        return $returnArray;                
    }        
    
}