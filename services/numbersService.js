app.factory('numbersService', function($http) {
  var o = {};

  o.summary = $http.get('summary').then(function(response) {
    o.data = response.data;
    return o.data;
  });

  return o;
});