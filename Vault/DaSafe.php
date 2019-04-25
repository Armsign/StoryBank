<?php

/**
 * Description of DaSafe
 *
 * @author PaulDunn
 */
class DaSafe 
{
    private $configs = null;
    private $mysqli = null;
    
    /*
     *      Constructor!
     */
    public function __construct() 
    {
        $this->configs = include('conf.php');
    }
    
    /*
     *      Actual Story creation
     */
    
    public function updateStory($staffId, $id, $promptId, $visitorID, $email, $nomDePlume, $title, $story, $charDesign, $hasConsent, $useEmail = 0, $isPlayable = 0)
    {       
        $returnArray = ($id * 1);        
        
        //  Validate the token to get the user id
        //  Now I don't really like much of this at all

        if (strlen($nomDePlume) > 0 && strlen($story) > 0)
        {      
            
            $this->mysqli = new mysqli($this->configs["host"], $this->configs["dbUsername"], $this->configs["dbPassword"], $this->configs["dbDatabase"], $this->configs["port"]);

            if ($this->mysqli->connect_errno > 0)
            {
                //  Exit early, failure to connect.
                return "Error: " . $this->mysqli->connect_errno;

            } else {              
                
                if ($id > 0)
                {    
                                        
                    $sql = "UPDATE DEPOSITS "
                            . "SET PROMPT_ID = ?, "     //  i
                            . "TITLE = ?, "             //  s
                            . "STORED_BY = ?, "         //  s
                            . "STORED_AS = ?, "         //  s
                            . "IS_PLAYABLE = ?, "       //  i
                            . "REVIEWED_BY = ?, "       //  i
                            . "HAS_CONSENT = ?, "       //  i
                            . "USE_EMAIL = ?, "         //  i                                      
                            . "REVIEWED_ON = NOW(), "   //  NOW()
                            . "TRANSCRIPTION = ? "     //  s
                            . "WHERE ID = ?;";          //  i
                    
                    $stmt = $this->mysqli->prepare($sql);                    

                    $stmt->bind_param('isssiiiisi', $promptId, $title, $email, 
                            $nomDePlume, $isPlayable, $staffId, $hasConsent, 
                            $useEmail, $story, $id);
                    
                } else {
                    
                   $sql = "INSERT INTO DEPOSITS ( "
                           . "PROMPT_ID, "          //  i
                           . "TITLE, "              //  s
                           . "VISITOR_ID, "         //  s
                           . "STORED_BY, "          //  s
                           . "STORED_AS, "          //  s
                           . "STORED_AT, "          //  N/A
                           . "STORED_ON, "          //  NOW()                           
                           . "REVIEWED_BY, "        //  i
                           . "AUDIO_TYPE, "         //  N/A
                           . "AUDIO_LENGTH, "       //  0
                           . "IS_PLAYABLE, "        //  i
                           . "IS_TRANSCRIBED, "     //  1
                           . "TRANSCRIPTION, "      //  s
                           . "CHARACTER_DESIGN, "   //  s
                           . "HAS_CONSENT, "        //  i
                           . "USE_EMAIL "           //  i
                        . ") VALUES ("
                           . "?, "                  //  i
                           . "?, "                  //  s
                           . "?, "                  //  s
                           . "?, "                  //  s
                           . "?, "                  //  s
                           . "'N/A', "              //  N/A
                           . "NOW(), "              //  NOW()                           
                           . "?, "                  //  i                           
                           . "'N/A', "              //  N/A
                           . "0, "                  //  0
                           . "?, "                  //  i
                           . "1, "                  //  1
                           . "?, "                  //  s
                           . "?, "                  //  s
                           . "?, "                  //  i
                           . "?);";                 //  i   
                    
                    $stmt = $this->mysqli->prepare($sql);
                    $stmt->bind_param('issssiissii', $promptId, $title, $visitorID, 
                            $email, $nomDePlume, $staffId, $isPlayable, $story, 
                            $charDesign, $hasConsent, $useEmail);
                                        
                }

                $stmt->execute();     
                
                if ($id === 0)               
                {               
                    $returnArray = mysqli_insert_id($this->mysqli);                
                }
                
                echo $stmt->error;
                
                $stmt->close();                            
            }

            $this->mysqli->close();            
            
            //  We should delete the tags, because they'll be arriving as soon as this is done, yes?
            $sql = "DELETE FROM DEPOSIT_TAGS WHERE DEPOSIT = " . $id . ";";
            $this->transactionalSQL($sql);   
        }        

        return $returnArray;
    }        

