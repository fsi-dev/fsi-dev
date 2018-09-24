function VerifyPDFCallBack(rv) {

}
function getFileUploadHandler() {
    return jQuery("#SaveFileSigned").val();
}

function exc_verify_pdf1() {
    var prms = {};
    prms["SessionId"] = "";
    prms["FileName"] = document.getElementById("file1").value;

    var json_prms = JSON.stringify(prms);

    vgca_verify_pdf(json_prms, VerifyPDFCallBack);
}
function exc_verify_pdf2() {
    var prms = {};
    prms["SessionId"] = "";
    prms["FileName"] = document.getElementById("file2").value;

    var json_prms = JSON.stringify(prms);

    vgca_verify_pdf(json_prms, VerifyPDFCallBack);
}
function exc_verify_pdf3() {
    var prms = {};
    prms["SessionId"] = "";
    prms["FileName"] = document.getElementById("file3").value;

    var json_prms = JSON.stringify(prms);

    vgca_verify_pdf(json_prms, VerifyPDFCallBack);
}

function exc_verify_pdf4() {
    var prms = {};
    prms["SessionId"] = "";
    prms["FileName"] = document.getElementById("file4").value;

    var json_prms = JSON.stringify(prms);

    vgca_verify_pdf(json_prms, VerifyPDFCallBack);
}

function SignFileCallBack1(rv) {

    Utils.reloadPage();

    var received_msg = JSON.parse(rv);
    if (received_msg.Status == 0) {
        //console.log(received_msg);
        document.getElementById("_signature").value = received_msg.FileName + ":" + received_msg.FileServer;
        document.getElementById("file1").value = received_msg.FileServer;
        document.getElementById("file2").value = received_msg.FileServer;
    } else {
        document.getElementById("_signature").value = received_msg.Message;
    }
}

//metadata có kiểu List<KeyValue> 
//KeyValue là class { string Key; string Value; }
function exc_sign_file1() {
    var prms = {};
    var scv = [{ "Key": "abc", "Value": "abc" }];

    prms["FileUploadHandler"] = getFileUploadHandler();
    prms["SessionId"] = "";
    prms["FileName"] = document.getElementById("file1").value;
    prms["MetaData"] = scv;

    var json_prms = JSON.stringify(prms);
    vgca_sign_file(json_prms, SignFileCallBack1);
}


function SignFileCallBack2(rv) {

    Utils.reloadPage();

    var received_msg = JSON.parse(rv);
    if (received_msg.Status == 0) {
        //console.log(received_msg);
        document.getElementById("_signature").value = received_msg.FileName + ":" + received_msg.FileServer;
        //document.getElementById("file2").value = received_msg.FileServer;
        document.getElementById("file3").value = received_msg.FileServer;
    } else {
        document.getElementById("_signature").value = received_msg.Message;
    }
}

//metadata có kiểu List<KeyValue> 
//KeyValue là class { string Key; string Value; }
function exc_sign_file2() {
    var prms = {};
    var scv = [{ "Key": "abc", "Value": "abc" }];

    prms["FileUploadHandler"] = getFileUploadHandler();
    prms["SessionId"] = "";
    prms["FileName"] = document.getElementById("file2").value;
    prms["MetaData"] = scv;

    var json_prms = JSON.stringify(prms);
    vgca_sign_file(json_prms, SignFileCallBack2);
}

function SignFileCallBack3(rv) {

    Utils.reloadPage();

    var received_msg = JSON.parse(rv);
    if (received_msg.Status == 0) {
        //console.log(received_msg);
        document.getElementById("_signature").value = received_msg.FileName + ":" + received_msg.FileServer;
        //document.getElementById("file3").value = received_msg.FileServer;
        document.getElementById("file4").value = received_msg.FileServer;
    } else {
        document.getElementById("_signature").value = received_msg.Message;
    }
}

//metadata có kiểu List<KeyValue> 
//KeyValue là class { string Key; string Value; }
function exc_sign_file3() {
    var prms = {};
    var scv = [{ "Key": "abc", "Value": "abc" }];

    prms["FileUploadHandler"] = getFileUploadHandler();
    prms["SessionId"] = "";
    prms["FileName"] = document.getElementById("file3").value;
    prms["MetaData"] = scv;

    var json_prms = JSON.stringify(prms);
    vgca_sign_file(json_prms, SignFileCallBack3);
}


function SignFileCallBack4(rv) {

    Utils.reloadPage();

    var received_msg = JSON.parse(rv);
    if (received_msg.Status == 0) {
        //console.log(received_msg);
        document.getElementById("_signature").value = received_msg.FileName + ":" + received_msg.FileServer;
        //document.getElementById("file3").value = received_msg.FileServer;
        document.getElementById("file4").value = received_msg.FileServer;
    } else {
        document.getElementById("_signature").value = received_msg.Message;
    }
}

//metadata có kiểu List<KeyValue> 
//KeyValue là class { string Key; string Value; }
function exc_sign_file4() {
    var prms = {};
    var scv = [{ "Key": "abc", "Value": "abc" }];

    prms["FileUploadHandler"] = getFileUploadHandler();
    prms["SessionId"] = "";
    prms["FileName"] = document.getElementById("file4").value;
    prms["MetaData"] = scv;

    var json_prms = JSON.stringify(prms);
    vgca_sign_file(json_prms, SignFileCallBack4);
}

function RequestLicenseCallBack(rv) {
    var received_msg = JSON.parse(rv);
    if (received_msg.Status == 0) {
        document.getElementById("_signature").value = received_msg.LicenseRequest;
    } else {
        alert("Ký số không thành công:" + received_msg.Status + ":" + received_msg.Error);
    }
}