import $ from 'jquery';
import { getSessionData } from './commonAdmin';
import moment from 'moment';




function getEmploymentPlan(selectedEnrollmentID) {
    //let selectedEnrollmentID = event.currentTarget.getAttribute('value');

    let apiAddress = sessionStorage.getItem("baseApiAddress");
    let fullGetEmploymentPlanAddress = `${apiAddress}/api/EmploymentPlan/GetEmploymentPlan/${selectedEnrollmentID}`;
    let sessionStorageData = getSessionData();

    fetch(fullGetEmploymentPlanAddress, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorageData.Token
        }
    }).then(result => result.json())
    .then(result => {
        //console.log(result);

        if (result !== null) {
            $("#txtEmploymentGoal").val(result.EmploymentGoal);
            $("#txtEducationalTrainingGoal").val(result.EduTrainGoal);
            $("#txtEPWorkExperience").val(result.WorkExperience);
            $("#txtEPStrengths").val(result.Strengths);
            $("#txtAdditionalTrainingAttended").val(result.AddtlTraining);
            $("#txtCredentialsReceived").val(result.Credentials);
            $("#txtBarriersToEmployment").val(result.Barriers);
            $("#hdnEmploymentPlanCreatedDate").val(result.CreatedDate);
            $("#hdnEmploymentPlanCreatedBy").val(result.CreatedBy);
            $("#hdnEmploymentPlanID").val(result.ID);
        }

       
        // if (result === null || result.Message !== undefined) {
        //     triggerErrorMessage("an error occurred while saving the record.");
        //     return;
        // }

        //triggerToastMessage('The enrollment was successfully saved.');

        toggleEmploymentPlanModal();

    });
}

export function toggleEmploymentPlanModal(event) {
    if (event !== undefined) {
        let selectedEnrollmentID = event.currentTarget.getAttribute("data-id");
        //$("#btnSaveEnrollment").data()
        document.getElementById("btnSaveEmploymentPlan").setAttribute("data-id", selectedEnrollmentID);

        getEmploymentPlan(selectedEnrollmentID);
    }

    $("#employmentPlanModal").modal('toggle');
}

export function toggleEnrollmentModal() {
    //TODO: add function to clear the modal on opening
    $("#enrollmentModal").modal('toggle');
}

function fetchPlacements() {
    let apiAddress = sessionStorage.getItem("baseApiAddress");

    let clientProfileID = sessionStorage.getItem("clientProfileID");

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

export function  getPlacementsByClientProfileID() {

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
            //props.createErrorNotification("an error occurred.")
            return;
        }

        getPlacementsByClientProfileID();

    });
}

export function togglePlacementModal(event) {
    if (event !== undefined) {
        let selectedPlacementID = event.currentTarget.getAttribute("data-id");
        //$("#btnSaveEnrollment").data()
        document.getElementById("btnSaveEnrollment").setAttribute("data-id", selectedPlacementID);
    }

    $("#referralModal").modal('toggle');
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
            //props.createErrorNotification("an error occurred while deleting the record.");
            return;
        }

        // generateTable(placementVM);
        getPlacementsByClientProfileID();

        //props.createNotification('The placement was successfully deleted.');

    });
}


function buildEditPlacementButton(placementRecord) {
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

          return placementButton;
}

function buildDeletePlacementButton(placementRecord) {
        //add the delete button
        let placementDeleteButton = document.createElement("button");
        placementDeleteButton.classList.add("btn");
        placementDeleteButton.classList.add("btn-secondary");
        placementDeleteButton.classList.add("mr-2");
        placementDeleteButton.classList.add("btn-sm");
        placementDeleteButton.setAttribute("data-id", placementRecord.ID);
        placementDeleteButton.innerText = "Delete";
        placementDeleteButton.title = "Delete placement";
        placementDeleteButton.onclick = deletePlacement;

        return placementDeleteButton;
}

function buildPrintHeaderButton(placementRecord) {
      //add the print button and put it next to edit
      let printButton = document.createElement("button");
      printButton.classList.add("btn");
      printButton.classList.add('btn-info');
      printButton.classList.add('btn-sm');
      printButton.setAttribute("data-id", placementRecord.ID);
      printButton.innerText = "Print";
      //let faPrint = "<i class='fa fa-print' aria-hidden='true'></i>";
     //printButton.innerHTML = faPrint;
      printButton.onclick = togglePrintScreen;

      return printButton;
}

