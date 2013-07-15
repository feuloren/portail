<?php

/**
 * sfGuardUser
 * 
 * This class has been auto-generated by the Doctrine ORM Framework
 * 
 * @package    simde
 * @subpackage model
 * @author     Your name here
 * @version    SVN: $Id: Builder.php 7490 2010-03-29 19:53:27Z jwage $
 */
class sfGuardUser extends PluginsfGuardUser
{

  /**
   * Returns an array containing all permissions, including groups permissions
   * and single permissions.
   *
   * @return array
   */
  public function getAllPermissions()
  {
    if(!$this->_allPermissions)
    {
      $this->_allPermissions = parent::getAllPermissions();
      $asso_members = AssoMemberTable::getInstance()->getDroits($this->getPrimaryKey())->execute();
      foreach($asso_members as $asso_member)
      {
        if($asso_member->getSemestreId() == sfConfig::get('app_portail_current_semestre'))
          $this->_allPermissions[$asso_member->getAsso()->getLogin()] = $asso_member;
      }
    }
    
    return $this->_allPermissions;
  }
  
  public function getPermissionValue($name)
  {
    return $this->_allPermissions[$name];
  }
  
  public function getName(){
    return $this->getFirstName().' '.$this->getLastName();
  }

  /**
   * @param type $asso
   * @param type $droit 
   *  0x001 - modification de l'asso
   *  0x002 - gestion des membres
   *  0x004 - gestion des articles
   *  0x008 - gestion des events
   *  0x010 - gestion des roles
   *  0x020 - changement de pres
   *  0x040 - gestion du materiel
   *  0x080 - gestion des mails
   *  0x100 - gestion de la trésorerie
   * @return type 
   */
  public function hasAccess($asso,$droit)
  {
    if(!$this->hasPermission($asso))
      return false;
    return $this->getPermissionValue($asso)->getRole()->getDroits() & $droit;
  }
  
  public function isMember($asso)
  {
    return $this->hasPermission($asso);
  }
  
  public function isFollower($asso)
  {
    $res = AbonnementTable::getInstance()->getCurrentAssoFollower($asso, $this->getId())->fetchOne();
    return $res ? true : false;
  }
  
   public function isFollowerService($service)
  {
    $res = MembreServiceTable::getInstance()->getCurrentServiceFollower($service, $this->getId())->fetchOne();
    return $res ? true : false;
  }
}