    /*
     *  Admin stuff
     */
    
    public function fetchStoryNomDePlume($email)
    {
        return $this->executeSQL("SELECT STORED_AS AS NOMDEPLUME FROM DEPOSITS WHERE STORED_BY = '"  . $email . "' ORDER BY STORED_ON DESC LIMIT 1");        
    }      
    
    public function fetchStoryCount($email)
    {
        return $this->executeSQL("SELECT COUNT(*) AS STORY_COUNT FROM DEPOSITS WHERE STORED_BY = '"  . $email . "'");        
    }      
    
    public function deleteStory($id)
    {
        //  We also need the login ...
        $sql = "DELETE FROM DEPOSITS WHERE ID = " . $id . ";";

        $returnArray = $this->transactionalSQL($sql);                                        

        $sql = "DELETE FROM DEPOSIT_TAGS WHERE DEPOSIT = " . $id . ";";

        $returnArray = $this->transactionalSQL($sql);                                                    

        return $returnArray;
    }  
    
    public function updateTags($token, $id, $title, $description)
    {
        //  Validate the token to get the user id
        $returnArray = array();
        
        if ($this->IsValidToken($token))
        {            
            if ($id > 0)
            {
                
                $sql = "UPDATE TAGS SET "
                    . "TITLE = '" . $title . "', "                 
                    . "DESCRIPTION = '" . $description . "' "
                    . "WHERE ID = " . $id . ";";
                
            } else {

                $sql = "INSERT INTO TAGS ( TITLE, DESCRIPTION ) "
                        . "VALUES ('" . $title . "', '" . $description . "')";
                
            }
            
            $returnArray = $this->transactionalSQL($sql);                                        
        }        

        return $returnArray;
    }      
    
    public function deleteTags($token, $id)
    {
        //  Validate the token to get the user id       
        $returnArray = array();
        
        if ($this->IsValidToken($token))
        {            
            
            $sql = "DELETE FROM TAGS WHERE ID = " . $id . ";";            
            $returnArray = $this->transactionalSQL($sql);                                        
           
            //  We also need the login ...
            $sql = "DELETE FROM DEPOSIT_TAGS WHERE TAG = " . $id . ";";
            $returnArray = $this->transactionalSQL($sql);                                        
            
        }        

        return $returnArray;
    }    
    
    public function createBridge($storyID, $tagID)
    {
        //  Validate the token to get the user id       
        $returnArray = array();
        
        if ($storyID > 0 && $tagID > 0)
        {
            
            $sql = "INSERT INTO DEPOSIT_TAGS (DEPOSIT, TAG) VALUES (" . $storyID . ", " . $tagID . ")";            
            $returnArray = $this->transactionalSQL($sql);                                                  
            
        }        

        return $returnArray;
    }     
    
    public function fetchMembers($token)
    {
        //  Need to check if this is a user
        $logins = $this->fetchToken($token);
        
        $returnArray = array();
        
        if (sizeof($logins) == 1)
        {            
            $returnArray = $this->executeSQL("SELECT ID, EMAIL, IS_ACTIVE, PREFERRED_NAME, SESSION, PASSWORD FROM LOGINS ORDER BY EMAIL ASC");                                        
        }
        
        return $returnArray;        
    }
    
    public function updateMember($id, $email, $preferredName, $isActive)
    {

        if ($id > 0)
        {    
            $sql = "UPDATE LOGINS SET "
                . "EMAIL = '" . $email . "', "                 
                . "IS_ACTIVE = " . $isActive . ", "
                . "PREFERRED_NAME = '" . $preferredName . "' "
                . "WHERE ID = " . $id . ";";

        } else {

            $sql = "INSERT INTO LOGINS ( EMAIL, IS_ACTIVE, PREFERRED_NAME, PASSWORD, SESSION ) "
                    . "VALUES ('" . $email . "', " . $isActive . ", '" . $preferredName . "', '123456', '123456')";

        }

        return $this->transactionalSQL($sql);
    }          
    
