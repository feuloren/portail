<?php
$result = array();
$i=0;
foreach ($assos as $asso) 
{
  $result[] = array(
    "id" => ($asso->getId()),
    "name" => ($asso->getName()), 
    "login" => ($asso->getLogin()),
    "description" => ($asso->getDescription()),
    "url" => url_for('assos_show',$asso)
  );
}
echo json_encode($result);
?>
