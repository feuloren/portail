<?php include_partial("insideMenu",array("param" => $param)) ?>

<?php if($id == -1): ?>

	<h3>Listes des reservations non validées</h3>

	<?php foreach ($reservations as $reservation): ?>

		<pre>
		<?php echo link_to ($reservation->getDate()." - ".$reservation->getAsso(), "reservation_validation_id", array('id'=>$reservation->getId())) ?>
		</pre>

	<?php endforeach; ?>

<?php else: ?>

	<p><?php echo link_to ('<< retour', 'reservation_validation') ?></p>

	<h3>Reservation non validée</h3>
	
	<?php include_partial("showReservation",array("reservation" => $reservation)) ?>

	<form action="<?php echo url_for('reservation_validation_valid',array('id'=>$id)) ?>" method="post">
	
		<textarea rows="4" cols="50" name="commentaire" placeholder="Your comment here"></textarea>
	
		<input type="submit" name="accepter" value="Accepter" />
		<input type="submit" name="refuser" value="Refuser" />
	
	</form>

<?php endif; ?>
