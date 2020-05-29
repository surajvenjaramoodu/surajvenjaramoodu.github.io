/// <reference path="../jquery.js" />
/// <reference path="../jquery.extensions.js" />
/// <reference path="../angular.min.js" /> 
var app = angular.module("DocPModule", ['angular.filter']);

app.controller("DocPController", function ($scope) {

    $scope.Lang = localStorage.getItem("lang");

    var DoctorInfoModel = function (DoctorInfoObject) {

        $scope.doctor = DoctorInfoObject.Doctor;

        $scope.Doctor = DoctorInfoObject.Doctor.DoctorName;
        $scope.Designation = DoctorInfoObject.Doctor.Designation;
        $scope.Schedule = DoctorInfoObject.Doctor.ScheduleDescription;
        $scope.DoctorId = DoctorInfoObject.Doctor.DoctorId;
        $scope.DoctorCode = DoctorInfoObject.Doctor.DoctorCode;
        $scope.Departmentid = DoctorInfoObject.Doctor.Departmentid;
        $scope.DocPhoto = DoctorInfoObject.Doctor.PhotoPath

        $scope.ServerPath = DoctorInfoObject.ServerPath
        $scope.ProfileDetails = angular.fromJson(DoctorInfoObject.listDets);

     }
   // var jsonString = $("#hdnAllDocData").val();
   // var jsonObj = JSON.parse(jsonString);
   // PageModel = new DoctorInfoModel(jsonObj);

    $.ajax({
        url: 'WebServices.asmx/GetDoctorProfileDetails',
        data: "{'DocID':'" + localStorage.getItem("DocID") + "'}",
        async: false,
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (data) {
            var jsonObj = JSON.parse(data.d);
            PageModel = new DoctorInfoModel(jsonObj);
            //$scope.Serviceslink = jsonObj;

        }
    })


    $('.rrssb-whatsapp a').attr('href', 'whatsapp://send?text=' + $scope.ServerPath + '/DoctorProfile.aspx?DocID=' + $scope.DoctorId + '')
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

    $scope.MakeAppointment = function (item) {
        var PageObj = {
            Date: '',
            Time: '',
            DepartID: item.Departmentid,
            DoctorID: item.DoctorCode,
            DepartName: item.DepartmentName,
            DoctorName: item.DoctorName,
            Location: item.Location
        };
        localStorage.setItem("PageObj", JSON.stringify(PageObj));
        location.href = "FixAppointment.html";
    }
});

app.filter('spaceless', function () {
    return function (input) {
        if (input) {
            //return input.replace(/\s+/g, '-');
            return (((input.replace(/-/g, '~')).replace(/:/g, '_')).replace(/\s+/g, '-')).replace(/&/g, 'and');
        }
    }
});