budgetEditeurApp.directive('budgetEditeurLigneTrans', function(softCopy, $timeout) {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        template: '<div>'+
                      '<div class="budget-td budget-colonne-nom budget-edited-line" ng-if="edit_mode">'+
                          '<input name="nom" class="budget-edit-field" type="text" ng-model="buffer.nom" ng-keydown="key($event)" placeholder="Nom" ng-blur="onBlur($event)" ng-focus="onFocus(event)" ng-class="{invalid : errors.nom.length}"/>'+
                      '</div>'+
                      '<div class="budget-td budget-colonne-montant budget-edited-line" ng-if="edit_mode">'+
                          '<input name="qte" class="budget-edit-field budget-edited-qte" type="text" ng-model="buffer.qte" ng-keydown="key($event)" placeholder="Quantité" ng-blur="onBlur($event)" ng-focus="onFocus(event)" ng-class="{invalid : errors.qte.length}"/>'+
                          ' x '+
                          '<input name="unite" class="budget-edit-field budget-edited-montant" type="text" ng-model="buffer.unite" ng-keydown="uniteKey($event)" placeholder="Prix unitaire" ng-blur="onBlur($event)" ng-focus="onFocus(event)" ng-class="{invalid : errors.unite.length}"/>'+
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
            $scope.buffer = {};
            $scope.errors = {reset : function() {
                                this.nom = [];
                                this.qte = [];
                                this.unite = [];
                                return this;
                             }}.reset();

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
            this.reset = function(val) {
                softCopy(val, $scope.buffer, $scope.inputsOrder);
                softCopy(val, $scope.ligne, $scope.inputsOrder);
                $scope.errors.reset();
            };

            this.validateNom = function() {
                $scope.errors.nom = [];

                if ($scope.buffer.nom.length == 0) {
                    $scope.errors.nom.push("La ligne doit avoir un nom");
                }
            }
            this.validateQte = function() {
                $scope.errors.qte = [];

                if ($scope.buffer.qte.length == 0) {
                    $scope.errors.qte.push("La quantité ne peut pas être vide");
                } else {
                    if (angular.isNumber(!$scope.buffer.qte) && !$scope.buffer.qte.match(/\d+/)) {
                        $scope.errors.qte.push("La quantité doit être un entier");
                    } else if (parseInt($scope.buffer.qte) < 1) {
                        $scope.errors.qte.push("La quantité être supérieure à 0");
                    }
                }
            }
            this.validateUnite = function() {
                $scope.errors.unite = [];

                if ($scope.buffer.unite.length == 0) {
                    $scope.errors.unite.push("Le prix unitaire ne peut pas être vide");
                } else if (!angular.isNumber($scope.buffer.unite)) {
                    $scope.buffer.unite = $scope.buffer.unite.replace(',', '.');
                    // on parse avec une regexp parceque parseFloat donne des résulats faux
                    // par exemple parseFloat("8z4") == 8 et pas null !
                    if (!$scope.buffer.unite.match(/\d+(\.\d+)?/)) {
                        $scope.errors.unite.push("Le prix unitaire ne doit pas être ");
                    }
                }
            }
            this.validate = function(inputName) {
                if (inputName == undefined) {
                    this.validateNom();
                    this.validateQte();
                    this.validateUnite();
                } else if (inputName == 'nom') {
                    this.validateNom();
                } else if (inputName == 'qte') {
                    this.validateQte();
                } else if (inputName == 'unite') {
                    this.validateUnite();
                } else {
                    console.error("BudgetEditeurLigneEditeurTrans.validate : input name '" + inputName + "' in invalid");
                }
            }

            this.hasErrors = function() {
                return $scope.errors.nom.length > 0 || $scope.errors.qte.length > 0 || $scope.errors.unite.length > 0;
            }
        },
        link : function(scope, element, attrs, ctrl, $transclude) {
            if (attrs.control) {
                scope.ctrl = ctrl;
            }
            scope.hasErrors = ctrl.hasErrors;

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
                    scope.cancelCallback({control: ctrl});
                } else if (event.keyCode == 37) { // Droite
                    var input = scope.getInputForEvent(event);

                    if (!input || !scope.cursorAtStart(input)) {
                        return;
                    }

                    var prev = scope.getPreviousInput(input);
                    if (prev) {
                        ctrl.validate(input.name);
                        scope.selectInput(prev);
                    }
                } else if (event.keyCode == 39) { // Gauche
                    var input = scope.getInputForEvent(event);
                    if (!input || !scope.cursorAtEnd(input)) {
                        return;
                    }

                    var next = scope.getNextInput(input);
                    if (next) {
                        ctrl.validate(input.name);
                        scope.selectInput(next);
                    }
                } else if (event.keyCode == 13 || (event.keyCode == 9 && !event.shiftKey)) { // Entrée ou Tab
                    var input = scope.getInputForEvent(event);
                    if (!input) {
                        return;
                    }

                    var next = scope.getNextInput(input);
                    if (next) {
                        ctrl.validate(input.name);
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
                        ctrl.validate();
                        scope.blurCallback({control: ctrl});
                    }
                }, 0.3);
            };

            scope.cursorAtEnd = function(current, target) {
                return current.selectionStart == current.selectionEnd && current.selectionStart == current.value.length;
            };
            scope.cursorAtStart = function(current, target) {
                return current.selectionStart == current.selectionEnd && current.selectionStart == 0;
            };

            scope.uniteKey = function(event) {
                if (event.keyCode == 13 || (event.keyCode == 9 && !event.shiftKey)) {
                    // On regarde si ce que l'utilisateur a saisi est correct :
                    // nom non vide, quantité entier > 0
                    // montant decimal positif, séparateur virgule ou point
                    // TODO : gérer qte = 0 => suppression de la ligne
                    ctrl.validate();

                    if (ctrl.hasErrors()) {
                        // on empeche le Tab de se proprager sinon ça va passer à l'input
                        // suivant et le gars va pas comprendre pourquoi la ligne a pas été ajoutée
                        event.preventDefault();
                        event.stopPropagation();
                    } else {
                        scope.validateCallback({control: ctrl});
                    }
                } else {
                    scope.key(event);
                }
            };

        }
    }
});

