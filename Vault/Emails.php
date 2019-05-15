<?php

require_once(__DIR__ . '/Libraries/TCPDF/tcpdf.php');
require_once(__DIR__ . '/Libraries/PHPMailer/Exception.php');
require_once(__DIR__ . '/Libraries/PHPMailer/PHPMailer.php');
require_once(__DIR__ . '/Libraries/PHPMailer/SMTP.php');

use PHPMailer\PHPMailer\PHPMailer;

//  Test with:
//  http://demo.armsign.com.au/Vault/API.php?action=withdraw&method=email&visitorID=12345&emails=pdunn@propergauche.com

/**
 * Description of Deposit
 *
 * @author PaulDunn
 */
class ArmsignEmails
{
    
    public function CreateAccountStatement($visitorID, $email)
    {        
        $visitorStories = $this->GatherData($visitorID);
        
        $outputHTML = '<html>';        
        $outputHTML .= '<head>';
        $outputHTML .= $this->SetupStyles();
        $outputHTML .= '</head>';
        
        $outputHTML .= '<body>';      
        
        $outputHTML .= $this->CompileHeader($visitorID, $visitorStories);
        $outputHTML .= $this->CompileRoomC($visitorID, $visitorStories);
        $outputHTML .= $this->CompileRoomD($visitorID, $visitorStories);
        $outputHTML .= $this->CompileRoomE($visitorID, $visitorStories);
        $outputHTML .= $this->CompileRoomI($visitorID, $visitorStories);
        $outputHTML .= $this->CompileBalance($visitorID);
        $outputHTML .= $this->CompileFooter($visitorID);
        
        $outputHTML .= '</body>';
        $outputHTML .= '</html>';

        $fileLocation = $this->CompilePDF($outputHTML);
        
        $this->HitSend($email, $outputHTML, $fileLocation);
        
    }
    
    private function SetupStyles()
    {
        $outputHTML = '<style>';
        
        $outputHTML .= 'body                {padding: 2%; background-color: #FFFFFF;}';        
        $outputHTML .= 'h1                  {color: blue;}';        
        $outputHTML .= 'p                   {color: red;}';                
        $outputHTML .= 'table               {width: 100%; border: none; border-collapse: collapse;}';        
        $outputHTML .= 'div                 {padding: 2%; display: block;}';   
        $outputHTML .= '.containerHeader    {width: 96%;}';   
        $outputHTML .= '.headerLeft         {float: left; display: inline; width: 62%;}';   
        $outputHTML .= '.headerRight        {float: right; display: inline; width: 30%;}';   
        $outputHTML .= '.footerLeft         {float: left; display: inline; width: 16%;}';   
        $outputHTML .= '.footerRight        {float: right; display: inline; width: 76%;}';   
        $outputHTML .= '.dashedAbove        {border-top: 1px dashed #000000;}';   
        
        $outputHTML .= '</style>';        
        
        return $outputHTML;
    }
    
    private function GatherData($visitorID)
    {
        //  Woo.
        $daSafe = new DaSafe();       
        $returnArray = json_encode($daSafe->fetchAccountStatement($visitorID));
        unset($daSafe);        
        
        return json_decode($returnArray);
    }
    
    private function CompileHeader($visitorID, $visitorStories)
    {
        //  Ok, what are we looking at here?
        $outputHTML = '<table>';          
        $outputHTML .= '<tbody>';        
        $outputHTML .= '<tr>';
        
        $outputHTML .= '<td width="66%">'
                . 'Account Statement'
                . '<br/><br/>'
                . $this->FetchAccountName($visitorStories)
                . '<br/><br/>'
                . $this->FetchAccountNumber($visitorStories)                
                . '<br/><br/>'                
                . '<b><i>Congratulations,</i></b> you are well on your way to learning the art of storytelling!'
                . '<br/>'
                . 'Your account holds the deposits of your adventures through The Story Bank. These are valuable investments that will add compound interest to your story.'
                . '<br/><br/>'                
                . '<b>Account Balance:</b>'
                . '<br/>'
                . 'Every good story comes from a simple storytelling process. Your balance of ideas and thoughts below create the outline for your story. Take a look at your account so far!';
        $outputHTML .= '</td>';        
        
        $outputHTML .= '<td width="34%">The Story Bank<br/>And some pixtures</td>';
        
        $outputHTML .= '</tr>';
        $outputHTML .= '</tbody>';
        $outputHTML .= '</table>';        
        
        return $outputHTML . '<br/><br/>';
    }