    public function updatePassword($token, $id, $password)    
    {
        //  Validate the token to get the user id
        $logins = $this->fetchToken($token);
        
        $returnArray = array();
        
        if (sizeof($logins) == 1)
        {            
            $sanePassword = hash('md5', $password);  
            
            echo "Crypto Password: " . $sanePassword;
            
            $sql = "UPDATE LOGINS SET "
                . "PASSWORD = '" . $sanePassword . "' "
                . "WHERE ID = " . $id . ";";               
            
            echo $sql;
            
            $returnArray = $this->transactionalSQL($sql);                                        
        }        

        return $returnArray;        
    }
    
    public function fetchApprovedStories()
    {        
        $returnArray = $this->executeSQL("SELECT PROMPT_ID, TITLE, STORED_BY, STORED_AS, "
                . "IS_PLAYABLE, REVIEWED_BY, HAS_CONSENT, USE_EMAIL, "
                . "REVIEWED_ON, LEFT(TRANSCRIPTION, 32) AS TRANSCRIPTION, ID, STORED_ON "
                . "FROM DEPOSITS "
                . "WHERE IS_PLAYABLE = 1 "
                . "AND REVIEWED_BY > 0 "
                . "ORDER BY STORED_ON DESC");                                        

        return $returnArray;                
    }
    
    public function fetchUnApprovedStories()
    {
        $returnArray = $this->executeSQL("SELECT PROMPT_ID, TITLE, STORED_BY, STORED_AS, "
                . "IS_PLAYABLE, REVIEWED_BY, HAS_CONSENT, USE_EMAIL, "
                . "REVIEWED_ON, LEFT(TRANSCRIPTION, 32) AS TRANSCRIPTION, ID, STORED_ON "
                . "FROM DEPOSITS "
                . "WHERE IS_PLAYABLE = 0 "
                . "ORDER BY STORED_ON DESC");                                        

        return $returnArray;          
    }
    
    public function fetchSingularStory($id)
    {
        $returnArray = $this->executeSQL("SELECT * FROM DEPOSITS WHERE ID = " . $id);                                        

        return $returnArray;          
    }    
    
    /*
     *      Withdrawal stations
     */
    
    public function fetchWithdrawalStory($tag, $orderBy)
    {
        
        if ($orderBy == "POPULAR")
        {
        
            $sql = "SELECT D.*, COUNT(DM.ID) AS POPULAR " .
                    "FROM TAGS T " .                         
                    "JOIN DEPOSIT_TAGS DT ON T.ID = DT.TAG " .
                    "JOIN DEPOSITS D ON DT.DEPOSIT = D.ID AND D.IS_PLAYABLE = 1 " .
                    "LEFT JOIN DEPOSIT_METRICS DM ON D.ID = DM.DEPOSIT " .
                    "WHERE T.TITLE = '" . $tag . "' " .                    
                    "GROUP BY D.ID " .
                    "ORDER BY POPULAR DESC";
            
        } else {
                
            $sql = "SELECT D.* " .
                "FROM TAGS T " .
                "JOIN DEPOSIT_TAGS DT ON T.ID = DT.TAG " .
                "JOIN DEPOSITS D ON DT.DEPOSIT = D.ID AND D.IS_PLAYABLE = 1 " .
                "WHERE T.TITLE = '" . $tag . "' ";

            switch($orderBy)
            {
                case "AUTHOR":
                    $sql .= "ORDER BY D.STORED_AS ASC";
                    break;
                case "TITLE":
                    $sql .= "ORDER BY D.TITLE ASC";
                    break;            
                default:
                    $sql .= "ORDER BY D.STORED_ON DESC";
                    break;
            }  
            
        }
        
        return $this->executeSQL($sql);        
    }     
        
    public function updateMetrics($deposit, $visitorID)
    {
        //  Validate the token to get the user id
        $returnArray = array();        
        
        $sql = "INSERT INTO DEPOSIT_METRICS ( DEPOSIT, LOVED_BY, LOVED_ON ) "
                . "VALUES (" . $deposit . ", '" . $visitorID . "', NOW())";

        $returnArray = $this->transactionalSQL($sql);                                               

        return $returnArray;
    }     
    
    
    public function fetchWithdrawalStoryId($id)
    {        
        $sql = "SELECT D.* " .
            "FROM   DEPOSITS D  " .
            "WHERE  D.ID = " . $id . " " .
            "AND    D.IS_PLAYABLE = 1";
       
        return $this->executeSQL($sql);        
    }       
    
