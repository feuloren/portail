<?php
/**
 * This class has been auto-generated by the Doctrine ORM Framework
 */
class Addeventmember extends Doctrine_Migration_Base
{
    public function up()
    {
        $this->createForeignKey('event_member', 'event_member_event_id_event_id', array(
             'name' => 'event_member_event_id_event_id',
             'local' => 'event_id',
             'foreign' => 'id',
             'foreignTable' => 'event',
             ));
        $this->createForeignKey('event_member', 'event_member_user_id_sf_guard_user_id', array(
             'name' => 'event_member_user_id_sf_guard_user_id',
             'local' => 'user_id',
             'foreign' => 'id',
             'foreignTable' => 'sf_guard_user',
             ));
        $this->addIndex('event_member', 'event_member_event_id', array(
             'fields' => 
             array(
              0 => 'event_id',
             ),
             ));
        $this->addIndex('event_member', 'event_member_user_id', array(
             'fields' => 
             array(
              0 => 'user_id',
             ),
             ));
    }

    public function down()
    {
        $this->dropForeignKey('event_member', 'event_member_event_id_event_id');
        $this->dropForeignKey('event_member', 'event_member_user_id_sf_guard_user_id');
        $this->removeIndex('event_member', 'event_member_event_id', array(
             'fields' => 
             array(
              0 => 'event_id',
             ),
             ));
        $this->removeIndex('event_member', 'event_member_user_id', array(
             'fields' => 
             array(
              0 => 'user_id',
             ),
             ));
    }
}