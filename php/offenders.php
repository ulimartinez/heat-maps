<?php
    if(!isset($_POST['swLng']) || !isset($_POST['swLng']) || !isset($_POST['swLng']) || !isset($_POST['swLng'])){
        echo("Not enough parameters provided");
    }else{
        echo(file_get_contents('https://records.txdps.state.tx.us/SexOffenderRegistry/map/MappedAddress/?mapReqId=1&swLng='. $_POST['swLng'] .'&swLat='. $_POST['swLat'] .'&neLng='. $_POST['neLng'] .'&neLat='. $_POST['neLat'] .'&_=1580531046762'));
    }
?>