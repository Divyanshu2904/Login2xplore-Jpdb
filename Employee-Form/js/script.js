// --- Configuration ---
const jpdbBaseURL = "http://api.login2explore.com:5577";
const jpdbIRL = "/api/irl";
const jpdbIML = "/api/iml";
const empDBName = "EMP-DB";
const empRelationName = "EmpData";

const connToken = "90935064|-31949248061646868|90904000"; 

// --- Initial Setup ---
$(document).ready(function() {
    $("#empId").focus();
    
    // Auto-calculate Net Salary when inputs change
    $(".auto-calc").on("input", calculateNetSalary);
});

// --- Utility Functions ---

function calculateNetSalary() {
    const salary = parseFloat($("#empSalary").val()) || 0;
    const hra = parseFloat($("#empHRA").val()) || 0;
    const da = parseFloat($("#empDA").val()) || 0;
    const deduct = parseFloat($("#empDeduct").val()) || 0;
    
    const netSalary = salary + hra + da - deduct;
    $("#empNetSalary").val(netSalary);
}

function showAlert(message, type = 'success') {
    const alertHtml = `
        <div class="alert alert-${type} alert-dismissible fade show shadow-sm" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    $("#alertContainer").html(alertHtml);
    setTimeout(() => {
        $(".alert").alert('close');
    }, 4000);
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

function getEmpIdAsJsonObj() {
    const empId = $("#empId").val();
    const jsonStr = { id: empId };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    const record = JSON.parse(jsonObj.data).record;
    $("#empName").val(record.name);
    $("#empSalary").val(record.salary);
    $("#empHRA").val(record.hra);
    $("#empDA").val(record.da);
    $("#empDeduct").val(record.deduction);
    calculateNetSalary();
}

function resetForm() {
    $("#empId").val("");
    $("#empName").val("");
    $("#empSalary").val("");
    $("#empHRA").val("");
    $("#empDA").val("");
    $("#empDeduct").val("");
    $("#empNetSalary").val("");
    
    $(".is-invalid").removeClass("is-invalid");
    
    $("#empId").prop("disabled", false);
    $("#empName").prop("disabled", true);
    $("#empSalary").prop("disabled", true);
    $("#empHRA").prop("disabled", true);
    $("#empDA").prop("disabled", true);
    $("#empDeduct").prop("disabled", true);
    
    $("#empSave").prop("disabled", true);
    $("#empChange").prop("disabled", true);
    $("#empReset").prop("disabled", true);
    
    $("#empId").focus();
}

function validateAndGetFormData() {
    let isValid = true;
    const fields = ["empId", "empName", "empSalary", "empHRA", "empDA", "empDeduct"];
    
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
    
    const jsonStrObj = {
        id: $("#empId").val(),
        name: $("#empName").val(),
        salary: $("#empSalary").val(),
        hra: $("#empHRA").val(),
        da: $("#empDA").val(),
        deduction: $("#empDeduct").val()
    };
    
    return JSON.stringify(jsonStrObj);
}

// --- Primary Operations ---

function getEmp() {
    const empId = $("#empId").val();
    if (empId === "") return;
    
    const empIdJsonObj = getEmpIdAsJsonObj();
    const getRequest = createGET_BY_KEYRequest(connToken, empDBName, empRelationName, empIdJsonObj);
    
    jQuery.ajaxSetup({async: false});
    const resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({async: true});

    if (resJsonObj.status === 400) {
        $("#empSave").prop("disabled", false);
        $("#empReset").prop("disabled", false);
        
        $("#empName").prop("disabled", false).focus();
        $("#empSalary").prop("disabled", false);
        $("#empHRA").prop("disabled", false);
        $("#empDA").prop("disabled", false);
        $("#empDeduct").prop("disabled", false);
    } else if (resJsonObj.status === 200) {
        $("#empId").prop("disabled", true);
        fillData(resJsonObj);
        
        $("#empChange").prop("disabled", false);
        $("#empReset").prop("disabled", false);
        
        $("#empName").prop("disabled", false).focus();
        $("#empSalary").prop("disabled", false);
        $("#empHRA").prop("disabled", false);
        $("#empDA").prop("disabled", false);
        $("#empDeduct").prop("disabled", false);
    }
}

function saveEmployee() {
    const jsonStr = validateAndGetFormData();
    if (jsonStr === "") return;
    
    setBtnLoading('empSave', true);
    const putReqStr = createPUTRequest(connToken, jsonStr, empDBName, empRelationName);
    
    // Slight delay to show spinner effect
    setTimeout(() => {
        jQuery.ajaxSetup({async: false});
        const resultObj = executeCommandAtGivenBaseUrl(putReqStr, jpdbBaseURL, jpdbIML);
        jQuery.ajaxSetup({async: true});
        
        if (resultObj.status === 200) {
            showAlert("Employee record saved successfully!", "success");
            resetForm();
        } else {
            showAlert("Error saving data. Please try again.", "danger");
        }
        setBtnLoading('empSave', false);
    }, 400); 
}

function changeEmployee() {
    const jsonChg = validateAndGetFormData();
    if (jsonChg === "") return;
    
    setBtnLoading('empChange', true);
    const updateRequest = createUPDATERecordRequest(connToken, jsonChg, empDBName, empRelationName, localStorage.getItem("recno"));
    
    setTimeout(() => {
        jQuery.ajaxSetup({async: false});
        const resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
        jQuery.ajaxSetup({async: true});
        
        if (resJsonObj.status === 200) {
            showAlert("Employee record updated successfully!", "success");
            resetForm();
        } else {
            showAlert("Error updating data. Please try again.", "danger");
        }
        setBtnLoading('empChange', false);
    }, 400);
}

// Trigger getEmp() when the user moves out of the Employee ID field
$("#empId").on("blur", getEmp);