    private function CompileRoomC($visitorID, $visitorStories)
    {
        $outputHTML = '<table>';          
        $outputHTML .= '<tbody>';       
        
        // PROMPT_ID, STORED_ON, STORED_AS, STORED_BY, TRANSCRIPTION, CHARACTER_DESIGN
        
        $outputHTML .= '<tr>';        
        $outputHTML .= '<td width="17%">DATE OF DEPOSIT</td>';                
        $outputHTML .= '<td width="17%">' . $this->FetchAccountDate($visitorStories) . '</td>';                
        $outputHTML .= '<td width="66%">A place to write and somethign to write about ... (pix)</td>';
        $outputHTML .= '</tr>';        
        
        $outputHTML .= '<tr>';        
        $outputHTML .= '<td colspan="2">'
                . 'The environment in which you write and the objects you keep around you say something about your memories and your imagination. They often build the world in which a story will unfold. Review your notes to scope out the features of the world you want to create.'
                . '<br/><br/>'                
                . 'Think about how you want to tell your story. Is it a short tale or a long yarn? Is it a complex narrative or a simple memory? Will people read it or experience it in some other way such as film, music or art? '
                . '</td>';                
        
        $outputHTML .= '<td width="68%">';
        
        foreach ($visitorStories as $story)
        {        
            if ($story->PROMPT_ID > 0 && $story->PROMPT_ID < 10)
            {                
                $outputHTML .= $story->TRANSCRIPTION;
                $outputHTML .= '<br/><br/>';
            }        
        }
        
        $outputHTML .= '</td>';
        $outputHTML .= '</tr>';                
        
        $outputHTML .= '</tbody>';
        $outputHTML .= '</table>'; 
        
        return $outputHTML . '<br/><br/>';
    }

    private function CompileRoomD($visitorID, $visitorStories)
    {
        $outputHTML = '<table>';          
        $outputHTML .= '<tbody>';       
        
        $outputHTML .= '<tr>';        
        $outputHTML .= '<td width="17%">DATE OF DEPOSIT</td>';                
        $outputHTML .= '<td width="17%">' . $this->FetchAccountDate($visitorStories) . '</td>';                
        $outputHTML .= '<td width="66%">Characters are a pillar of your story ...</td>';
        $outputHTML .= '</tr>';        
        
        $outputHTML .= '<tr>';        
        $outputHTML .= '<td colspan="2">'
                . 'To develop an interesting story, work more on your character to give them some flaws.'
                . '<br/><br/>'                     
                . 'What do they need to learn or desire to change? This will provide you with an idea of what happens to them as the story unfolds.'
                . '<br/><br/>'                                       
                . 'Now, create an opposing character (an Antagonist) who will create obstacles and complications for your main character.'
                . '<br/><br/>'                     
                . 'Think good guys and bad guys! How do they create conflict and stop the main character from achieving their goals?'
                . '</td>';                
        
        $outputHTML .= '<td width="66%">';
        
        foreach ($visitorStories as $story)
        {        
            if ($story->PROMPT_ID > 9 && $story->PROMPT_ID < 15)
            {                
                $outputHTML .= $story->TRANSCRIPTION;
                $outputHTML .= '<br/><br/>';
            }        
        }
        
        $outputHTML .= '</td>';
        $outputHTML .= '</tr>';                
        
        $outputHTML .= '</tbody>';
        $outputHTML .= '</table>'; 
        
        return $outputHTML . '<br/><br/>';
    }

