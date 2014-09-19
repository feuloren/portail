'use strict';
var budgetEditeurApp = angular.module('BudgetEditeurApp', ['Portail', 'ngResource']);

budgetEditeurApp.controller('editeurCtrl', function($scope, asso, budget) {
    $scope.asso = asso;
    $scope.budget = budget;
    $scope.recettes = [{
        nom: 'Subventions',
        id: 1,
        lignes : [{
            nom: 'T-Shirts',
            qte: 15,
            unite: 8
        }, {
            nom: 'Participation Hebergement',
            qte: 5,
            unite: 15.34
        }, {
            nom: 'T-Shirts',
            qte: 15,
            unite: 8
        }, {
            nom: 'Participation Hebergement',
            qte: 5,
            unite: 15.34
        }, {
            nom: 'T-Shirts',
            qte: 15,
            unite: 8
        }, {
            nom: 'Participation Hebergement',
            qte: 5,
            unite: 15.34
        }, {
            nom: 'T-Shirts',
            qte: 15,
            unite: 8
        }, {
            nom: 'Participation Hebergement',
            qte: 5,
            unite: 15.34
        }]
    }, {
        nom: 'Sponsors',
        id: 2,
        lignes : [{
            nom: 'T-Shirts',
            qte: 15,
            unite: 8
        }, {
            nom: 'Participation Hebergement',
            qte: 5,
            unite: 15.34
        }, {
            nom: 'T-Shirts',
            qte: 15,
            unite: 8
        }, {
            nom: 'Participation Hebergement',
            qte: 5,
            unite: 15.34
        }]
    }, {
        nom: 'Participation des membres',
        id: 3,
        lignes : [{
            nom: 'T-Shirts',
            qte: 15,
            unite: 8
        }, {
            nom: 'Participation Hebergement',
            qte: 5,
            unite: 15.34
        }, {
            nom: 'T-Shirts',
            qte: 15,
            unite: 8
        }, {
            nom: 'Participation Hebergement',
            qte: 5,
            unite: 15.34
        }, {
            nom: 'T-Shirts',
            qte: 15,
            unite: 8
        }, {
            nom: 'Participation Hebergement',
            qte: 5,
            unite: 15.34
        }, {
            nom: 'T-Shirts',
            qte: 15,
            unite: 8
        }, {
            nom: 'Participation Hebergement',
            qte: 5,
            unite: 15.34
        }, {
            nom: 'T-Shirts',
            qte: 15,
            unite: 8
        }, {
            nom: 'Participation Hebergement',
            qte: 5,
            unite: 15.34
        }]},
        {
        nom: 'Autre',
        id: 3,
        lignes : [{
            nom: 'T-Shirts',
            qte: 15,
            unite: 8
        }, {
            nom: 'Participation Hebergement',
            qte: 5,
            unite: 15.34
        }, {
            nom: 'T-Shirts',
            qte: 15,
            unite: 8
        }, {
            nom: 'Participation Hebergement',
            qte: 5,
            unite: 15.34
        }, {
            nom: 'T-Shirts',
            qte: 15,
            unite: 8
        }, {
            nom: 'Participation Hebergement',
            qte: 5,
            unite: 15.34
        }, {
            nom: 'T-Shirts',
            qte: 15,
            unite: 8
        }, {
            nom: 'Participation Hebergement',
            qte: 5,
            unite: 15.34
        }, {
            nom: 'T-Shirts',
            qte: 15,
            unite: 8
        }, {
            nom: 'Participation Hebergement',
            qte: 5,
            unite: 15.34
        }, {
            nom: 'Participation Hebergement',
            qte: 5,
            unite: 15.34
        }, {
            nom: 'T-Shirts',
            qte: 15,
            unite: 8
        }, {
            nom: 'Participation Hebergement',
            qte: 5,
            unite: 15.34
        }, {
            nom: 'T-Shirts',
            qte: 15,
            unite: 8
        }, {
            nom: 'Participation Hebergement',
            qte: 5,
            unite: 15.34
        }]
    }];
    $scope.depenses = [];
});

budgetEditeurApp.filter('dotmontant', function() {
    return function(montant) {
        if (angular.isString(montant)) {
            montant = parseFloat(montant);
        }
        var res = Math.floor(montant);
        if (montant % 1 > 0) {
            res += '+';
        }

        return res;
    };
});

budgetEditeurApp.directive('budgetMontant', function() {
    return {
        restrict: 'E',
        replace: true,
        template: '<span class="budget-montant" title="{{ montant | currency }}">{{ montant | dotmontant }}</span>',
        scope: {
            montant: '@m'
        }
    }
});

