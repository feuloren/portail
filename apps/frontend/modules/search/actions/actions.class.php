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
  public function executeAsso(sfWebRequest $request)
  {
    $this->forwardUnless($query = $request->getParameter('query'), 'asso', 'index');

    $this->assos = Doctrine_Core::getTable('Asso')->getForLuceneQuery($query);

    if($request->isXmlHttpRequest())
    {
      return $this->renderPartial('asso/list', array('assos' => $this->assos));
    }
  }

  public function executeEvent(sfWebRequest $request)
  {
    $this->forwardUnless($query = $request->getParameter('query'), 'asso', 'index');

    $this->events = Doctrine_Core::getTable('Event')->getForLuceneQuery($query);

    if($request->isXmlHttpRequest())
    {
      return $this->renderPartial('event/list', array('events' => $this->events));
    }
  }

  public function executeArticle(sfWebRequest $request)
  {
    $this->forwardUnless($query = $request->getParameter('query'), 'asso', 'index');

    $this->articles = Doctrine_Core::getTable('Article')->getForLuceneQuery($query);

    if($request->isXmlHttpRequest())
    {
      return $this->renderPartial('article/list', array('articles' => $this->articles));
    }
  }
}
