import React, { useState, useEffect } from 'react';
import { getSessionData } from './commonAdmin';
import $ from 'jquery';
import AddressModal from './AddressModal';

const FamilyInfo = (props) => {

    let personId = '';
    let clientProfileId = '';
    
    let maritalStatuses = props.maritalStatusValues;
    let relationships = props.relationshipValues;
    let suffixes = props.suffixValues;


    let familyInfoTable;

    if (props.clientProfile !== undefined) {
        personId = props.clientProfile.Person.ID;
        clientProfileId = props.clientProfileID.ID;
    }

    if (props.clientProfile !== undefined && props.clientProfile.FamilyProfile !== null && props.clientProfile.FamilyProfile.length > 0) {
       
        let familyProfile = props.clientProfile.FamilyProfile;

        familyInfoTable = generateTable(familyProfile);

    }
    
    useEffect(() => {

        if (props.clientProfile !== undefined && props.clientProfile.FamilyProfile !== null && props.clientProfile.FamilyProfile.length > 0) {
            getFamilyMembers();
        }
    });


    function generateTable(familyProfile) {

        let tableRef = document.getElementById("tblFamilyInfo").getElementsByTagName('tbody')[0];
        tableRef.innerHTML = "";
        familyProfile.forEach(profile => {
            let newRow = tableRef.insertRow();

            //add the edit button
            let editButton = document.createElement("button");
            editButton.classList.add("btn");
            editButton.classList.add("btn-secondary");
            editButton.classList.add("btn-sm");
            editButton.setAttribute("data-id", props.clientProfile.Person.ID);
            editButton.setAttribute("data-familymemberid", profile.FamilyProfile.ID);
            editButton.innerText = "Edit";
            editButton.title = "edit the family member";
            editButton.onclick = getFamilyMemberDetails;

            let editFamilyButtonCell = newRow.insertCell(0);
            editFamilyButtonCell.appendChild(editButton);

            //add the Address button
            let addressButton = document.createElement("button");
            addressButton.classList.add("btn");
            addressButton.classList.add("btn-secondary");
            addressButton.classList.add("btn-sm");
            addressButton.setAttribute("data-id", profile.FamilyProfile.FamilyMemberID);
            addressButton.innerText = "Address";
            addressButton.title = "edit the family member's address";
            addressButton.onclick = toggleAddressModal;

            let addressButtonCell = newRow.insertCell(1);
            addressButtonCell.appendChild(addressButton);

            let lastNameCell = newRow.insertCell(2);
            lastNameCell.innerText = profile.FamilyProfile.Person.LastName;
            
            let firstNameCell = newRow.insertCell(3);
            firstNameCell.innerText = profile.FamilyProfile.Person.FirstName;

            let middleNameCell = newRow.insertCell(4);
            middleNameCell.innerText = profile.FamilyProfile.Person.MiddleName;           

            let suffixCell = newRow.insertCell(5);
            suffixCell.innerText = (profile.FamilyProfile.Person.Suffix !== null) ? profile.FamilyProfile.Person.Suffix.Description : '';

            let relationshipCell = newRow.insertCell(6);
            relationshipCell.innerText = (profile.FamilyProfile.Relationship !== null) ? profile.FamilyProfile.Relationship.Description : '';

            let homePhoneCell = newRow.insertCell(7);
            homePhoneCell.innerText = profile.PersonSupplemental.HomePhone;

            let workPhoneCell = newRow.insertCell(8);
            workPhoneCell.innerText = profile.PersonSupplemental.WorkPhone;

            let emergencyContactCell = newRow.insertCell(9);
            emergencyContactCell.innerText = (profile.PersonSupplemental.HasEmergencyContactNo === true) ? 'Yes' : 'No';

            //add the delete button for each row
            let deleteButton = document.createElement("button");
            deleteButton.classList.add("btn");
            deleteButton.classList.add("btn-danger");
            deleteButton.classList.add("btn-sm");
            deleteButton.setAttribute("data-id", profile.FamilyProfile.FamilyMemberID);
            deleteButton.innerText = "Delete";
            deleteButton.title = "delete the family member";
            deleteButton.onclick = deleteFamilyMember;

            let deleteButtonCell = newRow.insertCell(10);
            deleteButtonCell.appendChild(deleteButton);

        });
    }

    function deleteFamilyMember(event) {
        let userInput = confirm("Are you sure you want to delete this family member?");
        if (!userInput) return;

        let selectedFamilyMemberId = event.currentTarget.getAttribute("data-id");

        let apiAddress = sessionStorage.getItem("baseApiAddress");
        let sessionStorageData = getSessionData();

        let familyMemberPersonAddressUrl = `${apiAddress}/api/FamilyProfile/DeleteMember/${selectedFamilyMemberId}`;

        fetch(familyMemberPersonAddressUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorageData.Token
            }
        }).then(result => {
            if (result.status === 200) {
                return result.json();
            }
            else {
                return result;
            }
        }).then(result => {
            if (result === "Success") {
               props.createNotification("The family member record was successfully deleted.");
               getFamilyMembers();
               return;
            } else {
                props.createErrorNotification("An error occured.");
                console.log(result);
            }
        });
    }


    function toggleAddressModal(event) {
        let selectedFamilyMemberPersonID = event.currentTarget.getAttribute("data-id");

        $("#hdnCurrentFamilyMemberPersonID").val(selectedFamilyMemberPersonID);

        let apiAddress = sessionStorage.getItem("baseApiAddress");
        let sessionStorageData = getSessionData();

        let familyMemberPersonAddressUrl = `${apiAddress}/api/PersonAddress/GetByPersonID/${selectedFamilyMemberPersonID}`;

        fetch(familyMemberPersonAddressUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorageData.Token
            }
        }).then(result =>  {
            if (result.status === 200) {
                return result.json();
            }
            else {
                return result;
            }
        })
        .then(result => {
            if (result !== null || result !== undefined) {
                
                $("#hdnAmAddressID").val(result.ID);
                $("#hdnAmAdddressTypeID").val(result.AddressTypeID);
                $("#hdnAmAddressCreatedDate").val(result.CreatedDate);
                $("#hdnAmAddressCreatedBy").val(result.CreatedBy);
                $("#txtAmAddressLineOne").val(result.AddressLineOne);
                $("#txtAmAddressLineTwo").val(result.AddressLineTwo);
                $("#txtAmCity").val(result.City);
                $("#txtAmState").val(result.State);
                $("#txtAmZip").val(result.Zip);
                $("#txtAmComments").val(result.Comments);
                $("#txtAmTimeCurrentAddress").val(result.TimeAtCurrentAddress);
            }
        });

        $('#addressModal').modal('toggle');
    }

    function addFamilyMember() {
        clearFamilyMemberModal();
        $('#familyMemberModal').modal('toggle');
    }

    function getFamilyMembers() {
       let clientID = props.clientProfile.Person.ID;
       let apiAddress = sessionStorage.getItem("baseApiAddress");
       let fullPersonFamilyProfileAddress = `${apiAddress}/api/ClientProfile/FamilyProfile/${clientID}`;
       let sessionStorageData = getSessionData();

       fetch(fullPersonFamilyProfileAddress, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorageData.Token
        }
        }).then(result => result.json())
        .then(result => { 
            //console.log(result);
            generateTable(result);
        });

    }

    function getFamilyMemberDetails(event) {

       clearFamilyMemberModal();
      
       let clientID = event.currentTarget.getAttribute("data-id");
       console.log('the clientID is' + clientID);

       let familyMemberID = event.currentTarget.getAttribute("data-familymemberid");
       console.log('the family memberID is ' + familyMemberID);

       let apiAddress = sessionStorage.getItem("baseApiAddress");
       let fullPersonFamilyProfileAddress = `${apiAddress}/api/ClientProfile/FamilyProfile/${clientID}`;
       let sessionStorageData = getSessionData();

       fetch(fullPersonFamilyProfileAddress, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorageData.Token
            }
        }).then(result => result.json())
        .then(result => {

            if (result === null || result === undefined || result.length === 0)  {
                props.createErrorNotification("an error occurred while retrieving the record.");
                return;
            }

            //filter the result by the familyMemberID
            let selectedFamilyMember = result.filter(function(familyMember) {
                return familyMember.FamilyProfile.ID === parseInt(familyMemberID);
            });

            let person = selectedFamilyMember[0].FamilyProfile.Person;
            let relationship = selectedFamilyMember[0].FamilyProfile.Relationship;
            let personSupplemental = selectedFamilyMember[0].PersonSupplemental;
            let familyProfile = selectedFamilyMember[0].FamilyProfile;

            $("#txtFMLastName").val(person.LastName);
            $("#txtFMFirstName").val(person.FirstName);
            $("#txtFMMiddleName").val(person.MiddleName);

            if (relationship !== null) {
                document.getElementById("btnFMRelationship").value = relationship.ID;
                document.getElementById("btnFMRelationship").innerHTML = relationship.Description;
            }

            $("#txtFMSSN").val(person.SSN);

            if (personSupplemental.MaritalStatus !== null) {
                document.getElementById("btnFMMaritalStatus").value = personSupplemental.MaritalStatus.ID;
                document.getElementById("btnFMMaritalStatus").innerHTML = personSupplemental.MaritalStatus.Description;
            }

            if (person.Suffix !== null) {
                document.getElementById("btnFMSuffix").value = person.Suffix.ID;
                document.getElementById("btnFMSuffix").innerHTML = person.Suffix.Description;
            }

            $("#txtMonthlyIncome").val(personSupplemental.Income);

            setRadioButtonState("rdpIsFHHYes", "rdpIsFHHNo", personSupplemental.HasFHH);
            setRadioButtonState("rdpEmergencyContactYes", "rdpEmergencyContactNo", personSupplemental.HasEmergencyContactNo);

            $("#txtFMHomePhone").val(personSupplemental.HomePhone);
            $("#txtWorkFMPhone").val(personSupplemental.WorkPhone);
            $("#txtWorkPhoneExt").val(personSupplemental.WorkPhoneExt);
            $("#txtFMAltPhone").val(personSupplemental.OtherPhone);
            $("#txtAltPhoneExt").val(personSupplemental.OtherPhoneExt);
            $("#txtFMComments").val(personSupplemental.Comments);
            $("#hdnPersonSupplementalID").val(personSupplemental.ID);
            $("#hdnPersonSupplementalPersonID").val(personSupplemental.PersonID);

            //$("#hdnCurrentFamilyProfileID").val(result[0].FamilyProfile.ID);
            $("#hdnCurrentFamilyProfileID").val(familyProfile.ID);
            //$("#hdnFamilyMemberID").val(result[0].FamilyProfile.FamilyMemberID);
            $("#hdnFamilyMemberID").val(familyProfile.FamilyMemberID);
            
            $("#hdnFamilyProfileCreatedDate").val(familyProfile.CreatedDate);
            $("#hdnFamilyProfileCreatedBy").val(familyProfile.CreatedBy);
            $("#hdnPersonCreatedDate").val(person.CreatedDate);
            $("#hdnPersonCreatedBy").val(person.CreatedBy);
            $("#hdnPersonSupplementalCreatedDate").val(personSupplemental.CreatedDate);
            $("#hdnPersonSupplementalCreatedBy").val(personSupplemental.CreatedBy);

            $('#familyMemberModal').modal('toggle');

        });
    }

    function clearFamilyMemberModal() {
        $("#txtFMLastName").val('');
        $("#txtFMFirstName").val('');
        $("#txtFMMiddleName").val('');
        document.getElementById("btnFMRelationship").innerHTML = 'Please Select';
        document.getElementById("btnFMMaritalStatus").innerHTML = 'Please Select';
        document.getElementById("btnFMSuffix").innerHTML = 'Please Select';
        $("#txtMonthlyIncome").val('');
        setRadioButtonState('rdpIsFHHYes', 'rdpIsFHHNo', false);
        setRadioButtonState('rdpEmergencyContactYes', 'rdpEmergencyContactNo', false);
        $("#txtFMHomePhone").val('');
        $("#txtWorkFMPhone").val('');
        $("#txtWorkPhoneExt").val('');
        $("#txtFMAltPhone").val('');
        $("#txtAltPhoneExt").val('');
        $("#txtFMComments").val('');

        $("#hdnPersonSupplementalID").val('');
        $("#hdnPersonSupplementalPersonID").val('');
        $("#hdnCurrentFamilyProfileID").val('');
        $("#hdnFamilyMemberID").val('');

        $("#hdnFamilyProfileCreatedDate").val('');
        $("#hdnFamilyProfileCreatedBy").val('');
        $("#hdnPersonCreatedDate").val('');
        $("#hdnPersonCreatedBy").val('');
        $("#hdnPersonSupplementalCreatedDate").val('');
        $("#hdnPersonSupplementalCreatedBy").val('');
    }

    function handleMaritalStatusChange(event){        
        let selectedValue = event.currentTarget.getAttribute('value');
        
        document.getElementById("btnFMMaritalStatus").value = selectedValue;
        
        let selectedMaritalStatus =  maritalStatuses.filter(function (educationLevel) {
            return educationLevel.ID === parseInt(selectedValue)
        });

        document.getElementById("btnFMMaritalStatus").innerHTML = selectedMaritalStatus[0].Description;
    }

    function handleRelationshipChange(event){        
        let selectedValue = event.currentTarget.getAttribute('value');
        
        document.getElementById("btnFMRelationship").value = selectedValue;
        
        let selectedRelationship = relationships.filter(function (maritalStatus) {
            return maritalStatus.ID === parseInt(selectedValue)
        });

        document.getElementById("btnFMRelationship").innerHTML = selectedRelationship[0].Description;
    }

    function handleSuffixChange(event){        
        let selectedValue = event.currentTarget.getAttribute('value');
        
        document.getElementById("btnFMSuffix").value = selectedValue;
        
        let selectedSuffix =  suffixes.filter(function (suffix) {
            return suffix.ID === parseInt(selectedValue)
        });

        document.getElementById("btnFMSuffix").innerHTML = selectedSuffix[0].Description;
    }


    let maritalStatusValueOptions = [];
    if ( maritalStatuses.length > 0) {

        maritalStatusValueOptions = maritalStatuses.map((value) =>
            <a key={value.ID} value={value.ID} description={value.Description} onClick={handleMaritalStatusChange} className="dropdown-item">{value.Description}</a>
        );
    }

    
    let relationshipValueOptions = [];
    if ( relationships.length > 0) {

        relationshipValueOptions = relationships.map((value) =>
            <a key={value.ID} value={value.ID} description={value.Description} onClick={handleRelationshipChange} className="dropdown-item">{value.Description}</a>
        );
    }

    
    let suffixValueOptions = [];
    if ( suffixes.length > 0) {

        suffixValueOptions = suffixes.map((value) =>
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

        let familyProfileID = $("#hdnCurrentFamilyProfileID").val();

        let familyProfileCreatedDate = (familyProfileID !== "") ? $("#hdnFamilyProfileCreatedDate").val() : new Date();
        let familyProfileCreatedBy = (familyProfileID !== "") ? $("#hdnFamilyProfileCreatedBy").val() : sessionStorageData.CurrentUser;
        let personCreatedDate = (familyProfileID !== "") ? $("#hdnPersonCreatedDate").val() : new Date();
        let personCreatedBy = (familyProfileID !== "") ? $("#hdnPersonCreatedBy").val() : sessionStorageData.CurrentUser;
        let personSupplementalCreatedDate = (familyProfileID !== "") ? $("#hdnPersonSupplementalCreatedDate").val() : new Date();
        let personSupplementalCreatedBy = (familyProfileID !== "") ? $("#hdnPersonSupplementalCreatedBy").val() : sessionStorageData.CurrentUser;

        let methodType = (familyProfileID !== "") ? 'PUT' : 'POST';

        //first, we create the family profile person object. this gets saved first
        let person = {
            LastName: $("#txtFMLastName").val(),
            FirstName: $("#txtFMFirstName").val(),
            MiddleName: $("#txtFMMiddleName").val(),
            SuffixID: $("#btnFMSuffix").val(),
            SSN: $("#txtFMSSN").val(),
            Active: true,
            CreatedDate: personCreatedDate,
            CreatedBy: personCreatedBy,
            UpdatedDate: new Date(),
            UpdatedBy: sessionStorageData.CurrentUser
        }

        let familyProfile = {
            ClientProfilePersonID: clientProfileId, 
            RelationshipID: $("#btnFMRelationship").val(),
            PrimaryContactFlag: getRadioButtonState("rdpEmergencyContactYes"),
            Person: person,
            Active: true,
            CreatedDate: familyProfileCreatedDate,
            CreatedBy: familyProfileCreatedBy,
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
            CreatedDate: personSupplementalCreatedDate,
            CreatedBy: personSupplementalCreatedBy,
            UpdatedDate: new Date(),
            UpdatedBy: sessionStorageData.CurrentUser
        }

        //this is an update, and we need to pass these params
        if (familyProfileID !== "") {
            person.ID = $("#hdnPersonSupplementalPersonID").val(), 
            familyProfile.FamilyMemberID = $("#hdnFamilyMemberID").val(),
            personSupplemental.ID = $("#hdnPersonSupplementalID").val(),
            personSupplemental.PersonID = $("#hdnPersonSupplementalPersonID").val(), 
            familyProfile.ID = familyProfileID //$("#hdnFamilyMemberID").val() //familyProfileID
        }

        let familyProfileViewModel = {
            FamilyProfile: familyProfile,
            personSupplemental: personSupplemental
        }


        fetch(fullPersonFamilyProfileAddress, {
            method: methodType,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorageData.Token
            },
            body: JSON.stringify(familyProfileViewModel)
        }).then(result => result.json())
        .then(result => {
            console.log(result);

            if (result === null || result.Message !== undefined) {
                props.createErrorNotification("an error occurred while saving the record.");
                return;
            }

            getFamilyMembers();

            props.createNotification('The family profile was successfully updated.');


        });

        $('#familyMemberModal').modal('toggle');
    }

    function createNotification(message) {
        props.createNotification(message);
    }

    function createErrorNotification(message) {
        props.createErrorNotification(message);
    }


     return <div>
         <br></br>
         <input type="hidden" defaultValue="" id="hdnCurrentFamilyMemberPersonID" />
         <input type="hidden" defaultValue="" id="hdnCurrentFamilyProfileID" />
         <input type="hidden" defaultValue="" id="hdnFamilyMemberID" />
         <input type="hidden" defaultValue="" id="hdnPersonSupplementalID" />
         <input type="hidden" defaultValue="" id="hdnPersonSupplementalPersonID" />
         <input type="hidden" defaultValue="" id="hdnFamilyProfileCreatedDate" />
         <input type="hidden" defaultValue="" id="hdnFamilyProfileCreatedBy" />
         <input type="hidden" defaultValue="" id="hdnPersonCreatedDate" />
         <input type="hidden" defaultValue="" id="hdnPersonCreatedBy" />
         <input type="hidden" defaultValue="" id="hdnPersonSupplementalCreatedDate" />
         <input type="hidden" defaultValue="" id="hdnPersonSupplementalCreatedBy" />
         <input type="hidden" defaultValue="" id="hdnFMPersonId" />
         <input type="hidden" defaultValue="" id="hdnClientProfileId" />
         <h5>Family Info</h5>
         <button id="btnAddFamilyMember" onClick={addFamilyMember} className="btn btn-primary">Add Family Member</button>
         <br/>
         <br/>
         <table id="tblFamilyInfo" className="table">
             <thead>
                 <tr>
                    <th scope="col"></th>
                    <th scope="col"></th>
                    <th scope="col">Last Name</th>
                    <th scope="col">First Name</th>
                    <th scope="col">Middle Name</th>
                    <th scope="col">Suffix</th>
                    <th scope="col">Relationship</th>
                    <th scope="col">Home Phone</th>
                    <th scope="col">Work Phone</th>
                    <th scope="col">Emergency Contact</th>
                 </tr>
             </thead>
             <tbody>

             </tbody>
         </table>
         {/* {familyInfoTable} */}
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
                        <button type="button" className="btn btn-primary" onClick={saveNewFamilyProfile}  >Save</button>
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
        <AddressModal
         ClientPersonID={personId}
          createNotification={ createNotification } 
          createErrorNotification={ createErrorNotification }
        />
     </div>;
};

export default FamilyInfo;