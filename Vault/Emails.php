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
    //  Standard Fonts to setup  
    private $configs = null;

    /*
     *      Constructor!
     */
    public function __construct() 
    {
        $this->configs = include('conf.php');
    }    
    
    public function CreateAccountStatement($visitorID, $email)
    {        
        
        $visitorStories = $this->GatherData($visitorID);

        //  $fileLocation = $this->CompilePDF($outputHTML);
        $fileLocation = $this->CompilePS($visitorID, $visitorStories);        
        
        return $fileLocation;         
    }
    
    private function CompilePS($visitorID, $visitorStories)
    {
        // create new PDF document
        $pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, "A4", true, "UTF-8", false);               

        // set document information
        $pdf->SetCreator(PDF_CREATOR);
        $pdf->SetAuthor('Story Bank');
        $pdf->SetTitle('Story Bank Account Statement');
        $pdf->SetSubject('Story Bank Account Statement');
        $pdf->SetKeywords('Story Bank, Account Statement');
        $pdf->SetMargins(10, 10, 10);
        $pdf->SetPrintHeader(false);
        $pdf->SetPrintFooter(false);   
        
        // set margins  
        $pdf->SetAutoPageBreak(TRUE, 0);        
        $pdf->setFontSubsetting(false);
        $pdf->setCellPaddings(3, 3, 3, 3);
        $pdf->setImageScale(1);     
        $pdf->setCellHeightRatio(1.1);        
        
        // add a page break
        $pdf->AddPage();

        $this->CompileHeader($pdf, $visitorStories);
        $this->CompileRoomC($pdf, $visitorStories);
        $this->CompileRoomE($pdf, $visitorStories);

        //  Page Break
        $pdf->AddPage();       
        $pdf->ImageSVG('../Images/Email/PageBreak.svg', 85, 6, 40, 11, '', '', '', 0, false);           

        //  Page 2 Content
        $this->CompileRoomD($pdf, $visitorStories);
        $this->CompileRoomI($pdf, $visitorStories);
        
        //  Footer data
        $this->CompileBalance($pdf, $visitorStories);        
        $this->CompileFooter($pdf, $visitorStories);        

        //  Hooray, let's build her up
        //  $pdf->Output(__DIR__ . '/Files/AccountStatement_' . $visitorID . '.pdf', 'F');      
        $pdf->Output(__DIR__ . '/Files/AccountStatement_' . $visitorID . '.pdf', 'F');      
        
        //  Done, tidy it all up
        unset($pdf);        

        //  Let the email know about it
        return 'Vault/Files/AccountStatement_' . $visitorID . '.pdf';    //  We need the relative path on the front-end
    }
    
    private function CompileHeader($pdf, $visitorStories)
    {

        $pdf->ImageSVG('../Images/Email/AccountStatement.svg', 10, 10, 110, 15, '', '', '', 0, false);                   
        $pdf->ImageSVG('../Images/Email/Header.svg', 130, 10, 70, 90, '', '', '', 0, false);                   
        $pdf->ImageSVG('../Images/Email/AccountDetails.svg', 10, 30, 110, 25, '', '', '', 0, false); 
        
        $pdf->SetFont('balfordbase', 'B', 12);
        $pdf->MultiCell(60, 11, 
                "account name / nom de plume",                
                0, 'L', 0, 0, 12, 29, true, 0, false, true, 11, 'M', false);        
        
        $pdf->MultiCell(60, 11, 
                "account number",                
                0, 'L', 0, 0, 12, 45, true, 0, false, true, 11, 'M', false);    
        
        $pdf->SetFont('zai_olivettiunderwoodstudio21typewriter', 'B', 10);
        //  $pdf->SetTextColor(216,0,0);
        
        $pdf->MultiCell(60, 11, 
                $this->FetchAccountName($visitorStories),                
                0, 'L', 0, 0, 12, 37, true, 0, false, true, 11, 'M', false);        
        
        $pdf->MultiCell(60, 11, 
                $this->FetchAccountNumber($visitorStories),                
                0, 'L', 0, 0, 85, 45, true, 0, false, true, 11, 'M', false);         
        
        $pdf->SetFont('sourcesansproi', '', 12);                
        $pdf->SetTextColor(0,0,0);          
        $pdf->MultiCell(100, 10, 
                "Congratulations,",
                0, 'L', 0, 0, 12, 62, true, 0, false, true, 0, 'T', false);           
        
        $pdf->SetFont('sourcesansprolight', '', 12);              
        $pdf->MultiCell(102, 60, 
                "                                    you are well on your way to learning the art of storytelling!\n\n" .
                "Your account holds the deposits of your adventures through The Story Bank. These are valuable investments that will add compound interest to your story.\n\n",
                0, 'L', 0, 0, 12, 62, true, 0, false, true, 0, 'T', false);         
        
        $pdf->SetFont('sourcesansprob', '', 12);        
        $pdf->MultiCell(102, 60, 
                "Account Balance:",
                0, 'L', 0, 0, 12, 94, true, 0, false, true, 0, 'T', false); 
        
        $pdf->SetFont('sourcesansprolight', '', 12);
        $pdf->MultiCell(102, 60, 
                "\n" .
                "Every good story comes from a simple storytelling process. " .
                "Your balance of ideas and thoughts below create the outline for your story. Take a look at your account so far!\n\n", 
                0, 'L', 0, 0, 12, 96, true, 0, false, true, 0, 'T', false);          
        
        return;
    }

    private function CompileRoomC($pdf, $visitorStories)
    {
       // Date of Deposit       
        $complex_cell_border = array(
           'T' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
           'R' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
           'B' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
           'L' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
        );        
        
        $pdf->SetFont('balfordbase', 'B', 12);
        $pdf->MultiCell(30, 11, 
                "date of deposit",                
                $complex_cell_border, 'L', 0, 0, 10, 133, true, 0, false, true, 11, 'M', false);
        
        //  Merge Date
        $complex_cell_border = array(
           'T' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
           'R' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
           'B' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
           //'L' => array('width' => 0, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
        );         
        
        $pdf->SetFont('zai_olivettiunderwoodstudio21typewriter', 'B', 8);        
        //  $pdf->SetTextColor(216,0,0);        
        $pdf->MultiCell(35, 11, 
                $this->FetchAccountDate($visitorStories),                
                $complex_cell_border, 'C', 0, 0, 40, 133, true, 0, false, true, 11, 'M', false);  
        $pdf->SetTextColor(0,0,0);      
                
        //  Story Header
        $pdf->setCellHeightRatio(1);        
        $pdf->SetFont('sourcesanspro', '', 14);
        $pdf->MultiCell(125, 10, 
               'A place to write and something to write about ...',                
                $complex_cell_border, 'L', 0, 0, 75, 133, true, 0, false, true, 11, 'M', false);        
        $pdf->setCellHeightRatio(1.1);        
        
        $pdf->ImageSVG('../Images/Email/MaryPoppins.svg', 181, 135, 8, 7, '', '', '', 0, false);           
        $pdf->ImageSVG('../Images/Email/OneQuarter.svg', 189, 133, 11, 11, '', '', '', 0, false);        
                
        //  Blurb        
        $complex_cell_border = array(
           'R' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
           'B' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
           'L' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
        );           

        $pdf->SetFont('sourcesanspro', '', 9);    
        $pdf->MultiCell(65, 55, 
                "The environment in which you write and the objects you keep around you say something about your memories and your imagination.\n\n" .
                "They often build the world in which a story will unfold. Review your notes to scope out the features of the world you want to create.\n\n" .
                "Think about how you want to tell your story. As a short tale or a long yarn? Is it a complex narrative or a simple memory? Will people read it or experience it in some other way such as film, music or art?\n\n",
                $complex_cell_border, 'J', 0, 0, 10, 144, true, 0, false, true, 0, 'M', false);

        //  Story Data
        $pdf->SetFont('zai_olivettiunderwoodstudio21typewriter', '', 10); 
        //  $pdf->SetTextColor(216,0,0);       
        
        $displayText = '<table><tbody>';
        for ($i = 0; $i < 14; $i++)
        {        
            if ($i % 2 == 0)
            {                
                $displayText .= '<tr style="background-color: #FAFAFA;">';
            } else {
                $displayText .= '<tr>';                    
            }
            
            $displayText .= '<td>&nbsp;</td></tr>';
            
            $rowCounter++;
        }
        $displayText .= '</tbody></table>';
        
        $pdf->MultiCell(125, 55, 
                $displayText,                
                0, 'L', 0, 0, 75, 144, true, 0, true, true, 0, 'T', false);          
        
        $complex_cell_border = array(
           'R' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
           'B' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
        );    
        
        $pdf->SetFont('zai_olivettiunderwoodstudio21typewriter', 'B', 6);         
        $displayText = '';
        foreach ($visitorStories as $story)
        {        
            if ($story->PROMPT_ID > 0 && $story->PROMPT_ID < 10)
            {            
                $height = $pdf->getStringHeight(125, $displayText . $story->TRANSCRIPTION, true, true, 0, 0 );
                
                if ($height < 55)
                {
                    $displayText .= $story->TRANSCRIPTION;                        
                } else {
                    break;                    
                }
            }        
        }        
           
        $pdf->setCellHeightRatio(2);
        $pdf->MultiCell(125, 55, 
                $displayText,                
                $complex_cell_border, 'L', 0, 0, 75, 144, true, 0, true, true, 55, 'T', false);          
        $pdf->setCellHeightRatio(1);
        $pdf->SetTextColor(0,0,0);               

        return;                
    }

    private function CompileRoomD($pdf, $visitorStories)
    {
        // Date of Deposit       
        $complex_cell_border = array(
           'T' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
           'R' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
           'B' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
           'L' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
        );        
        
        $pdf->SetFont('balfordbase', 'B', 12);
        $pdf->MultiCell(30, 11, 
                "date of deposit",                
                $complex_cell_border, 'L', 0, 0, 10, 25, true, 0, false, true, 11, 'M', false);
        
        //  Merge Date
        $complex_cell_border = array(
           'T' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
           'R' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
           'B' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
           //'L' => array('width' => 0, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
        );         
        
        $pdf->SetFont('zai_olivettiunderwoodstudio21typewriter', 'B', 8);        
        //  $pdf->SetTextColor(216,0,0);        
        $pdf->MultiCell(35, 11, 
                $this->FetchAccountDate($visitorStories),                
                $complex_cell_border, 'C', 0, 0, 40, 25, true, 0, false, true, 11, 'M', false);  
        $pdf->SetTextColor(0,0,0);      
                
        //  Story Header
        $pdf->SetFont('sourcesanspro', '', 14);
        $pdf->setCellHeightRatio(1);
        $pdf->MultiCell(125, 11, 
               'Characters are a pillar of your story ...',                
                $complex_cell_border, 'L', 0, 0, 75, 25, true, 0, false, true, 11, 'M', false);        
        $pdf->setCellHeightRatio(1.1);        
        
        $pdf->ImageSVG('../Images/Email/MaryPoppins.svg', 181, 27, 8, 7, '', '', '', 0, false);           
        $pdf->ImageSVG('../Images/Email/ThreeQuarter.svg', 189, 25, 11, 11, '', '', '', 0, false);        
        
        // $pdf->Image('../Images/Email/OneQuarter.png', 186, 25, 13, 13, 'PNG', '', '', true, 72, '', false, false, 0, false, false, false);                
        
        //  Blurb        
        $complex_cell_border = array(
           'R' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
           'B' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
           'L' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
        );           

        $pdf->SetFont('sourcesanspro', '', 9);    
        $pdf->MultiCell(65, 55, 
                "To develop an interesting story, work more on your character to give them some flaws.\n\n" .
                "What do they need to learn or change? What happens to them as the story unfolds.\n\n" .
                "Now, create an opposing character (an Antagonist) who will create obstacles and complications for your main character.\n\n" .
                "Think good guys and bad guys!\n",
                $complex_cell_border, 'J', 0, 0, 10, 36, true, 0, false, true, 0, 'M', false);

        //  Story Data
        $pdf->SetFont('zai_olivettiunderwoodstudio21typewriter', 'B', 10); 
        //  $pdf->SetTextColor(216,0,0);       
        
        $displayText = '<table><tbody>';
        for ($i = 0; $i < 14; $i++)
        {        
            if ($i % 2 == 0)
            {                
                $displayText .= '<tr style="background-color: #FAFAFA;">';
            } else {
                $displayText .= '<tr>';                    
            }
            
            $displayText .= '<td>&nbsp;</td></tr>';
            
            $rowCounter++;
        }
        $displayText .= '</tbody></table>';
        
        $pdf->MultiCell(125, 55, 
                $displayText,                
                0, 'L', 0, 0, 75, 36, true, 0, true, true, 0, 'T', false);          
        
        $complex_cell_border = array(
           'R' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
           'B' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
        );    
        
        $pdf->SetFont('zai_olivettiunderwoodstudio21typewriter', 'B', 6);         
        $displayText = '';
        foreach ($visitorStories as $story)
        {        
            if ($story->PROMPT_ID > 9 && $story->PROMPT_ID < 15)
            {       
                $height = $pdf->getStringHeight(125, $displayText . $story->TRANSCRIPTION, true, true, 0, 0 );
                
                if ($height < 55)
                {
                    $displayText .= $story->TRANSCRIPTION;                        
                } else {
                    break;                    
                }                                
            }        
        }        
           
        $pdf->setCellHeightRatio(2);        
        $pdf->MultiCell(125, 55, 
                $displayText,                
                $complex_cell_border, 'L', 0, 0, 75, 36, true, 0, true, true, 55, 'T', false);          
        $pdf->setCellHeightRatio(1);        
        $pdf->SetTextColor(0,0,0);               

        return;
    }

    private function CompileRoomE($pdf, $visitorStories)
    {
        // Date of Deposit       
        $complex_cell_border = array(
           'T' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
           'R' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
           'B' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
           'L' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
        );        
        
        $pdf->SetFont('balfordbase', 'B', 12);
        $pdf->MultiCell(30, 11, 
                "date of deposit",                
                $complex_cell_border, 'L', 0, 0, 10, 204, true, 0, false, true, 11, 'M', false);
        
        //  Merge Date
        $complex_cell_border = array(
           'T' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
           'R' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
           'B' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
           //'L' => array('width' => 0, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
        );         
        
        $pdf->SetFont('zai_olivettiunderwoodstudio21typewriter', 'B', 8);        
        //  $pdf->SetTextColor(216,0,0);        
        $pdf->MultiCell(35, 11, 
                $this->FetchAccountDate($visitorStories),                
                $complex_cell_border, 'C', 0, 0, 40, 204, true, 0, false, true, 11, 'M', false);  
        $pdf->SetTextColor(0,0,0);      
                
        //  Story Header
        $pdf->SetFont('sourcesanspro', '', 14);
        $pdf->setCellHeightRatio(1);
        $pdf->MultiCell(125, 11, 
               'Bringing your main character to life ...',                
                $complex_cell_border, 'L', 0, 0, 75, 204, true, 0, false, true, 11, 'M', false);        
        $pdf->setCellHeightRatio(1.1);        
        
        $pdf->ImageSVG('../Images/Email/MaryPoppins.svg', 181, 206, 8, 7, '', '', '', 0, false);           
        $pdf->ImageSVG('../Images/Email/TwoQuarter.svg', 189, 204, 11, 11, '', '', '', 0, false);        
                
        //  Blurb        
        $complex_cell_border = array(
           'R' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
           'B' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
           'L' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
        );           

        $pdf->SetFont('sourcesanspro', '', 9);    
        $pdf->MultiCell(65, 65, 
                "Every story has a single Protagonist or leading character.\n\n" .
                "What is the name of yours?\n\n" .
                "Check back on your notes and expand your description of the appearance and personality of your main character.\n\n" .
                "Make your character memorable with a distinctive personality that people will connect with.\n",
                $complex_cell_border, 'J', 0, 0, 10, 215, true, 0, false, true, 0, 'M', false);

        //  Story Data
        $pdf->SetFont('zai_olivettiunderwoodstudio21typewriter', 'B', 10); 
        //  $pdf->SetTextColor(216,0,0);       
        
        $displayText = '<table><tbody>';
        for ($i = 0; $i < 18; $i++)
        {        
            if ($i % 2 == 0)
            {                
                $displayText .= '<tr style="background-color: #FAFAFA;">';
            } else {
                $displayText .= '<tr>';                    
            }
            
            $displayText .= '<td>&nbsp;</td></tr>';
            
            $rowCounter++;
        }
        $displayText .= '</tbody></table>';
        
        $pdf->MultiCell(83, 65, 
                $displayText,                
                0, 'L', 0, 0, 75, 215, true, 0, true, true, 0, 'T', false);          
        
        $complex_cell_border = array(
           // 'R' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
           'B' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
        );    
        
        $pdf->SetFont('zai_olivettiunderwoodstudio21typewriter', 'B', 6);         
        $displayText = '';
        $characterDesign = undefined;
        
        foreach ($visitorStories as $story)
        {        
            if ($story->PROMPT_ID == 15)
            {                
                $height = $pdf->getStringHeight(83, $displayText . $story->TRANSCRIPTION, true, true, 0, 0 );
                
                if ($height < 65)
                {
                    $displayText .= $story->TRANSCRIPTION; 
                    
                    if (strlen($story->CHARACTER_DESIGN) > 0)
                    {
                        $characterDesign = json_decode($story->CHARACTER_DESIGN);                        
                    }
                } else {
                    break;                    
                }   
            }        
        }        
           
        $pdf->setCellHeightRatio(2);        
        $pdf->MultiCell(83, 65, 
                $displayText,                
                $complex_cell_border, 'L', 0, 0, 75, 215, true, 0, true, true, 55, 'T', false);          
        $pdf->setCellHeightRatio(1.1);        
        $pdf->SetTextColor(0,0,0); 
        
        //  Pictures!
        $complex_cell_border = array(
           'R' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
           'B' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
        );          
        $pdf->MultiCell(42, 65, 
                "",                
                $complex_cell_border, 'L', 0, 0, 158, 215, true, 0, true, true, 55, 'T', false);          

        if ($characterDesign !== undefined)
        {
            
            $pdf->Image('../Images/CharacterAssets/Legs/' . $this->GetResolvedFileName($characterDesign->LEG), 
                    164, 246, 30, 30, 'PNG', '', '', true, 300, '', false, false, 0, false, false, false);                                    
            $pdf->Image('../Images/CharacterAssets/Feet/' . $this->GetResolvedFileName($characterDesign->FEET), 
                    163, 252, 30, 30, 'PNG', '', '', true, 300, '', false, false, 0, false, false, false);                                   
            $pdf->Image('../Images/CharacterAssets/Torso/' . $this->GetResolvedFileName($characterDesign->TORSO), 
                    164, 238, 30, 30, 'PNG', '', '', true, 300, '', false, false, 0, false, false, false);                                                
            $pdf->Image('../Images/CharacterAssets/Arms/' . $this->GetResolvedFileName($characterDesign->ARM), 
                    162, 237, 30, 30, 'PNG', '', '', true, 300, '', false, false, 0, false, false, false);  
            $pdf->Image('../Images/CharacterAssets/Faces/' . $this->GetResolvedFileName($characterDesign->FACE), 
                    163, 223, 30, 30, 'PNG', '', '', true, 300, '', false, false, 0, false, false, false);                                   
            $pdf->Image('../Images/CharacterAssets/Hands/' . $this->GetResolvedFileName($characterDesign->HAND), 
                    160, 242, 30, 30, 'PNG', '', '', true, 300, '', false, false, 0, false, false, false);                        
            $pdf->Image('../Images/CharacterAssets/Hair/' . $this->GetResolvedFileName($characterDesign->HAIR), 
                    162, 223, 30, 30, 'PNG', '', '', true, 300, '', false, false, 0, false, false, false);                        

        }

        
        return;        
    }    
    
    private function CompileRoomI($pdf, $visitorStories)
    {        
        // Date of Deposit       
        $complex_cell_border = array(
           'T' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
           'R' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
           'B' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
           'L' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
        );        
        
        $pdf->SetFont('balfordbase', 'B', 12);
        $pdf->MultiCell(30, 11, 
                "date of deposit",                
                $complex_cell_border, 'L', 0, 0, 10, 96, true, 0, false, true, 11, 'M', false);
        
        //  Merge Date
        $complex_cell_border = array(
           'T' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
           'R' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
           'B' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
        );         
        
        $pdf->SetFont('zai_olivettiunderwoodstudio21typewriter', 'B', 8);        
        //  $pdf->SetTextColor(216,0,0);        
        $pdf->MultiCell(35, 11, 
                $this->FetchAccountDate($visitorStories),                
                $complex_cell_border, 'C', 0, 0, 40, 96, true, 0, false, true, 11, 'M', false);  
        $pdf->SetTextColor(0,0,0);         
                
        //  Story Header
        $pdf->SetFont('sourcesanspro', '', 14);
        $pdf->setCellHeightRatio(1);        
        $pdf->MultiCell(125, 11, 
               'So, what\'s your story really about?',                
                $complex_cell_border, 'L', 0, 0, 75, 96, true, 0, false, true, 11, 'M', false);        
        $pdf->setCellHeightRatio(1.1);
        
        $pdf->ImageSVG('../Images/Email/MaryPoppins.svg', 181, 98, 8, 7, '', '', '', 0, false);   
        $pdf->ImageSVG('../Images/Email/FourQuarter.svg', 189, 96, 11, 11, '', '', '', 0, false);        
        
        //  Blurb        
        $complex_cell_border = array(
           'R' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
           'B' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
           'L' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
        );           
 
        $pdf->setCellHeightRatio(1.1);
        $pdf->SetFont('sourcesanspro', '', 9);    
        $pdf->MultiCell(65, 55, 
                "What are you trying to share by telling your story?  What is your theme and inspiration?\n\n" .
                "Go back through your notes and decide the main purpose of your story.\n\n" .
                "How do your characters change?\n\n" .
                "How might the story end in an unexpected, interesting or unusual way?\n",
                $complex_cell_border, 'J', 0, 0, 10, 107, true, 0, false, true, 0, 'M', false);
        
        //  Story Data
        $pdf->SetFont('zai_olivettiunderwoodstudio21typewriter', 'B', 10); 
        //  $pdf->SetTextColor(216,0,0);       
        
        $displayText = '<table><tbody>';
        for ($i = 0; $i < 14; $i++)
        {        
            if ($i % 2 == 0)
            {                
                $displayText .= '<tr style="background-color: #FAFAFA;">';
            } else {
                $displayText .= '<tr>';                    
            }
            
            $displayText .= '<td>&nbsp;</td></tr>';
            
            $rowCounter++;
        }
        $displayText .= '</tbody></table>';
        
        $pdf->MultiCell(125, 55, 
                $displayText,                
                0, 'L', 0, 0, 75, 107, true, 0, true, true, 0, 'T', false);          
        
        $complex_cell_border = array(
           'R' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
           'B' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
        );    
        
        $pdf->SetFont('zai_olivettiunderwoodstudio21typewriter', 'B', 6);         
        $displayText = '';
        foreach ($visitorStories as $story)
        {        
            if ($story->PROMPT_ID == 16)
            {                
                $height = $pdf->getStringHeight(125, $displayText . $story->TRANSCRIPTION, true, true, 0, 0 );
                
                if ($height < 55)
                {
                    $displayText .= $story->TRANSCRIPTION;                        
                } else {
                    break;                    
                }   
            }        
        }        
           
        $pdf->setCellHeightRatio(2);        
        $pdf->MultiCell(125, 55, 
                $displayText,                
                $complex_cell_border, 'L', 0, 0, 75, 107, true, 0, true, true, 55, 'T', false);          
        $pdf->setCellHeightRatio(1.1); 
        $pdf->SetTextColor(0,0,0);               

        return;
    }     
    
    private function CompileBalance($pdf, $visitorStories)
    {
       // Date of Deposit       
        $complex_cell_border = array(
           'T' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
           'R' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
           'B' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
           'L' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
        );        
        
        $pdf->SetFont('balfordbase', 'B', 12);
        $pdf->MultiCell(65, 11, 
                "current account balance",                
                $complex_cell_border, 'L', 0, 0, 10, 164, true, 0, false, true, 11, 'M', false);
        
        //  Merge Date
        $complex_cell_border = array(
           'T' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
           'R' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
           'B' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
           //'L' => array('width' => 0, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
        );         
                
        //  Story Header
        $pdf->SetFont('sourcesanspro', '', 9);
        $pdf->MultiCell(125, 11, 
               '                                   Halfway to your story goal!',                
                $complex_cell_border, 'L', 0, 0, 75, 164, true, 0, false, true, 11, 'M', false);        
        
        $pdf->ImageSVG('../Images/Email/YourStory.svg', 78, 160, 20, 20, '', '', '', 0, false);                
        
        // Date of Deposit       
        $complex_cell_border = array(
           'T' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
           'R' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
           'B' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
           'L' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
        );        
        
        $pdf->SetFont('balfordbase', 'B', 12);
        $pdf->MultiCell(65, 11, 
                "interest rate",                
                $complex_cell_border, 'L', 0, 0, 10, 177, true, 0, false, true, 11, 'M', false);
        
        //  Merge Date
        $complex_cell_border = array(
           'T' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
           'R' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
           'B' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
           //'L' => array('width' => 0, 'color' => array(33, 33, 33), 'dash' => 0, 'cap' => 'square'),
        );         
                
        //  Story Header
        $pdf->SetFont('sourcesanspro', '', 9);
        $pdf->MultiCell(125, 11, 
               '                             To determine your current rate of interest, pitch your story ideas to a friend.',                
                $complex_cell_border, 'L', 0, 0, 75, 177, true, 0, false, true, 11, 'M', false);          
        
        return;
    }
    
    private function CompileFooter($pdf, $visitorStories)
    {   
        
        $pdf->ImageSVG('../Images/Email/LightBulb.svg', 20, 196, 21, 27, '', '', '', 0, false);   
        
        $pdf->SetFont('sourcesanspro', '', 15);                
        $pdf->MultiCell(28, 10, 
                'Inspired?',
                0, 'C', 0, 0, 20, 224, true, 0, true, true, 0, 'T', false); 
        
        $pdf->SetFont('sourcesansprolight', '', 12);        
        $pdf->MultiCell(150, 60, 
                "Great! Now it's time to keep growing your balance by taking your Story Workshop or your favourite creative place and using them to create your story.\n\n" .
                "Develop an outline by listing a series of events in the order that they will happen. Seeing all the moments in your story will highlight any gaps. It will also show you opportunities to fill with twists and turns, surprises and delights. Easy, right?\n\n" .
                "As Mary Poppins herself says:                                                         Good luck!\n\n" . 
                "Oh, and when you're finished, let us know - we'd love to share your story!",
                0, 'L', 0, 0, 45, 194, true, 0, false, true, 0, 'T', false); 
        
        $pdf->SetFont('sourcesansproi', '', 12);                
        $pdf->MultiCell(150, 10, 
                '"Well begun is half done!"',
                0, 'L', 0, 0, 96, 226, true, 0, false, true, 0, 'T', false);         
        
        //  Contact Details
        $pdf->ImageSVG('../Images/Email/Hand.svg', 22, 258, 22, 10, '', '', '', 0, false);                   

        $complex_cell_border = array(
           'T' => array('width' => .1, 'color' => array(33, 33, 33), 'dash' => 3, 'cap' => 'round'),
        );      
        
        $pdf->SetFont('skitchsolid', 'B', 12);   
        
        $pdf->MultiCell(190, 1, '', $complex_cell_border, 'L', 0, 0, 10, 249, true, 0, true, true, 0, 'M', false);          
        
        $pdf->MultiCell(190, 1, 
                "<a href='mailto:storybank@frasercoast.qld.gov.au'>StoryBank@frasercoast.qld.gov.au</a><br/><br/>" .
                "#storybankmaryborough<br/><br/>" .
                "<a href='http://www.storybankmaryborough.com.au' target='_blank'>www,storybankmaryborough.com.au</a>",
                0, 'L', 0, 0, 45, 254, true, 0, true, true, 0, 'M', false);        
        
        
        $pdf->ImageSVG('../Images/Email/ComeFindYourStory.svg', 138, 254, 42, 26, '', '', '', 0, false);           
        
        return;
    }

    public function HitSend($email, $fileLocation)
    {
        //  Open a mailer, takes more time, but is working
        $mail = new PHPMailer(true);

        //Server settings
        $mail->SMTPDebug = 0;                                 // Enable verbose debug output
        $mail->isSMTP();                                      // Set mailer to use SMTP
        $mail->Host       = $this->configs['smtpHost'];       // Specify main and backup SMTP servers
        $mail->SMTPAuth   = true;                             // Enable SMTP authentication
        $mail->Username   = $this->configs['smtpUser'];       // SMTP username
        $mail->Password   = $this->configs['smtpPassword'];       // SMTP password
        $mail->SMTPSecure = $this->configs['smtpSecurity'];       // Enable TLS encryption, `ssl` also accepted
        $mail->Port       = $this->configs['smtpPort'];       // TCP port to connect to

        //Recipients
        $mail->setFrom('teller@storybank.com.au', 'Story Bank');
        $mail->addAddress($email, 'Storybank Visitor');     // Add a recipient
        $mail->addReplyTo('donotreply@storybank.com.au', 'Do Not Reply');

        // Attachments
        if (strlen($fileLocation) > 0)
        {        
            $mail->addAttachment('/volume1/web/StoryBank/' . $fileLocation);         // Add attachments
        }

        // Content
        $mail->isHTML(true);                                  // Set email format to HTML
        $mail->Subject = 'My Account Statement - The Story Bank, Maryborough';

        $mail->Body = '<i>Thank you for visiting and opening an account at The Story Bank, Maryborough.</i><br/><br/>' .
                'Your adventures through the Bank today have been safely deposited in to your account.  These valuable investments will add compound interest to your story.<br/><br/' .
                'The attached Account Statement provides a balance of your ideas and thoughts.<br/>' .
                'Now it\'s time to keep growing your balance by working hard while the interest rate is high.<br/><br/>' .
                'Keep investing in your story - it will reap satisfying returns.<br/><br/>'.
                'The Story Bank is continually growing its collection. Once your story is complete, you are invited to secure a long-term deposit so that future visitors can share in our wealth of stories.<br/><br/>' .
                'To register your interest in future story investment opportunities and tips on how to develop your story portfolio, visit us online <a href="www.storybankmaryborough.com.au" target="_blank">www.storybankmaryborough.com.au</a> or follow us on <a href="www.facebook.com" target="_blank">Facebook</a> <a href="www.instagram.com" target="_blank">Instagram</a><br/><br/>' .
                'Yours most sincerely,<br/><br/>' .
                'The Story Bank Teller<br/><br/>' . 
                'p.s. <i>Once upon a time is always...</i>';
   
        $mail->AltBody = 'This is the body in plain text for non-HTML mail clients';

        $mail->send();

        // Tidy this mess up boy
        unset($mail);
    }
    
    /*
     *      DATA MANIPULATION
     */
    
    private function GatherData($visitorID)
    {
        //  Woo.
        $daSafe = new DaSafe();       
        $returnArray = json_encode($daSafe->fetchAccountStatement($visitorID));
        unset($daSafe);        
        
        return json_decode($returnArray);
    }    
    
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
                $date=date_create($story->STORED_ON);
                return date_format($date,"d.m.Y");
            }        
        }          
        
        return 'Today';
    }
    
    private function MakeTableLayout($pdf)
    {
        
        $pdf->Rect($pdf->GetX(), $pdf->GetY(), 30, 10, 'L', '', '' );
        $pdf->Rect($pdf->GetX() + 30, $pdf->GetY(), 30, 10, 'L', '', '' );
        $pdf->Rect($pdf->GetX() + 60, $pdf->GetY(), 130, 10, 'L', '', '' );
        $pdf->Rect($pdf->GetX(), $pdf->GetY() + 10, 60, 60, 'L', '', '' );        
        $pdf->Rect($pdf->GetX() + 60, $pdf->GetY() + 10, 130, 60, 'L', '', '' );         
        
    }
    
    private function GetResolvedFileName($fileName)
    {
        $armPieces = explode("/", $fileName);
        
        if (count($armPieces) > 0)
        {
            return $armPieces[count($armPieces) - 1];            
        }

        return '';
    }
    
}