function buildPrintButton(enrollment) {
        //add the print button and put it next to edit
        let printButton = document.createElement("button");
        printButton.classList.add("btn");
        printButton.classList.add('btn-info');
        printButton.classList.add('btn-sm');
        printButton.setAttribute("data-id", enrollment.Enrollment.ID);
        let faPrint = "<i class='fa fa-print' aria-hidden='true'></i>";
        printButton.innerHTML = faPrint;
        printButton.onclick = togglePrintScreen;

        return printButton;
}

export function generateTable(placements) {

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

        let placementButton = buildEditPlacementButton(placementRecord);

        let placementDeleteButton = buildDeletePlacementButton(placementRecord);

        let placementPrintHeaderButton = buildPrintHeaderButton(placementRecord);

        let bodyDiv = document.createElement("div");
        bodyDiv.classList.add("card-body");
        parentCard.appendChild(bodyDiv);
        bodyDiv.appendChild(placementButton);
        bodyDiv.appendChild(placementDeleteButton);
        bodyDiv.appendChild(placementPrintHeaderButton);

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
                editEnrollmentButton.classList.add("mr-2");
                editEnrollmentButton.setAttribute("data-id", enrollment.Enrollment.ID);
                editEnrollmentButton.setAttribute("data-placementid", placementRecord.ID);
                let faPencil = "<i class='fa fa-pencil-square-o' aria-hidden='true'></i>";
                editEnrollmentButton.innerHTML = faPencil;
                //editEnrollmentButton.innerText = "Edit Referral";
                editEnrollmentButton.onclick = getEnrollment;
                editButtonCell.appendChild(editEnrollmentButton);

                //add button for Service Units
                let serviceUnitButton = document.createElement("button");
                serviceUnitButton.classList.add("btn");
                serviceUnitButton.classList.add("btn-info");
                serviceUnitButton.classList.add("btn-sm");
                serviceUnitButton.setAttribute("data-id", enrollment.Enrollment.ID);
                let faSuitCase = "<i class='fa fa-suitcase' aria-hidden='true'></i>";
                serviceUnitButton.innerHTML = faSuitCase;
                serviceUnitButton.onclick = toggleServiceUnitModal;

                editButtonCell.appendChild(serviceUnitButton);

                //add the Add/Edit Employment Plan button
                //keeping this commented out because it seems that this functionality is never used
                // let employmentButton = document.createElement("button");
                // employmentButton.classList.add("btn");
                // employmentButton.classList.add("btn-info");
                // employmentButton.classList.add("btn-sm");
                // employmentButton.setAttribute("data-id", enrollment.Enrollment.ID);
                // let faSuitCase = "<i class='fa fa-suitcase' aria-hidden='true'></i>";
                // employmentButton.innerHTML = faSuitCase;
                // employmentButton.onclick = toggleEmploymentPlanModal;

                //editButtonCell.appendChild(employmentButton);

                let serviceNameCell = enrollmentRow.insertCell(1);
                if (enrollment.Enrollment.ServiceProgramCategory !== null) {
                    serviceNameCell.innerText = enrollment.Enrollment.ServiceProgramCategory.ServiceProgram.Name;
                }

                let beginDateCell = enrollmentRow.insertCell(2);
                let convertedBeginDate = moment(new Date(enrollment.Enrollment.BeginDate)).format('YYYY-MM-DD');
                beginDateCell.innerText = convertedBeginDate;

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

export function createColumnGroup(labelText, content) {
    //let row = document.createElement("div");
    //row.classList.add("row");
    if (content === undefined || content === null) {
        content = "";
    }

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

export function createRow() {
    let row = document.createElement("div");
    row.classList.add("row");

    return row;
}


function buildPlacementInfoBoxForPrintModal(placement) {

    let highlightedBox = document.createElement("div");
    highlightedBox.classList.add("lightBorder");

    let firstRow = createRow();

    let courtOrderDate = moment(new Date(placement.CourtOrderDate)).format('YYYY-MM-DD');
    let enrollmentDateGroup = createColumnGroup("Enrollment Date", courtOrderDate);
    firstRow.appendChild(enrollmentDateGroup);

    let participateInSnapGroup;
    if (placement.PlacementLevel !== null) {
        participateInSnapGroup = createColumnGroup("Participating in SNAP-ET", placement.PlacementLevel.Name);
    } else {
        participateInSnapGroup = createColumnGroup("Participating in SNAP-ET", "");
    }
    firstRow.appendChild(participateInSnapGroup);

    let secondRow = createRow();
    let formattedCourtDate = moment(new Date(placement.NextCourtDate)).format('YYYY-MM-DD');
    let nextApptDateGroup = createColumnGroup("Next Appt. Date", formattedCourtDate);
    secondRow.appendChild(nextApptDateGroup);

    let viewTanfGroup; 
    if (placement.Judge.Name) {
        viewTanfGroup = createColumnGroup("Participating in VIEW/TANF", placement.Judge.Name);
    } else {
        viewTanfGroup = createColumnGroup("Participating in VIEW/TANF", "");
    }
    secondRow.appendChild(viewTanfGroup);

    let thirdRow = createRow();
    let assisTanceTypeGroup;
    if (placement.AssistanceType !== null) {
        assisTanceTypeGroup = createColumnGroup("Assistance Type", placement.AssistanceType.Name);
    } else {
        assisTanceTypeGroup = createColumnGroup("Assistance Type", "");
    }

    thirdRow.appendChild(assisTanceTypeGroup);

    let fourthRow = createRow();
    let commentsGroup = createColumnGroup("Comments", placement.Comments);
    fourthRow.appendChild(commentsGroup);

    let fifthRow = createRow();
    let formattedEmploymentStartDate = moment(new Date(placement.EmployerStartDate)).format('YYYY-MM-DD');
    let employmentStartDateGroup = createColumnGroup("Employment Start Date", formattedEmploymentStartDate);
    fifthRow.appendChild(employmentStartDateGroup);
    let wagesGroup = createColumnGroup("Wages ($ per hour)", placement.EmployerWages);
    fifthRow.appendChild(wagesGroup);

    let sixthRow = createRow();
    let employerBenefitsGroup = createColumnGroup("Benefits", placement.EmployerWages);
    sixthRow.appendChild(employerBenefitsGroup);

    let careerPathWayGroup
    if (placement.CareerPathway !== null) {
        careerPathWayGroup = createColumnGroup("Career Pathway Position", placement.CareerPathway.Name);
    } else {
        careerPathWayGroup = createColumnGroup("Career Pathway Position", "");
    }

    sixthRow.appendChild(careerPathWayGroup);

    let seventhRow = createRow();
    let fullOrPartTime = createColumnGroup("Full or Part-Time", placement.EmployerFullPartTime);
    seventhRow.appendChild(fullOrPartTime);

    highlightedBox.appendChild(firstRow);
    highlightedBox.appendChild(secondRow);
    highlightedBox.appendChild(thirdRow);
    highlightedBox.appendChild(fourthRow);
    highlightedBox.appendChild(fifthRow);
    highlightedBox.appendChild(sixthRow);
    highlightedBox.appendChild(seventhRow);

    return highlightedBox;
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

function togglePrintScreen(event) {

    if (event !== undefined) {
        let selectedPlacementID = event.currentTarget.getAttribute("data-id");
        console.log(selectedPlacementID);

        fetchPlacements().then(placement => {

            let selectedPlacement = placement.filter(function(selected) {
                return selected.Placement.ID === parseInt(selectedPlacementID);
            });
            console.log('here it is');
            console.log(selectedPlacement);

            // console.log('here it is');
            // console.log(selectedPlacement[0].Placement);

            let placementBox = buildPlacementInfoBoxForPrintModal(selectedPlacement[0].Placement);
            let divPlacements = document.getElementById("divPlacements");
            divPlacements.appendChild(placementBox);

            generateEnrollmentRows(selectedPlacement[0]);

        });
    }

    $("#printModal").modal('toggle');
}

export function toggleServiceUnitModal(event) {
    if (event !== undefined) {
        let selectedEnrollmentID = event.currentTarget.getAttribute("data-id");

        $("#hdnServiceUnitEnrollmentID").val(selectedEnrollmentID)

    }

    $("#serviceUnitModal").modal('toggle');
}