    private function CompileRoomE($visitorID, $visitorStories)
    {
        $outputHTML = '<table>';          
        $outputHTML .= '<tbody>';       
        
        $outputHTML .= '<tr>';        
        $outputHTML .= '<td width="17%">DATE OF DEPOSIT</td>';                
        $outputHTML .= '<td width="17%">' . $this->FetchAccountDate($visitorStories) . '</td>';                
        $outputHTML .= '<td width="66%">Bringing your main character to life ...</td>';
        $outputHTML .= '</tr>';        
        
        $outputHTML .= '<tr>';        
        $outputHTML .= '<td colspan="2">'
                . 'Every story has a single Protagonist or leading character.'
                . '<br/><br/>'
                . 'What is the name of yours?'
                . '<br/><br/>'
                . 'Check back on your notes and expand your description of the appearance and personality of your main character.'
                . '<br/><br/>'
                . 'Make your character memorable with a distinctive personality that people will connect with.'
                . '</td>';                
        
        $outputHTML .= '<td width="66%">';
        
        foreach ($visitorStories as $story)
        {        
            if ($story->PROMPT_ID == 15)
            {                
                $outputHTML .= $story->TRANSCRIPTION;
                $outputHTML .= '<br/><br/>';
            }        
        }
        
        $outputHTML .= '</td>';
        $outputHTML .= '</tr>';                
        
        $outputHTML .= '</tbody>';
        $outputHTML .= '</table>'; 
        
        return $outputHTML . '<br/><br/>';
    }    
    
    private function CompileRoomI($visitorID, $visitorStories)
    {
        $outputHTML = '<table>';          
        $outputHTML .= '<tbody>';       
        
        $outputHTML .= '<tr>';        
        $outputHTML .= '<td width="17%">DATE OF DEPOSIT</td>';                
        $outputHTML .= '<td width="17%">' . $this->FetchAccountDate($visitorStories) . '</td>';                
        $outputHTML .= '<td width="66%">So, what\'s your story really about?</td>';
        $outputHTML .= '</tr>';        
        
        $outputHTML .= '<tr>';        
        $outputHTML .= '<td colspan="2">'
                . 'What, in the end, are you trying to share by telling your story?  What is your theme and inspiration?'
                . '<br/><br/>'                
                . 'Go back through your notes on thought provoking life questions and decide the main purpose of your story.' 
                . '<br/><br/>'
                . 'How does your main character and any supporting characters change through the course of the story?'
                . '<br/><br/>'                
                . 'How might the story end in an unexpected, interesting or unusual way?'
                . '</td>';                
        
        $outputHTML .= '<td width="66%">';
        
        foreach ($visitorStories as $story)
        {        
            if ($story->PROMPT_ID == 16)
            {                
                $outputHTML .= $story->TRANSCRIPTION;
                $outputHTML .= '<br/><br/>';
            }        
        }
        
        $outputHTML .= '</td>';
        $outputHTML .= '</tr>';                
        
        $outputHTML .= '</tbody>';
        $outputHTML .= '</table>'; 
        
        return $outputHTML . '<br/><br/>';
    }     
    
    private function CompileBalance($visitorID)
    {
        $outputHTML = '<table>';          
        $outputHTML .= '<tbody>';       
        
        $outputHTML .= '<tr>';        
        $outputHTML .= '<td width="34%">CURRENT ACCOUNT BALANCE</td>';                
        $outputHTML .= '<td width="66%">Halfway to your story goal!</td>';
        $outputHTML .= '</tr>';        
        
        $outputHTML .= '<tr>';        
        $outputHTML .= '<td width="34%">INTEREST RATE</td>';                
        $outputHTML .= '<td width="66%">To determine your current rate of interest, pitch your story ideas to a friend.</td>';
        $outputHTML .= '</tr>';                

        $outputHTML .= '</tbody>';
        $outputHTML .= '</table>'; 
        
        return $outputHTML . '<br/><br/>';        
        
    }
    
