budgetEditeurApp.directive('budgetEditeurLigneTrans', function(softCopy) {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        template: '<div class="budget-edited-line">'+
                      '<div class="budget-td budget-colonne-nom" ng-if="edit_mode">'+
                          '<input name="nom" class="budget-edit-field" type="text" ng-model="buffer.nom" ng-keypress="key($event)" placeholder="Nom" ng-blur="onBlur($event)"/>'+
                      '</div>'+
                      '<div class="budget-td budget-colonne-montant" ng-if="edit_mode">'+
                          '<input name="qte" class="budget-edit-field" type="text" ng-model="buffer.qte" ng-keypress="key($event)" placeholder="Quantité" ng-blur="onBlur($event)"/>'+
                          ' x '+
                          '<input name="unite" class="budget-edit-field" type="text" ng-model="buffer.unite" ng-keypress="uniteKey($event)" placeholder="Prix unitaire" ng-blur="onBlur($event)"/>'+
                      '</div>'+
                  '</div>',
        scope: {
            ligne: '=',
            cancelCallback: '&editCancel',
            validateCallback: '&editValidate',
            blurCallback: '&editBlur'
        },
        link : function(scope, element, attrs, categorieCtrl, $transclude) {
            scope.edit_mode = false;
            scope.inputsOrder = ['nom', 'qte', 'unite'];

            scope.buffer = {};
            scope.$watch('ligne', function() {
                softCopy(scope.ligne, scope.buffer, scope.inputsOrder);
            }, true);

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

            scope.edit = function(inputName, start, end) {
                scope.edit_mode = true;
                setTimeout(function() {
                    var input = scope.getInput(inputName);
                    input.focus();
                    if (start != undefined && end != undefined) {
                        input.selectionStart = start;
                        input.selectionEnd = end;
                    } else {
                        input.selectionStart = input.value.length;
                        input.selectionEnd = input.value.length;
                    }
                }, 0);
            };

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
                setTimeout(function() {
                    input.focus();
                }, 0);
            };
            scope.selectInput = function(input) {
                setTimeout(function() {
                    input.focus();
                    input.select();
                }, 0);
            };

            scope.key = function(event) {
                if (event.keyCode == 27) { // Echap
                    scope.edit_mode = false;
                    scope.cancelCallback({api: scope.api});
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

            scope.onBlur = function(event) {
                setTimeout(function() {
                    for(var i = 0; i < scope.inputsOrder.length; i++) {
                        if ($(scope.getInput(scope.inputsOrder[i])).is(':focus')) {
                            return;
                        }
                    }

                    scope.edit_mode = false;
                    scope.blurCallback({api: scope.api});
                    scope.$apply();
                }, 0.1);
            };

            scope.cursorAtEnd = function(current, target) {
                return current.selectionStart == current.selectionEnd && current.selectionStart == current.value.length;
            };
            scope.cursorAtStart = function(current, target) {
                return current.selectionStart == current.selectionEnd && current.selectionStart == 0;
            };

            scope.uniteKey = function(event) {
                if (event.keyCode == 13 || (event.keyCode == 9 && !event.shiftKey)) {
                    scope.validateCallback({api: scope.api});
                } else {
                    scope.key(event);
                }
            };


            // API client
            scope.api = {
                save: function() {
                    softCopy(scope.buffer, scope.ligne, scope.inputsOrder);
                },
                stop: function() {
                    scope.edit_mode = false;
                },
                get: function() {
                    return angular.copy(scope.buffer);
                },
                undoChanges: function() {
                    softCopy(scope.ligne, scope.buffer, scope.inputsOrder);
                },
                set: function(val) {
                    softCopy(val, scope.buffer, scope.inputsOrder);
                    softCopy(val, scope.ligne, scope.inputsOrder);
                },
                edit: scope.edit
            }
        }
    }
});