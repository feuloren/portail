<?php use_helper('Text') ?>
<?php use_helper('Thumb') ?>
<h1>Résultat de la recherche</h1>
<ul id="assos_list">
  <?php foreach($assos as $asso) : ?>
    <li>
      <h3><a href="<?php echo url_for('asso/show?login='.$asso->getLogin()) ?>"><?php echo $asso->getName() ?></a></h3>
      <a href="<?php echo url_for('asso/show?login='.$asso->getLogin()) ?>"><?php echo showThumb($asso->getLogo(), 'assos', array('width'=>85, 'height'=>85, 'class'=>'logo'), 'center') ?></a>
      <div class="desc">
        <?php echo $asso->getSummary() ?>
        </br>
        <a class="website" href="<?php echo $asso->getUrlSite() ?>"><?php echo $asso->getUrlSite() ?></a> - <a class="email" href="mailto:<?php echo $asso->getLogin() ?>@assos.utc.fr"><?php echo $asso->getLogin() ?>@assos.utc.fr</a>
      </div>
    </li>
  <?php endforeach; ?>
</ul>
