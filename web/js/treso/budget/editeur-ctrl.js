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
        var res = Math.floor(montant);
        if (montant % 1 > 0) {
            res += '+';
        }

        return res;
    };
});

budgetEditeurApp.directive('budgetEditeurTableau', function() {
    return {
        restrict: 'E',
        replace: true,
        template: '<div class="budget-table">'+
                    '<div class="budget-thead">'+
                        '<div class="budget-tr">'+
                            '<div class="budget-td budget-colonne-nom">Nom</div>'+
                            '<div class="budget-td budget-colonne-montant">Montant</div>'+
                        '</div>'+
                    '</div>'+
                    '<budget-editeur-categorie ng-repeat="categorie in model" categorie="categorie" />'+
                '</div>',
        scope: {
            model: '=',
        },
        controller: function ($scope, $element) {},
        link: function(scope, element) {
            scope.update = function() {

            };

            scope.$watch('model', scope.update);
        }
    }
})
.directive('budgetEditeurCategorie', function() {
    return {
        restrict: 'E',
        replace: true,
        template: '<div class="budget-sortable-group budget-tbody">'+
                    '<div class="budget-tr">'+
                        '<div class="budget-td budget-colonne-nom"><strong>{{ categorie.nom }}</strong></div>'+
                        '<div class="budget-td budget-colonne-montant"><strong></strong></div>'+
                    '</div>'+
                    '<budget-editeur-ligne ng-repeat="ligne in categorie.lignes" ligne="ligne"></budget-editeur-ligne>'+
                    '<div class="budget-tr">'+
                        '<div class="budget-td budget-colonne-nom"><em>Nouvelle ligne</em></div>'+
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
                    '<div class="budget-td budget-colonne-montant">{{ ligne.qte * ligne.unite | dotmontant }}</div>'+
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