    private function CompileFooter($visitorID)
    {
        //  Ok, what are we looking at here?
        $outputHTML = '<table>';          
        $outputHTML .= '<tbody>';        
        
        $outputHTML .= '<tr>';        
        $outputHTML .= '<td width="20%">Light bulb</td>';                
        $outputHTML .= '<td width="80%">'
               . 'Inspired?'
                . '<br/><br/>'           
                . 'Great! Now it\'s time to keep growing your balance by taking your Story Notes to our Workshop or your favourite creative place and use them to start creating your story.'
                . '<br/><br/>'
                . 'Develop the outline of your story by listing a series of events in the order that they will happen. Seeing all the moments in your story will highlight any gaps. It will also show you opportunities to fill with twists and turns, surprises and delights. Easy, right?'
                . '<br/><br/>'
                . 'Well, as Mary Poppins herself says: "<b><i>Well begun is half done!</i></b>" Good luck!'
                . '<br/><br/>'                
                . 'Oh, and when you\'re finished, let us know - we\'d love to share your story!'
                . '</td>';
        
        $outputHTML .= '</tr>';    
        
        $outputHTML .= '<tr class="dashedAbove">';        
        $outputHTML .= '<td width="20%">Hand pointing</td>';                
        $outputHTML .= '<td width="80%">'
                . '<a href="mailto:storybank@frasercoast.qld.gov.au">StoryBank@frasercoast.qld.gov.au</a>'
                . '<br/><br/>'   
                . '#storybankmaryborough'
                . '<br/><br/>'
                . '<a href="www.storybankmaryborough.com.au">www,storybankmaryborough.com.au</a>'
                . '</td>';        
        $outputHTML .= '</tr>';
        
        $outputHTML .= '</tbody>';
        $outputHTML .= '</table>';         
        
        
        return $outputHTML;
    }
    
    private function CompilePDF($html)
    {
        $returnFile = '';
        
        // create new PDF document
        $pdf = new TCPDF();

        // set document information
        $pdf->SetCreator(PDF_CREATOR);
        $pdf->SetAuthor('Story Bank');
        $pdf->SetTitle('Story Bank Account Statement');
        $pdf->SetSubject('Story Bank Account Statement');
        $pdf->SetKeywords('Story Bank, Account Statement');

        // set default monospaced font
        $pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

        // set margins
        $pdf->SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
        $pdf->SetHeaderMargin(PDF_MARGIN_HEADER);
        $pdf->SetFooterMargin(PDF_MARGIN_FOOTER);

        // set auto page breaks
        $pdf->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);

        // set image scale factor
        $pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);

        // set font
        $pdf->SetFont('helvetica', '', 12);

        // add a page
        $pdf->AddPage();
        
        // output the HTML content
        $pdf->writeHTML($html, true, false, true, false, '');

        // close and output PDF document
        $pdf->Output(__DIR__ . 'Files/example_011.pdf', 'I');      
        
        unset($pdf);
        
        return __DIR__ . 'Files/example_011.pdf';        
    }
    
    private function HitSend($email, $outputHTML, $fileLocation)
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
        if (strlen($fileLocation) > 0)
        {        
            $mail->addAttachment($fileLocation);         // Add attachments
        }

        // Content
        $mail->isHTML(true);                                  // Set email format to HTML
        $mail->Subject = 'Storybank Withdrawal';

        $mail->Body .= $outputHTML;

        $mail->AltBody = 'This is the body in plain text for non-HTML mail clients';

        $mail->send();

        // Tidy this mess up boy
        unset($mail);
    }
    
    /*
     *      DATA MANIPULATION
     */
    
    private function FetchAccountName($visitorStories)
    {        
        foreach ($visitorStories as $story)
        {        
            if (strlen($story->STORED_AS) > 0)
            {                
                return $story->STORED_AS;
            }        
        }
        
        return 'Anon';
    }
    
    private function FetchAccountNumber($visitorStories)
    {
        foreach ($visitorStories as $story)
        {        
            if (strlen($story->VISITOR_ID) > 0)
            {                
                return $story->VISITOR_ID;
            }        
        }        
        
        return 'XXXXX';
    }
    
    private function FetchAccountDate($visitorStories)
    {
        foreach ($visitorStories as $story)
        {        
            if (strlen($story->STORED_ON) > 0)
            {                
                return $story->STORED_ON;
            }        
        }          
        
        return 'Today';
    }
    
}