<?php
$result = array();
$i=0;
foreach ($events as $event) 
{
  $result[] = array(
    "id" => ($event->getId()),
    "name" => ($event->getName()), 
    "asso" => ($event->getAsso()->getName()),
    "start" => $event->getStartDate(),
    "end" => $event->getEndDate(),
    "summary" => ($event->getSummary()),
    "url" => url_for('event_show',$event)
  );
}
echo json_encode($result);
?>
