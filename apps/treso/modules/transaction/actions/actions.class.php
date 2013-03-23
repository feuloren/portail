<?php

/**
 * transaction actions.
 *
 * @package    simde
 * @subpackage transaction
 * @author     Your name here
 * @version    SVN: $Id: actions.class.php 23810 2009-11-12 11:07:44Z Kris.Wallsmith $
 */
class transactionActions extends sfActions
{
  public function executeIndex(sfWebRequest $request)
  {
    $this->asso = $this->getRoute()->getObject();
    $this->transactions = TransactionTable::getInstance()->getAllForAsso($this->asso)->execute();
  }

  public function executeNew(sfWebRequest $request)
  {
    $this->form = new TransactionForm();
    $this->asso = $this->getRoute()->getObject();
    $this->form->setDefault('asso_id', $this->getRoute()->getObject()->getPrimaryKey());
  }

  public function executeCreate(sfWebRequest $request)
  {
    $this->forward404Unless($request->isMethod(sfRequest::POST));

    $this->form = new TransactionForm();

    $this->processForm($request, $this->form);

    $this->setTemplate('new');
  }

  public function executeEdit(sfWebRequest $request)
  {
    $this->forward404Unless($transaction = Doctrine_Core::getTable('Transaction')->find(array($request->getParameter('id'))), sprintf('Object transaction does not exist (%s).', $request->getParameter('id')));
    $this->form = new TransactionForm($transaction);
  }

  public function executeUpdate(sfWebRequest $request)
  {
    $this->forward404Unless($request->isMethod(sfRequest::POST) || $request->isMethod(sfRequest::PUT));
    $this->forward404Unless($transaction = Doctrine_Core::getTable('Transaction')->find(array($request->getParameter('id'))), sprintf('Object transaction does not exist (%s).', $request->getParameter('id')));
    $this->form = new TransactionForm($transaction);

    $this->processForm($request, $this->form);

    $this->setTemplate('edit');
  }

  public function executeDelete(sfWebRequest $request)
  {
    $request->checkCSRFProtection();

    $this->forward404Unless($transaction = Doctrine_Core::getTable('Transaction')->find(array($request->getParameter('id'))), sprintf('Object transaction does not exist (%s).', $request->getParameter('id')));
    $transaction->delete();

    $this->redirect('transaction/index');
  }

  protected function processForm(sfWebRequest $request, sfForm $form)
  {
    $form->bind($request->getParameter($form->getName()), $request->getFiles($form->getName()));
    if ($form->isValid())
    {
      $transaction = $form->save();

      $this->redirect('transaction', $form->getObject()->getAsso());
    }
  }
}