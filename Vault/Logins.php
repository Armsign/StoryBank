<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

require_once("DaSafe.php"); 

/**
 * Description of Login
 *
 * @author PaulDunn
 */
class Logins 
{
    
    public function Authenticate($email, $password)
    {
        $returnValue = '';
        
        if (strlen($email) > 0)
        {    
            $mySafe = new DaSafe();
        
            //  Santize that stuff!
            $saneEmail = $mySafe->escapeString($email);
            $sanePassword = hash('md5', $password);  
            
            $results = $mySafe->fetchLogin($saneEmail);
            
            foreach ($results as $key => $value)
            {                
                
                if ($value['PASSWORD'] === $sanePassword)
                {                   
                    //  OK ... let's just swap out the password and swap in the session token ....
                    $value['PASSWORD'] = 'OBFUSCATED';
                    $value['SESSION'] = hash('sha256', $saneEmail . $sanePassword);        
                    
                    //  Record the new login
                    $mySafe->updateToken($value['EMAIL'], $value['SESSION']);
                    
                    //  Return all the goods!
                    $returnValue = json_encode($value);
                } 
                        
            }   
            
            unset($mySafe);
        }
                        
        return $returnValue;
    }
    
    public function ReAuthenticate($token)
    {
        $returnValue = '';        
        
        if (strlen($token) > 0)
        {    
            $mySafe = new DaSafe();
            
            $results = $mySafe->fetchToken($token);
            
            foreach ($results as $key => $value)
            {                
                $value['PASSWORD'] = 'OBFUSCATED';
                //  Return all the goods!
                $returnValue = json_encode($value);
            } 
            
            unset($mySafe);
        }        
                        
        return $returnValue;
    }    
    
    public function fetchMembers($token)
    {
        $returnValue = '';
        
        $daSafe = new DaSafe();       
        if ($daSafe->IsValidToken($token))
        {
            $returnValue = json_encode($daSafe->fetchMembers());
        }        
        unset($daSafe);        
     
        return $returnValue;
    }    
    
    public function updateMember($token, $id, $email, $preferredName, $isActive)
    {
        $returnValue = '';
        
        $daSafe = new DaSafe();       
        if ($daSafe->IsValidToken($token) && strlen($email) > 0 && strlen($preferredName) > 0)
        {
            $returnValue = json_encode($daSafe->updateMember($id, $email, $preferredName, $isActive));
        }        
        unset($daSafe);              
        
        return $returnValue;
    }
    
    public function updatePassword($token, $id, $password)    
    {
        //  Validate the token to get the user id        
        $returnArray = array();
        
        $daSafe = new DaSafe();         
        if ($daSafe->IsValidToken($token))
        {            
            $sanePassword = hash('md5', $password);  

            $returnArray = json_encode($daSafe->updatePassword($token, $id, $password));
        }                
        unset($daSafe);

        return $returnArray;        
    }    
    
}
