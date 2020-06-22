import React, { useState, useEffect, useCallback, createRef } from 'react';
import $ from 'jquery';
import { getSessionData } from './commonAdmin';
import moment from 'moment';
import Referral from './Referral';
import PrintEnrollment from './PrintEnrollment';
import { generateTable, getPlacementsByClientProfileID, togglePlacementModal, toggleEnrollmentModal } from './EnrollmentTabHelpers';

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

    //build the client profile box in the print modal
    function buildClientProfileHeaderForPrintModal() {
        let divClientProfile = document.getElementById("divClientProfile");
        divClientProfile.innerText = "";

        let firstRow = createRow(); //document.createElement("div");
            
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
    }

    //creates the table of family members in the print modal
    function buildFamilyTableForPrintModal(familyProfiles) {
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

    //builds the placement boxes in the print modal
    function generatePlacementRows(placements) {
        let divPlacements = document.getElementById("divPlacements");        
        divPlacements.innerText = "";
        placements.forEach(placement => {
            let highlightedBox = document.createElement("div");
            highlightedBox.classList.add("lightBorder");

            let firstRow = createRow();

            let courtOrderDate = moment(new Date(placement.Placement.CourtOrderDate)).format('YYYY-MM-DD');
            let enrollmentDateGroup = createColumnGroup("Enrollment Date", courtOrderDate);
            firstRow.appendChild(enrollmentDateGroup);
            let participateInSnapGroup = createColumnGroup("Participating in SNAP-ET", placement.Placement.PlacementLevel.Name);
            firstRow.appendChild(participateInSnapGroup);

            let secondRow = createRow();
            let formattedCourtDate = moment(new Date(placement.Placement.NextCourtDate)).format('YYYY-MM-DD');
            let nextApptDateGroup = createColumnGroup("Next Appt. Date", formattedCourtDate);
            secondRow.appendChild(nextApptDateGroup);
            let viewTanfGroup = createColumnGroup("Participating in VIEW/TANF", placement.Placement.Judge.Name);
            secondRow.appendChild(viewTanfGroup);

            let thirdRow = createRow();
            let assisTanceTypeGroup = createColumnGroup("Assistance Type", placement.Placement.AssistanceType.Name);
            thirdRow.appendChild(assisTanceTypeGroup);

            let fourthRow = createRow();
            let commentsGroup = createColumnGroup("Comments", placement.Placement.Comments);
            fourthRow.appendChild(commentsGroup);

            let fifthRow = createRow();
            let formattedEmploymentStartDate = moment(new Date(placement.Placement.EmployerStartDate)).format('YYYY-MM-DD');
            let employmentStartDateGroup = createColumnGroup("Employment Start Date", formattedEmploymentStartDate);
            fifthRow.appendChild(employmentStartDateGroup);
            let wagesGroup = createColumnGroup("Wages ($ per hour)", placement.Placement.EmployerWages);
            fifthRow.appendChild(wagesGroup);

            let sixthRow = createRow();
            let employerBenefitsGroup = createColumnGroup("Benefits", placement.Placement.EmployerWages);
            sixthRow.appendChild(employerBenefitsGroup);
            let careerPathWayGroup = createColumnGroup("Career Pathway Position", placement.Placement.CareerPathway.Name);
            sixthRow.appendChild(careerPathWayGroup);

            let seventhRow = createRow();
            let fullOrPartTime = createColumnGroup("Full or Part-Time", placement.Placement.EmployerFullPartTime);
            seventhRow.appendChild(fullOrPartTime);

            highlightedBox.appendChild(firstRow);
            highlightedBox.appendChild(secondRow);
            highlightedBox.appendChild(thirdRow);
            highlightedBox.appendChild(fourthRow);
            highlightedBox.appendChild(fifthRow);
            highlightedBox.appendChild(sixthRow);
            highlightedBox.appendChild(seventhRow);

            divPlacements.appendChild(highlightedBox);


            generateEnrollmentRows(placement);

        });
    }

    function generateEnrollmentRows(enrollments) {
        let divEnrollments = document.getElementById("divEnrollments");
        divEnrollments.innerText = "";
        //console.log('the enrollments');
        //console.log(enrollments);

        //for each enrollment, write the enrollment -> Staff rows, and then the enrollment.
        enrollments.Enrollment.forEach(enrollment => {
            

            //first make the enrollment box
            let enrollmentBox = document.createElement("div");
            enrollmentBox.classList.add("lightBorder");
            let enrollmentTitle = document.createElement("h5");
            enrollmentTitle.innerText = "Referral";
            enrollmentBox.appendChild(enrollmentTitle);

            let enrollmentFirstRow = createRow();
            let formattedEnrollmentReferralDate = moment(new Date( enrollment.Enrollment.ReferralDate)).format('YYYY-MM-DD');
            let enrollmentReferralDateGroup = createColumnGroup("Referral Date", formattedEnrollmentReferralDate);
            enrollmentFirstRow.appendChild(enrollmentReferralDateGroup);

            enrollmentBox.appendChild(enrollmentFirstRow);

            let lineBreak = document.createElement("br");
            divEnrollments.appendChild(lineBreak);

            //build the counselor box for the enrollment
            let counselorHighlightedBox = document.createElement("div");
            counselorHighlightedBox.classList.add("lightBorder");
            let counselorTitle = document.createElement("h5");
            counselorTitle.innerText = "Counselor";
            counselorHighlightedBox.appendChild(counselorTitle);
            
            let firstRow = createRow();
            let counselorFirstNameGroup = createColumnGroup("Full Name", enrollment.Enrollment.Counselor.FirstName + " " + enrollment.Enrollment.Counselor.LastName);
            firstRow.appendChild(counselorFirstNameGroup);
            let titleGroup = createColumnGroup("Title", enrollment.Enrollment.Counselor.JobTitle.Name);
            firstRow.appendChild(titleGroup);
            
            let secondCounselorRow = createRow();
            let phoneNumberGroup = createColumnGroup("Phone Number", enrollment.Enrollment.Counselor.Phone);
            secondCounselorRow.appendChild(phoneNumberGroup);
            let faxGroup = createColumnGroup("Fax", enrollment.Enrollment.Counselor.Fax);
            secondCounselorRow.appendChild(faxGroup);

            let thirdCounselorRow = createRow();
            let emailGroup = createColumnGroup("E-Mail", enrollment.Enrollment.Counselor.EMail);
            thirdCounselorRow.appendChild(emailGroup);
            let departmentGroup = createColumnGroup("Department", enrollment.Enrollment.Counselor.Department);
            thirdCounselorRow.appendChild(departmentGroup);

            counselorHighlightedBox.appendChild(firstRow);
            counselorHighlightedBox.appendChild(secondCounselorRow);
            counselorHighlightedBox.appendChild(thirdCounselorRow);
            
            divEnrollments.appendChild(enrollmentBox);
            divEnrollments.appendChild(counselorHighlightedBox);
            
        });

    }

    function generatePrintModal(placements, familyProfiles) {

        buildClientProfileHeaderForPrintModal();
        
        buildFamilyTableForPrintModal(familyProfiles);
    
        generatePlacementRows(placements);
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