/// <reference path="../jquery.js" />
/// <reference path="../jquery.extensions.js" />
/// <reference path="../angular.min.js" /> 
var app = angular.module("HPModule", ['angular.filter']);
app.controller("HPController", function ($scope) {

    var PackageInfoModel = function (PackageInfoObject) {

        $scope.HealthPackageList = PackageInfoObject.HealthPackageList;
        $scope.Lang = localStorage.getItem("lang");
      
 
    }
    var jsonString = $("#hdnHealthPackage").val();
    var jsonObj = JSON.parse(jsonString);
    PageModel = new PackageInfoModel(jsonObj);
    $.ajax({
        url: 'Services.aspx/GetAllCommonService',
        data: "{'Lang':'" + localStorage.getItem("lang") + "'}",
        async: false,
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (data) {
            var jsonObj = JSON.parse(data.d);
            $scope.Serviceslink = jsonObj;

        }
    })
    $.ajax({
        url: 'Doctors.aspx/GetAllDoctors',
        async: false,
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (data) {
            var jsonObj = JSON.parse(data.d);
            $scope.Doctorslink = jsonObj;

        }
    })
    $scope.ViewPackage = function (PID) {
        localStorage.setItem("PID", PID);
        location.href = "Package.html";
    }

});
app.filter('spaceless', function () {
    return function (input) {
        if (input) {
            //return ((input.replace(/-/g, '~')).replace(/:/g, '_')).replace(/\s+/g, '-');
            return (((input.replace(/-/g, '~')).replace(/:/g, '_')).replace(/\s+/g, '-')).replace(/&/g, 'and');
        }
    }
});