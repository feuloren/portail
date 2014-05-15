<?php

/**
 * search actions.
 *
 * @package    simde
 * @subpackage search
 * @author     Your name here
 * @version    SVN: $Id: actions.class.php 23810 2009-11-12 11:07:44Z Kris.Wallsmith $
 */
class searchActions extends sfActions
{
 /**
  * Executes index action
  *
  * @param sfRequest $request A request object
  */
  public function executeIndex(sfWebRequest $request)
  {
    $this->forwardUnless($query = $request->getParameter('query'), 'asso', 'index');

    $this->assos = Doctrine_Core::getTable('Asso')->getForLuceneQuery($query);

    if($request->isXmlHttpRequest())
    {
      if('*' == $query || !$this->assos)
      {
        return $this->renderText('No results.');
      }

      return $this->renderPartial('asso/list', array('assos' => $this->assos));
    }
  }
}
