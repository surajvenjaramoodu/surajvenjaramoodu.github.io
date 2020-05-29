/// <reference path="../jquery.js" />
/// <reference path="../jquery.extensions.js" />
/// <reference path="../angular.min.js" /> 
var app = angular.module("NewsViewModule", ['angular.filter', 'ngSanitize']);
app.controller("NewsController", function ($scope) {


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

    var NewsEventInfoModel = function (NewsEventInfoObject) {
        $scope.NewsEventDetails = NewsEventInfoObject.NewsEvent;
    }
    var jsonString = $("#hdnNewsEvent").val();
    var jsonObj = JSON.parse(jsonString);
    PageModel = new NewsEventInfoModel(jsonObj);






    $scope.Delete = function (item) {    
        swal({
            title: "Are you sure ?",
            text: "Delete",
            type: "warning",
            showConfirmButton: true,
            showCancelButton: true,
            closeOnConfirm: true
        }, function () {
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: 'ViewNewsandEvents.aspx/DeleteEvent',
                data: "{'EventID':'" + item.EventID + "'}",
                dataType: "json",
                async: false,
                html: true,
                success: function (data) {
                    if (data.d >= 1) {
                        swal({
                            title: "Successfully Deleted",
                            text: "",
                            timer: 2000,
                            showConfirmButton: false,
                            type: "success",
                        });
                        $scope.$apply(function () {
                            $scope.NewsEventDetails.splice(
                                $scope.NewsEventDetails.indexOf(item), 1
                            );
                        });
                    }
                }
            });
        });
    };
});
app.filter('spaceless', function () {
    return function (input) {
        if (input) {
            //return input.replace(/\s+/g, '-');
            return (((input.replace(/-/g, '~')).replace(/:/g, '_')).replace(/\s+/g, '-')).replace(/&/g, 'and');
        }
    }
});
