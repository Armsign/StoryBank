<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require(__DIR__ . '/Libraries/PHPMailer/Exception.php');
require(__DIR__ . '/Libraries/PHPMailer/PHPMailer.php');
require(__DIR__ . '/Libraries/PHPMailer/SMTP.php');

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
        //  Open a mailer, takes more time, but is working
        $mail = new PHPMailer(true);
        
        try {
            //Server settings
            $mail->SMTPDebug = 0;                                       // Enable verbose debug output
            $mail->isSMTP();                                            // Set mailer to use SMTP
            $mail->Host       = 'smtp.gmail.com';                       // Specify main and backup SMTP servers
            $mail->SMTPAuth   = true;                                   // Enable SMTP authentication
            $mail->Username   = 'paul@armsign.com.au';                     // SMTP username
            $mail->Password   = 'Reddragon01';                               // SMTP password
            $mail->SMTPSecure = 'tls';                                  // Enable TLS encryption, `ssl` also accepted
            $mail->Port       = 587;                                    // TCP port to connect to

            //Recipients
            $mail->setFrom('teller@storybank.com.au', 'Story Bank');
            $mail->addAddress($email, 'Storybank Visitor');     // Add a recipient
            $mail->addReplyTo('donotreply@storybank.com.au', 'Do Not Reply');

            // Attachments

            $mail->addAttachment(__DIR__ . '/Files/safeDoor.png');         // Add attachments

            // Content
            $mail->isHTML(true);                                  // Set email format to HTML
            $mail->Subject = 'Storybank Withdrawal';
            
            $mail->Body .= "<h1>You're too hot!</h1>";
            $mail->Body .= "<p>Like, if anything, you're too hot to actually date.<p>";            
            
            $mail->AltBody = 'This is the body in plain text for non-HTML mail clients';

            $mail->send();
            
            //  echo 'Message has been sent';
            
        } catch (Exception $e) {
            
            // echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
            
        }    
       

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

/*
sendmail -F “Synology Station” -f “paul@armsign.com.au” -t pdunn@propergauche.com << EOF
Subject: Synology Mail Test
Seems to work. Hooray.
EOF
 * 
 * 
 * 
 *              /usr/bin/ssmtp -t
 * 
 * 
 
 sendmail -F “Synology Station” -f “paul@armsign.com.au” -t paul@armsign.com.au << EOF
Subject: Synology Mail Test
Seems to work. Hooray.
EOF
 
 * 
 * 
 */