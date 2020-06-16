import React, { useState, useEffect, useCallback } from 'react';
import $ from 'jquery';
import { getSessionData } from './commonAdmin';
import moment from 'moment';
import Referral from './Referral';
import PrintEnrollment from './PrintEnrollment';

//import modal from './bootstrap.js';
//import {modal} from './bootstrap.js';

const Enrollment = (props) => {

    let personId = '';
    let clientProfileId = '';
    let placements;

    if (props.clientProfile !== undefined) {
        //console.log('the family profiles in CWB');
        //console.log(props.familyProfiles.FamilyProfile);
        //console.log(props.clientProfile);

        personId = props.clientProfile.Person.ID;
        clientProfileId = props.clientProfile.ID;
    }

    let assistanceTypes = props.assistanceTypeValues;
    let careerPathways = props.careerPathwayValues;
    let staff = props.staffValues;
    let serviceReleases = props.serviceReleaseValues;
    let serviceOutcomes = props.serviceOutcomeValues;
    
    useEffect(() => {

        if (props.clientProfile !== undefined) {

            //placements = props.placement;
            //let placementVM = fetchPlacements();
            generateTable(props.placement);

            generatePrintModal(props.placement, props.familyProfiles.FamilyProfile);
            //generateTable(placements);
        }

        document.getElementById("btnViewTanf").value = 'Please Select';
        document.getElementById("btnViewTanf").innerHTML = 'Please Select';

        document.getElementById("btnViewTanf").value = 'Please Select';
        document.getElementById("btnViewTanf").innerHTML = 'Please Select';

        document.getElementById("btnEnrollmentBenefits").value = 'Please Select';
        document.getElementById("btnEnrollmentBenefits").innerHTML = 'Please Select';

        document.getElementById("btnCareerPathwayPosition").value = 'Please Select';
        document.getElementById("btnCareerPathwayPosition").innerHTML = 'Please Select';

        document.getElementById("btnFullTimePartTime").value = 'Please Select';
        document.getElementById("btnFullTimePartTime").innerHTML = 'Please Select';

        document.getElementById("btnAssistanceType").value = 'Please Select';        
        document.getElementById("btnAssistanceType").innerHTML = 'Please Select';

        document.getElementById("btnCareerPathwayPosition").value = 'Please Select';
        document.getElementById("btnCareerPathwayPosition").innerHTML = 'Please Select';

     });

    function toggleEnrollmentModal() {
        //TODO: add function to clear the modal on opening
        $("#enrollmentModal").modal('toggle');
    }

    function togglePlacementModal() {
        $("#referralModal").modal('toggle');
    }

    function togglePrintScreen() {
        //let selectedEnrollmentID = event.currentTarget.getAttribute("data-id");
        //$("#hdnPrintSelectedEnrollmentID").val(selectedEnrollmentID);

        $("#printModal").modal('toggle');
    }

    function ddlViewTanfSelectEventHandler(event) {
        let selectedValue = event.currentTarget.getAttribute('value');
      
        document.getElementById("btnViewTanf").value = selectedValue;

        let displayValue;
        if (selectedValue === "35") {
            displayValue = "Yes";
        } else if (selectedValue === "36") {
            displayValue = "No";
        }

        document.getElementById("btnViewTanf").innerHTML =  displayValue;
    }

    function ddlSnapSelectEventHandler(event) {
        //btnSnapEt
        let selectedValue = event.currentTarget.getAttribute('value');
      
        document.getElementById("btnSnapEt").value = selectedValue;

        let displayValue;
        if (selectedValue === "24") {
            displayValue = "Yes";
        } else if (selectedValue === "25") {
            displayValue = "No";
        }

        document.getElementById("btnSnapEt").innerHTML = displayValue; //selectedValue;
    }

    function ddlBenefitsSelectEventHandler(event) {
        let selectedValue = event.currentTarget.getAttribute('value');
      
        //console.log(selectedValue);
        document.getElementById("btnEnrollmentBenefits").value = selectedValue;
        document.getElementById("btnEnrollmentBenefits").innerHTML = selectedValue;
    }

    function ddlCareerPathwayPositionSelectHandler(event) {
        let selectedValue = event.currentTarget.getAttribute('value');

        document.getElementById("btnCareerPathwayPosition").value = selectedValue;

        let selectedCareerPathway =  careerPathways.filter(function (careerPathway) {
            return careerPathway.ID === parseInt(selectedValue)
        });

        document.getElementById("btnCareerPathwayPosition").innerHTML = selectedCareerPathway[0].Description;
      
    }

    function ddlPartTimeFullTimeSelectHandler(event) {
        let selectedValue = event.currentTarget.getAttribute('value');
      
        document.getElementById("btnFullTimePartTime").value = selectedValue;
        document.getElementById("btnFullTimePartTime").innerHTML = selectedValue;
    }

    function ddlAssistanceTypeSelectHandler(event) {
        let selectedValue = event.currentTarget.getAttribute('value');
        
        document.getElementById("btnAssistanceType").value = selectedValue;
        
        let selectedAssistanceType =  assistanceTypes.filter(function (suffix) {
            return suffix.ID === parseInt(selectedValue)
        });

        document.getElementById("btnAssistanceType").innerHTML = selectedAssistanceType[0].Name;
    }

    function getElementValue(element) {
        let value = document.getElementById(element).value;

        if (value === "" || value === "Please Select") {
            return null;
        }
        return value;
    }

    function deletePlacement(event) {
        let selectedPlacementID = event.currentTarget.getAttribute("data-id");
        let apiAddress = sessionStorage.getItem("baseApiAddress");
        let fullDeletePlacementAddress = `${apiAddress}/api/Placement/Deleteplacement/${selectedPlacementID}`;
        let sessionStorageData = getSessionData();

        fetch(fullDeletePlacementAddress, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorageData.Token
            }
        }).then(result => result.json())
        .then(result => {
            
            if (result === null || result.Message !== undefined) {
                props.createErrorNotification("an error occurred while deleting the record.");
                return;
            }

            // let placementVM = fetchPlacements();
            // generateTable(placementVM);
            getPlacementsByClientProfileID();


            props.createNotification('The placement was successfully deleted.');

        });
    }

    function calculateAge(birthDate) {
        let difference = moment(new Date()).diff(birthDate);
        let duration = moment.duration(difference, 'milliseconds');
        let diffInYears = Math.round(duration.asYears());
        return diffInYears;
    }

    function createColumnGroup(labelText, content) {
        //let row = document.createElement("div");
        //row.classList.add("row");

        let col = document.createElement("div")
        col.classList.add("col-6");

        let formGroup = document.createElement("div");
        formGroup.classList.add("form-group");

        let strong = document.createElement("strong");
        strong.innerText = labelText;

        let label = document.createElement("label");
        label.appendChild(strong);

        let contentDiv = document.createElement("div");
        contentDiv.innerText = content;
    
        formGroup.appendChild(label);
        formGroup.appendChild(contentDiv);
        col.appendChild(formGroup);

        return col;
    }
    
    function createRow() {
        let row = document.createElement("div");
        row.classList.add("row");

        return row;
    }

    function generatePrintModal(placements, familyProfiles) {

        //let placements = props.placement;
        let divClientProfile = document.getElementById("divClientProfile");
        divClientProfile.innerText = "";

        placements.forEach(placement => {

            let firstRow = createRow(); document.createElement("div");
            
            let participantName = props.clientProfile.Person.FirstName + " " + props.clientProfile.Person.LastName;
            let participantNameColGroup = createColumnGroup("Participant's Name", participantName);
            
            firstRow.appendChild(participantNameColGroup);

            let ssnGroup = createColumnGroup("SSN", props.clientProfile.Person.SSN);
            firstRow.appendChild(ssnGroup);

            let secondRow = createRow(); 
            let genderGroup = createColumnGroup("Gender", props.clientProfile.Person.Gender.Name);
            secondRow.appendChild(genderGroup);
            let raceGroup = createColumnGroup("Race", props.clientProfile.Person.Race.Name);
            secondRow.appendChild(raceGroup);

            let thirdRow = createRow();
            let stateVcin = createColumnGroup("State/VCIN", props.clientProfile.Person.StateORVCIN);
            let currentAge = calculateAge(props.clientProfile.Person.DOB);
            let age = createColumnGroup("Current age", currentAge);
            thirdRow.appendChild(stateVcin);
            thirdRow.appendChild(age);

            
            divClientProfile.appendChild(firstRow);
            divClientProfile.appendChild(secondRow); 
            divClientProfile.appendChild(thirdRow);
        });

        // let familyTable = document.getElementById("familyTable");
        // let familyTBody = familyTable.createTBody();
        let familyTableContainer = document.getElementById("familyTableContainer");
        familyTableContainer.innerText = "";
        let familyTable = document.createElement("table");
        familyTable.classList.add("table");

        //create the headers
        let familyHeader = familyTable.createTHead();
        let familyHeaderRow = familyHeader.insertRow(0);
        let lastNameHeader = familyHeaderRow.insertCell(0);
        lastNameHeader.innerHTML = "<strong>Last Name</strong>";
        let firstNameHeader = familyHeaderRow.insertCell(1);
        firstNameHeader.innerHTML = "<strong>First Name</strong>";
        let middleNameHeader = familyHeaderRow.insertCell(2);
        middleNameHeader.innerHTML = "<strong>Middle Name</strong>";
        let suffixHeader = familyHeaderRow.insertCell(3);
        suffixHeader.innerHTML = "<strong>Suffix</strong>";
        let relationshipHeader = familyHeaderRow.insertCell(4);
        relationshipHeader.innerHTML = "<strong>Relationship</strong>";
        let homePhoneHeader = familyHeaderRow.insertCell(5);
        homePhoneHeader.innerHTML = "<strong>Home Phone</strong>";
        let workPhoneHeader = familyHeaderRow.insertCell(6);
        workPhoneHeader.innerHTML = "<strong>Work Phone</strong>"

        let familyTableTBody = familyTable.createTBody();

        familyTableContainer.appendChild(familyTable);

        familyProfiles.forEach(familyProfile => {
            console.log(familyProfile);

            let dataRow = familyTableTBody.insertRow();
            let lastNameCell = dataRow.insertCell(0);
            lastNameCell.innerText = familyProfile.FamilyProfile.Person.LastName;
            let firstNameCell = dataRow.insertCell(1);
            firstNameCell.innerText = familyProfile.FamilyProfile.Person.FirstName;
            let middleNameCell = dataRow.insertCell(2);
            middleNameCell.innerText = familyProfile.FamilyProfile.Person.MiddleName;
            let suffixCell = dataRow.insertCell(3);
            suffixCell.innerText = familyProfile.FamilyProfile.Person.Suffix.Name;
            let relationshipCell = dataRow.insertCell(4);
            relationshipCell.innerText = familyProfile.FamilyProfile.Relationship.Description;
            let homePhoneCell = dataRow.insertCell(5);
            homePhoneCell.innerText = familyProfile.PersonSupplemental.HomePhone;
            let workPhoneCell = dataRow.insertCell(6);
            workPhoneCell.innerText = familyProfile.PersonSupplemental.WorkPhone;

            
        });

    }

    function fetchPlacements() {
        let apiAddress = sessionStorage.getItem("baseApiAddress");
        let clientProfileID = props.clientProfile.ID;
        //let fullGetPlacementsAddress = `${apiAddress}/api/Placement/GetPlacementsByClientProfileID/${clientProfileID}`;
        let fullGetPlacementsAddress = `${apiAddress}/api/ClientProfile/GetPlacementsByClientProfileId/${clientProfileID}`;
        let sessionStorageData = getSessionData();

       return fetch(fullGetPlacementsAddress, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorageData.Token
            }
        }).then(result => result.json());
    }

    function  getPlacementsByClientProfileID() {
        // let apiAddress = sessionStorage.getItem("baseApiAddress");
        // let clientProfileID = props.clientProfile.ID;
        // //let fullGetPlacementsAddress = `${apiAddress}/api/`Placement/GetPlacementsByClientProfileID/${clientProfileID}`;
        // let fullGetPlacementsAddress = `${apiAddress}/api/ClientProfile/GetPlacementsByClientProfileId/${clientProfileID}`;
        // let sessionStorageData = getSessionData();

        // fetch(fullGetPlacementsAddress, {
        //     method: 'GET',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': 'Bearer ' + sessionStorageData.Token
        //     }
        // }).then(result => result.json())
        // .then(result => {
        //     //console.log('the new method');
        //     //console.log(result);
            
        // });


        // let placement = fetchPlacements();

        // generateTable(placement);

        fetchPlacements().then(placement => generateTable(placement));
    }

    function getEnrollment(event) {
        let selectedEnrollmentID = event.currentTarget.getAttribute("data-id");
        let selectedPlacementID = event.currentTarget.getAttribute("data-placementid");
        $("#hdnPlacementID").val(selectedPlacementID);

        let apiAddress = sessionStorage.getItem("baseApiAddress");
        let fullGetEnrollmentAddress = `${apiAddress}/api/Enrollment/GetEnrollment/${selectedEnrollmentID}`;
        let sessionStorageData = getSessionData();

        fetch(fullGetEnrollmentAddress, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorageData.Token
            }
        }).then(result => result.json())
        .then(result => {
            //console.log(result);

            //txtReferralDate
            let referralDate = moment(new Date(result.ReferralDate)).format('YYYY-MM-DD');
            $("#txtReferralDate").val(referralDate);
            if (result.Counselor !== null) {
                $("#btnCareerAdvisorName").val(result.Counselor.ID);
                document.getElementById("btnCareerAdvisorName").innerText = result.Counselor.LastName + ", " + result.Counselor.FirstName;
            }
            if (result.ServiceProgramCategory !== null) {
                $("#btnReferToService").val(result.ServiceProgramCategory.ServiceProgram.ID);
                document.getElementById("btnReferToService").innerText = result.ServiceProgramCategory.ServiceProgram.Name;
            }

            $("#txtReferralNotes").val(result.Comments);
            $("#txtReferralStatusNotes").val(result.SuppComments);

            let serviceBeginDate = moment(new Date(result.BeginDate)).format('YYYY-MM-DD');
            $("#txtServiceBeginDate").val(serviceBeginDate);
            let serviceEndDate = moment(new Date(result.EndDate)).format('YYYY-MM-DD');
            $("#txtServiceEndDate").val(serviceEndDate);

            if (result.ServiceRelease !== null) {
                $("#btnCaseStatus").val(result.ServiceReleaseID);
                document.getElementById("btnCaseStatus").innerText = result.ServiceRelease.Name;
            }

            if (result.ServiceOutcome !== null) {
                $("#btnServiceOutcome").val(result.ServiceOutcomeID);
                document.getElementById("btnServiceOutcome").innerText = result.ServiceOutcome.Name;
            }

            let DateCaseAssigned = moment(new Date(result.DateCaseAssigned)).format('YYYY-MM-DD');
            $("#txtDateCaseAssigned").val(DateCaseAssigned);

            $("#hdnEnrollmentID").val(result.ID);
            $("#hdnReferralCreatedDate").val(result.CreatedDate);
            $("#hdnCreatedBy").val(result.CreatedBy);

            togglePlacementModal();
        });
    }

    function getPlacement(event) {

        let selectedPlacementID = event.currentTarget.getAttribute("data-id");
        let apiAddress = sessionStorage.getItem("baseApiAddress");
        let fullGetPlacementAddress = `${apiAddress}/api/Placement/GetPlacement/${selectedPlacementID}`;
        let sessionStorageData = getSessionData();

        fetch(fullGetPlacementAddress, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorageData.Token
            }
        }).then(result => result.json())
        .then(result => {
            
            if (result.AssistanceType !== undefined && result.AssistanceType !== null) {
                document.getElementById("btnAssistanceType").innerHTML = result.AssistanceType.Name;
                document.getElementById("btnAssistanceType").value = result.AssistanceTypeID;
            }

            if (result.CareerPathway !== undefined && result.CareerPathway !== null) {
                document.getElementById("btnCareerPathwayPosition").innerHTML = result.CareerPathway.Name;
                document.getElementById("btnCareerPathwayPosition").value = result.CareerPathwayID;
            }

            let convertedEnrollmentDate = moment(new Date(result.CourtOrderDate)).format('YYYY-MM-DD');
            $("#txtEnrollmentDate").val(convertedEnrollmentDate);
            $("#txtEnrollmentComments").val(result.CourtOrderNarrative);
            
            document.getElementById("btnEnrollmentBenefits").innerHTML = result.EmployerBenefits;
            document.getElementById("btnEnrollmentBenefits").value = result.EmployerBenefits;

            document.getElementById("btnFullTimePartTime").innerText = result.EmployerFullPartTime;
            document.getElementById("btnFullTimePartTime").value = result.EmployerFullPartTime;

            $("#txtEnrollmentEmployerName").val(result.EmployerName);
            $("#txtEnrollmentPosition").val(result.EmployerPosition);

            let convertedEmployerStartDate = moment(new Date(result.EmployerStartDate)).format('YYYY-MM-DD');
            $("#txtEnrollmentStartDate").val(convertedEmployerStartDate);

            $("#txtEnrollmentWagesPerHour").val(result.EmployerWages);

            //View/TANF
            if (result.Judge !== undefined && result.Judge !== null) {
                document.getElementById("btnViewTanf").innerText = result.Judge.Name;
                document.getElementById("btnViewTanf").value = result.JudgeID;
            }

            let convertedNextCourtDate = moment(new Date(result.NextCourtDate)).format('YYYY-MM-DD');
            $("#txtApptDate").val(convertedNextCourtDate);

            if (result.PlacementLevel !== undefined && result.PlacementLevel !== null) {
                document.getElementById("btnSnapEt").innerText = result.PlacementLevel.Name;
                document.getElementById("btnSnapEt").value = result.PlacementLevelID;
            }

            $("#hdnPlacementID").val(result.ID);
            $("#hdnPlacementCreatedDate").val(result.CreatedDate);
            $("#hdnPlacementCreatedBy").val(result.CreatedBy);
            $("#hdnPlacementUpdatedDate").val(result.UpdatedDate);
            $("#hdnPlacementUpdatedBy").val(result.UpdatedBy);


             toggleEnrollmentModal();

        });
    }

    function deleteEnrollment(event) {
        let selectedEnrollmentID = event.currentTarget.getAttribute("data-id");

        let apiAddress = sessionStorage.getItem("baseApiAddress");
        let fullDeleteEnrollmentAddress = `${apiAddress}/api/Enrollment/DeleteEnrollment/${selectedEnrollmentID}`;
        let sessionStorageData = getSessionData();


        fetch(fullDeleteEnrollmentAddress, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorageData.Token
            }
        }).then(result => result.json())
        .then(result => {
            if (result === undefined || result == null ) {
                props.createErrorNotification("an error occurred.")
                return;
            }

            // let placementVM = fetchPlacements();
            // generateTable(placementVM);
            getPlacementsByClientProfileID();

            props.createNotification("the enrollment was deleted.");

        });
    }

    
    function generateTable(placements) {

        let divRef = document.getElementById("placementsContainer");
        divRef.innerHTML = "";
        placements.forEach(placement => {
            //console.log(placement);
            let placementRecord;
            if (placement.Placement !== undefined) {
                placementRecord = placement.Placement;
            }
            else {
                placementRecord = placement;
            }

            let parentCard = document.createElement("div");
            parentCard.classList.add("card");
            
            let headerDiv = document.createElement("div");
            headerDiv.classList.add("card-header");
            parentCard.appendChild(headerDiv);

            //add the Edit Placement button
            let placementButton = document.createElement("button");
            placementButton.classList.add("btn");
            placementButton.classList.add("btn-secondary");
            placementButton.classList.add("btn-sm");
            placementButton.classList.add("mr-2");
            placementButton.setAttribute("data-id", placementRecord.ID);
            placementButton.innerText = "Edit Placement";
            placementButton.title = "edit the Placement";
            placementButton.onclick = getPlacement;

            //add the delete button
            let placementDeleteButton = document.createElement("button");
            placementDeleteButton.classList.add("btn");
            placementDeleteButton.classList.add("btn-secondary");
            
            placementDeleteButton.classList.add("btn-sm");
            placementDeleteButton.setAttribute("data-id", placementRecord.ID);
            placementDeleteButton.innerText = "Delete";
            placementDeleteButton.title = "Delete placement";
            placementDeleteButton.onclick = deletePlacement;


            let bodyDiv = document.createElement("div");
            bodyDiv.classList.add("card-body");
            parentCard.appendChild(bodyDiv);
            bodyDiv.appendChild(placementButton);
            bodyDiv.appendChild(placementDeleteButton);

            let table = document.createElement("table");
            table.classList.add("table");

            //create the Referral rows 
            let header = table.createTHead();
            let addReferralRow = header.insertRow(0);
            let addReferralCell = addReferralRow.insertCell(0);

            //button to add new Referrals/Enrollments
            let addReferralButton = document.createElement("button");
            addReferralButton.classList.add("btn");
            addReferralButton.classList.add("btn-secondary");
            addReferralButton.classList.add("btn-sm");
            addReferralButton.setAttribute("data-id", placementRecord.ID);
            $("#hdnCurrentlySelectedPlacementID").val(placementRecord.ID);
            addReferralButton.innerText = "Add Referral";
            addReferralButton.onclick = togglePlacementModal;

            addReferralCell.appendChild(addReferralButton);


            let row = header.insertRow(1);
            row.insertCell(0);
            let serviceNameCell = row.insertCell(1);
            serviceNameCell.innerHTML = "<strong> Service Name</strong>";
            let beginDateCell = row.insertCell(2);
            beginDateCell.innerHTML = "<strong>Begin Date</strong>";
            let endDateCell = row.insertCell(3);
            endDateCell.innerHTML = "<strong>End Date</strong>";
            let caseStatusCell = row.insertCell(4);
            caseStatusCell.innerHTML = "<strong>Case Status</strong>";
            row.insertCell(5);
        
            let tbody = table.createTBody();

            let enrollmentRowsIndex = 0;
            if (placement.Enrollment !== undefined && placement.Enrollment !== null) {
                placement.Enrollment.forEach(function(enrollment) {
                    //console.log(enrollment);
    
                    let enrollmentRow = tbody.insertRow(enrollmentRowsIndex);
                    enrollmentRowsIndex = enrollmentRowsIndex + 1;

                    //button to edit a Referral/Enrollment
                    let editButtonCell = enrollmentRow.insertCell(0);
                    let editEnrollmentButton = document.createElement("button");
                    editEnrollmentButton.classList.add("btn");
                    editEnrollmentButton.classList.add("btn-info");
                    editEnrollmentButton.classList.add("btn-sm");
                    editEnrollmentButton.setAttribute("data-id", enrollment.Enrollment.ID);
                    editEnrollmentButton.setAttribute("data-placementid", placementRecord.ID);
                    let faPencil = "<i class='fa fa-pencil-square-o' aria-hidden='true'></i>";
                    editEnrollmentButton.innerHTML = faPencil;
                    //editEnrollmentButton.innerText = "Edit Referral";
                    editEnrollmentButton.onclick = getEnrollment;
                    editButtonCell.appendChild(editEnrollmentButton);

                    //add the print button and put it next to edit
                    let printButton = document.createElement("button");
                    printButton.classList.add("btn");
                    printButton.classList.add('btn-info');
                    printButton.classList.add('btn-sm');
                    printButton.setAttribute("data-id", enrollment.Enrollment.ID);
                    let faPrint = "<i class='fa fa-print' aria-hidden='true'></i>";
                    printButton.innerHTML = faPrint;
                    printButton.onclick = togglePrintScreen;
                    editButtonCell.appendChild(printButton);

                    let serviceNameCell = enrollmentRow.insertCell(1);
                    if (enrollment.Enrollment.ServiceProgramCategory !== null) {
                        serviceNameCell.innerText = enrollment.Enrollment.ServiceProgramCategory.ServiceProgram.Name;
                    }
    
                    let beginDateCell = enrollmentRow.insertCell(2);
                    beginDateCell.innerText = enrollment.Enrollment.BeginDate;
    
                    let endDateCell = enrollmentRow.insertCell(3);
                    let convertedEndDate = moment(new Date(enrollment.Enrollment.EndDate)).format('YYYY-MM-DD');
                    endDateCell.innerText = convertedEndDate;
    
                    let caseStatusCell = enrollmentRow.insertCell(4);
                    if (enrollment.Enrollment.ServiceRelease !== null) {
                        caseStatusCell.innerText = enrollment.Enrollment.ServiceRelease.Name;
                    }

                    let deleteButtonCell = enrollmentRow.insertCell(5);
                    let deleteEnrollmentButton = document.createElement("button");
                    deleteEnrollmentButton.classList.add("btn");
                    deleteEnrollmentButton.classList.add("btn-secondary");
                    deleteEnrollmentButton.classList.add("btn-sm");
                    deleteEnrollmentButton.setAttribute("data-id", enrollment.Enrollment.ID);
                    let faTrash = "<i class='fa fa-trash-o' aria-hidden='true'></i>";
                    deleteEnrollmentButton.innerHTML = faTrash;
                    //deleteEnrollmentButton.innerText = "Delete";
                    deleteEnrollmentButton.onclick = deleteEnrollment
                    deleteButtonCell.appendChild(deleteEnrollmentButton);
    
                });
            }
    
            bodyDiv.appendChild(table);

            divRef.appendChild(parentCard);
            
            let lineBreak = document.createElement("br");
            divRef.appendChild(lineBreak);

        });
    }

    function savePlacement() {

        let apiAddress = sessionStorage.getItem("baseApiAddress");
        let fullPersonPlacementAddress = `${apiAddress}/api/Placement`;
        let sessionStorageData = getSessionData();
       
        let enrollmentDate = new Date($("#txtEnrollmentDate").val());
        let snapEt = new Date($("#txtSnapEt").val());


        let viewTanf = document.getElementById("btnViewTanf").value;

        if (snapEt === '') {
            $("#frmEnrollment").addClass("was-validated");
        }

        if (viewTanf === '') {
            $("#frmEnrollment").addClass("was-validated");
            document.getElementById("divViewTanfError").removeAttribute("style");
        }

        let placement ={
            AssistanceTypeID: getElementValue("btnAssistanceType"),
            CareerPathwayID: getElementValue("btnCareerPathwayPosition"),
            ClientProfileID:  clientProfileId,
            CourtOrderDate: enrollmentDate,
            CourtOrderNarrative: getElementValue("txtEnrollmentComments"), //will be the comments
            EmployerBenefits: getElementValue("btnEnrollmentBenefits"),
            EmployerFullPartTime: getElementValue("btnFullTimePartTime"),
            EmployerName: getElementValue("txtEnrollmentEmployerName"),
            EmployerPosition: getElementValue("txtEnrollmentPosition"),
            EmployerStartDate: new Date($("#txtEnrollmentStartDate").val()),
            EmployerWages: getElementValue("txtEnrollmentWagesPerHour"),
            JudgeID: getElementValue("btnViewTanf"), //"Participating in VIEW/TANF"
            NextCourtDate: new Date($("#txtApptDate").val()), //Next Appt. Date
            PlacementLevelID: getElementValue("btnSnapEt"), //10, //this is "Participating in SNAP-ET"
            Active: true,
            //CreatedDate: new Date(),
            //CreatedBy: sessionStorageData.CurrentUser,
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
            //console.log(result);

            if (result === null || result.Message !== undefined) {
                props.createErrorNotification("an error occurred while saving the record.");
                return;
            }


            // let placementVM = fetchPlacements();
            // generateTable(placementVM);
            getPlacementsByClientProfileID();

            props.createNotification('The placement was successfully saved.');

            toggleEnrollmentModal();
        });

        //console.log(placment);

        //console.log(snapEt);
    }

    let assistanceTypeValueOptions = [];
    if ( assistanceTypes.length > 0) {

        assistanceTypeValueOptions = assistanceTypes.map((value) =>
            <a key={value.ID} value={value.ID} description={value.Description} onClick={ ddlAssistanceTypeSelectHandler  } className="dropdown-item">{value.Name}</a>
        );
    }

    let careerPathWayValueOptions = [];
    if ( careerPathways.length > 0) {

        careerPathWayValueOptions = careerPathways.map((value) =>
            <a key={value.ID} value={value.ID} description={value.Description} onClick={ ddlCareerPathwayPositionSelectHandler  } className="dropdown-item">{value.Description}</a>
        );
    }

    return <div>
        <h3>Program</h3>
        <br/>
        <button id="btnAddEnrollment" onClick={toggleEnrollmentModal} className="btn btn-primary">Add Enrollment</button>
        <br/>
        <br/>
        <input type="hidden" id="hdnPlacementID" />
        <input type="hidden" id="hdnPlacementCreatedDate" />
        <input type="hidden" id="hdnPlacementCreatedBy" />
        <input type="hidden" id="hdnPlacementUpdatedDate" />
        <input type="hidden" id="hdnPlacementUpdatedBy" />
        <div id="placementsContainer">

        </div>
   
        <form id="frmEnrollment">
            <div className="modal fade" id="enrollmentModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Enrollment</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-row">
                                <div className="col-4">
                                    <label htmlFor="txtEnrollmentDate"><strong>Enrollment Date</strong></label>
                                    <input type="date" defaultValue="" id="txtEnrollmentDate" className="form-control"></input>
                                </div>
                                <div className="col-4">
                                    <label htmlFor="txtSnapEt"><strong> Participating in SNAP-ET *</strong></label>
                                    <div className="dropdown">
                                        <button type="button" id="btnSnapEt" value="" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                            
                                        </button>
                                        <div className="dropdown-menu">
                                            <a key="Please Select" value="Please Select" onClick={ ddlSnapSelectEventHandler } className="dropdown-item">Please Select</a>                                                
                                            <a key="24" value="24" onClick={ddlSnapSelectEventHandler} className="dropdown-item">Yes</a>
                                            <a key="25" value="25" onClick={ddlSnapSelectEventHandler} className="dropdown-item">No</a>
                                        </div>
                                    </div>
                                    <div style={{display:'none'}} id="divSnapEtError" className='errorDiv'>Please select a value.</div> 
                                </div>
                                <div className="col-4">
                                    <label htmlFor="txtNextApptDate"><strong>Next Appt. Date</strong> </label>
                                    <input type="date" defaultValue="" id="txtApptDate" className="form-control"></input>
                                </div>        
                            </div>
                            <br></br>
                            <div className="form-row">    
                                <div className="col-4">
                                    <label htmlFor="ddlViewTanf"><strong>Participating in VIEW/TANF *</strong></label>
                                    <div className="dropdown">
                                        <button type="button" id="btnViewTanf" value="" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                            
                                        </button>
                                        <div className="dropdown-menu">
                                            <a key="Please Select" value="Please Select" onClick={ddlViewTanfSelectEventHandler} className="dropdown-item">Please Select</a>                                                
                                            <a key="35" value="35" onClick={ddlViewTanfSelectEventHandler} className="dropdown-item">Yes</a>
                                            <a key="36" value="36" onClick={ddlViewTanfSelectEventHandler} className="dropdown-item">No</a>
                                        </div>
                                    </div>
                                    <div style={{display:'none'}} id="divViewTanfError" className='errorDiv'>Please select a value.</div> 
                                </div>
                                <div className="col-4">
                                    <label htmlFor="ddlAssistanceType"><strong>Assistance Type</strong></label>
                                    <div className="dropdown">
                                        <button type="button" id="btnAssistanceType" value="" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                            
                                        </button>
                                        <div className="dropdown-menu">
                                            { assistanceTypeValueOptions }
                                            {/* {maritalStatusValueOptions} */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <br />
                            <div className="form-row">
                                <div className="col-8">
                                    <label htmlFor="txtEnrollmentComments"><strong>Comments</strong></label>
                                    <textarea id="txtEnrollmentComments" type="text" defaultValue="" className="form-control"></textarea>
                                </div>
                            </div>
                            <br></br>
                            <div className="form-row">
                                <div className="col-4">
                                    <label htmlFor="txtEnrollmentEmployerName"><strong>Employer Name</strong></label>
                                    <input type="text" id="txtEnrollmentEmployerName" className="form-control"></input>
                                </div>
                                <div className="col-4">
                                    <label htmlFor="txtEnrollmentPosition"><strong>Position</strong></label>
                                    <input type="text" id="txtEnrollmentPosition" className="form-control"></input>
                                </div>
                                <div className="col-4">
                                    <label htmlFor="txtEnrollmentStartDate"><strong>Start Date</strong></label>
                                    <input id="txtEnrollmentStartDate" type="date" className="form-control"></input>
                                </div>
                            </div>
                            <br/>
                            <div className="form-row">
                                <div className="col-4">
                                    <label htmlFor="txtEnrollmentWagesPerHour"><strong>Wages ($ per hour)</strong></label>
                                    <input type="text" id="txtEnrollmentWagesPerHour" className="form-control"></input>
                                </div>
                                <div className="col-4">
                                    <label htmlFor="txtEnrollmentBenefits"><strong>Benefits</strong></label>
                                    <div className="dropdown">
                                        <button type="button" id="btnEnrollmentBenefits" value="" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                            
                                        </button>
                                        <div className="dropdown-menu">
                                            <a key="Please Select" value="Please Select" onClick={ ddlBenefitsSelectEventHandler } className="dropdown-item">Please Select</a>                                                
                                            <a key="Yes" value="Yes" onClick={ddlBenefitsSelectEventHandler} className="dropdown-item">Yes</a>
                                            <a key="No" value="No" onClick={ddlBenefitsSelectEventHandler} className="dropdown-item">No</a>
                                        </div>
                                    </div> 
                                </div>
                            
                            </div>
                            <br/>
                            <div className="form-row">
                                <div className="col-4">
                                    <label htmlFor="ddlPartTimeFullTime"><strong> Full or Part-Time</strong></label>
                                    <div className="dropdown">
                                        <button type="button" id="btnFullTimePartTime" value="" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                            
                                        </button>
                                        <div className="dropdown-menu">
                                            <a key="Please Select" value="Please Select" onClick={ ddlPartTimeFullTimeSelectHandler  } className="dropdown-item">Please Select</a>                                                
                                            <a key="Full-Time" value="Full-Time" onClick={ddlPartTimeFullTimeSelectHandler} className="dropdown-item">Full-Time</a>
                                            <a key="Part-Time" value="Part-Time" onClick={ddlPartTimeFullTimeSelectHandler} className="dropdown-item">Part-Time</a>
                                        </div>
                                    </div> 
                                </div>
                                <div className="col-4">
                                    <label htmlFor="ddlCareerPathWayPosition" id="ddlCareerPathwayPosition"><strong> Career Pathway Position</strong></label>
                                    <div className="dropdown">
                                        <button type="button" id="btnCareerPathwayPosition" value="" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                            
                                        </button>
                                        <div className="dropdown-menu">
                                            { careerPathWayValueOptions }
                                        </div>
                                    </div> 
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={savePlacement} >Save</button>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
        <Referral
            staffValues = {staff}
            serviceReleaseValues = {serviceReleases }
            serviceOutcomeValues = { serviceOutcomes }
            togglePlacementModal={togglePlacementModal}
            refreshEnrollmentGrid = { getPlacementsByClientProfileID }
            createNotification={props.createNotification}
            createErrorNotification={props.createErrorNotification}
         />
         <PrintEnrollment 
         clientProfileID = {clientProfileId }
         clientProfile ={props.clientProfile} />
    </div>
}

export default Enrollment;