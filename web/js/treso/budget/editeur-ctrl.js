'use strict';
var budgetEditeurApp = angular.module('BudgetEditeurApp', ['Portail', 'ngResource']);

budgetEditeurApp.controller('editeurCtrl', function($scope, asso, budget) {
    $scope.asso = asso;
    $scope.budget = budget;
    $scope.recettes = [{
        nom: 'Subventions',
        id: 1,
        lignes : []
    }, {
        nom: 'Sponsors',
        id: 2,
        lignes : []
    }, {
        nom: 'Participation des membres',
        id: 3,
        lignes : [{
            nom: 'T-Shirts',
            qte: 15,
            unite: 8
        }, {
            nom: 'Participation Hebergement',
            qte: 15.34,
            unite: 5
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
})

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
                    '<div class="budget-tr budget-placeholder">'+
                        '<div class="budget-td">Nouvelle catégorie</div>'+
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

            };

            scope.totalTableau = totalTableau;

            scope.$watch('model', scope.update);
        }
    }
})
.directive('budgetEditeurCategorie', function(totalCategorie) {
    return {
        restrict: 'E',
        replace: true,
        template: '<div class="budget-sortable-group budget-tbody">'+
                    '<div class="budget-tr budget-tr-categorie">'+
                        '<div class="budget-td budget-colonne-nom">{{ categorie.nom }}</div>'+
                        '<div class="budget-td budget-colonne-montant"><budget-montant m="{{ totalCategorie(categorie) }}"/></div>'+
                    '</div>'+
                    '<budget-editeur-ligne ng-repeat="ligne in categorie.lignes" ligne="ligne"></budget-editeur-ligne>'+
                    '<div class="budget-tr budget-placeholder">'+
                        '<div class="budget-td budget-colonne-nom">Nouvelle ligne</div>'+
                        '<div class="budget-td budget-colonne-montant"></div>'+
                    '</div>'+
                '</div>',
        scope: {
            categorie: '=',
        },
        controller: function ($scope, $element) {},
        link: function(scope, element) {
            scope.update = function() {

            };

            scope.totalCategorie = totalCategorie;

            scope.$watch('categorie', scope.update);
        }
    }
})
.directive('budgetEditeurLigne', function() {
    return {
        restrict: 'E',
        replace: true,
        template: '<div class="budget-tr">'+
                    '<div class="budget-td budget-colonne-nom">{{ ligne.nom }}</div>'+
                    '<div class="budget-td budget-colonne-montant"><budget-montant m="{{ ligne.qte * ligne.unite }}"/></div>'+
                '</div>',
        scope: {
            ligne: '=',
        },
        controller: function ($scope, $element) {},
        link: function(scope, element) {
            scope.update = function() {

            };

            scope.$watch('ligne', scope.update);
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