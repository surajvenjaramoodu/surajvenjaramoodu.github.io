/// <reference path="../jquery-3.2.1.min.js" /> 
/// <reference path="../jquery.extensions.js" /> 
/// <reference path="../angular.min.js" /> 
var app = angular.module("ContactUsViewModule", ['angular.filter']);

app.controller("ContactUsViewController", function ($scope, $http) {

    $.ajax({
        url: 'WebServices.asmx/GetBranchDataAsJson',
        async: false,
        type: 'POST',
        data: "{'Lang':'" + localStorage.getItem("lang") + "'}",
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (data) {
            var jsonObj = JSON.parse(data.d);
            $scope.branches = jsonObj;
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

});

app.filter('spaceless', function () {
    return function (input) {
        if (input) {
            //return input.replace(/\s+/g, '-');
            return (((input.replace(/-/g, '~')).replace(/:/g, '_')).replace(/\s+/g, '-')).replace(/&/g, 'and');
        }
    }
});

$(function () {
    if (localStorage.getItem("lang") == 'ar') {
        $('.fields').attr('dir', 'rtl');
        $('#btnSubmit').attr('Text', 'Send');
        $('#btnSubmit').attr('dir', 'rtl');

        $('#txtName').attr('placeholder', 'الاسم')
        $('#CNT_txtEmail').attr('placeholder', 'البريد الالكتروني')
        $('#txtMessage').attr('placeholder', 'اكتب رسالتك')


    }
    else {
        $('.fields').removeAttr('dir');
        $('#btnSubmit').attr('Text', 'Send');
        $('#btnSubmit').attr('dir', 'rtl');
    }

})