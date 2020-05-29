/// <reference path="../jquery-3.2.1.min.js" /> 
/// <reference path="../jquery.extensions.js" /> 
/// <reference path="../angular.min.js" /> 

var app = angular.module("ServiceViewModule", ['angular.filter']);


app.controller("ServiceViewController", function ($scope, $http) {
    //var jsonString = $("#hdnAllServiceData").val();
    //var jsonObj = JSON.parse(jsonString);



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
            $scope.AllServices = jsonObj;

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

    $scope.Delete = function (item) {
        swal({
            title: "Are you sure to Delete?",
            text: "Delete",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, Delete!",
            closeOnConfirm: false
        }, function () {


            var index = $scope.AllServices.indexOf(item);
            $scope.AllServices.splice(index, 1);
            $scope.$apply()




            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: 'ServiceEdit.aspx/Delete',
                data: "{'ID':'" + item.ServiceID + "'}",
                dataType: "json",
                async: false,
                html: true,
                success: function (data) {


                }
            });


            sweetAlert({
                title: "Successfully Deleted",
                text: "Your Response has been send Successfully!",
                timer: 1000,
                type: "success",
                showConfirmButton: false
            });

        }); 

    }


});

app.filter('spaceless', function () {
    return function (input) {
        if (input) {
            // return input.replace(/\s+/g, '-');
            return (((input.replace(/-/g, '~')).replace(/:/g, '_')).replace(/\s+/g, '-')).replace(/&/g, 'and');
        }
    }
});