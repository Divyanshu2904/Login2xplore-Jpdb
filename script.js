// --- Configuration ---
var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var empDBName = "EMP-DB";
var empRelationName = "EmpData";

// TODO: Replace with your actual Connection Token from Login2Xplore Dashboard
var connToken = "YOUR_CONNECTION_TOKEN_HERE"; 

// --- Initial Setup ---
$(document).ready(function() {
    $("#empId").focus();
});

// --- Utility Functions ---

// Save Record Number to LocalStorage for updating later
function saveRecNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}

// Convert Employee ID into a JSON object for querying
function getEmpIdAsJsonObj() {
    var empId = $("#empId").val();
    var jsonStr = {
        id: empId
    };
    return JSON.stringify(jsonStr);
}

// Populate form fields with fetched data
function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $("#empName").val(record.name);
    $("#empSalary").val(record.salary);
    $("#empHRA").val(record.hra);
    $("#empDA").val(record.da);
    $("#empDeduct").val(record.deduction);
}

// Reset the entire form and adjust button/field states
function resetForm() {
    $("#empId").val("");
    $("#empName").val("");
    $("#empSalary").val("");
    $("#empHRA").val("");
    $("#empDA").val("");
    $("#empDeduct").val("");
    
    // Reset field disabilities
    $("#empId").prop("disabled", false);
    $("#empName").prop("disabled", true);
    $("#empSalary").prop("disabled", true);
    $("#empHRA").prop("disabled", true);
    $("#empDA").prop("disabled", true);
    $("#empDeduct").prop("disabled", true);
    
    // Reset button states
    $("#empSave").prop("disabled", true);
    $("#empChange").prop("disabled", true);
    $("#empReset").prop("disabled", true);
    
    $("#empId").focus();
}

// Validate input data and create JSON string
function validateAndGetFormData() {
    var empIdVar = $("#empId").val();
    if (empIdVar === "") {
        alert("Employee ID is Required");
        $("#empId").focus();
        return "";
    }
    
    var empNameVar = $("#empName").val();
    if (empNameVar === "") {
        alert("Employee Name is Required");
        $("#empName").focus();
        return "";
    }
    
    var empSalaryVar = $("#empSalary").val();
    if (empSalaryVar === "") {
        alert("Employee Salary is Required");
        $("#empSalary").focus();
        return "";
    }
    
    var empHRAVar = $("#empHRA").val();
    if (empHRAVar === "") {
        alert("HRA is Required");
        $("#empHRA").focus();
        return "";
    }
    
    var empDAVar = $("#empDA").val();
    if (empDAVar === "") {
        alert("DA is Required");
        $("#empDA").focus();
        return "";
    }
    
    var empDeductVar = $("#empDeduct").val();
    if (empDeductVar === "") {
        alert("Deduction is Required");
        $("#empDeduct").focus();
        return "";
    }
    
    var jsonStrObj = {
        id: empIdVar,
        name: empNameVar,
        salary: empSalaryVar,
        hra: empHRAVar,
        da: empDAVar,
        deduction: empDeductVar
    };
    
    return JSON.stringify(jsonStrObj);
}

// --- Primary Operations ---

// 1. GET Request: Check if employee already exists in database
function getEmp() {
    var empIdJsonObj = getEmpIdAsJsonObj();
    // Using jpdb-commons function to create GET request
    var getRequest = createGET_BY_KEYRequest(connToken, empDBName, empRelationName, empIdJsonObj);
    
    jQuery.ajaxSetup({async: false});
    // Execute GET request
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({async: true});

    if (resJsonObj.status === 400) {
        // Status 400: Data not found, meaning NEW employee
        $("#empSave").prop("disabled", false);
        $("#empReset").prop("disabled", false);
        
        // Enable input fields for new entry
        $("#empName").prop("disabled", false).focus();
        $("#empSalary").prop("disabled", false);
        $("#empHRA").prop("disabled", false);
        $("#empDA").prop("disabled", false);
        $("#empDeduct").prop("disabled", false);
        
    } else if (resJsonObj.status === 200) {
        // Status 200: Data found, meaning EXISTING employee
        $("#empId").prop("disabled", true);
        fillData(resJsonObj);
        
        $("#empChange").prop("disabled", false);
        $("#empReset").prop("disabled", false);
        
        // Enable input fields for editing
        $("#empName").prop("disabled", false).focus();
        $("#empSalary").prop("disabled", false);
        $("#empHRA").prop("disabled", false);
        $("#empDA").prop("disabled", false);
        $("#empDeduct").prop("disabled", false);
    }
}

// 2. PUT Request: Save a completely new employee record
function saveEmployee() {
    var jsonStr = validateAndGetFormData();
    if (jsonStr === "") {
        return; // Validation failed
    }
    
    // Using jpdb-commons function to create PUT request
    var putReqStr = createPUTRequest(connToken, jsonStr, empDBName, empRelationName);
    
    jQuery.ajaxSetup({async: false});
    // Execute PUT request
    var resultObj = executeCommandAtGivenBaseUrl(putReqStr, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    
    if(resultObj.status === 200) {
        alert("Employee details saved successfully!");
    } else {
        alert("Error saving data: " + resultObj.message);
    }
    resetForm();
}

// 3. UPDATE Request: Modify existing employee record
function changeEmployee() {
    $("#empChange").prop("disabled", true);
    
    var jsonChg = validateAndGetFormData();
    if (jsonChg === "") {
        return; // Validation failed
    }
    
    // Using jpdb-commons function to create UPDATE request using the localstorage record number
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, empDBName, empRelationName, localStorage.getItem("recno"));
    
    jQuery.ajaxSetup({async: false});
    // Execute UPDATE request
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    
    if(resJsonObj.status === 200) {
        alert("Employee details updated successfully!");
    } else {
        alert("Error updating data: " + resJsonObj.message);
    }
    
    resetForm();
}

// --- Event Listeners ---

// Trigger getEmp() when the user moves out of the Employee ID field (e.g. presses Tab)
$("#empId").on("blur", function() {
    if ($(this).val() !== "") {
        getEmp();
    }
});
