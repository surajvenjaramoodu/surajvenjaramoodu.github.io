

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
        errorMsg = ""; // for mandatory msg
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
        errorMsg = ""; // for mandatory msg
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