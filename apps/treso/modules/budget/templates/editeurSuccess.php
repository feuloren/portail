<?php
use_javascript('treso/common/portail.js');
use_javascript('treso/budget/editeur-ctrl.js');

$infos_asso = array('nom' => $asso->getName(),
    'login' => $asso->getLogin(),
    'id' => $asso->getPrimaryKey());

$infos_budget = array('nom' => $budget->getNom(),
    'id' => $budget->getPrimaryKey());
?>

<script type="text/javascript">
budgetEditeurApp.constant('baseUrl', "<?php echo url_for('homepage') ?>");
budgetEditeurApp.constant('asso', <?php echo json_encode($infos_asso) ?>);
budgetEditeurApp.constant('budget', <?php echo json_encode($infos_budget) ?>);
</script>

<div ng-app="BudgetEditeurApp" ng-controller="editeurCtrl">
Édition du budget {{ budget.nom }} de l'asso {{ asso.nom }}
</div>