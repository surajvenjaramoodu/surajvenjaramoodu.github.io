/// <reference path="../jquery-3.2.1.min.js" /> 
/// <reference path="../jquery.extensions.js" /> 
/// <reference path="../angular.min.js" /> 

var app = angular.module("TestimonialViewModule", ['angular.filter']);
app.controller("TestimonialViewController", function ($scope) {

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

    $scope.GetAllTestimonial = function () {
        $.ajax({
            url: 'Testimonial.aspx/GetAllTestimonials',
            async: false,
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            data: "{'BranchID':'" + "" + "'}",
            dataType: "json",
            success: function (data) {
                var Response = JSON.parse(data.d);
                $scope.AllTestimonials = Response; 
            }
        })

    }

    $scope.GetAllTestimonial();
});