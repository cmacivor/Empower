import React, { useState, useEffect, useCallback, createRef } from 'react';
import $ from 'jquery';
import { getSessionData } from './commonAdmin';
import { getRoles, getSystems } from './Constants';
import ServiceUnit from './ServiceUnit';
import ProgressNote from './ProgressNote';
import ReferralCWB from './ReferralCWB';
import PrintEnrollment from './PrintEnrollment';
import moment from 'moment';
import { generateTable, 
    getPlacementsByClientProfileID, 
    toggleCaseEnrollmentModal,
    togglePlacementModal,
    createColumnGroup, 
    createRow, 
    populateServiceUnitModalTable} from './EnrollmentTabHelpers';
import { addActive, onKeyDownHandler, populatePlacementChargesBox  } from './AutoComplete';
import {  Api } from './commonAdmin';
import { triggerErrorMessage } from './ToastHelper';
import ReferralJuvenile from './ReferralJuvenile';

const EnrollmentCaseModal = (props) => {

    let clientProfileId = '';

    if (props.clientProfile !== undefined) {

        clientProfileId = props.clientProfile.ID;

        generateTable(props.placement);

        //generatePrintModal(props.placement, props.familyProfiles.FamilyProfile);
    }

    
    let sessionData = getSessionData();

    let systems = getSystems();

    let offenseValues = props.offenseValues;
    let placementLevels = props.placementLevelValues;
    let judges = props.judgeValues;
    let contactTypes = props.contactTypeValues;
    let subContactTypes = props.subContactTypeValues;
    let staff = props.staffValues;
    let serviceReleases = props.serviceReleaseValues;
    let serviceOutcomes = props.serviceOutcomeValues;

    useEffect(() => {
        document.getElementById('btnOverallRisk').value = 'Please Select';
        document.getElementById('btnOverallRisk').innerText = 'Please Select';

        document.getElementById('btnJudge').value = 'Please Select';
        document.getElementById('btnJudge').innerText = 'Please Select';

    });

    function overallRiskSelectHandler(event) {
        let selectedValue = event.currentTarget.getAttribute('value');
        
        let selectedPlacementLevel = placementLevels.filter(function(placementLevel) {
            return placementLevel.ID === parseInt(selectedValue);
        });

        //console.log(selectedPlacementLevel);

        $("#btnOverallRisk").val(selectedValue);

        document.getElementById("btnOverallRisk").innerText = selectedPlacementLevel[0].Description;

        if (selectedValue !== '') {
            document.getElementById("divOverallRiskError").setAttribute("style", "display:none");
        }
    }

    function judgeSelectHandler(event) {
        let selectedValue = event.currentTarget.getAttribute('value');
        
        let selectedJudge = judges.filter(function(judge) {
            return judge.ID === parseInt(selectedValue);
        });

        //console.log(selectedJudge);

        $("#btnJudge").val(selectedValue);

        document.getElementById("btnJudge").innerText = selectedJudge[0].Description

        if (selectedValue !== '') {
            document.getElementById("divJudgeError").setAttribute("style", "display:none");
        }
    }


    function placementChargesOnKeyDownEventHandler(e) {
        onKeyDownHandler(e, "txtPlacementCharges");
    }

    function onPlacementChargeChangeEventHandler(event) {

        populatePlacementChargesBox(offenseValues, "txtPlacementCharges", populateChargeSelectionBox);
    }

    function populateChargeSelectionBox(offenseProperties) {
        console.log(offenseProperties);
        let offenseID = offenseProperties[0].ID;

        $("#hdnOffenseID").val(offenseID);

        document.getElementById("divPlacementCharges").setAttribute("style", "display:none");

    }

    function getElementValue(element) {
        let value = document.getElementById(element).value;

        if (value === "" || value === "Please Select") {
            return null;
        }
        return value;
    }

    function savePlacement() {

        let overallRisk = getElementValue("btnOverallRisk");

        let judgeID = getElementValue("btnJudge");

        //let offenseID = $("#hdnOffenseID").val();

        if (overallRisk === null) {
            $("#frmCaseEnrollment").addClass("was-validated");   
            document.getElementById("divOverallRiskError").removeAttribute("style");
        }

        if (judgeID === null) {
            $("#frmCaseEnrollment").addClass("was-validated");
            document.getElementById("divJudgeError").removeAttribute("style");
        }

        //need to check the contents of divPlacementChargesContainer
        let placementCharges = document.getElementById("divPlacementChargesContainer").innerHTML; //one was created earlier
        let selectedPlacementCharge = $("#txtPlacementCharges").val();
        if (placementCharges === "" && selectedPlacementCharge === "") {
            $("#frmCaseEnrollment").addClass("was-validated");
            document.getElementById("divPlacementCharges").removeAttribute("style");
            return;
        }

        // if (offenseID === "") {
        //     $("#frmCaseEnrollment").addClass("was-validated");
        //     document.getElementById("divPlacementCharges").removeAttribute("style");
        // }

        if (overallRisk === null || judgeID === null) {
            return;
        }

        let apiAddress = sessionStorage.getItem("baseApiAddress");
        let fullPersonPlacementAddress = `${apiAddress}/api/Placement`;
        let fullPlacementOffenseAddress= `${apiAddress}/api/PlacementOffense`;
        let sessionStorageData = getSessionData();
       
        let placement ={
            ClientProfileID:  clientProfileId,
            CourtOrderDate: new Date($("#txtCourtOrderDate").val()), 
            PlacementLevelID: getElementValue("btnOverallRisk"),
            NextCourtDate: new Date($("#txtNextCourtDate").val()),
            JudgeID: getElementValue("btnJudge"), //"Judge"  
            CourtOrderNarrative: getElementValue("txtCourtOrderNarrative"), 
            Active: true,
            UpdatedDate: new Date(),
            UpdatedBy: sessionStorageData.CurrentUser
        }

   

        let methodType = "";
        let placementID = $("#hdnPlacementID").val();

        if (placementID !== "") {
            methodType = "PUT"
            placement.CreatedDate = $("#hdnPlacementCreatedDate").val();
            placement.CreatedBy = $("#hdnPlacementCreatedBy").val();
            placement.ID = $("#hdnPlacementID").val();
        } else {
            methodType = "POST";
            placement.CreatedDate = new Date(),
            placement.CreatedBy = sessionStorageData.CurrentUser;
        }


        let placementViewModel = {
            Placement: placement,
            Enrollment: null,
            PlacementOffense: null,
        }
        
        fetch(fullPersonPlacementAddress, {
            method: methodType,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorageData.Token
            },
            body: JSON.stringify(placementViewModel)
        }).then(result => result.json())
        .then(result => {

            if (result === null || result.Message !== undefined) {
                props.createErrorNotification("an error occurred while saving the record.");
                return;
            }

            if ($("#hdnOffenseID").val() !== "") {

                //console.log(result);

                let placementOffense = {
                    PlacementID: result.ID,
                    OffenseID: $("#hdnOffenseID").val(),  
                    Active: true,
                    CreatedDate: new Date(),
                    CreatedBy: sessionStorageData.CurrentUser,
                    UpdatedDate: new Date(),
                    UpdatedBy: sessionStorageData.CurrentUser
                }
                

                fetch(fullPlacementOffenseAddress, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + sessionStorageData.Token
                    },
                    body: JSON.stringify(placementOffense)
                }).catch(error => {
                    triggerErrorMessage("an error occurred while saving the offense record.");
                });
            }

            getPlacementsByClientProfileID();

            props.createNotification('The placement was successfully saved.');

            toggleCaseEnrollmentModal();
   
        });
    }

    let placementLevelOptions = [];
    if ( placementLevels.length > 0) {
        placementLevelOptions = placementLevels.map((value) =>
        <a key={value.ID} value={value.ID} description={value.Name} onClick={ overallRiskSelectHandler } className="dropdown-item">{value.Name}</a>
      );
    }

    let judgeOptions = [];
    if ( judges.length > 0) {
        judgeOptions = judges.map((value) =>
        <a key={value.ID} value={value.ID} description={value.Name} onClick={ judgeSelectHandler } className="dropdown-item">{value.Name}</a>
      );
    }

    return <div>
        <input type="hidden" id="hdnPlacementID" />
        <input type="hidden" id="hdnOffenseID" />
        <input type="hidden" id="hdnPlacementCreatedDate" />
        <input type="hidden" id="hdnPlacementCreatedBy" />
        <input type="hidden" id="hdnPlacementUpdatedDate" />
        <input type="hidden" id="hdnPlacementUpdatedBy" />
        <h3>Referral</h3>
        <br/>
        <button id="btnAddCaseEnrollment" className="btn btn-primary" onClick={toggleCaseEnrollmentModal} >Add Case Info</button>
        <br/>
        <br/>
        <div id="enrollmentSpinner" style={{display:'none'}} className="spinner"></div>
        <div id="placementsContainer">

        </div>
            <form id="frmCaseEnrollment">
            <div className="modal fade" id="caseEnrollmentModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Service Units</h5>
                            
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-row">
                                <div className="col-4">           
                                    <label htmlFor="txtCourtOrderDate"><strong>Court Order Date</strong></label>
                                    <input type="date" defaultValue="" id="txtCourtOrderDate" className="form-control"></input>
                                </div>
                                <div className="col-6">
                                    <label htmlFor="btnOverallRisk"><strong>Overall Risk at Time of Placement *</strong></label>
                                    <div className="dropdown">
                                        <button type="button" id="btnOverallRisk" value="" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                            
                                        </button>
                                        <div className="dropdown-menu">
                                            {placementLevelOptions}
                                        </div>
                                    </div>
                                    <div style={{display:'none'}} id="divOverallRiskError" className='errorDiv'>Please select a value.</div> 
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="col-4">
                                    <label htmlFor="txtNextCourtDate"><strong>Next Court Date</strong></label>
                                    <input type="date" defaultValue="" id="txtNextCourtDate" className="form-control"></input>
                                </div>
                                <div className="col-6">
                                    <label htmlFor="btnJudge"><strong>Judge *</strong></label>
                                    <div className="dropdown">
                                        <button type="button" id="btnJudge" value="" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                            
                                        </button>
                                        <div className="dropdown-menu">
                                            {judgeOptions}
                                        </div>
                                    </div>
                                    <div style={{display:'none'}} id="divJudgeError" className='errorDiv'>Please select a value.</div> 
                                </div>
                            </div>
                            <div className="form-row">
                                <label htmlFor="txtPlacementCharges"><strong>Placement Charges *</strong></label>
                                <input id="txtPlacementCharges" onKeyDown={ placementChargesOnKeyDownEventHandler } onChange={ onPlacementChargeChangeEventHandler } className="form-control" />
                            </div>
                            <div style={{display:'none'}} id="divPlacementCharges" className='errorDiv'>Please select a value.</div>
                            <div id="divPlacementChargesContainer">

                            </div>
                            <br/>
                            <div className="form-row">
                                <label><strong>Court Order Narrative</strong></label>
                                <textarea id="txtCourtOrderNarrative" className="form-control"></textarea>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" id="btnSavePlacement" onClick = {savePlacement} className="btn btn-primary">Save</button>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
        {
            parseInt(sessionData.SystemID) === systems.OCWB ?
            <ReferralCWB
            staffValues = {staff}
            serviceReleaseValues = {serviceReleases }
            serviceOutcomeValues = { serviceOutcomes }
            togglePlacementModal={togglePlacementModal}
            refreshEnrollmentGrid = { getPlacementsByClientProfileID }
            createNotification={props.createNotification}
            createErrorNotification={props.createErrorNotification}
         /> : <div></div>
        }
        {
            parseInt(sessionData.SystemID) === systems.Juvenile ?
            <ReferralJuvenile
                staffValues = {staff}
                serviceReleaseValues = {serviceReleases }
                serviceOutcomeValues = { serviceOutcomes }
                togglePlacementModal={togglePlacementModal}
                refreshEnrollmentGrid = { getPlacementsByClientProfileID }
                createNotification={props.createNotification}
                createErrorNotification={props.createErrorNotification} 
            /> : <div></div>
        }
   
         <PrintEnrollment 
         clientProfileID = {clientProfileId }
         clientProfile ={props.clientProfile} />
        <ServiceUnit />
        <ProgressNote
            contactTypeValues = { contactTypes }
            subContactTypeValues = { subContactTypes }
        />
    </div>
}

export default EnrollmentCaseModal;