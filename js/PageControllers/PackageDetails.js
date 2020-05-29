/// <reference path="../jquery.js" />
/// <reference path="../jquery.extensions.js" />
/// <reference path="../angular.min.js" /> 
var app = angular.module("HPDetailsModule", ['angular.filter', 'ngSanitize']);

app.controller("HPDetailsController", function ($scope, $http) {
    $scope.Lang = localStorage.getItem("lang");

    var PackageDetailsInfoModel = function (PackageDetailsInfoObject) {
        $scope.PackageName = PackageDetailsInfoObject.HealthPackage.PackageName;
        $scope.PackageDescription = PackageDetailsInfoObject.HealthPackage.PackageDescription;
        $scope.PackageDetails = PackageDetailsInfoObject.HealthPackage.PackageDetails;

        $scope.PackageName_ar = PackageDetailsInfoObject.HealthPackage.PackageName_ar;
        $scope.PackageDescription_ar = PackageDetailsInfoObject.HealthPackage.PackageDescription_ar;
        $scope.PackageDetails_ar = PackageDetailsInfoObject.HealthPackage.PackageDetails_ar;

        $scope.PackageDate = PackageDetailsInfoObject.HealthPackage.PackageDate;
        $scope.PackageStatus = PackageDetailsInfoObject.HealthPackage.PackageStatus;
        $scope.PackageId = PackageDetailsInfoObject.HealthPackage.PackageId;
        $scope.ServerPath = PackageDetailsInfoObject.ServerPath;
        //$('#hdetails').html($scope.PackageDetails);
    }
   
    $.ajax({
        url: GL_MainURL + '/Services.aspx/GetAllCommonService',
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
        url: GL_MainURL + '/Doctors.aspx/GetAllDoctors',
        async: false,
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (data) {
            var jsonObj = JSON.parse(data.d);
            $scope.Doctorslink = jsonObj;

        }
    })

    var url = window.location.href.split(/[\s/]+/);
    var HPName = (((url[url.length - 1]).replace(/-/g, ' ')).replace(/_/g, ':')).replace(/~/g, '-');
    $.ajax({
        url: GL_MainURL + '/WebServices.asmx/GetPackageDetails',
        data: "{'HPName':'" + HPName + "'}",
        async: false,
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (data) {
            var jsonObj = JSON.parse(data.d);
            PageModel = new PackageDetailsInfoModel(jsonObj);

        }
    })

    
    //var jsonString = $("#hdnPackage").val();
    //var jsonObj = JSON.parse(jsonString);
    //PageModel = new PackageDetailsInfoModel(jsonObj);
    $('.rrssb-whatsapp a').attr('href', 'whatsapp://send?text=' + $scope.ServerPath + 'Package/' + (($scope.PackageName.replace(/-/g, '~')).replace(/:/g, '_')).replace(/\s+/g, '-') + '')
});

app.filter('spaceless', function () {
    return function (input) {
        if (input) {
            //return ((input.replace(/-/g, '~')).replace(/:/g, '_')).replace(/\s+/g, '-');
            return (((input.replace(/-/g, '~')).replace(/:/g, '_')).replace(/\s+/g, '-')).replace(/&/g, 'and');
        }
    }
});