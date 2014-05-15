<?php use_stylesheet("reservation.css") ?>

<ul id="menuBde">
	<?php if ($param == "salle"): ?>
	<li><a class="active" href="<?php echo url_for('reservation_salle') ?>">Gestion des salles</a></li>
	<?php else: ?>
	<li><a href="<?php echo url_for('reservation_salle') ?>">Gestion des salles</a></li>
	<?php endif; ?>
	
	<?php if ($param == "validation"): ?>
	<li><a class="active" href="<?php echo url_for('reservation_validation') ?>">Validation des reservations</a></li>
	<?php else: ?>
	<li><a href="<?php echo url_for('reservation_validation') ?>">Validation des reservations</a></li>
	<?php endif; ?>
	
	<?php if ($param == "gestion"): ?>
	<li><a class="active" href="<?php echo url_for('reservation_gestion') ?>">Gestion des reservations</a></li>
	<?php else: ?>
	<li><a href="<?php echo url_for('reservation_gestion') ?>">Gestion des reservations</a></li>
	<?php endif; ?>
	
</ul>


