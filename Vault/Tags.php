<?php

/**
 * Description of Tags
 *
 * @author PaulDunn
 */
class Tags
{
    
    public function createBridge($token, $storyID, $tagID)
    {
        $returnValue = $storyID . '-' . $tagID;


        $mySafe = new DaSafe();          
        if ($mySafe->IsValidToken($token))
        {          
            $returnValue = json_encode($mySafe->createBridge($storyID, $tagID));
        }
        unset($mySafe);

        
        return $returnValue;
    }   
    
}
