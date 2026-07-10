const jpdbBaseURL = "http://api.login2explore.com:5577";
const jpdbIRL = "/api/irl";
const jpdbIML = "/api/iml";
const stuDBName = "SCHOOL-DB";
const stuRelationName = "STUDENT-TABLE";
const connToken = "90935064|-31949248061646868|90904000"; 

$(document).ready(function() {
    $("#rollNo").focus();
});

function showAlert(message, type = 'success') {
    const alertHtml = `
        <div class="alert alert-${type} alert-dismissible fade show shadow-sm" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    $("#alertContainer").html(alertHtml);
    setTimeout(() => { $(".alert").alert('close'); }, 4000);
}

function setBtnLoading(btnId, isLoading) {
    const btn = $(`#${btnId}`);
    if (isLoading) {
        btn.prop('disabled', true);
        btn.find('.btn-text').addClass('d-none');
        btn.find('.spinner-border').removeClass('d-none');
    } else {
        btn.prop('disabled', false);
        btn.find('.btn-text').removeClass('d-none');
        btn.find('.spinner-border').addClass('d-none');
    }
}

function saveRecNo2LS(jsonObj) {
    const lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}

function getRollNoAsJsonObj() {
    return JSON.stringify({ id: $("#rollNo").val() });
}

function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    const record = JSON.parse(jsonObj.data).record;
    $("#fullName").val(record.name);
    $("#class").val(record.course);
    $("#birthDate").val(record.dob);
    $("#address").val(record.address);
    $("#enrollmentDate").val(record.enrollDate);
}

function resetForm() {
    $("#rollNo").val("");
    $("#fullName").val("");
    $("#class").val("");
    $("#birthDate").val("");
    $("#address").val("");
    $("#enrollmentDate").val("");
    
    $(".is-invalid").removeClass("is-invalid");
    
    $("#rollNo").prop("disabled", false);
    $("#fullName").prop("disabled", true);
    $("#class").prop("disabled", true);
    $("#birthDate").prop("disabled", true);
    $("#address").prop("disabled", true);
    $("#enrollmentDate").prop("disabled", true);
    
    $("#btnSave").prop("disabled", true);
    $("#btnUpdate").prop("disabled", true);
    $("#btnReset").prop("disabled", true);
    
    $("#rollNo").focus();
}

function validateAndGetFormData() {
    let isValid = true;
    const fields = ["rollNo", "fullName", "class", "birthDate", "address", "enrollmentDate"];
    
    fields.forEach(field => {
        const el = $(`#${field}`);
        if (el.val().trim() === "") {
            el.addClass("is-invalid");
            isValid = false;
        } else {
            el.removeClass("is-invalid");
        }
    });

    if (!isValid) return "";
    
    return JSON.stringify({
        id: $("#rollNo").val(),
        name: $("#fullName").val(),
        course: $("#class").val(),
        dob: $("#birthDate").val(),
        address: $("#address").val(),
        enrollDate: $("#enrollmentDate").val()
    });
}

function getStudent() {
    const rollNo = $("#rollNo").val();
    if (rollNo === "") return;
    
    const getRequest = createGET_BY_KEYRequest(connToken, stuDBName, stuRelationName, getRollNoAsJsonObj());
    
    jQuery.ajaxSetup({async: false});
    const resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({async: true});

    if (resJsonObj.status === 400) {
        $("#btnSave").prop("disabled", false);
        $("#btnReset").prop("disabled", false);
        
        $("#fullName").prop("disabled", false).focus();
        $("#class").prop("disabled", false);
        $("#birthDate").prop("disabled", false);
        $("#address").prop("disabled", false);
        $("#enrollmentDate").prop("disabled", false);
    } else if (resJsonObj.status === 200) {
        $("#rollNo").prop("disabled", true);
        fillData(resJsonObj);
        
        $("#btnUpdate").prop("disabled", false);
        $("#btnReset").prop("disabled", false);
        
        $("#fullName").prop("disabled", false).focus();
        $("#class").prop("disabled", false);
        $("#birthDate").prop("disabled", false);
        $("#address").prop("disabled", false);
        $("#enrollmentDate").prop("disabled", false);
    }
}

function saveStudent() {
    const jsonStr = validateAndGetFormData();
    if (jsonStr === "") return;
    
    setBtnLoading('btnSave', true);
    const putReqStr = createPUTRequest(connToken, jsonStr, stuDBName, stuRelationName);
    
    setTimeout(() => {
        jQuery.ajaxSetup({async: false});
        const resultObj = executeCommandAtGivenBaseUrl(putReqStr, jpdbBaseURL, jpdbIML);
        jQuery.ajaxSetup({async: true});
        
        if (resultObj.status === 200) {
            showAlert("Student record saved successfully!", "success");
            resetForm();
        } else {
            showAlert("Error saving data. Please try again.", "danger");
        }
        setBtnLoading('btnSave', false);
    }, 400);
}

function updateStudent() {
    const jsonChg = validateAndGetFormData();
    if (jsonChg === "") return;
    
    setBtnLoading('btnUpdate', true);
    const updateRequest = createUPDATERecordRequest(connToken, jsonChg, stuDBName, stuRelationName, localStorage.getItem("recno"));
    
    setTimeout(() => {
        jQuery.ajaxSetup({async: false});
        const resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
        jQuery.ajaxSetup({async: true});
        
        if (resJsonObj.status === 200) {
            showAlert("Student record updated successfully!", "success");
            resetForm();
        } else {
            showAlert("Error updating data. Please try again.", "danger");
        }
        setBtnLoading('btnUpdate', false);
    }, 400);
}

$("#rollNo").on("blur", getStudent);