budgetEditeurApp.directive('editableText', function() {
    return {
        restrict: 'EA',
        replace: true,
        template: '<input class="budget-edit-field" type="text" ng-model="buffer.t" ng-keypress="key($event)" ng-blur="save()"/>',
        scope: {
            content: '='
        },
        link: function(scope, element, attrs) {
            scope.buffer = {t : scope.content};

            scope.save = function() {
                scope.content = scope.buffer.t;
            };

            scope.cancel = function() {
                scope.buffer.t = scope.content;
            }

            scope.key = function(event) {
                console.log(event);
                if (event.key == 13) {
                    scope.save();
                    element.blur();
                }
                else if (event.key == 27) {
                    scope.cancel();
                    element.blur();
                } else if (event.key == 9) {
                    scope.save();
                    element.blur();
                } else if (event.key == 38 || event.key == 40) {
                    scope.save();
                    element.blur();
                }
            };

            scope.$watch('content', function() {
                scope.buffer.t = scope.content;
            });
        }
    };
});

budgetEditeurApp.directive('budgetEditeurTableau', function(totalTableau) {
    return {
        restrict: 'E',
        replace: true,
        template: '<div class="budget-table">'+
                    '<div class="budget-thead">'+
                        '<div class="budget-tr">'+
                            '<div class="budget-td budget-colonne-nom">{{ nom }}</div>'+
                            '<div class="budget-td budget-colonne-montant">Total en € : <budget-montant m="{{ totalTableau(model) }}" /></div>'+
                        '</div>'+
                    '</div>'+
                    '<budget-editeur-categorie ng-repeat="categorie in model" categorie="categorie"></budget-editeur-categorie>'+
                    '<div class="budget-tr">'+
                        '<div class="budget-td budget-placeholder">Nouvelle catégorie</div>'+
                        '<div class="budget-td"></div>'+
                    '</div>'+
                '</div>',
        scope: {
            model: '=',
            nom: '@'
        },
        controller: function ($scope, $element) {},
        link: function(scope, element) {
            scope.update = function() {
                //console.log("tableau", scope.model);
            };

            scope.totalTableau = totalTableau;

            scope.$watchCollection('model', scope.update); // watch for delete / add categories
        }
    }
})
.directive('budgetEditeurCategorie', function(totalCategorie, softCopy) {
    return {
        restrict: 'E',
        replace: true,
        template: '<div class="budget-sortable-group budget-tbody">'+
                    '<div class="budget-tr budget-tr-categorie">'+
                        '<div class="budget-td budget-colonne-nom"><editable-text content="categorie.nom"/></div>'+
                        '<div class="budget-td budget-colonne-montant"><budget-montant m="{{ totalCategorie(categorie) }}"/></div>'+
                    '</div>'+
                    '<budget-editeur-ligne-trans class="budget-tr" ng-repeat="ligne in categorie.lignes" ligne="ligne" edit-cancel="cancelLigne(api)" edit-validate="validateLigne(api)" edit-blur="validateLigne(api)">'+
                        '<div class="budget-td budget-colonne-nom" ng-click="edit(\'nom\')">{{ ligne.nom }}</div>'+
                        '<div class="budget-td budget-colonne-montant" ng-click="edit(\'unite\')"><budget-montant m="{{ ligne.qte * ligne.unite }}"></budget-montant></div>'+
                    '</budget-editeur-ligne-trans>'+
                    '<budget-editeur-ligne-trans class="budget-tr" ligne="newLine" edit-cancel="cancelNewLigne(api)" edit-validate="validateNewLigne(api)" edit-blur="pauseNewLigne(api)">'+
                        '<div class="budget-td budget-colonne-nom budget-placeholder" ng-click="edit(\'nom\')"><span>Nouvelle ligne</span></div>'+
                        '<div class="budget-td budget-colonne-montant"></div>'+
                    '</budget-editeur-ligne>'+
                '</div>',
        scope: {
            categorie: '=',
        },
        link: function(scope, element) {
            scope.emptyNewLine = function() { return {nom: "", qte: 1, unite: ""}; };
            scope.newLine = scope.emptyNewLine();

            scope.validateLigne = function(ligneEditeur) {
                ligneEditeur.save();
                ligneEditeur.stop();
            };

            scope.cancelLigne = function(ligneEditeur) {
                ligneEditeur.undoChanges();
            }

            scope.pauseNewLigne = function(ligneEditeur) {
                ligneEditeur.stop();
            };

            scope.validateNewLigne = function(ligneEditeur) {
                // TODO : gérer les inputs avec des virgules comme séparateur décimal
                // directive frDecimalInput ?
                scope.categorie.lignes.push(ligneEditeur.get());
                ligneEditeur.set(scope.emptyNewLine());
                ligneEditeur.edit('nom');
            };

            scope.cancelNewLigne = function(ligneEditeur) {
                ligneEditeur.set(scope.emptyNewLine());
            }

            scope.totalCategorie = totalCategorie;
        }
    }
});

budgetEditeurApp.factory('totalCategorie', function() {
    return function(categorie) {
        var total = 0;
        for (var i = 0; i < categorie.lignes.length; i++) {
            var ligne = categorie.lignes[i];
            total += ligne.unite * ligne.qte;
        }
        return total;
    };
})
.factory('totalTableau', function(totalCategorie) {
    return function(model) {
        var total = 0;
        for (var i = 0; i < model.length; i++) {
            total += totalCategorie(model[i]);
        }
        return total;
    };
})