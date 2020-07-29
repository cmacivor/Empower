import React, { useState, useEffect, useCallback, createRef } from 'react';
import $ from 'jquery';
import { getSessionData } from './commonAdmin';
import { getRoles, getSystems } from './Constants';
import { triggerToastMessage, triggerErrorMessage } from './ToastHelper';
import moment from 'moment';


const Assessment = (props) => {

    let assessmentTypes = props.assessmentTypeValues;
    let assessmentSubTypes = props.assessmentSubTypeValues;
    let staff = props.staffValues;
    let clientProfileID = '';

    let assessmentsTable;
    let computedStaff = [];

    if (props.clientProfile !== undefined) {

        clientProfileID = props.clientProfile.ID;

        let assessments = props.assessments;

        assessmentsTable = generateTable(assessments);
     }

    staff.forEach(element => {
        let staffDDLItem = {
            ID: element.ID,
            Name: element.LastName + ', ' + element.FirstName,
        }

        computedStaff.push(staffDDLItem);
    });

    useEffect(() => {
        resetDropdowns();
    });

    function resetDropdowns() {
        document.getElementById('btnAssessmentType').value = 'Please Select';
        document.getElementById('btnAssessmentType').innerText = 'Please Select';

        document.getElementById('btnAssessmentSubType').value = 'Please Select';
        document.getElementById('btnAssessmentSubType').innerText = 'Please Select';

        document.getElementById('btnStaffPerson').value = 'Please Select';
        document.getElementById('btnStaffPerson').innerText = 'Please Select';
    }

    function createNewAssessment() {
        resetDropdowns();

        $("#txtDateOfAssessment").val("");
        $("#txtAssessmentScore").val("");
        $("#txtAssessmentNotes").val("");

        $("#hdnAssessmentID").val("");
        $("#hdnAssessmentCreatedDate").val("");
        $("#hdnAssessmentCreatedBy").val("");

        $("#assessmentModal").modal({show: true});
    }

    function getAssessmentDetails(event) {
        let assessmentID = event.currentTarget.getAttribute("data-id");

        let apiAddress = sessionStorage.getItem("baseApiAddress");
        let fullGetAssessmentAddress = `${apiAddress}/api/Assessment/GetAssessment/${assessmentID}`;
        let sessionStorageData = getSessionData();

        fetch(fullGetAssessmentAddress, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorageData.Token
            }
        }).then(result => {
            return result.json();
        }).then(result => {
       
            if (result.AssessmentType !== null) {
                document.getElementById('btnAssessmentType').value = result.AssessmentType.ID;
                document.getElementById('btnAssessmentType').innerText = result.AssessmentType.Name;
            }

            if (result.AssessmentSubtype !== null) {  
                document.getElementById('btnAssessmentSubType').value = result.AssessmentSubtype.ID;
                document.getElementById('btnAssessmentSubType').innerText = result.AssessmentSubtype.Name;
            }

            if (result.AssessmentDate !== null) {
                let convertedAssessmentDate = result.AssessmentDate !== null ? moment(new Date(result.AssessmentDate)).format('YYYY-MM-DD') : "";
                $("#txtDateOfAssessment").val(convertedAssessmentDate); 
            }

            $("#txtAssessmentScore").val(result.AssessmentScore);

            if (result.Staff !== null) {
                document.getElementById('btnStaffPerson').value =  result.Staff.ID;
                document.getElementById('btnStaffPerson').innerText = result.Staff.LastName + ", " + result.Staff.FirstName;
            }

            $("#txtAssessmentNotes").val(result.Notes);

            $("#hdnAssessmentID").val(result.ID);
            $("#hdnAssessmentCreatedDate").val(result.CreatedDate);
            $("#hdnAssessmentCreatedBy").val(result.CreatedBy);

            $("#assessmentModal").modal({show: true});
        });
    }

    function deleteAssessment(event) {
        let assessmentID = event.currentTarget.getAttribute("data-id");

        let apiAddress = sessionStorage.getItem("baseApiAddress");
        let fullDeleteAssessmentAddress = `${apiAddress}/api/Assessment/DeleteAssessment/${assessmentID}`;
        let sessionStorageData = getSessionData();

        fetch(fullDeleteAssessmentAddress, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorageData.Token
            }
        }).then(result => result.json())
        .then(result => {
            triggerToastMessage("the assessment was deleted.");

            getAssessments();
        });
    }

    function getAssessments() {

        let apiAddress = sessionStorage.getItem("baseApiAddress");
        let fullGetAssessmentAddress = `${apiAddress}/api/Assessment/GetAssessments/${clientProfileID}`;
        let sessionStorageData = getSessionData();

        fetch(fullGetAssessmentAddress, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorageData.Token
            }
        }).then(result => {
            return result.json();
        }).then(result => {
            generateTable(result);       
        });
    }

    function generateTable(assessments) {

        if (assessments === undefined) return;

        let tableRef = document.getElementById("tblAssessments").getElementsByTagName('tbody')[0];
        tableRef.innerHTML = "";
        assessments.forEach(assessment => {

            let newRow = tableRef.insertRow();

            // //add the edit button
            let editButton = document.createElement("button");
            editButton.classList.add("btn");
            editButton.classList.add("btn-secondary");
            editButton.classList.add("btn-sm");
            editButton.setAttribute("data-id", assessment.ID);
            editButton.innerText = "Edit";
            editButton.title = "edit the Assessment";
            editButton.onclick = getAssessmentDetails;

            let assessmentButtonCell = newRow.insertCell(0);
            assessmentButtonCell.appendChild(editButton);

             let assessmentTypeCell = newRow.insertCell(1);
             assessmentTypeCell.innerText = (assessment.AssessmentType.Name !== null) ? assessment.AssessmentType.Name : "";
            
             let domainCell = newRow.insertCell(2);
             domainCell.innerText = assessment.AssessmentSubtype.Name !== null ? assessment.AssessmentSubtype.Name : "";

             let assessmentDateCell = newRow.insertCell(3);
             assessmentDateCell.innerText = assessment.AssessmentDate !== null ? moment(new Date(assessment.AssessmentDate)).format('YYYY-MM-DD') : "";

             let assessmentScoreCell = newRow.insertCell(4);
             assessmentScoreCell.innerText = assessment.AssessmentScore;

            // //add the delete button for each row
            let deleteButton = document.createElement("button");
            deleteButton.classList.add("btn");
            deleteButton.classList.add("btn-danger");
            deleteButton.classList.add("btn-sm");
            deleteButton.setAttribute("data-id", assessment.ID);
            deleteButton.innerText = "Delete";
            deleteButton.title = "delete the Assessment";
            deleteButton.onclick = deleteAssessment

            let deleteButtonCell = newRow.insertCell(5);
            deleteButtonCell.appendChild(deleteButton);

        });
    }

    function assessmentTypeSelectHandler(event) {
        let selectedValue = event.currentTarget.getAttribute('value');
        
        let selectedAssessmentType = assessmentTypes.filter(function(assessmentType) {
            return assessmentType.ID === parseInt(selectedValue);
        });

        $("#btnAssessmentType").val(selectedValue);

        document.getElementById("btnAssessmentType").innerText = selectedAssessmentType[0].Description;
    }

    function assessmentSubTypeSelectHandler(event) {
        let selectedValue = event.currentTarget.getAttribute('value');

        let selectedAssessmentSubType = assessmentSubTypes.filter(function(assessmentSubType) {
            return assessmentSubType.ID === parseInt(selectedValue);
        });

        $("#btnAssessmentSubType").val(selectedValue);

        document.getElementById("btnAssessmentSubType").innerText = selectedAssessmentSubType[0].Description;
    }

    function staffSelectHandler(event) {
        let selectedValue = event.currentTarget.getAttribute('value');

        let selectedStaff = computedStaff.filter(function(staff) {
            return staff.ID === parseInt(selectedValue);
        });

        $("#btnStaffPerson").val(selectedValue);

        document.getElementById("btnStaffPerson").innerText = selectedStaff[0].Name;
    }


    function getElementValue(element) {
        let value = document.getElementById(element).value;

        if (value === "" || value === "Please Select") {
            return null;
        }
        return value;
    }

    function saveAssessment() {

        let apiAddress = sessionStorage.getItem("baseApiAddress");
        let fullPersonAssessmentAddress = `${apiAddress}/api/Assessment`;
        let sessionStorageData = getSessionData();

        let assessment = {
            ClientProfileID: clientProfileID,
            AssessmentTypeID: getElementValue("btnAssessmentType"),
            AssessmentSubtypeID: getElementValue("btnAssessmentSubType"),
            AssessmentDate: new Date($("#txtDateOfAssessment").val()),
            AssessmentScore: $("#txtAssessmentScore").val(),
            StaffID: getElementValue("btnStaffPerson"),
            Notes: $("#txtAssessmentNotes").val(),
            Active: true,
            UpdatedDate: new Date(),
            UpdatedBy: sessionStorageData.CurrentUser
        }

        let methodType = "";
        let assessmentID = $("#hdnAssessmentID").val();
        if (assessmentID === "") {
            methodType = 'POST';
            assessment.CreatedDate = new Date();
            assessment.CreatedBy = sessionStorageData.CurrentUser;
        } else {
            methodType = 'PUT';
            assessment.CreatedDate = $("#hdnAssessmentCreatedDate").val();
            assessment.CreatedBy = $("#hdnAssessmentCreatedBy").val();
            assessment.ID = $("#hdnAssessmentID").val();
        }

        fetch(fullPersonAssessmentAddress, {
            method: methodType,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorageData.Token
            },
            body: JSON.stringify(assessment)
        }).then(result => result.json())
        .then(result => {

            if ($("#hdnAssessmentID").val() === "") {

            }

            triggerToastMessage("the assessment was successfully saved.");

            $("#assessmentModal").modal('hide');

            getAssessments();

        })
        .catch(function() {
            triggerErrorMessage("an error occurred while saving the assessment record.");
        });
        
    }

    let assessmentTypeOptions = [];
    if ( assessmentTypes.length > 0) {
        assessmentTypeOptions = assessmentTypes.map((value) =>
        <a key={value.ID} value={value.ID} description={value.Name} onClick={ assessmentTypeSelectHandler } className="dropdown-item">{value.Name}</a>
      );
    }

    let assessmentSubTypeOptions = [];
    if ( assessmentSubTypes.length > 0) {
        assessmentSubTypeOptions = assessmentSubTypes.map((value) =>
        <a key={value.ID} value={value.ID} description={value.Name} onClick={ assessmentSubTypeSelectHandler } className="dropdown-item">{value.Name}</a>
      );
    }

    let staffOptions = [];
    if ( computedStaff.length > 0) {
        staffOptions = computedStaff.map((value) =>
        <a key={value.ID} value={value.ID} description={value.Name} onClick={ staffSelectHandler } className="dropdown-item">{value.Name}</a>
      );
    }

    return <div>
        <br/>
        <button type="button" id="btnAddAssessment" onClick={createNewAssessment} className="btn btn-primary">Add Assessment</button>
        <br/>
        <br/>
        <table id="tblAssessments" className="table">
             <thead>
                 <tr>
                    <th scope="col"></th>
                    <th scope="col">Type</th>
                    <th scope="col">Domain</th>
                    <th scope="col">Date</th>
                    <th scope="col">Score</th>
                    <th scope="col"></th>
                 </tr>
             </thead>
             <tbody>

             </tbody>
         </table>
        <input type="hidden" id="hdnAssessmentID" />
        <input type="hidden" id="hdnAssessmentCreatedDate" />
        <input type="hidden" id="hdnAssessmentCreatedBy" />
        <div className="modal fade" id="assessmentModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Assessment</h5>
                        
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="form-row">
                            <div className="col-6">
                                <label htmlFor="btnAssessmentType"><strong>Assessment Type</strong></label>
                                <div className="dropdown">
                                    <button type="button" id="btnAssessmentType" value="" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                        
                                    </button>
                                    <div className="dropdown-menu">
                                        { assessmentTypeOptions }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="col-6">
                                <label htmlFor="btnAssessmentSubType"><strong>Domain</strong></label>
                                <div className="dropdown">
                                    <button type="button" id="btnAssessmentSubType" value="" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                        
                                    </button>
                                    <div className="dropdown-menu">
                                        { assessmentSubTypeOptions }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="col-6">
                                <label htmlFor="txtDateOfAssessment"><strong>Date of Assessment</strong></label>
                                <input type="date" id="txtDateOfAssessment" defaultValue="" className="form-control" />
                            </div>
                            <div className="col-6">
                                <label htmlFor="txtAssessmentScore">Assessment Score</label>
                                <input id="txtAssessmentScore" type="text" className="form-control" defaultValue="" />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="col-6">
                                <label htmlFor="btnStaffPerson"><strong>Staff Person</strong></label>
                                <div className="dropdown">
                                    <button type="button" id="btnStaffPerson" value="" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                        
                                    </button>
                                    <div className="dropdown-menu">
                                        { staffOptions }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="col-6">
                                <label htmlFor="txtAssessmentNotes"><strong>Notes</strong></label>
                                <textarea type="text" className="form-control" id="txtAssessmentNotes" />
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" id="btnSavePlacement" onClick={saveAssessment} className="btn btn-primary">Save</button>
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default Assessment;