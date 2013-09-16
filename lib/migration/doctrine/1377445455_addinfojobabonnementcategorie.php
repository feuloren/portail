<?php
/**
 * This class has been auto-generated by the Doctrine ORM Framework
 */
class Addinfojobabonnementcategorie extends Doctrine_Migration_Base
{
    public function up()
    {
        $this->createTable('info_job_abonnement_categorie', array(
             'id' => 
             array(
              'type' => 'integer',
              'length' => 8,
              'autoincrement' => true,
              'primary' => true,
             ),
             'categorie_id' => 
             array(
              'type' => 'integer',
              'notnull' => true,
              'length' => 8,
             ),
             'user_id' => 
             array(
              'type' => 'integer',
              'notnull' => true,
              'length' => 8,
             ),
             ), array(
             'indexes' => 
             array(
             ),
             'primary' => 
             array(
              0 => 'id',
             ),
             'collate' => 'utf8_unicode_ci',
             'charset' => 'utf8',
             ));
    }

    public function down()
    {
        $this->dropTable('info_job_abonnement_categorie');
    }
}