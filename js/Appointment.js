/// <reference path="angular.min.js" />
/// <reference path="jquery-1.12.4.min.js" /> 
/// <reference path="moment.js" />

var app = angular.module("AppointmentModule", []);
app.controller("AppointmentController", function ($scope) {
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

    $scope.Submit = function () {


        if (validatePage()) {
            var appObj = {
                AppointmentDate: $('#txtAppointmentDate').val(),
                Salutation: $("#drpSalutation option:selected").val() != '' ? $("#drpSalutation option:selected").text() : '',
                Name: $('#txtName').val(),
                Gender: $('#drpGender option:selected').val(),
                DateofBirth: $("#txtDOB").val(),
                Email: $("#APP_txtEmail").val(),
                Mobile: $("#txtMobile").val(),
                Country: $("#drpNationality option:selected").val() != '' ? $scope.selectedCountry : '',
                CountryName: $("#drpNationality option:selected").text() != '' ? $("#drpNationality option:selected").text() : '',
                Department: $scope.selectedDepart,
                DepartmentName: $("#txtDepart").val(),
                Doctor: $scope.selectedDoc,
                BranchID: '',
                RequestedTime: $("#txtReqTime").val(),
                FileNo: $("#txtFileNo").val(),
                Remarks: $("#txtRemarks").val(),
                AppointmentID: 0,
                DoctorName: $scope.selectedDocName,
                BranchName: $scope.selectedLocName
            };

            $.ajax({
                url: 'FixAppointment.aspx/RequestAppointment',
                async: false,
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                data: "{'PageObj':'" + JSON.stringify(appObj) + "'}",
                dataType: "json",
                success: function (data) {
                    if (data.d != 0) {

                        swal({
                            title: "Appointment Requested",
                            text: "Your appointment has been requested successfully",
                            timer: 2000,
                            showConfirmButton: false,
                            type: "success",
                        });
                        sendMail(appObj);

                        $scope.Reset();
                    }
                    else
                        swal({
                            title: "Invalid Appointment Time",
                            text: "Doctor is not available for your requested time",
                            timer: 3000,
                            showConfirmButton: false,
                            type: "warning"
                        });

                }
            })


        }


    };

    $scope.Reset = function () {
        //localStorage.clear();
        localStorage.removeItem('PageObj');
        $("#txtAppointmentDate").val('')
        $("#drpSalutation").val("")
        $("#txtName").val('')
        $("#drpGender").val("")

        $('#divSchedule').hide();

        $("#APP_txtEmail").val('')
        $("#drpNationality").val("")
        $("#txtLoc").val('')
        $("#txtDepart").val('')
        $("#txtReqTime").val("")
        $("#txtDoc").val("")

        $("#txtFileNo").val('')
        $("#txtRemarks").val("")

        var SelCountryTitle = $('.selected-flag').attr("title");
        var SplitCountryCode = SelCountryTitle.split(':');
        var CountryCode = (SplitCountryCode[1]).replace(" ", "");
        $("#txtMobile").val(CountryCode);
        $(".form-control-feedback").removeClass("glyphicon glyphicon-ok");
        $(".form-control-feedback").attr("style", "display: none;");
        $(".help-block").attr("style", "display: none;");

        $('#txtAppointmentDate,#txtReqTime,#txtFileNo,#txtLoc,#txtDepart,#txtDoc,#txtName,#APP_txtEmail,#txtRemarks').removeClass("TextBoxValidate").addClass("TextBox")
        $('#drpGender,#drpSalutation,#drpNationality').removeClass('SelectBoxValidate').addClass('SelectBox')

    };
    function sendMail(appObj) {
        $.ajax({
            url: 'FixAppointment.aspx/SendMail',
            async: true,
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            data: "{'AppInfo':'" + JSON.stringify(appObj) + "'}",
            dataType: "json",
            success: function (data) {

            }
        })
    }


    Datefunction();
    LoadCountry();

    //Autocomplete()
    LoadLocation();
    function LoadCountry() {
        $scope.selectedCountry = null;
        $.ajax({
            url: 'FixAppointment.aspx/GetAllCountries',
            async: false,
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            data: "{}",
            dataType: "json",
            success: function (data) {
                var parsedData = JSON.parse(data.d);
                var JsonStr = JSON.stringify(parsedData)
                $scope.Countries = parsedData;
            }
        }).fail(
                 function (xhr, textStatus, err) {
                     alert(err);
                 });


        $scope.form = { type: $scope.Countries[0].Name };

    }
    function LoadLocation() {
        $("#txtLoc").autocomplete({
            source: function (request, response) {
                $.ajax({
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    url: "FixAppointment.aspx/LoadLocation",
                    data: "{'term':'" + $('#txtLoc').val().trim().replace(/[\\\"]/g, '') + "'}",
                    dataType: "json",
                    async: true,
                    html: true,
                    success: function (data) {
                        var pars = JSON.parse(data.d);
                        response($.map(pars, function (name, val) {
                            return {
                                label: name.Name,
                                value: name.LocID
                            }
                        }));
                    },
                    failure: function (response) {
                    },
                });
            },
                change: function (event, ui) {
                    if (ui.item == null) {
                        $("#txtLoc").val('');
                        $("#txtLoc").focus();
                        $("#txtDepart").autocomplete({ source: [] });
                        $("#txtDepart").val('');
                        $("#txtDoc").autocomplete({ source: [] });
                        $("#txtDoc").val('');
                        $('#divSchedule').hide();
                        $scope.selectedDoc = "";
                        $scope.selectedDepart = "";
                    }
                },
            select: function (event, ui) {
                var id = ui.item.value;
                var name = ui.item.label;
                $("#txtLoc").val(name);
                $("#txtDepart").val('');
                $("#txtDoc").val('');
                $("#txtDoc").autocomplete({ source: [] });
                Autocomplete(id);
                $('#hdnLocID').val(id);
                $scope.selectedLocName = name;

                return false;
            }, focus: function (event, ui) {
                event.preventDefault();
                $("#txtLoc").val(ui.item.label);
            },
            minLength: 1
        }).focus(function () { $(this).val(''); $(this).autocomplete("search", "%"); })
                    .data("uiAutocomplete")._renderItem = function (ul, item) {
                        return $("<li>")
                        .data("item.autocomplete", item)
                        .append("<a><span>" + item.label + "</span></a>")
                        .appendTo(ul).css("position", "static");
                    };
    }


    function Autocomplete(LocID) {



        $("#txtDepart").autocomplete({
            source: function (request, response) {
                $.ajax({
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    url: "FixAppointment.aspx/LoadDepartmentforappointment",
                    data: "{'term':'" + $('#txtDepart').val().trim().replace(/[\\\"]/g, '') + "','LocID':'" + LocID + "'}",
                    dataType: "json",
                    async: true,
                    html: true,
                    success: function (data) {
                        var pars = JSON.parse(data.d);
                        response($.map(pars, function (name, val) {
                            return {
                                label: name.Name,
                                value: name.ID
                            }
                        }));
                    },
                    failure: function (response) {
                    },
                });
            },
            change: function (event, ui) {
                if (ui.item == null) {
                    $("#txtDepart").val('');
                    $("#txtDepart").focus();
                    $("#txtDoc").autocomplete({ source: [] });
                    $("#txtDoc").val('');

                    $('#divSchedule').hide();
                    $scope.selectedDoc = "";
                    $scope.selectedDepart = "";
                }
            },
            select: function (event, ui) {
                var id = ui.item.value;
                var name = ui.item.label;
                $("#txtDepart").val(name);
                $("#txtDoc").val('');
                $('#divSchedule').hide();
                LoadDoctorsByDepartID(id, LocID);
                return false;
            }, focus: function (event, ui) {
                event.preventDefault();
                $("#txtDepart").val(ui.item.label);
            },
            minLength: 1
        })
                .focus(function () { $(this).val(''); $(this).autocomplete("search", "%"); })
                            .data("uiAutocomplete")._renderItem = function (ul, item) {
                                return $("<li>")
                                .data("item.autocomplete", item)
                               .append("<a><span>" + item.label + "</span></a>")
                                .appendTo(ul).css("position", "static");
                            };

    }

    function LoadDoctorsByDepartID(deptID, LocID) {


        $("#txtDoc").autocomplete({
            source: function (request, response) {
                $.ajax({
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    url: "FixAppointment.aspx/LoadDoctorsByDepartID",
                    data: "{'DeptID':'" + deptID + "','term':'" + $('#txtDoc').val().trim().replace(/[\\\"]/g, '') + "','LocID':'" + LocID + "'}",
                    dataType: "json",
                    async: true,
                    html: true,
                    success: function (data) {
                        var pars = JSON.parse(data.d);
                        response($.map(pars, function (name, val) {
                            return {
                                label: name.Name,
                                value: name.ID
                            }
                        }));
                    },
                    failure: function (response) {
                    },
                });
            },
            change: function (event, ui) {
                if (ui.item == null) {
                    $scope.selectedDoc = "";
                    $("#txtDoc").val('');
                    $('#divSchedule').hide();
                    $("#txtDoc").focus();
                }
            },
            select: function (event, ui) {
                var id = ui.item.value;
                var name = ui.item.label;
                $("#txtDoc").val(name);
                $scope.selectedDepart = deptID;
                $scope.selectedDoc = id;
                $scope.selectedDocName = name;


                LoadScheduleOfDoctor($scope.selectedDoc);

                return false;

            }
            , focus: function (event, ui) {
                event.preventDefault();
                $("#txtDoc").val(ui.item.label);
            },
            minLength: 1
        })
                     .focus(function () { $(this).val(''); $(this).autocomplete("search", "%"); })
                                 .data("uiAutocomplete")._renderItem = function (ul, item) {
                                     return $("<li>")
                                     .data("item.autocomplete", item)
                                    .append("<a><span>" + item.label + "</span></a>")
                                     .appendTo(ul).css("position", "static");
                                 };


    }


    //--------------------  QuerysString Area-----------------------------
    var DocID = getParameterByName('DocID');
    var DepID = getParameterByName('DepID');

    if (DocID && DepID != null) {
        //localStorage.clear();
        localStorage.removeItem('PageObj');
        SetDoctorandDepartment(DocID, DepID);
        LoadScheduleOfDoctor(DocID);
    }


    function SetDoctorandDepartment(DocID, DepID) {
        $.ajax({
            url: 'FixAppointment.aspx/GetDoctorandDepartment',
            async: false,
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            data: "{'DocID':'" + DocID + "','DepID':'" + DepID + "'}",
            dataType: "json",
            success: function (data) {
                var Str = data.d.split('|');

                $('#txtDepart').val(Str[1]);
                $('#txtDoc').val(Str[0]);
                $scope.selectedDepart = DepID
                $scope.selectedDoc = Str[2]
                $scope.selectedDocName = $('#txtDoc').val();
                LoadDoctorsByDepartID(DepID);
            }
        })
    }


    function getParameterByName(name, url) {
        if (!url) {
            url = window.location.href;
        }
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    //--------------------  QuerysString Area-----------------------------

    //--------------------  LocalStorage Area-----------------------------


    var PageItem = JSON.parse(localStorage.getItem("PageObj"));

    if (PageItem != null) {
        $('#txtLoc').val(PageItem.Location);
        $('#txtDepart').val(PageItem.DepartName);
        $('#txtDoc').val(PageItem.DoctorName);
        $scope.selectedDepart = PageItem.DepartID
        $scope.selectedDoc = PageItem.DoctorID
        LoadDoctorsByDepartID(PageItem.DepartID);
        $scope.selectedDocName = PageItem.DoctorName;
        $('#txtAppointmentDate').val(PageItem.Date);
        $('#txtReqTime').val(PageItem.Time)
        LoadScheduleOfDoctor($scope.selectedDoc)
        if (PageItem.DepartName != "") {
            if (PageItem.DoctorName === "") {
                LoadDoctorsByDepartID(PageItem.DepartID);
            }
        }

    }




    //--------------------  LocalStorage Area-----------------------------



    function LoadScheduleOfDoctor(DocCode) {
        $.ajax({
            url: 'FixAppointment.aspx/LoadScheduleOfDoctor',
            async: false,
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            data: "{'Docid':'" + DocCode + "'}",
            dataType: "json",
            success: function (data) {

                if (data.d != null) {
                    $("#divSchedule").show();
                    data.d !== '' ? $("#spnSchedule").html(data.d) : $("#divSchedule").hide();
                }
                else
                    location.href = "Login.html";
            }
        })

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
$.fn.datepicker.noConflict = function () {
    $.fn.datepicker = old;
    return this;
};


function Datefunction() {
    $('.DatePkr_TxtBx').datepicker({
        format: "dd-M-yyyy",
        autoclose: true,
        startDate: 'today'
    });




}



function validatePage() {
    $("#DivErrorMsg").css('display', 'block')
    var ApDate = isNotEmpty("txtAppointmentDate", "TextBox", "", "TextBoxValidate");
    var Sal = isSelected("drpSalutation", "", "DivErrorMsg", "", "SelectBox", "SelectBoxValidate");
    var name = isNotEmpty("txtName", "TextBox", "", "TextBoxValidate");
    var Gender = isSelected("drpGender", "", "DivErrorMsg", "", "SelectBox", "SelectBoxValidate");
    var Email = isNotEmpty("APP_txtEmail", "TextBox", "", "TextBoxValidate");
    $('#contactForm').formValidation('revalidateField', 'phoneNumber');
    var nation = isSelected("drpNationality", "", "DivErrorMsg", "", "SelectBox", "SelectBoxValidate");
    var Dep = isNotEmpty("txtDepart", "TextBox", "", "TextBoxValidate");
    var Doc = isNotEmpty("txtDoc", "TextBox", "", "TextBoxValidate");
    var ReqTime = isNotEmpty("txtReqTime", "TextBox", "", "TextBoxValidate");
    //  var FileNo = isNotEmpty("txtFileNo", "TextBox", "", "TextBoxValidate");
    // var Remarks = isNotEmpty("txtRemarks", "TextBox", "", "TextBoxValidate");


    if (!(name && Gender && Email && nation && Dep && Doc && ReqTime)) {
        $("#DivErrorMsg").addClass("Form_ErrorMessge")
        $("#DivErrorMsg").append("Please fill the mandatory fields!")
        $("#DivErrorMsg").css("Form_ErrorMessge");
    }
    return (name && Gender && Email && nation && Dep && Doc && ReqTime &&
            isSelected("drpNationality", "", "DivErrorMsg", "0", "SelectBox", "SelectBoxValidate") &&
            isValidEmail("APP_txtEmail", "Please enter valid Email id!", "DivErrorMsg", "TextBox", "TextBoxValidate")
        );

}



//-----------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------From here begins validation------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------

function isNotEmpty(inputId, cssClass, errorMsg, cssErrorClass) {
    var inputElement = document.getElementById(inputId);
    var errorElement = null;
    var inputValue = inputElement.value.trim();
    if (inputId == 'txtContactKsa') {
        var isValid = (inputValue.length > 4);
    }
    else {
        var isValid = (inputValue.length !== 0);
    }// boolean
    showMessage(isValid, inputElement, cssClass, errorMsg, errorElement, cssErrorClass);
    return isValid;
}

function isEmptyText(inputId, cssClass, errorMsg, errorElement, cssErrorClass) {
    var inputElement = document.getElementById(inputId);
    var errorElement = document.getElementById(errorElement);
    var inputValue = inputElement.value.trim();
    var isValid = (inputValue.length !== 0);  // boolean
    showMessage(isValid, inputElement, cssClass, errorMsg, errorElement, cssErrorClass);
    return isValid;
}





function showMessage(isValid, inputElement, cssClass, errorMsg, errorElement, cssErrorClass) {
    if (!isValid) {
        if (errorElement !== null) {
            errorElement.className = "Form_ErrorMessge";
            errorElement.innerHTML = errorMsg;
            if (errorMsg == "")
                errorElement.className = "Form_ErrorDefault";
        }
        if (inputElement !== null) {
            inputElement.className = cssErrorClass;
            //inputElement.focus();
        }
    } else {
        if (errorElement !== null) {
            errorElement.innerHTML = "";
            errorElement.className = "Form_ErrorDefault";
        }
        if (inputElement !== null) {
            inputElement.className = cssClass;
        }
    }
}

function isNumeric(inputId, errorMsg, errorElement, CssClass, cssErrorClass) {
    var inputElement = document.getElementById(inputId);
    var errorElement = document.getElementById(errorElement);
    var inputValue = inputElement.value.trim();
    //if (inputValue !== null && inputValue !== "") {
    var isValid = (inputValue.match(/^[0-9]+$/));
    if (isValid == null) {
        isValid = false;
    }

    if (inputValue == "")
        errorMsg = "Please fill the mandatory fields!"; // for mandatory msg
    showMessage(isValid, inputElement, CssClass, errorMsg, errorElement, cssErrorClass);
    return isValid;
    //}
    //else
    //    return false;
}

function isAlphabetic(inputId, errorMsg, errorElement, cssClass, cssErrorClass) {
    var inputElement = document.getElementById(inputId);
    var errorElement = document.getElementById(errorElement);
    var inputValue = inputElement.value.trim();
    //if (inputValue !== null && inputValue !== "") {
    var isValid = inputValue.match(/^[a-zA-Z ]+$/);
    if (isValid == null) {
        isValid = false;
    }

    if (inputValue == "")
        errorMsg = "Please fill the mandatory fields!";  // for mandatory msg
    showMessage(isValid, inputElement, cssClass, errorMsg, errorElement, cssErrorClass);
    return isValid;
    //}
    //else
    //    return false;
}

function isAlphanumeric(inputId, errorMsg, errorElement, cssClass, cssErrorClass) {
    var inputElement = document.getElementById(inputId);
    var errorElement = document.getElementById(errorElement);
    var inputValue = inputElement.value.trim();
    var isValid = inputValue.match(/^[0-9a-zA-Z]+$/);

    if (isValid == null) {
        isValid = false;
    }
    if (inputValue == "")
        errorMsg = "Please fill the mandatory fields!"; // for mandatory msg
    showMessage(isValid, inputElement, cssClass, errorMsg, errorElement, cssErrorClass);
    return isValid;
}

function isValidDate(inputId, errorMsg, errorElement, cssClass, cssErrorClass) {
    var inputElement = document.getElementById(inputId);
    var errorElement = document.getElementById(errorElement);
    var inputValue = inputElement.value.trim();
    var isValid = inputValue.match(/^(([0-9])|([0-2][0-9])|([3][0-1]))\-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\-\d{4}$/);
    if (isValid == null) {
        isValid = false;
    }
    if (inputValue == "")
        errorMsg = "Please fill the mandatory fields!"; // for mandatory msg
    showMessage(isValid, inputElement, cssClass, errorMsg, errorElement, cssErrorClass);
    return isValid;
}

function isLengthMinMax(inputId, errorMsg, minLength, maxLength) {
    var inputElement = document.getElementById(inputId);
    var errorElement = document.getElementById(inputId + "Error");
    var inputValue = inputElement.value.trim();
    var isValid = (inputValue.length >= minLength) && (inputValue.length <= maxLength);
    showMessage(isValid, inputElement, errorMsg, errorElement);
    return isValid;
}

function isValidEmail(inputId, errorMsg, errorElement, cssClass, cssErrorClass) {
    var inputElement = document.getElementById(inputId);
    var errorElement = document.getElementById(errorElement);
    var inputValue = inputElement.value;
    var atPos = inputValue.indexOf("@");
    var dotPos = inputValue.lastIndexOf(".");
    var isValid = (atPos > 0) && (dotPos > atPos + 1) && (inputValue.length > dotPos + 2);
    if (isValid == null) {
        isValid = false;
    }
    if (inputValue == "")
        errorMsg = "Please fill the mandatory fields!"; // for mandatory msg
    showMessage(isValid, inputElement, cssClass, errorMsg, errorElement, cssErrorClass);
    return isValid;
}

function isAleValidEmail(inputId, errorMsg, errorElement, cssClass, cssErrorClass) {
    var inputElement = document.getElementById(inputId);
    var errorElement = document.getElementById(errorElement);
    var inputValue = inputElement.value;
    var atPos = inputValue.indexOf("@");
    var dotPos = inputValue.lastIndexOf(".");
    var isValid = (atPos > 0) && (dotPos > atPos + 1) && (inputValue.length > dotPos + 2);
    if (isValid == null) {
        isValid = false;
    }
    else if (isValid == true) {
        isValid == true
    }
    else {
        $("#txtAltEmail").val('')
    }
    if (inputValue == "")
        errorMsg = "Please fill the mandatory fields!"; // for mandatory msg
    showMessage(isValid, inputElement, cssClass, errorMsg, errorElement, cssErrorClass);
    return isValid;
}

function isSelected(inputId, errorMsg, errorElement, validationText, cssClass, cssErrorClass) {
    var inputElement = document.getElementById(inputId);
    var errorElement = document.getElementById(errorElement);
    var inputValue = inputElement.value;
    if (inputValue !== null && inputValue !== validationText) {

        var isValid = inputValue !== validationText;
        if (isValid == null) {
            isValid = false;
        }

        showMessage(isValid, inputElement, cssClass, errorMsg, errorElement, cssErrorClass);
        return isValid;
    }
    else {
        showMessage(isValid, inputElement, cssClass, errorMsg, errorElement, cssErrorClass);
        return false;
    }
}

function isChecked(inputName, chkvalElement, errorMsg, errorElement, cssClass, cssErrorClass) {
    var checkedvalElement = document.getElementById(chkvalElement);
    var inputElements = document.getElementsByName(inputName);
    var errorElement = document.getElementById(errorElement);
    var isChecked = false;
    for (var i = 0; i < inputElements.length; i++) {
        if (inputElements[i].checked) {
            isChecked = true;  // found one element checked
            break;
        }
    }
    if (isChecked == null) {
        return false;
    }
    showMessage(isChecked, checkedvalElement, cssClass, errorMsg, errorElement, cssErrorClass);
    return isChecked;
}




function NotifyDataChange(Element, typeid) {
    //alert($('#' + Element2).val());
    //if (Element2!=null)
    //if ($('#' + Element2).val()!="")
    if (typeid == 1)
        $('#' + Element).html("<div class=\"successmessage\"><span>Successfully Saved</span></div>").fadeIn().delay(5000).fadeOut(function () { $('#' + Element).html(""); });
    else if (typeid == 2)
        $('#' + Element).html("<div class=\"successmessage\"><span>Successfully Updated</span></div>").fadeIn().delay(5000).fadeOut(function () { $('#' + Element).html(""); });
    else if (typeid == 3)
        $('#' + Element).html("<div class=\"successmessage\"><span>Successfully Deleted</span></div>").fadeIn().delay(5000).fadeOut(function () { $('#' + Element).html(""); });
    else if (typeid == 4)
        $('#' + Element).html("<div class=\"message\"><span>Already exists</span></div>").fadeIn().delay(5000).fadeOut(function () { $('#' + Element).html(""); });
    else if (typeid == 5)
        $('#' + Element).html("<div class=\"errormessage\"><span>Failed to Process</span></div></div>").fadeIn().delay(5000).fadeOut(function () { $('#' + Element).html(""); });
    else if (typeid == 6)
        $('#' + Element).html("<div class=\"errormessage\"><span>Edit In Progress</span></div></div>").fadeIn().delay(5000).fadeOut(function () { $('#' + Element).html(""); });
    else if (typeid == 7)
        $('#' + Element).html("<div class=\"successmessage\"><span>Your appointment request has sent successfully. Your request will be confirmed ASAP by the clinic Or hospital via phone call</span></div></div>").fadeIn().delay(5000).fadeOut(function () { $('#' + Element).html(""); });
}