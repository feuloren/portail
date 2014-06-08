<?php
$result = array();
$i=0;
foreach ($articles as $article) 
{
  $result[] = array(
    "id" => ($article->getId()),
    "name" => ($article->getName()), 
    "asso" => ($article->getAsso()->getName()),
    "summary" => ($article->getSummary()),
    "url" => url_for('article_show',$article)
  );
}
echo json_encode($result);
?>
