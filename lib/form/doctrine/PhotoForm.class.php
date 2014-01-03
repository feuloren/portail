<?php

/**
 * Photo form.
 *
 * @package    simde
 * @subpackage form
 * @author     Your name here
 * @version    SVN: $Id: sfDoctrineFormTemplate.php 23810 2009-11-12 11:07:44Z Kris.Wallsmith $
 */
class PhotoForm extends BasePhotoForm
{
  public function configure()
  {
  	sfProjectConfiguration::getActive()->loadHelpers(array('Asset', 'Thumb'));

  	$this->setWidgets(array(
      'id'              => new sfWidgetFormInputHidden(),
      'galeriePhoto_id' => new sfWidgetFormInputHidden(),
      'title'           => new sfWidgetFormInputText(),
      'author'          => new sfWidgetFormInputText(),
      'is_public'       => new sfWidgetFormInputText(),
    ));

    $this->widgetSchema['image'] = new sfWidgetFormInputFileEditable(array(
        'file_src' => doThumb($this->getObject()->getImage(), 'galeries', array('width'=>150, 'height'=>150), 'scale'),
        'is_image' => true,
        'edit_mode' => (!$this->isNew() && $this->getObject()->getImage()),
        'with_delete' => true,
        'delete_label' => "Supprimer cette photo"
    ));

    $this->setValidators(array(
      'id'              => new sfValidatorChoice(array('choices' => array($this->getObject()->get('id')), 'empty_value' => $this->getObject()->get('id'), 'required' => false)),
      'galeriePhoto_id' => new sfValidatorDoctrineChoice(array('model' => $this->getRelatedModelName('GaleriePhoto'))),
      'title'           => new sfValidatorString(array('max_length' => 200, 'required' => false)),
      'author'          => new sfValidatorInteger(),
      'is_public'       => new sfValidatorInteger(),
    ));

    $this->validatorSchema['image'] = new sfValidatorFileImage(array(
    	'required' => false,
    	'path' => sfConfig::get('sf_upload_dir').'/galeries/source',
        'mime_types' => 'web_images',
        'max_width' => 1000,
        'max_height' => 1000
    ));


    $this->widgetSchema->setLabel('title', 'Titre');
    $this->widgetSchema->setLabel('author', 'Photographe');
    $this->widgetSchema->setLabel('is_public', "Est publique");
    $this->widgetSchema->setNameFormat('photo[%s]');

    $this->errorSchema = new sfValidatorErrorSchema($this->validatorSchema);
    $this->useFields(array('galeriePhoto_id', 'title', 'author', 'is_public', 'image'));
  }
}
