budgetEditeurApp.directive('budgetEditeurLigneTrans', function(softCopy, $timeout) {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        template: '<div class="budget-edited-line">'+
                      '<div class="budget-td budget-colonne-nom" ng-if="edit_mode">'+
                          '<input name="nom" class="budget-edit-field" type="text" ng-model="buffer.nom" ng-keypress="key($event)" placeholder="Nom" ng-blur="onBlur($event)" ng-focus="onFocus(event)"/>'+
                      '</div>'+
                      '<div class="budget-td budget-colonne-montant" ng-if="edit_mode">'+
                          '<input name="qte" class="budget-edit-field" type="text" ng-model="buffer.qte" ng-keypress="key($event)" placeholder="Quantité" ng-blur="onBlur($event)" ng-focus="onFocus(event)"/>'+
                          ' x '+
                          '<input name="unite" class="budget-edit-field" type="text" ng-model="buffer.unite" ng-keypress="uniteKey($event)" placeholder="Prix unitaire" ng-blur="onBlur($event)" ng-focus="onFocus(event)"/>'+
                      '</div>'+
                  '</div>',
        scope: {
            ligne: '=',
            ctrl: '=control',
            cancelCallback: '&editCancel',
            validateCallback: '&editValidate',
            blurCallback: '&editBlur'
        },
        controller: function($scope, $element) {
            $scope.ctrl = this;
            $scope.buffer = {};

            /*
             * Mettre la ligne en mode modifiable
             * Le focus peut être mis sur un certain champ
             * et une selection peut être faite dans ce champ
             */
            $scope.edit = function(inputName, start, end) {
                $scope.edit_mode = true;
                if ($scope.inputsOrder.indexOf(inputName) >= 0) {
                    $timeout(function() {
                        var input = $scope.getInput(inputName);
                        input.focus();
                        if (start != undefined && end != undefined) {
                            input.selectionStart = start;
                            if (end == -1) {
                                input.selectionEnd = input.value.length;
                            } else {
                                input.selectionEnd = end;
                            }
                        } else {
                            input.selectionStart = input.value.length;
                            input.selectionEnd = input.value.length;
                        }
                    }, 0);
                }
            };
            this.edit = $scope.edit;


            this.save = function() {
                softCopy($scope.buffer, $scope.ligne, $scope.inputsOrder);
            };
            this.stop = function() {
                // first we blur out of t
                for(var i = 0; i < $scope.inputsOrder.length; i++) {
                    var input = $($scope.getInput($scope.inputsOrder[i]));
                    if (input.is(':focus')) {
                        input.blur();
                    }
                }
                $scope.edit_mode = false;
            };
            this.get = function() {
                return angular.copy($scope.buffer);
            };
            this.undoChanges = function() {
                softCopy($scope.ligne, $scope.buffer, $scope.inputsOrder);
            };
            this.set = function(val) {
                softCopy(val, $scope.buffer, $scope.inputsOrder);
                softCopy(val, $scope.ligne, $scope.inputsOrder);
            };
        },
        link : function(scope, element, attrs, categorieCtrl, $transclude) {
            scope.edit_mode = false;
            scope.inputsOrder = ['nom', 'qte', 'unite'];

            scope.$watch('ligne', function() {
                softCopy(scope.ligne, scope.buffer, scope.inputsOrder);
            });

            // Attention fonction de fou
            // On veut afficher le contenu défini par le parent uniquement quand on est pas en edit_mode
            // mais à cause de "display: table" qui est pas super malin on ne peut pas juste faire un <div ng-if="!edit_mode"></div>
            // du coup on va transcluder manuellement le contenu défini par le parent en le marquant de la classe line-transcluded
            // et on hide / show les elements .line-transcluded en fonction de valeur de edit_mode
            scope.$watch('edit_mode', function() {
                if (scope.edit_mode) {
                    element.find('.line-transcluded').hide();
                } else {
                    element.find('.line-transcluded').show();
                }
            });
            $transclude(scope, function(clone) {
                for (var i = 0; i < clone.length; i++) {
                    $(clone[i]).addClass('line-transcluded');
                }
                element.append(clone);
            });

            scope.getInput = function(input) { // input must be in scope.inputsOrder
                return element.find('input[name='+input+']')[0];
            }

            scope.getInputForEvent = function(event) {
                return event.delegateTarget;
            }

            scope.getPreviousInput = function(input) {
                var index = scope.inputsOrder.indexOf(input.name);
                if (index <= 0) { // gère les elements non trouves (index = -1)
                    // et le premier element qui n'a pas d'element précédent par définition
                    return false;
                }
                return scope.getInput(scope.inputsOrder[index - 1]);
            }
            scope.getNextInput = function(input) {
                var index = scope.inputsOrder.indexOf(input.name);
                if (index == -1 || index == scope.inputsOrder.length) {
                    return false;
                }
                return scope.getInput(scope.inputsOrder[index + 1]);
            }

            scope.focusInput = function(input) {
                $timeout(function() {
                    input.focus();
                }, 0);
            };
            scope.selectInput = function(input) {
                $timeout(function() {
                    input.focus();
                    input.select();
                }, 0);
            };

            scope.key = function(event) {
                if (event.keyCode == 27) { // Echap
                    scope.edit_mode = false;
                    scope.cancelCallback({control: scope.ctrl});
                } else if (event.keyCode == 37) { // Droite
                    var input = scope.getInputForEvent(event);

                    if (!input || !scope.cursorAtStart(input)) {
                        return;
                    }

                    var prev = scope.getPreviousInput(input);
                    if (prev) {
                        scope.selectInput(prev);
                    }
                } else if (event.keyCode == 39) { // Gauche
                    var input = scope.getInputForEvent(event);
                    if (!input || !scope.cursorAtEnd(input)) {
                        return;
                    }

                    var next = scope.getNextInput(input);
                    if (next) {
                        scope.selectInput(next);
                    }
                } else if (event.keyCode == 13 || (event.keyCode == 9 && !event.shiftKey)) { // Entrée ou Tab
                    var input = scope.getInputForEvent(event);
                    if (!input) {
                        return;
                    }

                    var next = scope.getNextInput(input);
                    if (next) {
                        scope.selectInput(next);
                    }
                }
            };

            scope.onFocus = function(event) {
                scope.waitingForFocus = false;
            };

            scope.onBlur = function(event) {
                scope.waitingForFocus = true;
                $timeout(function() {
                    // on regarde si un des inputs de la ligne
                    // a recu le focus pendant le timeout
                    // si non on peut appeler le callback donné par le controleur parent
                    if (scope.waitingForFocus) {
                        scope.edit_mode = false;
                        scope.blurCallback({control: scope.ctrl});
                    }
                }, 0.3);
                //$timeout(function() {
                    /*
                    for(var i = 0; i < scope.inputsOrder.length; i++) {
                        if ($(scope.getInput(scope.inputsOrder[i])).is(':focus')) {
                            return;
                        }
                    }
                    */
                    //scope.edit_mode = false;
                    //scope.blurCallback({control: scope.ctrl});
                 //   scope.$apply();
                //}, 0.1);
            };

            scope.cursorAtEnd = function(current, target) {
                return current.selectionStart == current.selectionEnd && current.selectionStart == current.value.length;
            };
            scope.cursorAtStart = function(current, target) {
                return current.selectionStart == current.selectionEnd && current.selectionStart == 0;
            };

            scope.uniteKey = function(event) {
                if (event.keyCode == 13 || (event.keyCode == 9 && !event.shiftKey)) {
                    scope.validateCallback({control: scope.ctrl});
                } else {
                    scope.key(event);
                }
            };

        }
    }
});