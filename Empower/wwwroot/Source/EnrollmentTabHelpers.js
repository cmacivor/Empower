import $ from 'jquery';
import { getSessionData } from './commonAdmin';
import moment from 'moment';
import { triggerErrorMessage, triggerToastMessage } from './ToastHelper';




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

export function getProgressNotesByEnrollmentID() {
    let apiAddress = sessionStorage.getItem("baseApiAddress");

    let enrollmentID = $("#hdnProgressNoteEnrollmentID").val();

    let fullGetPlacementsAddress = `${apiAddress}/api/ProgressNote/GetByEnrollmentID/${enrollmentID}`;
    let sessionStorageData = getSessionData();

   return fetch(fullGetPlacementsAddress, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorageData.Token
        }
    }).then(result => result.json())
    .then(result => {
        console.log(result);
        //console.log(result);
        //populateServiceUnitModalTable(result);
        populateProgressNoteModalTable(result);
    });
}


export function getServiceUnitsByEnrollmentID() {
    let apiAddress = sessionStorage.getItem("baseApiAddress");

    let enrollmentID = $("#hdnServiceUnitEnrollmentID").val();

    let fullGetPlacementsAddress = `${apiAddress}/api/ServiceUnit/GetByEnrollmentID/${enrollmentID}`;
    let sessionStorageData = getSessionData();

   return fetch(fullGetPlacementsAddress, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorageData.Token
        }
    }).then(result => result.json())
    .then(result => {
        //console.log(result);
        populateServiceUnitModalTable(result);
    });

}


function deleteServiceUnitButtonClickHandler(event) {
    if (event !== undefined) {
        event.preventDefault();

        let serviceUnitID = event.currentTarget.getAttribute("data-id");
        let apiAddress = sessionStorage.getItem("baseApiAddress");
        let fullDeleteServiceUnitAddress = `${apiAddress}/api/ServiceUnit/Delete/${serviceUnitID}`;
        let sessionStorageData = getSessionData();
        
        fetch(fullDeleteServiceUnitAddress, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorageData.Token
            }
        }).then(result => result.json())
        .then(result => {
            getServiceUnitsByEnrollmentID();

            triggerToastMessage("the service unit was successfully deleted.");
        });
    }
}

function deleteProgressNoteButtonClickHandler(event) {
    if (event !== undefined) {
        event.preventDefault();

        let serviceUnitID = event.currentTarget.getAttribute("data-id");
        let apiAddress = sessionStorage.getItem("baseApiAddress");
        let fullDeleteProgressNoteAddress = `${apiAddress}/api/ProgressNote/Delete/${serviceUnitID}`;
        let sessionStorageData = getSessionData();
        
        fetch(fullDeleteProgressNoteAddress, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorageData.Token
            }
        }).then(result => result.json())
        .then(result => {
            getProgressNotesByEnrollmentID();

            triggerToastMessage("the progress note was successfully deleted.");
        });
    }
}


function populateServiceUnitModalOnRowClick(event) {
    if (event !== undefined) {
        event.preventDefault();
        let serviceUnitID = event.currentTarget.getAttribute("data-id");
        
        // let siblings = $(this).parent().siblings();
        
        // let month = siblings[0].innerText;
        // let year = siblings[1].innerText;
        // let units = siblings[2].innerText;

        // document.getElementById("btnServiceMonth").value = month;
        // document.getElementById("btnServiceMonth").innerHTML = month;
        // document.getElementById("btnServiceYear").value = year;
        // document.getElementById('btnServiceYear').innerHTML = year;

        // $("#txtServiceUnits").val(units);

        let apiAddress = sessionStorage.getItem("baseApiAddress");
        let fullGetServiceUnitByIDAddress = `${apiAddress}/api/ServiceUnit/GetByID/${serviceUnitID}`;
        let sessionStorageData = getSessionData();

        fetch(fullGetServiceUnitByIDAddress, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorageData.Token
            }
        }).then(result => result.json())
        .then(result => {
            ///console.log(result);

            document.getElementById("btnServiceMonth").value = result.Month;
            document.getElementById("btnServiceMonth").innerText = result.Month;

            document.getElementById("btnServiceYear").value = result.Year;
            document.getElementById("btnServiceYear").innerText = result.Year;

            $("#txtServiceUnits").val(result.Units);

            $("#hdnServiceUnitCreatedDate").val(result.CreatedDate);
            $("#hdnServiceUnitCreatedBy").val(result.CreatedBy);
            $("#hdnServiceUnitID").val(serviceUnitID);
        });



    }
}

