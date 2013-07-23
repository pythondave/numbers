//*** Note: not yet built to cope with server requests which fail for some reason (e.g. internet disconnection)

var app = angular.module('app', ['ui.bootstrap', 'ngMockE2E', 'ngResource']);

app.controller('MainCtrl', ['$scope', '$httpBackend', 'listService', 'numbersService', function($scope, $httpBackend, listService, numbersService) {
  numbersService.summary.then(function() {
    $scope.summary = numbersService.data;
    $scope.setNumberOfLargeNumbers(0);
  });

  var percentColors = [ //TODO: move to service
      { pct: 0.0, color: { r: 0xff, g: 0x00, b: 0 } },
      { pct: 0.9, color: { r: 0xff, g: 0xff, b: 0 } },
      { pct: 0.999, color: { r: 0x99, g: 0xff, b: 0 } },
      { pct: 1.0, color: { r: 0x00, g: 0xff, b: 0 } } ];

  var getColorForPercentage = function(pct) { //TODO: move to service
      for (var i = 0; i < percentColors.length; i++) {
          if (pct <= percentColors[i].pct) {
              var lower = percentColors[i - 1] || { pct: 0.1, color: { r: 0x0, g: 0x00, b: 0 } };
              var upper = percentColors[i];
              var range = upper.pct - lower.pct;
              var rangePct = (pct - lower.pct) / range;
              var pctLower = 1 - rangePct;
              var pctUpper = rangePct;
              var color = {
                  r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
                  g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
                  b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
              };
              return "#" + ('0'+color.r.toString(16)).slice(-2) + ('0'+color.g.toString(16)).slice(-2) + ('0'+color.b.toString(16)).slice(-2);
          }
      }
  };

  $scope.setNumberOfLargeNumbers = function(n) {
    $scope.numberOfLargeNumbers = n;
    $scope.selectionType = numbersService.data.numberOfLargeNumbers[$scope.numberOfLargeNumbers];
  };

  $scope.getColor = function(targetNumber) { //TODO: refactor to include a 'rescale' function //is 0.28 the min?
    var x = $scope.selectionType.targets[targetNumber-100].numberOfPossibilities / $scope.selectionType.numberOfPossibilities;
    return getColorForPercentage((x-0.28)/0.72);
  };

  //TODO: add different layouts
  $scope.rows = new Array(100);
  $scope.columns = new Array(9);

  $scope.navBarUrl = "partials/navBar.html";
  $scope.leftSectionUrl = "partials/leftSection.html";
  $scope.mainUrl = "partials/summary.html";

}]);
