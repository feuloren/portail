<?php

/**
 * compte actions.
 *
 * @package    simde
 * @subpackage compte
 * @author     Your name here
 * @version    SVN: $Id: actions.class.php 23810 2009-11-12 11:07:44Z Kris.Wallsmith $
 */
class compteActions extends sfActions
{
  public function executeIndex(sfWebRequest $request)
  {
    $this->asso = $this->getRoute()->getObject();
    $this->compte_banquaires = CompteBanquaireTable::getInstance()->getAllForAsso($this->asso)->execute();
  }

  public function executeNew(sfWebRequest $request)
  {
    $this->asso = $this->getRoute()->getObject();
    $this->form = new CompteBanquaireForm();
    $this->form->setDefault('asso_id',$this->asso->getPrimaryKey());
  }

  public function executeCreate(sfWebRequest $request)
  {
    $this->forward404Unless($request->isMethod(sfRequest::POST));

    $this->form = new CompteBanquaireForm();

    $this->processForm($request, $this->form);

    $this->setTemplate('new');
  }

  public function executeEdit(sfWebRequest $request)
  {
    $this->forward404Unless($compte_banquaire = Doctrine_Core::getTable('CompteBanquaire')->find(array($request->getParameter('id'))), sprintf('Object compte_banquaire does not exist (%s).', $request->getParameter('id')));
    $this->form = new CompteBanquaireForm($compte_banquaire);
  }

  public function executeUpdate(sfWebRequest $request)
  {
    $this->forward404Unless($request->isMethod(sfRequest::POST) || $request->isMethod(sfRequest::PUT));
    $this->forward404Unless($compte_banquaire = Doctrine_Core::getTable('CompteBanquaire')->find(array($request->getParameter('id'))), sprintf('Object compte_banquaire does not exist (%s).', $request->getParameter('id')));
    $this->form = new CompteBanquaireForm($compte_banquaire);

    $this->processForm($request, $this->form);

    $this->setTemplate('edit');
  }

  public function executeDelete(sfWebRequest $request)
  {
    $request->checkCSRFProtection();

    $this->forward404Unless($compte_banquaire = Doctrine_Core::getTable('CompteBanquaire')->find(array($request->getParameter('id'))), sprintf('Object compte_banquaire does not exist (%s).', $request->getParameter('id')));
    $compte_banquaire->delete();

    $this->redirect('compte/index');
  }

  protected function processForm(sfWebRequest $request, sfForm $form)
  {
    $form->bind($request->getParameter($form->getName()), $request->getFiles($form->getName()));
    if ($form->isValid())
    {
      $compte_banquaire = $form->save();

      $this->redirect('compte/edit?id='.$compte_banquaire->getId());
    }
  }
}