angular.module('ngFormBuilderHelper')
  .constant('FormController', [
    '$scope',
    '$stateParams',
    '$state',
    'Formio',
    'FormioHelperConfig',
    'FormioAlerts',
    function (
      $scope,
      $stateParams,
      $state,
      Formio,
      FormioHelperConfig,
      FormioAlerts,
      $location
    ) {
      $scope.loading = true;
      $scope.hideComponents = [];
      $scope.submission = { data: {} };
      $scope.isCopy = !!($stateParams.components && $stateParams.components.length);
      $scope.formId = $stateParams.formId;
      $scope.formUrl = FormioHelperConfig.appUrl + '/form';
      $scope.appUrl = FormioHelperConfig.appUrl;
      var formTag = FormioHelperConfig.tag || 'common';
      $scope.showTransTitleIT = false;
      $scope.showTransTitleFR = false;
      $scope.transTitleIT = "";
      $scope.transTitleFR = "";
      $scope.formUrl += $stateParams.formId ? ('/' + $stateParams.formId) : '';
      $scope.formTags = [];

      $scope.form = {
        display: 'form',
        components: $stateParams.components || [],
        type: ($stateParams.formType ? $stateParams.formType : 'form'),
        publish: Boolean,
        relative: Boolean,
        lang: String,
        tags: [formTag],
        transTitle: {},
        modified: String,
        de: $stateParams.de || [],
        fr: $stateParams.fr || [],
        it: $stateParams.it || [],
      };

      $scope.publish = $scope.form.publish || false;
      $scope.diary = $scope.form.diary || false;
      $scope.relative = $scope.form.relative || false;

      $scope.form.lang = 'DE';
      $scope.form.modified = "2017-05-10T23:32:43.219Z";

      $scope.tags = [{ text: formTag }];
      $scope.formio = new Formio($scope.formUrl);
      $scope.formDisplays = [
        {
          name: 'form',
          title: 'Form'
        },
        {
          name: 'wizard',
          title: 'Wizard'
        }
      ];


      $scope.publicate = function (bool) {
        $scope.publish = bool;
        $scope.form.publish = bool;
        $scope.form.token = Formio.getToken();
        //  console.log(bool);
        return $scope.form.publish && $scope.publish;
      };
      $scope.isDiary = function (bool) {
        $scope.diary = bool;
        $scope.form.diary = bool;
        $scope.form.token = Formio.getToken();
        //  console.log(bool);
        return $scope.form.diary && $scope.diary;
      };
      $scope.isRelative = function (bool) {
        //  console.log(bool)
        $scope.relative = bool;
        $scope.form.relative = bool;
        console.log($scope.form.relative);
        $scope.form.token = Formio.getToken();
        return $scope.form.relative && $scope.relative;
      };

      $scope.addTag = function (tag) {
        //console.log(tag);
        if (!$scope.form) {
          return;
        }
        if (!$scope.form.tags) {
          $scope.form.tags = [];
        }
        $scope.form.tags = $scope.formTags;

        //  return $scope.formTags && $scope.form.tags;
      };

      $scope.removeTag = function (tag) {
        $scope.form.tags = [];
        /*if ($scope.form.tags && $scope.form.tags.length) {
            var tagIndex = $scope.form.tags.indexOf(tag.text);
            if (tagIndex !== -1) {

                $scope.form.tags.splice(tagIndex, 1);
            }
        }*/
      };


      $scope.copyEdit = function () {
        //console.log($scope.basePath);
        $state.go($scope.basePath + 'createForm', {
          components: _.cloneDeep($scope.form.components)
        });
      };

      $scope.copyOutsite = function (scope) {
        console.log(scope.form);
        $scope.form = scope.form;
        $scope.isCopy = !!(scope.form.components && scope.form.components.length);
        $scope.isCopying = true;
        $state.go(scope.basePath + 'createForm', {

          de: _.cloneDeep(scope.form.de),
          fr: _.cloneDeep(scope.form.fr),
          it: _.cloneDeep(scope.form.it),
          components: _.cloneDeep(scope.form.components)
        });


      };
      $scope.translateTo = function (lang) {
        if ($stateParams.formId) {
          $scope.formLoadPromise = $scope.formio.loadForm().then(function (form) {
            // $scope.form.tags.length = 0;
            // $scope.form.tags = [];
            switch (lang) {
              case 'DE':
                $scope.form.components = form.de;
                $scope.form.de = form.de;
                $scope.translating = false;
                break;
              case 'IT':

                $scope.form.lang = lang;
                $scope.form.components = form.de;
                $scope.form.it = form.de;
                $scope.translating = true;
                break;
              case 'FR':

                $scope.form.lang = lang;
                $scope.form.components = form.de;
                $scope.form.fr = form.de;
                $scope.translating = true;
                break;
            }
          }, FormioAlerts.onError.bind(FormioAlerts));
        } else {
          switch (lang) {
            case 'DE':
              console.log($scope.form)
              if (!$scope.form.de) {
                $scope.form.de = [];
              }
              $scope.form.lang = lang
              $scope.form.components = $scope.form.de;
              $scope.translating = false;
              $scope.showTransTitleIT = false;
              $scope.showTransTitleFR = false;

              break;
            case 'IT':
              console.log($scope.form)
              if (!$scope.form.it) {
                $scope.form.it = [];
              }
              $scope.form.lang = lang;
              $scope.form.components = $scope.form.de;
              $scope.translating = true;
              $scope.showTransTitleFR = false;
              $scope.showTransTitleIT = true;
              break;
            case 'FR':
              console.log($scope.form)
              if (!$scope.form.fr) {
                $scope.form.fr = [];
              }
              $scope.form.lang = lang
              $scope.form.components = $scope.form.de;
              $scope.translating = true;
              $scope.showTransTitleIT = false;
              $scope.showTransTitleFR = true;
              break;
          }
        }
      }

      var getForm = function (lang) {
        if ($stateParams.formId) {
          console.log($scope.form)
          $scope.formLoadPromise = $scope.formio.loadForm().then(function (form) {
            // $scope.form.tags.length = 0;
            // $scope.form.tags = [];

            switch (lang) {
              case 'DE':

                $scope.form.lang = lang
                $scope.form.components = form.de;
                $scope.form.de = form.de;
                $scope.translating = false;
                break;
              case 'IT':

                $scope.form.lang = lang;
                $scope.form.components = form.it;
                $scope.form.it = form.it;
                $scope.translating = true;
                if (form.transTitle.it) {
                  $scope.transTitleIT = form.transTitle.it;
                }
                $scope.showTransTitleFR = false;
                $scope.showTransTitleIT = true;
                break;
              case 'FR':

                $scope.form.lang = lang
                $scope.form.components = form.fr;
                $scope.form.fr = form.fr;
                $scope.translating = true;
                if (form.transTitle.fr) {
                  $scope.transTitleFR = form.transTitle.fr;
                }
                $scope.showTransTitleIT = false;
                $scope.showTransTitleFR = true;
                break;
              default:
              //  console.log(lang)
              //$scope.form.lang = lang
            }
          }, FormioAlerts.onError.bind(FormioAlerts));
        } else {
          switch (lang) {
            case 'DE':
              // console.log($scope.form)
              if (!$scope.form.de) {
                $scope.form.de = [];
              }
              $scope.form.lang = lang;
              if (!$scope.isCopying) {

                $scope.form.components = $scope.form.de;
                $scope.translating = false;
              }
              break;
            case 'IT':
              if (!$scope.form.it) {
                //  $scope.form.it = [];
              }
              $scope.form.lang = lang;
              if (!$scope.isCopying) {
                $scope.form.components = $scope.form.it;
              }
              $scope.translating = true;
              $scope.showTransTitleFR = false;
              $scope.showTransTitleIT = true;
              console.log($scope.form)
              break;
            case 'FR':
              if (!$scope.form.fr) {
                $scope.form.fr = [];
              }
              $scope.form.lang = lang;
              if (!$scope.isCopying) {
                $scope.form.components = $scope.form.fr;
              }
              $scope.translating = true;
              $scope.showTransTitleIT = false;
              $scope.showTransTitleFR = true;
              console.log($scope.form)
              break;
          }
        }
      }

      // Load the form if the id is provided.
      if ($stateParams.formId) {
        $scope.formLoadPromise = $scope.formio.loadForm().then(function (form) {
          form.display = form.display || 'form';
          $scope.form = form;
          var tags = form.tags || [];
          $scope.tags = tags.map(function (tag) { return { text: tag }; });
          switch (form.lang) {
            case 'DE':
              $scope.form.components = form.de;
              $scope.translating = false;
              break;
            case 'IT':
              $scope.form.components = form.it;
              $scope.form.it = form.it;
              $scope.translating = true;
              $scope.showTransTitleFR = false;
              $scope.showTransTitleIT = true;
              break;
            case 'FR':
              $scope.form.components = form.fr;
              $scope.form.fr = form.fr;
              $scope.translating = true;
              $scope.showTransTitleIT = false;
              $scope.showTransTitleFR = true;
              break;
          }

          $scope.relative = $scope.form.relative;
          $scope.formTags = $scope.form.tags;
          $scope.publish = $scope.form.publish;
          $scope.diary = $scope.form.diary;
          return form;
        }, FormioAlerts.onError.bind(FormioAlerts));
      }
      else {
        // Load the roles available.
        if (!$scope.form.submissionAccess) {
          Formio.makeStaticRequest(Formio.getProjectUrl() + '/role?limit=1000').then(function (roles) {
            if ($scope.form.submissionAccess) {
              return;
            }
            angular.forEach(roles, function (role) {
              if (!role.admin && !role.default) {
                // Add access to the form being created to allow for authenticated people to create their own.
                $scope.form.submissionAccess = [
                  {
                    type: 'create_own',
                    roles: [role._id]
                  },
                  {
                    type: 'read_own',
                    roles: [role._id]
                  },
                  {
                    type: 'update_own',
                    roles: [role._id]
                  },
                  {
                    type: 'delete_own',
                    roles: [role._id]
                  }
                ];
              }
            });
          });
        }
      }

      // Match name of form to title if not customized.
      $scope.titleChange = function (oldTitle) {
        if (!$scope.form.name || $scope.form.name === _.camelCase(oldTitle)) {
          $scope.form.name = _.camelCase($scope.form.title);
        }
        if ($scope.$parent && $scope.$parent.form) {
          $scope.$parent.form.title = $scope.form.title;
        }
      };

      $scope.transTitleChange = function (oldTitle) {
        if ($scope.form.lang == 'FR') {
          console.log(oldTitle)
          $scope.form.transTitle.fr = oldTitle;
          // $scope.transTitleFR = oldTitle;
        }
        if ($scope.form.lang == 'IT') {
          console.log(oldTitle)
          $scope.form.transTitle.it = oldTitle;
          //$scope.transTitleIT = oldTitle;
        }
      };

      // Update form tags
      $scope.updateFormTags = function () {
        $scope.form.tags = $scope.tags.map(function (tag) { return tag.text; });
      };

      // When display is updated
      $scope.$watch('form.display', function (display) {
        $scope.$broadcast('formDisplay', display);
      });

      // When a submission is made.
      $scope.$on('formSubmission', function (event, submission) {
        FormioAlerts.addAlert({
          type: 'success',
          message: 'New submission added!'
        });
        if (submission._id) {
          $state.go($scope.basePath + 'form.submission.view', { subId: submission._id });
        }
      });

      $scope.$on('pagination:error', function () {
        $scope.loading = false;
      });
      $scope.$on('pagination:loadPage', function () {
        $scope.loading = false;
      });

      // Called when the form is updated.
      $scope.$on('formUpdate', function (event, form) {
        $scope.form.components = form.components;
      });

      $scope.$on('formError', function (event, error) {
        //FormioAlerts.onError(error);
      });

      $scope.$watch('form.lang', function (lang) {
        console.log($scope.form);
        getForm(lang);
      });

      // Called when the form or resource is deleted.
      $scope.$on('delete', function () {
        var type = $scope.form.type === 'form' ? 'Form ' : 'Resource ';
        FormioAlerts.addAlert({
          type: 'success',
          message: type + $scope.form.name + ' was deleted.'
        });
        $state.go($scope.basePath + 'home');
      });

      $scope.$on('cancel', function () {
        $state.go($scope.basePath + 'form.view');
      });

      $scope.cancel = function () {
        //console.log('cancel');
        $location.path('/')
        // $state.go($scope.basePath + '/');
      }

      // Save a form.
      $scope.saveForm = function () {
        $scope.form.transTitle.de = $scope.form.title;

        console.log($scope.form)
        switch ($scope.form.lang) {
          case 'DE':
            console.log($scope.form)
            if (!$scope.form.de) {
              $scope.form.de = [];
            }
            $scope.form.de = $scope.form.components;
            break;
          case 'IT':
            if (!$scope.form.it) {
              $scope.form.it = [];
            }
            $scope.form.it = $scope.form.components;
            break;
          case 'FR':
            if (!$scope.form.fr) {
              $scope.form.fr = [];
            }
            $scope.form.fr = $scope.form.components;
            break;
        }
        $scope.formio.saveForm(angular.copy($scope.form)).then(function (form) {

          var numPages = $scope.form.numPages
          $scope.form = form;
          $scope.form.numPages = numPages;
          console.log($scope.form.relative)

          //$scope.$emit('formUpdate2',form);

          var method = $stateParams.formId ? 'updated' : 'created';
          FormioAlerts.addAlert({
            type: 'success',
            message: 'Successfully ' + method + ' form!'
          });
          $state.go($scope.basePath + 'form.edit', { formId: form._id });
        }, FormioAlerts.onError.bind(FormioAlerts));
      };
    }
  ]);
