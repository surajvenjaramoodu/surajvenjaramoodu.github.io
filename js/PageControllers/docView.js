/// <reference path="../jquery.js" />
/// <reference path="../jquery.extensions.js" />
/// <reference path="../angular.min.js" /> 
var app = angular.module("DocViewModule", ['angular.filter']);

app.controller("DoctorViewController", function ($scope, $http, $timeout) {
    $scope.lang = localStorage.getItem("lang");
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

    /* $(document).ready(function () {
       var DoctorInfoModel = function (DoctorInfoObject) {

            var data = { d: DoctorInfoObject };
            var output = $('#DTemplate').parseTemplate(data)
            $('#DoctorContainer').append(output);


            $('.DeleteDoc').click(function (e) {
                var Docid = $(this).attr('Did');

                swal({
                    title: "Are you sure ?",
                    text: "Delete",
                    type: "warning",
                    showConfirmButton: true,
                    showCancelButton:true,
                    closeOnConfirm: true
                }, function () {
                    $.ajax({
                        type: "POST",
                        contentType: "application/json; charset=utf-8",
                        url: "Doctors_View.aspx/DeleteDoctor",
                        data: "{'ID':'" + Docid + "'}",
                        dataType: "json",
                        async: false,
                        html: true,
                        success: function (data) {
                            var pars = JSON.parse(data.d);
                            $("[MainId='" + Docid + "']").remove();
                            swal({
                                title: "Successfully Deleted",
                                text: "",
                                timer: 2000,
                                showConfirmButton: false,
                                type: "success",
                            });
                        }
                    });
                });

            });


        }



        LoadDepartments();



        function LoadDepartments() {
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "FixAppointment.aspx/LoadFilteredDepartment",
                data: "{'term':'" + "" + "'}",
                dataType: "json",
                async: false,
                html: true,
                success: function (data) {
                    var pars = JSON.parse(data.d);
                    $scope.Departments = pars;

                    $scope.$apply()
                }
            });

        }



        var jsonString = $("#hdnAllDocData").val();
        var jsonObj = JSON.parse(jsonString);
        PageModel = new DoctorInfoModel(jsonObj);


        //Gallery With Filters List
        if ($('.filter-list').length) {
            $('.filter-list').mixItUp({});
        }
       


    }); */



            $(document).ready(function () {

                var DoctorInfoModel = function (DoctorInfoObject) {

                    $scope.Doctors = DoctorInfoObject;
                    $scope.AllDoctors = DoctorInfoObject;
                    $scope.$apply();


                    $('.DeleteDoc').click(function (e) {
                        var Docid = $(this).attr('Did');

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
                                url: "Doctors_View.aspx/DeleteDoctor",
                                data: "{'ID':'" + Docid + "'}",
                                dataType: "json",
                                async: false,
                                html: true,
                                success: function (data) {
                                    var pars = JSON.parse(data.d);
                                    $("[MainId='" + Docid + "']").remove();
                                    swal({
                                        title: "Successfully Deleted",
                                        text: "",
                                        timer: 2000,
                                        showConfirmButton: false,
                                        type: "success",
                                    });
                                }
                            });
                        });

                    });

                }


                $scope.LoadDoctors = function (DepId, Locid) {
                    if (Locid == "" || Locid == undefined) {
                        if (DepId != '') {
                            var FilteredDoctors = $.grep($scope.AllDoctors, function (element, index) {
                                return element.Departmentid == DepId;
                            });
                            $scope.Doctors = FilteredDoctors;
                        }
                        else
                            $scope.Doctors = $scope.AllDoctors;
                    }
                    else {
                        var FilteredDoctorsByLoc = $.grep($scope.AllDoctors, function (element, index) {
                            return element.LocationId == Locid;
                        });

                        if (DepId != '') {
                            var FilteredDoctors = $.grep(FilteredDoctorsByLoc, function (element, index) {
                                return element.Departmentid == DepId;
                            });
                            $scope.Doctors = FilteredDoctors;
                        }
                        else
                            $scope.Doctors = FilteredDoctorsByLoc;
                    }


                }


                $scope.LoadDepartments = function (locid) {
                    var LocID = locid == null ? "" : locid;
                    $.ajax({
                        type: "POST",
                        contentType: "application/json; charset=utf-8",
                        url: "FixAppointment.aspx/LoadFilteredDepartment",
                        data: "{'term':'" + "" + "','LocId':'" + LocID + "'}",
                        dataType: "json",
                        async: false,
                        html: true,
                        success: function (data) {
                            var pars = JSON.parse(data.d);
                            $scope.Departments = pars;
                            $timeout(function () {
                                var FilteredDoctors = $.grep($scope.AllDoctors, function (element, index) {
                                    return element.LocationId == LocID;
                                });
                                if (LocID == "")
                                    $scope.Doctors = $scope.AllDoctors;
                                else
                                    $scope.Doctors = FilteredDoctors;
                            });
                        }
                    });
                }
                $scope.LoadDepartments("");
                LoadLocation();
                function LoadLocation() {
                    $.ajax({
                        url: "FixAppointment.aspx/LoadLocation",
                        async: false,
                        type: 'POST',
                        contentType: 'application/json; charset=utf-8',
                        data: "{'term':'" + "%" + "'}",
                        dataType: "json",
                        success: function (data) {
                            var Response = JSON.parse(data.d);
                            $scope.Locations = Response
                        }
                    })
                }

                function LoadFilteredDoctorsandDepartments(LocID) {
                    LoadDepartments(LocID);
                    var jsonObj = JSON.parse($("#hdnAllDocData").val());
                    var FilteredDoctors = $.grep(jsonObj, function (element, index) {
                        return element.LocationId == LocID;
                    });
                    $('#DoctorContainer').html('');
                    var data = { d: FilteredDoctors };
                    var output = $('#DTemplate').parseTemplate(data)
                    $('#DoctorContainer').append(output);
                    MixUp();
                }  
                var jsonString = $("#hdnAllDocData").val();
                var jsonObj = JSON.parse(jsonString);
                PageModel = new DoctorInfoModel(jsonObj);
                //Gallery With Filters List
                if ($('.filter-list').length) {
                    $('.filter-list').mixItUp({});
                }
            });
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
            $scope.ViewDocProfile = function (item) {
                localStorage.setItem("DocID", item.DoctorId);
                location.href = "DoctorProfile.html";
            }

}).filter('removeSpaces', [function () {
    return function (string) {
        if (!angular.isString(string)) {
            return string;
        }
        return string.replace(/[\s]/g, '');
    };
}])
app.filter('spaceless', function () {
    return function (input) {
        if (input) {
            //return input.replace(/\s+/g, '-');
            return (((input.replace(/-/g, '~')).replace(/:/g, '_')).replace(/\s+/g, '-')).replace(/&/g, 'and');
        }
    }
});

//function MakeAppointment() {
//    var PageObj = {
//        Date: $('.DatePkr_TxtBx').val(),
//        Time: $('#txtReqTime').val(),
//        DepartID: $('#hdnDepartID').val(),
//        DoctorID: $('#hdnDocID').val(),
//        DepartName: $('#txtDepart').val(),
//        DoctorName: $('#txtDoc').val(),
//        Location: $('#hdnLocID').val(),
//    };
//    localStorage.setItem("PageObj", JSON.stringify(PageObj));
//    location.href = "FixAppointment.aspx";
//}
