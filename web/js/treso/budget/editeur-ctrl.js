'use strict';
var budgetEditeurApp = angular.module('BudgetEditeurApp', ['Portail', 'ngResource']);

budgetEditeurApp.controller('editeurCtrl', function($scope, asso, budget) {
    $scope.asso = asso;
    $scope.budget = budget;
});