<!DOCTYPE html>
<!--
To change this license header, choose License Headers in Project Properties.
To change this template file, choose Tools | Templates
and open the template in the editor.
-->
<html>
    <head>
        <meta charset="UTF-8">
        <title>PL Travers Building</title>
        
        <!-- CSS -->
        <link href="CSS/animate.min.css" rel="stylesheet" type="text/css"/>
        <link href="CSS/PLTravers.css" rel="stylesheet" type="text/css"/>
        
        <!-- Javascript -->
        <script src="Scripts/jquery-3.3.1.min.js" type="text/javascript"></script>
        <script src="Scripts/recorder.js" type="text/javascript"></script>
        <script src="Scripts/wavesurfer.min.js" type="text/javascript"></script>
        <script src="Scripts/PLTravers.js" type="text/javascript"></script>
    </head>
    <body>
        
        <div class="container animated bounceInDown">
            <a href="Admin/admin.php">Admin</a>
            <a href="Playback/playback.php">Playback</a>
            <a href="Record/record.php">Record</a>            
        </div>
        
        <div class="container animated bounceInDown">

            <h1>Welcome to the Story Bank!</h1>
            
            <h1>Testing voice recording</h1>

            <p>
                <button onclick="startRecording(this);">record</button>
                <button onclick="stopRecording(this);" disabled>stop</button>

                <h2>Recordings</h2>
                <ul id="recordingslist"></ul>
            </p>

        </div>
        
    </body>
</html>
