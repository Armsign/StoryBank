<?php

//  Add a new entry for each part of the configuration. Make the file invisible to everyone else.
return array(
    
    'host' => 'armsign-office',
    'port' => '3307',    
    'fsHost' => 'Files',
    'dbDatabase' => 'StoryVault',
    'dbUsername' => 'vaultAdmin',
    'dbPassword'=> 'Q2QBL5BQDKB85KNG',

    'smtpHost' => 'syn211.syd3.hostyourservices.net',
    'smtpUser' => 'yourstory@storybankmaryborough.com.au',
    'smtpPassword' => '3B&CNkBbjM;U7UAx}=',
    'smtpSecurity' => 'ssl',
    'smtpPort' => 465,
    
    //  'printer' => 'DOCUCENTRE',
    
);



//  Magic Words to apply IP Alias, which don't work over wifi ... boooooooo

//  sudo ifconfig eth0:0 192.168.45.10 up