    public function fetchStoryTags($id)
    {        
        
        $sql = "SELECT T.* "
                . "FROM DEPOSIT_TAGS DF, TAGS T "
                . "WHERE DF.DEPOSIT = " . $id . " "
                . "AND DF.TAG = T.ID "
                . "ORDER BY T.TITLE ASC  ";
        
        $returnArray = $this->executeSQL($sql);          
        
        return $returnArray;
    }
    
    public function fetchStoryComments($id)
    {        
        
        $sql = "SELECT DC.* "
                . "FROM DEPOSIT_COMMENTS DC "
                . "WHERE DC.DEPOSIT = " . $id . " "
                . "AND DC.IS_INAPPROPRIATE = 0 "
                . "ORDER BY DC.COMMENT_ON DESC";
        
        $returnArray = $this->executeSQL($sql);          
        
        return $returnArray;
    }
    
    public function addComment($deposit, $visitorID, $comment)
    {
        //  Validate the token to get the user id
        $returnArray = array();        
        
        $sql = "INSERT INTO DEPOSIT_COMMENTS ( COMMENT, COMMENT_BY, COMMENT_ON, DEPOSIT, "
                . "IS_INAPPROPRIATE, REVIEWED_BY, REVIEWED_ON ) "
                . "VALUES ('" . $comment . "', '" . $visitorID . "' , NOW(), " . $deposit . ", "
                . "1, 0, NOW())";

        $returnArray = $this->transactionalSQL($sql);   
        
        echo $sql;

        return $returnArray;     
    }    
    
    public function deleteComment($id)
    {
        //  Validate the token to get the user id
        $returnArray = array();        
        
        $sql = "DELETE FROM DEPOSIT_COMMENTS WHERE ID = " . $id;

        $returnArray = $this->transactionalSQL($sql);                                               

        return $returnArray;         
    }
    
    public function approveComment($id, $staffID)
    {
        //  Validate the token to get the user id
        $returnArray = array();        
        
        $sql = "UPDATE DEPOSIT_COMMENTS SET "
                . "IS_INAPPROPRIATE = 0, "
                . "REVIEWED_BY = " . $staffID . ", "                
                . "REVIEWED_ON = NOW() "
                . "WHERE ID = " . $id;

        $returnArray = $this->transactionalSQL($sql);                                               

        return $returnArray;                
    }
    
    public function fetchComments($deposit)
    {
        //  Validate the token to get the user id
        $returnArray = array();        
        
        $sql = "SELECT *, DATE_FORMAT(COMMENT_ON,'%d %b %Y') AS COMMENT_ON_FORMATTED FROM DEPOSIT_COMMENTS WHERE DEPOSIT = " . $deposit . " AND IS_INAPPROPRIATE = 0 ORDER BY COMMENT_ON DESC";
        
        return $this->executeSQL($sql);
    }     
    
    public function fetchNewComments()
    {
        //  Validate the token to get the user id
        $returnArray = array();        
        
        $sql = "SELECT *, DATE_FORMAT(COMMENT_ON,'%d %b %Y') AS COMMENT_ON_FORMATTED FROM DEPOSIT_COMMENTS WHERE IS_INAPPROPRIATE = 1 ORDER BY COMMENT_ON DESC";
        
        return $this->executeSQL($sql);
    }     
    
    /*
     *      Fetch all those tags
     */
    public function fetchTags()
    {
        return $this->executeSQL("SELECT ID, TITLE, DESCRIPTION FROM TAGS ORDER BY TITLE ASC");
    }
    
    /*
     *      Member Token Handling
     */
    
    public function IsLovedDeposit($deposit, $visitorID)
    {        
        $logins =  $this->executeSQL("SELECT * FROM DEPOSIT_METRICS WHERE DEPOSIT = " . $deposit . " AND LOVED_BY = '"  . $visitorID . "'");

        if (sizeof($logins) == 1)
        { 
            return true;            
        }
        
        return false;         
    }  
    
    public function IsValidDeposit($deposit)
    {
        $logins = $this->executeSQL("SELECT * FROM DEPOSITS WHERE ID = " . $deposit);

        if (sizeof($logins) == 1)
        { 
            return true;            
        }

        return false;         
    }      
    