function populateProgressNoteModalOnRowClick(event) {
    if (event !== undefined) {

        event.preventDefault();

        let progressNoteID = event.currentTarget.getAttribute("data-id");
        let apiAddress = sessionStorage.getItem("baseApiAddress");
        let fullGetProgressNoteByIDAddress = `${apiAddress}/api/ProgressNote/GetByID/${progressNoteID}`;
        let sessionStorageData = getSessionData();

        fetch(fullGetProgressNoteByIDAddress, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorageData.Token
            }
        }).then(result => result.json())
        .then(result => {

            let convertedCommentDate = moment(new Date(result.CommentDate)).format('YYYY-MM-DD');
            $("#txtProgressNoteDate").val(convertedCommentDate);
            $("#txtProgressNoteComments").val(result.Comment);

            if (result.ContactType !== null) {
                $("#btnProgressNoteContactType").val(result.ContactType.ID);
                document.getElementById("btnProgressNoteContactType").innerText = result.ContactType.Name;
            }

            if (result.SubContactType !== null) {
                $("#btnProgressNoteSubContactType").val(result.SubContactType.ID);
                document.getElementById("btnProgressNoteSubContactType").innerText = result.SubContactType.Name;
            }

            let duration = new Date(result.Duration);
            console.log('the duration: ');
            console.log(duration);
            let hours = duration.getHours();
            let minutes = duration.getMinutes();
            console.log('the hours');
            console.log(hours);
            console.log('the minutes');
            console.log(minutes);

            let hoursToDisplay = hours - 4;
            $("#txtDurationHour").val(hoursToDisplay);
            $("#txtDurationMinute").val(minutes);

            $("#hdnProgressNoteID").val(progressNoteID);
            $("#hdnProgressNoteCreatedDate").val(result.CreatedDate);
            $("#hdnProgressNoteCreatedBy").val(result.CreatedBy);

        });
    }
}

function populateProgressNoteModalTable(progressNotes) {
    let progressNoteDiv = document.getElementById("divProgressNotesTableContainer");
    progressNoteDiv.innerHTML = "";
    let table = document.createElement("table");
    table.classList.add("table");
    let header = table.createTHead();
    let headerRow = header.insertRow(0);
    let detailsCell = headerRow.insertCell(0); //for the edit button column
    let dateCell = headerRow.insertCell(1);
    dateCell.innerHTML = "<strong>Date</strong>";
    let contactTypeCell = headerRow.insertCell(2);
    contactTypeCell.innerHTML = "<strong>Contact Type</strong>";
    let commentCell = headerRow.insertCell(3);
    commentCell.innerHTML = "<strong>Comment</strong>";
    let deleteCell = headerRow.insertCell(4);

    let tbody = table.createTBody();

    let progressNoteRowIndex = 0;
    progressNotes.forEach(progressNote => {

        let progressNoteRow = tbody.insertRow(progressNoteRowIndex);
        let progressNoteCell = progressNoteRow.insertCell(0);
        //create the edit button
        let progressNoteEditButton = document.createElement("button");
        progressNoteEditButton.classList.add("btn");
        progressNoteEditButton.classList.add("btn-info");
        progressNoteEditButton.classList.add("btn-sm");
        progressNoteEditButton.setAttribute("data-id", progressNote.ID);
        let faPencil = "<i class='fa fa-pencil-square-o' aria-hidden='true'></i>";
        progressNoteEditButton.innerHTML = faPencil;
        progressNoteEditButton.onclick = populateProgressNoteModalOnRowClick;
        progressNoteCell.appendChild(progressNoteEditButton);

        let progressNoteMonthCell = progressNoteRow.insertCell(1);
        let convertedCommentDate = moment(new Date(progressNote.CommentDate)).format('YYYY-MM-DD');
        progressNoteMonthCell.innerText = convertedCommentDate; //progressNote.CommentDate;

        let progressNoteYearCell = progressNoteRow.insertCell(2);
        progressNoteYearCell.innerText = progressNote.ContactType.Name;

        let unitsCell = progressNoteRow.insertCell(3);
        unitsCell.innerText = progressNote.Comment;

        let deleteButtonCell = progressNoteRow.insertCell(4);
        let progressNoteDeleteButton = document.createElement("button");
        progressNoteDeleteButton.classList.add("btn");
        progressNoteDeleteButton.classList.add("btn-info");
        progressNoteDeleteButton.classList.add("btn-danger");
        progressNoteDeleteButton.setAttribute("data-id", progressNote.ID);
        let faTrash = "<i class='fa fa-trash-o' aria-hidden='true'></i>";
        progressNoteDeleteButton.innerHTML = faTrash;
        progressNoteDeleteButton.onclick = deleteProgressNoteButtonClickHandler
        deleteButtonCell.appendChild(progressNoteDeleteButton);

    });

    progressNoteDiv.appendChild(table);
}


