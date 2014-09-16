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
<div class="pull-right">
    <div class="btn-group">
        <a class="btn dropdown-toggle" data-toggle="dropdown" href="#">
        Export <span class="caret"></span>
        </a>
        <ul class="dropdown-menu">
            <li><a href="<?php echo url_for('budget_export', $budget) ?>">
                <i class="icon-share-alt"></i> PDF
                </a>
            </li>
        </ul>
    </div>
</div>

<h1>Budget {{ budget.nom }}</h1>

<div class="row-fluid">
    <div class="span6">
        <budget-editeur-tableau model="depenses" nom="Dépenses" />
    </div>
    <div class="span6">
        <budget-editeur-tableau model="recettes" nom="Recettes" />
    </div>
</div>

</div>