budgetEditeurApp.directive('editableText', function($timeout) {
    return {
        restrict: 'EA',
        replace: true,
        template: '<input class="budget-edit-field" type="text" ng-model="buffer.t" ng-keypress="key($event)" ng-blur="onBlur($event)" ng-class="{invalid : errors.length > 0}"/>',
        scope: {
            content: '=',
            ctrl: '=control',
            cancelCallback: '&editCancel',
            validateCallback: '&editValidate',
            blurCallback: '&editBlur'
        },
        controller: function($scope, $element) {
            $scope.errors = [];

            this.edit = function() {
                $timeout(function() {
                    $element.focus();
                }, 0);
            };
            this.save = function() {
                $scope.content = $scope.buffer.t;
            };
            this.undoChanges = function() {
                $scope.buffer.t = $scope.content;
            };
            this.get = function() {
                return $scope.buffer.t;
            }
            this.validate = function() {
                $scope.errors = [];
                console.log($scope.buffer);
                if ($scope.buffer.t == '') {
                    console.log('validate fail');
                    $scope.errors.push('Ce champ ne peut pas être vide');
                    return false;
                }

                return true;
            }
        },
        link: function(scope, element, attrs, ctrl) {
            if (attrs.control) {
                scope.ctrl = ctrl;
            }

            scope.buffer = {t : scope.content};

            scope.key = function(event) {
                if (event.keyCode == 13) { // Entree
                    if (ctrl.validate()) {
                        scope.validateCallback({control: ctrl});
                        element.blur();
                    }
                }
                else if (event.keyCode == 27) { // Echap
                    scope.cancelCallback({control: ctrl});
                    element.blur();
                } else if (event.keyCode == 9) { // Tab
                    if (ctrl.validate()) {
                        scope.validateCallback({control: ctrl});
                        element.blur();
                    } else {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                }
            };

            scope.onBlur = function(event) {
                scope.blurCallback({control: ctrl});
            };

            scope.$watch('content', function() {
                scope.buffer.t = scope.content;
            });
        }
    };
});