export function populateServiceUnitModalTable(serviceUnits) {

    let serviceUnitDiv = document.getElementById("divServiceUnitsTableContainer");
    serviceUnitDiv.innerHTML = "";
    let table = document.createElement("table");
    table.classList.add("table");
    let header = table.createTHead();
    let headerRow = header.insertRow(0);
    let detailsCell = headerRow.insertCell(0); //for the edit button column
    let monthCell = headerRow.insertCell(1);
    monthCell.innerHTML = "<strong>Month</strong>";
    let yearCell = headerRow.insertCell(2);
    yearCell.innerHTML = "<strong>Year</strong>";
    let unitsCell = headerRow.insertCell(3);
    unitsCell.innerHTML = "<strong>Units</strong>";
    let deleteCell = headerRow.insertCell(4);

    let tbody = table.createTBody();

    let serviceUnitRowIndex = 0;
    serviceUnits.forEach(serviceUnit => {
        let serviceUnitRow = tbody.insertRow(serviceUnitRowIndex);
        let serviceUnitCell = serviceUnitRow.insertCell(0);
        //create the edit button
        let serviceUnitEditButton = document.createElement("button");
        serviceUnitEditButton.classList.add("btn");
        serviceUnitEditButton.classList.add("btn-info");
        serviceUnitEditButton.classList.add("btn-sm");
        serviceUnitEditButton.setAttribute("data-id", serviceUnit.ID);
        let faPencil = "<i class='fa fa-pencil-square-o' aria-hidden='true'></i>";
        serviceUnitEditButton.innerHTML = faPencil;
        serviceUnitEditButton.onclick = populateServiceUnitModalOnRowClick;
        serviceUnitCell.appendChild(serviceUnitEditButton);

        let serviceUnitMonthCell = serviceUnitRow.insertCell(1);
        serviceUnitMonthCell.innerText = serviceUnit.Month;

        let serviceUnitYearCell = serviceUnitRow.insertCell(2);
        serviceUnitYearCell.innerText = serviceUnit.Year;

        let unitsCell = serviceUnitRow.insertCell(3);
        unitsCell.innerText = serviceUnit.Units;

        let deleteButtonCell = serviceUnitRow.insertCell(4);
        let serviceUnitDeleteButton = document.createElement("button");
        serviceUnitDeleteButton.classList.add("btn");
        serviceUnitDeleteButton.classList.add("btn-info");
        serviceUnitDeleteButton.classList.add("btn-danger");
        serviceUnitDeleteButton.setAttribute("data-id", serviceUnit.ID);
        let faTrash = "<i class='fa fa-trash-o' aria-hidden='true'></i>";
        serviceUnitDeleteButton.innerHTML = faTrash;
        serviceUnitDeleteButton.onclick = deleteServiceUnitButtonClickHandler
        deleteButtonCell.appendChild(serviceUnitDeleteButton);

    });

    serviceUnitDiv.appendChild(table);
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
                console.log('the enrollment');
                console.log(enrollment);

                populateServiceUnitModalTable(enrollment.ServiceUnit);

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
                editEnrollmentButton.title = "Edit Referral";
                editEnrollmentButton.onclick = getEnrollment;
                editButtonCell.appendChild(editEnrollmentButton);

                //add button for Service Units
                let serviceUnitButton = document.createElement("button");
                serviceUnitButton.classList.add("btn");
                serviceUnitButton.classList.add("btn-info");
                serviceUnitButton.classList.add("btn-sm");
                serviceUnitButton.classList.add("mr-2");
                serviceUnitButton.setAttribute("data-id", enrollment.Enrollment.ID);
                let faSuitCase = "<i class='fa fa-suitcase' aria-hidden='true'></i>";
                serviceUnitButton.innerHTML = faSuitCase;
                serviceUnitButton.title = "Edit Service Unit";
                serviceUnitButton.onclick = toggleServiceUnitModal;
                editButtonCell.appendChild(serviceUnitButton);

                let progressNoteButton = document.createElement("button");
                progressNoteButton.classList.add("btn");
                progressNoteButton.classList.add("btn-info");
                progressNoteButton.classList.add("btn-sm");
                progressNoteButton.setAttribute("data-id", enrollment.Enrollment.ID);
                let stickyNote = "<i class='fa fa-sticky-note-o' aria-hidden='true'></i>";
                progressNoteButton.innerHTML = stickyNote;
                progressNoteButton.title = "Edit Progress Note";
                progressNoteButton.onclick = toggleProgressNoteModal;
                editButtonCell.appendChild(progressNoteButton);

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
                deleteEnrollmentButton.classList.add("btn-danger");
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

function clearServiceUnitForm() {
    $("#hdnServiceUnitID").val("");
    $("#hdnServiceUnitCreatedDate").val("");
    $("#hdnServiceUnitCreatedBy").val("");
    document.getElementById("btnServiceMonth").value = "";
    document.getElementById("btnServiceMonth").innerText = "Please Select";
    document.getElementById("btnServiceYear").value = "";
    document.getElementById("btnServiceYear").innerText = "Please Select";
    $("#txtServiceUnits").val("");
}


export function toggleServiceUnitModal(event) {
    clearServiceUnitForm();
    if (event !== undefined) {
        let selectedEnrollmentID = event.currentTarget.getAttribute("data-id");

        $("#hdnServiceUnitEnrollmentID").val(selectedEnrollmentID);

        getServiceUnitsByEnrollmentID();

    }

    $("#serviceUnitModal").modal('toggle');
}

function clearProgressNoteForm() {
    $("#hdnProgressNoteID").val("");
    $("#hdnProgressNoteCreatedDate").val("");
    $("#hdnProgressNoteCreatedBy").val("");
    $("#txtProgressNoteDate").val("");
    $("#txtProgressNoteComments").val("");
    document.getElementById("btnProgressNoteContactType").value = "";
    document.getElementById("btnProgressNoteContactType").innerText = "Please Select";

    $("#txtDurationHour").val("");
    $("#txtDurationMinute").val("");

    document.getElementById("btnProgressNoteSubContactType").value = "";
    document.getElementById("btnProgressNoteSubContactType").innerText = "Please Select";
}


function toggleProgressNoteModal(event) {
    clearProgressNoteForm();

    if (event !== undefined) {
        let selectedEnrollmentID = event.currentTarget.getAttribute("data-id");
        $("#hdnProgressNoteEnrollmentID").val(selectedEnrollmentID);

        getProgressNotesByEnrollmentID();
    }   

    $("#progressNoteModal").modal("toggle");
}