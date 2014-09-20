'use strict';
var budgetEditeurApp = angular.module('BudgetEditeurApp', ['Portail', 'ngResource']);

budgetEditeurApp.controller('editeurCtrl', function($scope, asso, budget) {
    $scope.asso = asso;
    $scope.budget = budget;
    $scope.recettes = [{
        nom: 'Subventions',
        id: 1,
        lignes : [{
            id: 1,
            nom: 'T-Shirts',
            qte: 15,
            unite: 8
        }, {
            id: 2,
            nom: 'Participation Hebergement',
            qte: 5,
            unite: 15.34
        }, {
            id: 3,
            nom: 'T-Shirts',
            qte: 15,
            unite: 8
        }, {
            id: 4,
            nom: 'Participation Hebergement',
            qte: 5,
            unite: 15.34
        }, {
            id: 5,
            nom: 'T-Shirts',
            qte: 15,
            unite: 8
        }, {
            id: 6,
            nom: 'Participation Hebergement',
            qte: 5,
            unite: 15.34
        }, {
            id: 7,
            nom: 'T-Shirts',
            qte: 15,
            unite: 8
        }, {
            id: 8,
            nom: 'Participation Hebergement',
            qte: 5,
            unite: 15.34
        }]
    }, {
        nom: 'Sponsors',
        id: 2,
        lignes : [{
            id: 9,
            nom: 'T-Shirts',
            qte: 15,
            unite: 8
        }, {
            id: 10,
            nom: 'Participation Hebergement',
            qte: 5,
            unite: 15.34
        }, {
            id: 11,
            nom: 'T-Shirts',
            qte: 15,
            unite: 8
        }, {
            id: 12,
            nom: 'Participation Hebergement',
            qte: 5,
            unite: 15.34
        }]
    }, {
        nom: 'Participation des membres',
        id: 3,
        lignes : [{
            id: 13,
            nom: 'T-Shirts',
            qte: 15,
            unite: 8
        }, {
            id: 14,
            nom: 'Participation Hebergement',
            qte: 5,
            unite: 15.34
        }, {
            id: 15,
            nom: 'T-Shirts',
            qte: 15,
            unite: 8
        }, {
            id: 16,
            nom: 'Participation Hebergement',
            qte: 5,
            unite: 15.34
        }, {
            id: 17,
            nom: 'T-Shirts',
            qte: 15,
            unite: 8
        }, {
            id: 18,
            nom: 'Participation Hebergement',
            qte: 5,
            unite: 15.34
        }, {
            id: 19,
            nom: 'T-Shirts',
            qte: 15,
            unite: 8
        }, {
            id: 20,
            nom: 'Participation Hebergement',
            qte: 5,
            unite: 15.34
        }, {
            id: 21,
            nom: 'T-Shirts',
            qte: 15,
            unite: 8
        }, {
            id: 22,
            nom: 'Participation Hebergement',
            qte: 5,
            unite: 15.34
        }]},
        {
        nom: 'Autre',
        id: 3,
        lignes : [{
            id: 23,
            nom: 'T-Shirts',
            qte: 15,
            unite: 8
        }, {
            id: 24,
            nom: 'Participation Hebergement',
            qte: 5,
            unite: 15.34
        }, {
            id: 25,
            nom: 'T-Shirts',
            qte: 15,
            unite: 8
        }, {
            id: 26,
            nom: 'Participation Hebergement',
            qte: 5,
            unite: 15.34
        }, {
            id: 27,
            nom: 'T-Shirts',
            qte: 15,
            unite: 8
        }, {
            id: 28,
            nom: 'Participation Hebergement',
            qte: 5,
            unite: 15.34
        }, {
            id: 29,
            nom: 'T-Shirts',
            qte: 15,
            unite: 8
        }, {
            id: 34,
            nom: 'Participation Hebergement',
            qte: 5,
            unite: 15.34
        }, {
            id: 33,
            nom: 'T-Shirts',
            qte: 15,
            unite: 8
        }, {
            id: 36,
            nom: 'Participation Hebergement',
            qte: 5,
            unite: 15.34
        }, {
            id: 37,
            nom: 'Participation Hebergement',
            qte: 5,
            unite: 15.34
        }, {
            id: 38,
            nom: 'T-Shirts',
            qte: 15,
            unite: 8
        }, {
            id: 39,
            nom: 'Participation Hebergement',
            qte: 5,
            unite: 15.34
        }, {
            id: 40,
            nom: 'T-Shirts',
            qte: 15,
            unite: 8
        }, {
            id: 42,
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
                    '<budget-editeur-ligne-trans class="budget-tr" ng-repeat="ligne in categorie.lignes" ligne="ligne" edit-cancel="cancelLigne(control)" edit-validate="validateLigne(control)" edit-blur="validateLigne(control)" control="ligneControllers[ligne.id]">'+
                        '<div class="budget-td budget-colonne-nom" ng-click="edit(\'nom\')">{{ ligne.nom }}</div>'+
                        '<div class="budget-td budget-colonne-montant" ng-click="edit(\'unite\')"><budget-montant m="{{ ligne.qte * ligne.unite }}"></budget-montant></div>'+
                    '</budget-editeur-ligne-trans>'+
                    '<budget-editeur-ligne-trans class="budget-tr" ligne="newLine" edit-cancel="cancelNewLigne(control)" edit-validate="validateNewLigne(control)" edit-blur="pauseNewLigne(control)" control="newLineControl">'+
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
            scope.ligneControllers = {};

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