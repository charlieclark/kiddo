<?php

$eventData = $_POST["myData"];

$response['events'] = $eventData;

$fp = fopen('../results.json', 'w');
fwrite($fp, json_encode( $response ));
fclose($fp);





?>