    public function IsValidVisitorID($visitorID)
    {
        $logins = $this->executeSQL("SELECT * FROM DEPOSITS WHERE VISITOR_ID = '"  . $visitorID . "'");

        if (sizeof($logins) > 0)
        { 
            return true;            
        }
        
        return false;         
    }
    
    public function IsValidToken($token)
    {       
        if (strlen($token) > 0)
        {        
            $logins =  $this->executeSQL("SELECT ID, EMAIL, IS_ACTIVE, PREFERRED_NAME, PASSWORD, SESSION FROM LOGINS WHERE SESSION = '"  . $token . "' AND IS_ACTIVE = 1");

            if (sizeof($logins) == 1)
            { 
                return true;            
            }
        }        
        
        return false;        
    }

    public function fetchLogin($email)
    {
        return $this->executeSQL("SELECT ID, EMAIL, IS_ACTIVE, PREFERRED_NAME, PASSWORD, SESSION FROM LOGINS WHERE EMAIL = '"  . $email . "' AND IS_ACTIVE = 1");
    }    

    public function fetchToken($token)
    {
        return $this->executeSQL("SELECT ID, EMAIL, IS_ACTIVE, PREFERRED_NAME, PASSWORD, SESSION FROM LOGINS WHERE SESSION = '"  . $token . "' AND IS_ACTIVE = 1");        
    }
    
    public function updateToken($email, $token)
    {
        $this->updateSQL("UPDATE LOGINS SET SESSION = '" . $token . "' WHERE EMAIL = '" . $email . "'");        
    }
    
    /*
     *      Lowest level code
     */
    
    public function escapeString($stringToEscape)
    {
        $returnString = '';
        
        $this->mysqli = new mysqli($this->configs["host"], $this->configs["dbUsername"], $this->configs["dbPassword"], $this->configs["dbDatabase"], $this->configs["port"]);                    
        
        if ($this->mysqli->errno > 0)
        {

            return "SQL String Escape Error";
            
        } else {
            
            $returnString = mysqli_escape_string($this->mysqli, $stringToEscape);                
            
        }
        
        $this->mysqli->close();
        
        return $returnString;        
    }       

    private function updateSQL($sql)
    {
        //  Since we're now closing it, we need to always re-open it ... boo.
        $this->mysqli = new mysqli($this->configs["host"], $this->configs["dbUsername"], $this->configs["dbPassword"], $this->configs["dbDatabase"], $this->configs["port"]);
        $this->mysqli->query($sql);
        $this->mysqli->close();
        
        //  And hand back a nice little array       
        return;                
    }

    private function transactionalSQL($sql)
    {
        //  Since we're now closing it, we need to always re-open it ... boo.
        $this->mysqli = new mysqli($this->configs["host"], $this->configs["dbUsername"], $this->configs["dbPassword"], $this->configs["dbDatabase"], $this->configs["port"]);
        
        if ($this->mysqli->connect_errno > 0)
        {
            //  Exit early, failure to connect.
            return "Error: " . $this->mysqli->connect_errno;
            
        } else {        
            
            $this->mysqli->query($sql);

        }
        
        $this->mysqli->close();
        
        //  And hand back a nice little array       
        return true;           
    }
    
    private function executeSQL($sql)
    {        
        //  Since we're now closing it, we need to always re-open it ... boo.
        $this->mysqli = new mysqli($this->configs["host"], $this->configs["dbUsername"], $this->configs["dbPassword"], $this->configs["dbDatabase"], $this->configs["port"]);
        
        if ($this->mysqli->connect_errno > 0)
        {
            
            //  Exit early, failure to connect.
            return "Error: " . $this->mysqli->connect_errno;
            
        } else {        
            $results = $this->mysqli->query($sql);            
        }
        
        $rows = array();
        
        //  Now to format this correctly
        if ($results)
        {
            while($row = $results->fetch_array(MYSQLI_ASSOC))
            {
                $rows[] = $row;
            }

            //  Tidy everything up since we're stateless now ... boo.
            $results->close();        
        }
        
        $this->mysqli->close();
        
        //  And hand back a nice little array       
        return $rows;        
    }    
    
}