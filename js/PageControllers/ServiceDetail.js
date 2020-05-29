/// <reference path="../jquery.js" />
/// <reference path="../jquery.extensions.js" />
/// <reference path="../angular.min.js" /> 
var app = angular.module("ServiceDetailsModule", ['angular.filter', 'ngSanitize', 'updateMeta']);

app.controller("ServiceDetailsController", function ($scope) {
    $scope.lang = localStorage.getItem("lang");


    var ServiceDetailsInfoModel = function (ServiceDetailsInfoObject) {
        $scope.ServiceID = ServiceDetailsInfoObject.Service.ServiceID;

        $scope.ServiceMetaTitle = ServiceDetailsInfoObject.Service.ServiceMetaName;
        $scope.ServiceMetaDescription = ServiceDetailsInfoObject.Service.ServiceMetaDescription;


        $scope.ServiceLink = ServiceDetailsInfoObject.Service.ServiceLink;

        //$scope.ServiceLinkURL = GL_MainURL + '/Services/' + ServiceDetailsInfoObject.Service.ServiceLink.replace(/\s+/g, '-');

        //$scope.ServiceImageURL = GL_MainURL + '/Services/' + ServiceDetailsInfoObject.Service.ServiceDescImageURL;



        $scope.ServiceName = ServiceDetailsInfoObject.Service.ServiceName;
        $scope.ServiceDescription = ServiceDetailsInfoObject.Service.ServiceDescription;
        $scope.ServiceDescriptionDetail = ServiceDetailsInfoObject.Service.ServiceDescriptionDetail;


        $scope.ServiceName_ar = ServiceDetailsInfoObject.Service.ServiceName_Ar;
        $scope.ServiceDescription_ar = ServiceDetailsInfoObject.Service.ServiceDescription_Ar;
        $scope.ServiceDescriptionDetail_ar = ServiceDetailsInfoObject.Service.ServiceDescriptionDetail_Ar;


        $scope.ServiceDate = ServiceDetailsInfoObject.Service.ServiceDate;
        $scope.ServiceDescImageURL = ServiceDetailsInfoObject.Service.ServiceDescImageURL;
        $scope.ServiceIconImageURL = ServiceDetailsInfoObject.Service.ServiceIconImageURL;
        $scope.ServiceStatus = ServiceDetailsInfoObject.Service.ServiceStatus;
        $scope.Speciality = ServiceDetailsInfoObject.Service.Speciality;
        $scope.Doctors = ServiceDetailsInfoObject.Doctors;

        $scope.ServiceAltTag1 = ServiceDetailsInfoObject.Service.ServiceAltTag1;
        $scope.ServiceAltTag2 = ServiceDetailsInfoObject.Service.ServiceAltTag2;

    }

    // var url = ;     // Returns full URL
    //var url = window.location.href.split(/[\s/]+/);
    //var SName = (url[url.length - 1]).replace(/-/g, " ");
    var SName = $('#ServiceName').attr('text')
    $.ajax({
        url: GL_MainURL + '/WebServices.asmx/GetServiceDetailsAsJson',
        data: "{'SName':'" + SName + "','Lang':'" + localStorage.getItem("lang") + "'}",
        async: false,
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (data) {
            var jsonObj = JSON.parse(data.d);
            PageModel = new ServiceDetailsInfoModel(jsonObj);

        }
    })


    //var jsonString = $("#hdnService").val();
    //var jsonObj = JSON.parse(jsonString);
    //PageModel = new ServiceDetailsInfoModel(jsonObj);

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
        location.href = "../FixAppointment.html";
    }
    $scope.ViewDocProfile = function (item) {
        localStorage.setItem("DocID", item.DoctorId);
        location.href = "../DoctorProfile.html";
    }

});
app.filter('spaceless', function () {
    return function (input) {
        if (input) {
            return input.replace(/\s+/g, '-');
        }
    }
});