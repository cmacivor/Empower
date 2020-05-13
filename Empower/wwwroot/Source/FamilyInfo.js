import React, { useState, useEffect } from 'react';
import { getSessionData } from './commonAdmin';
import $ from 'jquery';

const FamilyInfo = (props) => {

    let personId = '';
    let lastName = '';
    let firstName = '';
    let middleName = '';
    let ssn = '';

    
    let maritalStatuses = props.maritalStatusValues;
    let relationships = props.relationshipValues;
    let suffixes = props.suffixValues;

    if (props.clientProfile !== undefined && props.clientProfile.FamilyProfile !== null) {
        personId = props.clientProfile.Person.ID;

    }

    const [maritalStatusValues, setMaritalStatusValues ] = useState(maritalStatuses);
    const [relationshipValues, setRelationshipValues] = useState(relationships);
    const [suffixValues, setSuffixValues ] = useState(suffixes);


    useEffect(() => {

        $("#hdnFMPersonId").val(personId);

        setMaritalStatusValues(maritalStatuses);
        setRelationshipValues(relationships);
        setSuffixValues(suffixes);
    });

    function addFamilyMember() {
        $('#familyMemberModal').modal('toggle');
    }

    function handleMaritalStatusChange(event){        
        let selectedValue = event.currentTarget.getAttribute('value');
        
        document.getElementById("btnFMMaritalStatus").value = selectedValue;
        
        let selectedMaritalStatus =  maritalStatusValues.filter(function (educationLevel) {
            return educationLevel.ID === parseInt(selectedValue)
        });

        document.getElementById("btnFMMaritalStatus").innerHTML = selectedMaritalStatus[0].Description;
    }

    function handleRelationshipChange(event){        
        let selectedValue = event.currentTarget.getAttribute('value');
        
        document.getElementById("btnFMRelationship").value = selectedValue;
        
        let selectedRelationship =  relationshipValues.filter(function (maritalStatus) {
            return maritalStatus.ID === parseInt(selectedValue)
        });

        document.getElementById("btnFMRelationship").innerHTML = selectedRelationship[0].Description;
    }

    function handleSuffixChange(event){        
        let selectedValue = event.currentTarget.getAttribute('value');
        
        document.getElementById("btnFMSuffix").value = selectedValue;
        
        let selectedSuffix =  suffixValues.filter(function (suffix) {
            return suffix.ID === parseInt(selectedValue)
        });

        document.getElementById("btnFMSuffix").innerHTML = selectedSuffix[0].Description;
    }


    let maritalStatusValueOptions = [];
    if (maritalStatusValues.length > 0) {

        maritalStatusValueOptions = maritalStatusValues.map((value) =>
            <a key={value.ID} value={value.ID} description={value.Description} onClick={handleMaritalStatusChange} className="dropdown-item">{value.Description}</a>
        );
    }

    
    let relationshipValueOptions = [];
    if (relationshipValues.length > 0) {

        relationshipValueOptions = relationshipValues.map((value) =>
            <a key={value.ID} value={value.ID} description={value.Description} onClick={handleRelationshipChange} className="dropdown-item">{value.Description}</a>
        );
    }

    
    let suffixValueOptions = [];
    if (suffixValues.length > 0) {

        suffixValueOptions = suffixValues.map((value) =>
            <a key={value.ID} value={value.ID} description={value.Description} onClick={handleSuffixChange } className="dropdown-item">{value.Description}</a>
        );
    }

    function setRadioButtonState(rdYes, rdNo, clientValue) {
        if (clientValue === null || clientValue === '') {
            document.getElementById(rdNo).checked = true;
            return;
        }

        if (clientValue) {
            document.getElementById(rdYes).checked = true;
        } else {
            document.getElementById(rdNo).checked = true;
        }
    }

    function getRadioButtonState(rdYes) {
        let yesChecked = document.getElementById(rdYes).checked;
        if (yesChecked) {
            return true;
        }
        return false;
    }


    function saveNewFamilyProfile() {

        let apiAddress = sessionStorage.getItem("baseApiAddress");
        let fullPersonFamilyProfileAddress = `${apiAddress}/api/FamilyProfile`;
        let sessionStorageData = getSessionData();

        //first, we create the family profile person object. this gets saved first
        let person = {
            LastName: $("#txtFMLastName").val(),
            FirstName: $("#txtFMFirstName").val(),
            MiddleName: $("#txtFMMiddleName").val(),
            SuffixID: $("#btnFMSuffix").val(),
            SSN: $("#txtFMSSN").val(),
            Active: true,
            CreatedDate: new Date(),
            CreatedBy: sessionStorageData.CurrentUser,
            UpdatedDate: new Date(),
            UpdatedBy: sessionStorageData.CurrentUser
        }

        let familyProfile = {
            ClientProfilePersonID: $("#hdnFMPersonId").val(),
            RelationshipID: $("#btnFMRelationship").val(),
            PrimaryContactFlag: getRadioButtonState("rdpEmergencyContactYes"),
            Person: person,
            Active: true,
            CreatedDate: new Date(),
            CreatedBy: sessionStorageData.CurrentUser,
            UpdatedDate: new Date(),
            UpdatedBy: sessionStorageData.CurrentUser
        }

        let personSupplemental = {
            MaritalStatusID: $("#btnFMMaritalStatus").val(),
            Income: $("#txtMonthlyIncome").val(),
            HasFHH: getRadioButtonState("rdpIsFHHYes"),
            HasEmergencyContactNo: getRadioButtonState("rdpEmergencyContactYes"),
            HomePhone: $("#txtFMHomePhone").val(),
            WorkPhone: $("#txtWorkFMPhone").val(),
            WorkPhoneExt: $("#txtWorkPhoneExt").val(),
            OtherPhone: $("txtFMAltPhone").val(),
            Comments : $("#txtFMComments").val(),
            Active: true,
            CreatedDate: new Date(),
            CreatedBy: sessionStorageData.CurrentUser,
            UpdatedDate: new Date(),
            UpdatedBy: sessionStorageData.CurrentUser
        }

        let familyProfileViewModel = {
            FamilyProfile: familyProfile,
            personSupplemental: personSupplemental
        }


        fetch(fullPersonFamilyProfileAddress, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorageData.Token
            },
            body: JSON.stringify(familyProfileViewModel)
        }).then(result => result.json())
        .then(result => {
            console.log(result);

            if (result === null) {
                props.createErrorNotification("an error occurred while saving the record.");
                return;
            }

            props.createNotification('The family profile was successfully updated.');
        });



    }

     return <div>
         <br></br>
         <input type="hidden" defaultValue="" id="hdnFMPersonId" />
         <h5>Family Info</h5>
         <button id="btnAddFamilyMember" onClick={addFamilyMember} className="btn btn-primary">Add Family Member</button>
         <div className="modal fade" id="familyMemberModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Family Member/Contact</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="form-row">
                            <div className="col-4">
                                <label htmlFor="txtFMFirstName"><strong>First Name</strong></label>
                                <input type="text" className="form-control" defaultValue=""  id="txtFMFirstName"></input>
                            </div>
                            <div className="col-4">
                                <label htmlFor="txtFMMiddleName"><strong>Middle Name</strong></label>
                                <input type="text" className="form-control" defaultValue=""  id="txtFMMiddleName"></input>
                            </div>
                            <div className="col-4">
                                <label htmlFor="txtFMLastName"><strong>Last Name</strong></label>
                                <input type="text" className="form-control" defaultValue=""  id="txtFMLastName"></input>
                            </div>
                        </div>
                        <br></br>
                        <div className="form-row">    
                            <div className="col-4">
                                <label htmlFor="ddlEducationLevels"><strong>Relationship</strong></label>
                                <div className="dropdown">
                                    <button type="button" id="btnFMRelationship" value="" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                        
                                    </button>
                                    <div className="dropdown-menu">
                                        {relationshipValueOptions}
                                    </div>
                                </div>                                     
                            </div>
                            <div className="col-4">
                                <label htmlFor="txtFMSSN"><strong>SSN</strong></label>
                                <input type="text" id="txtFMSSN" className="form-control" defaultValue=""></input>
                            </div>
                            <div className="col-4">
                                <label htmlFor="ddlFMMaritalStatus"><strong>Marital Status</strong></label>
                                <div className="dropdown">
                                    <button type="button" id="btnFMMaritalStatus" value="" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                        
                                    </button>
                                    <div className="dropdown-menu">
                                        {maritalStatusValueOptions}
                                    </div>
                                </div> 
                            </div> 
                        </div>
                        <br></br>
                        <div className="form-row">
                            <div className="col-3">
                                <label htmlFor="ddlFMSuffix"><strong>Suffix</strong></label>
                                <div className="dropdown">
                                    <button type="button" id="btnFMSuffix" value="" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                        
                                    </button>
                                    <div className="dropdown-menu">
                                        {suffixValueOptions}
                                    </div>
                                </div> 
                            </div>
                            <div className="col-3">
                                <label htmlFor="lblMonthlyIncome"><strong>Monthly Income($)</strong> </label>
                                <input type="text" id="txtMonthlyIncome" className="form-control" defaultValue=""></input>
                            </div>
                            <div className="col-3">
                                <label><strong>FHH</strong></label>
                                <div>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" name="rdpIsFHH" id="rdpIsFHHYes"  />
                                        <label className="form-check-label">Yes</label>         
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" name="rdpIsFHH" id="rdpIsFHHNo"  />
                                        <label className="form-check-label">No</label>
                                    </div>
                                </div>
                            </div>
                            <div className="col-3">
                                <label htmlFor="lblEmergencyContact">Emergency Contact?</label>
                                <div>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" name="rdpEmergencyContact" id="rdpEmergencyContactYes"  />
                                        <label className="form-check-label">Yes</label>         
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" name="rdpEmergencyContact" id="rdpEmergencyContactNo"  />
                                        <label className="form-check-label">No</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <br></br>
                        <div className="form-row">
                            <div className="col-3">
                                <label><strong>Home Phone</strong></label>
                                <input type="text" id="txtFMHomePhone" defaultValue="" className="form-control" />
                            </div>
                            <div className="col-3">
                                <label><strong>Work Phone</strong></label>
                                <input type="text" id="txtWorkFMPhone" defaultValue="" className="form-control" />
                            </div>
                            <div className="col-1">
                                <label><strong>Ext.</strong></label>
                                <input type="text" className="form-control" id="txtWorkPhoneExt" defaultValue="" />
                            </div>
                            <div className="col-3">
                                <label><strong>Alt Phone</strong></label>
                                <input type="text" id="txtFMAltPhone" defaultValue="" className="form-control" />
                            </div>
                            <div className="col-1">
                                <label><strong>Ext.</strong></label>
                                <input type="text" className="form-control" id="txtAltPhoneExt" defaultValue="" />
                            </div>
                        </div>
                        <br></br>
                        <div className="form-row">
                            <label><strong>Comments</strong></label>
                            <textarea id="txtFMComments" className="form-control" defaultValue="" />
                        </div>

                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" onClick={saveNewFamilyProfile}  >Save New</button>
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
     </div>;
};

export default FamilyInfo;