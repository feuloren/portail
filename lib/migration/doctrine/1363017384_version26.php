<?php
/**
 * This class has been auto-generated by the Doctrine ORM Framework
 */
class Version26 extends Doctrine_Migration_Base
{
    public function up()
    {
        $this->addColumn('budget', 'asso_id', 'integer', '8', array(
             'notnull' => '1',
             ));
    }

    public function down()
    {
        $this->removeColumn('budget', 'asso_id');
    }
}