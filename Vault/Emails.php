<?php

require_once(__DIR__ . '/Libraries/TCPDF-master/tcpdf.php');
require_once(__DIR__ . '/Libraries/PHPMailer/Exception.php');
require_once(__DIR__ . '/Libraries/PHPMailer/PHPMailer.php');
require_once(__DIR__ . '/Libraries/PHPMailer/SMTP.php');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

//  Test with:
//  http://demo.armsign.com.au/Vault/API.php?action=withdraw&method=email&visitorID=12345&emails=pdunn@propergauche.com

/**
 * Description of Deposit
 *
 * @author PaulDunn
 */
class ArmsignEmails
{
    private $accountStatement = '';
    
    
    public function CreateAccountStatement($visitorID, $email)
    {
        $this->GatherData($visitorID);
        
        $outputHTML = '<html>';        
        $outputHTML .= '<head>';
        
        $outputHTML .= '</head>';
        
        $outputHTML .= '<body>';        
        $outputHTML .= $this->CompileHeader($visitorID);
        $outputHTML .= $this->CompileRoomC($visitorID);
        $outputHTML .= $this->CompileRoomD($visitorID);
        $outputHTML .= $this->CompileRoomE($visitorID);
        $outputHTML .= $this->CompileFooter($visitorID);
        
        $outputHTML .= '</body>';
        $outputHTML .= '</html>';
        
        $this->HitSend($email, $outputHTML);
        
    }
    
    private function GatherData($visitorID)
    {
        //  Woo.
        $daSafe = new DaSafe();       
        $returnArray = json_encode($daSafe->fetchAccountStatement($visitorID));
        unset($daSafe);        
        
        return $returnArray;
    }
    
    private function CompileHeader($visitorID)
    {
        return "Header<br/>";
    }

    private function CompileRoomC($visitorID)
    {
        return "RoomC<br/>";
    }

    private function CompileRoomD($visitorID)
    {
        return "RoomD<br/>";
    }

    private function CompileRoomE($visitorID)
    {
        return "RoomE<br/>";
    }    
    
    private function CompileRoomI($visitorID)
    {
        return "RoomI<br/>";
    }     
    
    private function CompileFooter($visitorID)
    {
        return "Footer<br/>";
    }
    
    private function HitSend($email, $outputHTML)
    {
        $fileToSend = '/Files/safeDoor.png';
        
        //  Open a mailer, takes more time, but is working
        $mail = new PHPMailer(true);

        //Server settings
        $mail->SMTPDebug = 0;                                       // Enable verbose debug output
        $mail->isSMTP();                                            // Set mailer to use SMTP
        $mail->Host       = 'smtp.gmail.com';                       // Specify main and backup SMTP servers
        $mail->SMTPAuth   = true;                                   // Enable SMTP authentication
        $mail->Username   = 'paul@armsign.com.au';                  // SMTP username
        $mail->Password   = 'Reddragon01';                          // SMTP password
        $mail->SMTPSecure = 'tls';                                  // Enable TLS encryption, `ssl` also accepted
        $mail->Port       = 587;                                    // TCP port to connect to

        //Recipients
        $mail->setFrom('teller@storybank.com.au', 'Story Bank');
        $mail->addAddress($email, 'Storybank Visitor');     // Add a recipient
        $mail->addReplyTo('donotreply@storybank.com.au', 'Do Not Reply');

        // Attachments

        $mail->addAttachment(__DIR__ . $fileToSend);         // Add attachments

        // Content
        $mail->isHTML(true);                                  // Set email format to HTML
        $mail->Subject = 'Storybank Withdrawal';

        $mail->Body .= $outputHTML;

        $mail->AltBody = 'This is the body in plain text for non-HTML mail clients';

        $mail->send();

        // Tidy this mess up boy
        unset($mail);
    }
    
}