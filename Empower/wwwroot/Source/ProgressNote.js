import React, { useState, useEffect, useCallback, createRef } from 'react';
import $ from 'jquery';
import { getSessionData } from './commonAdmin';
import {triggerToastMessage, triggerErrorMessage,  } from './ToastHelper';
import { getProgressNotesByEnrollmentID } from './EnrollmentTabHelpers';

const ProgressNote = (props) => {

    let contactTypes = props.contactTypeValues;
    let subContactTypes = props.subContactTypeValues;


    useEffect(() => {
        document.getElementById('btnProgressNoteContactType').value = "Please Select";
        document.getElementById("btnProgressNoteContactType").innerHTML = "Please Select";

        document.getElementById('btnProgressNoteSubContactType').value = "Please Select";
        document.getElementById("btnProgressNoteSubContactType").innerHTML = "Please Select";
    });

    function ddlContactTypeSelectHandler(event) {
        let selectedValue = event.currentTarget.getAttribute('value');

        document.getElementById("btnProgressNoteContactType").value = selectedValue;


        let selectedContactType =  contactTypes.filter(function (contactType) {
            return contactType.ID === parseInt(selectedValue)
        });

        document.getElementById("btnProgressNoteContactType").innerHTML = selectedContactType[0].Description;

    }

    function ddlSubContactTypeSelectHandler(event) {
        let selectedValue = event.currentTarget.getAttribute('value');

        document.getElementById("btnProgressNoteSubContactType").value = selectedValue;

        let selectedSubContactType = subContactTypes.filter(function (subContactType) {
            return subContactType.ID === parseInt(selectedValue)
        });

        document.getElementById("btnProgressNoteSubContactType").innerHTML = selectedSubContactType[0].Description;

    }

    function getDurationValue() {
        let durationHour = document.getElementById("txtDurationHour").value;
        let durationMinute = document.getElementById("txtDurationMinute").value;
        ///console.log(parseInt(durationHour));
        //console.log(parseInt(durationMinute));
        let today = new Date();
        //let offset = new Date().getTimezoneOffset();
        let durationToSend = new Date(today.getFullYear(), today.getMonth(), today.getDate(), parseInt(durationHour), parseInt(durationMinute), today.getSeconds(), 0);
        
        return durationToSend;
    }

    function saveProgressNote() {

        if ($("#txtProgressNoteDate").val() === "") {
            $("#frmServiceUnit").addClass("was-validated");
            return;
        }

        
        let apiAddress = sessionStorage.getItem("baseApiAddress");
        let fullProgressNoteAddress = `${apiAddress}/api/ProgressNote`;
        let sessionStorageData = getSessionData();

        let methodType = '';

        let progressNote = {
            EnrollmentID: $("#hdnProgressNoteEnrollmentID").val(),
            CommentDate: new Date($("#txtProgressNoteDate").val()),
            Comment: $("#txtProgressNoteComments").val(),
            ContactTypeID: document.getElementById("btnProgressNoteContactType").value,
            SubContactTypeID: document.getElementById("btnProgressNoteSubContactType").value,
            Duration: getDurationValue(),
            Active: true,
            //CreatedDate: new Date(),
            //CreatedBy: getSessionData().CurrentUser,
            UpdatedDate: new Date(),
            UpdatedBy: getSessionData().CurrentUser
        }

        if ($("#hdnProgressNoteID").val() === "") {
            methodType = 'POST';
            progressNote.CreatedDate = new Date();
            progressNote.CreatedBy = getSessionData().CurrentUser;
        } else {
            methodType = 'PUT';
        }

        fetch(fullProgressNoteAddress, {
            method: methodType,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorageData.Token
            },
            body: JSON.stringify(progressNote)
        }).then(result => result.json())
        .then(result => {
            console.log(result);
    
            if (result === null || result.Message !== undefined) {
                triggerErrorMessage("an error occurred while saving the record.");
                return;
            }

    
            triggerToastMessage("The service unit was successfully saved");

            //getServiceUnitsByEnrollmentID();
            getProgressNotesByEnrollmentID();
    
        });

    }

   

    let contactTypeOptions = [];
    if (contactTypes.length > 0) {
        contactTypeOptions = contactTypes.map((value) => 
            <a key={value.ID} value={value.ID} description={value.Description} onClick={ ddlContactTypeSelectHandler } className="dropdown-item">{value.Description}</a>
        );
    }

    let subContactTypeOptions = [];
    if (subContactTypes.length > 0) {
        subContactTypeOptions = subContactTypes.map((value) => 
            <a key={value.ID} value={value.ID} description={value.Description} onClick={ ddlSubContactTypeSelectHandler } className="dropdown-item">{value.Description}</a>
         );
    }

   
    return <div>
              <input type="hidden" id="hdnProgressNoteID" />
              <input type="hidden" id="hdnProgressNoteEnrollmentID" />
              <input type="hidden" id="hdnProgressNoteCreatedDate" />
              <input type="hidden" id="hdnProgressNoteCreatedBy" />
             <form id="frmProgressNote">
                <div className="modal fade" id="progressNoteModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Progress Note</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {/* <div className="form-row">
                                <div className="col-4">
                                    <button id="btnAddNew" className="btn btn-primary" onClick={ addNewButtonClickHandler } >Add New</button>
                                </div>
                            </div> */}
                            <div className="form-row">
                                <div className="col-4">
                                    <label htmlFor="btnServiceMonth"><strong> Date *</strong></label>
                                    <input type="date" id="txtProgressNoteDate" className="form-control" defaultValue="" required />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="col-8">
                                    <label htmlFor="btnProgressNoteComment"><strong> Comment</strong></label>
                                    <textarea id="txtProgressNoteComments" className="form-control" defaultValue="" />
                                </div>
                            </div>
                            <br/>
                            <div className="form-row">
                                <div className="col-4">
                                    <label htmlFor="btnProgressNoteContactType"><strong> Contact Type</strong></label>
                                    <div className="dropdown">
                                        <button type="button" id="btnProgressNoteContactType" value="" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                            
                                        </button>
                                        <div className="dropdown-menu">
                                            {contactTypeOptions}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-2">
                                    <label><strong>Duration (hours) </strong></label>
                                    <input id="txtDurationHour" step="1" type="number" name="txtDurationHour" className="form-control" />
                                </div>
                                <div className="col-2">
                                    <label><strong>Duration (minutes)</strong> </label>
                                    <input id="txtDurationMinute" step="15" max="60" min="0" type="number" name="txtDurationMinute" className="form-control" />
                                </div>
                            </div>
                            <br/>
                            <div className="form-row">
                                <div className="col-4">
                                    <label><strong>Sub Contact Type</strong></label>
                                    <div className="dropdown">
                                        <button type="button" id="btnProgressNoteSubContactType" value="" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                            
                                        </button>
                                        <div className="dropdown-menu">
                                            { subContactTypeOptions }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <br/>
                            <div id="divProgressNotesTableContainer" >

                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" id="btnSaveProgressNote" onClick={ saveProgressNote } className="btn btn-primary" >Save</button>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
}

export default ProgressNote;