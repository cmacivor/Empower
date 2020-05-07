import React, { useState, useEffect } from 'react';
import { getSessionData } from './commonAdmin';
import $ from 'jquery';
import moment from 'moment';

const SupplementalAdult = (props) => {

    let clientHeightInFeet = '';
    let clientHeighInInches = '';
    let clientWeight = '';
    let clientHairColor = '';
    let clientEyeColor = '';
    let clientHomePhone = '';
    let clientIncome = '';
    let clientLanguage = '';
    let clientInterpreterNeeded = false;
    let clientMedicaid = false;
    let clientInsurance = false;
    let clientDriversLicense = false;
    let clientOtherAgencyContacts = '';
    let clientNotes = '';
    let clientIDType = '';
    let clientIDNumber = '';
    let clientIDIssueDate = new Date();
    let clientIDExpirationDate = new Date();
    let clientScars = '';
    let clientDisabled = '';
    let clientLivingSituation = '';
    let clientStudentStatus = '';
    let clientHighestEducation = '';
    let clientEmployer = '';
    let clientSupervisor = '';
    let clientJobTitle = '';
    let clientHoursPerWeek = '';
    let clientEmployerAddress = '';
    let clientEmployerState = '';
    let clientEmployerAddressCity = '';
    let clientEmployerAddressZip = '';

    
    //dropdowns from database
    let clientEducationLevelID = '';
    let clientEducationLevelDescription = '';
    let clientFundingSourceID = '';
    let clientFundingSourceDescription = '';
    let clientJobStatusID = '';
    let clientJobStatusDescription = '';
    let clientMaritalStatusID = '';
    let clientMaritalStatusDescription = '';

    let clientSupplementalID = 0;

    //Audit
    let clientCreatedDate = '';
    let clientCreatedBy = '';
    let clientUpdatedDate = '';
    let clientUpdatedBy = '';

    let maritalStatuses = props.maritalStatusValues;
    let educationLevels = props.educationLevelValues;
    let fundingSources = props.fundingSourceValues;
    let jobStatuses = props.jobStatusValues;



    if (props.clientProfile !== undefined && props.clientProfile.PersonSupplemental !== null) {

        let personSupplemental = props.clientProfile.PersonSupplemental
            
        clientHeightInFeet = (personSupplemental.HeightFt !== null) ? personSupplemental.HeightFt : '';
        clientHeighInInches = (personSupplemental.HeightIn !== null) ? personSupplemental.HeightIn : '';
        clientWeight = (personSupplemental.Weight !== null) ? personSupplemental.Weight : '';
        clientEyeColor = (personSupplemental.EyeColor !== null) ? personSupplemental.EyeColor : '';
        clientHairColor = (personSupplemental.HairColor !== null) ? personSupplemental.HairColor : '';
       
        clientHomePhone = (personSupplemental.HomePhone !== null) ? personSupplemental.HomePhone : '';
        clientIncome = (personSupplemental.HouseholdIncome !== null) ? personSupplemental.HouseholdIncome : '';
        clientLanguage = (personSupplemental.Language !== null) ? personSupplemental.Language : '';
        clientInterpreterNeeded = (personSupplemental.HasInterpreter !== null) ? personSupplemental.HasInterpreter : false;
        clientMedicaid = (personSupplemental.HasMedicaid !== null ) ? personSupplemental.HasMedicaid : false;
        clientInsurance = (personSupplemental.HasInsurance !== null ) ? personSupplemental.HasInsurance : false;
        clientDriversLicense = (personSupplemental.HasDriversLicense !== null) ? personSupplemental.HasDriversLicense : false;
        clientOtherAgencyContacts = (personSupplemental.OtherAgencyContacts !== null) ? personSupplemental.OtherAgencyContacts : false;
        clientNotes = (personSupplemental.Comments !== null) ? personSupplemental.Comments : '';
        clientIDType = (personSupplemental.IDType !== null) ? personSupplemental.IDType : 'Please Select';
        clientIDNumber = (personSupplemental.IDNumber !== null) ? personSupplemental.IDNumber : '';
        clientIDIssueDate = (personSupplemental.IssueDate !== null) ? personSupplemental.IssueDate : '';        
        clientIDExpirationDate = (personSupplemental.ExpirationDate !== null) ?  personSupplemental.ExpirationDate : ''; 
        clientScars = (personSupplemental.ScarMarks !== null ) ? personSupplemental.ScarMarks : '';
        clientDisabled = (personSupplemental.IsDisable !== null) ? personSupplemental.IsDisable : '';
        clientLivingSituation = (personSupplemental.LivingSituation !== null) ? personSupplemental.LivingSituation : 'Please Select';
        clientStudentStatus = (personSupplemental.StudentStatus !== null) ? personSupplemental.StudentStatus : 'Please Select';
        clientHighestEducation = (personSupplemental.HighestEducation !== null) ? personSupplemental.HighestEducation : 'Please Select';
        clientEmployer = (personSupplemental.Employer !== null) ? personSupplemental.Employer : '';
        clientSupervisor = (personSupplemental.Supervisor !== null ) ? personSupplemental.Supervisor : '';
        clientJobTitle = (personSupplemental.JobTitle !== null ) ? personSupplemental.JobTitle : '';
        clientHoursPerWeek = (personSupplemental.HoursPerWeek !== null ) ? personSupplemental.HoursPerWeek : '';
        clientEmployerAddress = (personSupplemental.EmployerAddress !== null ) ? personSupplemental.EmployerAddress : '';
        clientEmployerState = (personSupplemental.EmployerAddressState !== null) ? personSupplemental.EmployerAddressState : 'Please Select';
        clientEmployerAddressCity = (personSupplemental.EmployerAddressCity !== null) ? personSupplemental.EmployerAddressCity : '';
        clientEmployerAddressZip = (personSupplemental.EmployerAddressZip !== null) ? personSupplemental.EmployerAddressZip : '';

        //the dropdowns from database
        clientEducationLevelID = (personSupplemental.EducationLevel !== null) ? personSupplemental.EducationLevel.ID : '';
        clientEducationLevelDescription = (personSupplemental.EducationLevel !== null ) ? personSupplemental.EducationLevel.Name : 'Please Select';
        clientFundingSourceID = (personSupplemental.FundingSource !== null ) ? personSupplemental.FundingSource.ID : '';
        clientFundingSourceDescription = (personSupplemental.FundingSource !== null) ? personSupplemental.FundingSource.Name : 'Please Select';
        clientJobStatusID = (personSupplemental.JobStatus !== null) ? personSupplemental.JobStatus.ID : '';
        clientJobStatusDescription = (personSupplemental.JobStatus !== null) ? personSupplemental.JobStatus.Name : 'Please Select';
        clientMaritalStatusID = (personSupplemental.MaritalStatus !== null ) ? personSupplemental.MaritalStatus.ID : '';
        clientMaritalStatusDescription = (personSupplemental.MaritalStatus !== null ) ? personSupplemental.MaritalStatus.Name: 'Please Select';

        clientSupplementalID = (personSupplemental.ID !== null ) ? personSupplemental.ID : 0;
        clientCreatedDate = (personSupplemental.CreatedDate !== null) ? personSupplemental.CreatedDate : '';
        clientCreatedBy = (personSupplemental.CreatedBy !== null) ? personSupplemental.CreatedBy : '';
        clientUpdatedDate = (personSupplemental.UpdatedDate !== null) ? personSupplemental.UpdatedDate : '';
        clientUpdatedBy = (personSupplemental.UpdatedBy !== null) ? personSupplemental.UpdatedBy : '';

    }

    //the dropdowns pulling values from the database
    const [jobStatusValues, setJobStatusValues] = useState(jobStatuses);
    const [maritalStatusValues, setMaritalStatusValues] = useState(maritalStatuses);

    const [isRefreshed, setIsRefreshed] = useState(0);
    
    
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

    function getElementValue(element) {
        let value = document.getElementById(element).value;

        if (value === "" || value === "Please Select") {
            return null;
        }
        return value;
    }
    
    useEffect(() => {

        $("#txtHeightFeet").val(clientHeightInFeet);
        $("#txtHeightInches").val(clientHeighInInches);
        $("#txtWeight").val(clientWeight);
        $("#txtEyeColor").val(clientEyeColor);
        $("#txtHairColor").val(clientHairColor);
        $("#txtHomePhone").val(clientHomePhone);
        
        $("#txtLanguage").val(clientLanguage);
        $("#txtOtherAgency").val(clientOtherAgencyContacts);
        $("#txtNotes").val(clientNotes);
        $("#txtIDNumber").val(clientIDNumber);
        $("#txtScarsMarks").val(clientScars);
        $("#txtEmployer").val(clientEmployer);
        $("#txtSupervisor").val(clientSupervisor);
        $("#txtJobTitle").val(clientJobTitle);
        $("#txtHoursPerWeek").val(clientHoursPerWeek);
        $("#txtEmployerAddress").val(clientEmployerAddress);
        $("#txtEmployerCity").val(clientEmployerAddressCity);
        $("#txtEmployerZipCode").val(clientEmployerAddressZip);

        setRadioButtonState("rdpInterpreterNeededYes", "rdpInterpreterNeededNo", clientInterpreterNeeded);
        setRadioButtonState("rdpMedicaidNeededYes", "rdpMedicaidNeededNo", clientMedicaid);
        setRadioButtonState("rdpHasInsuranceYes", "rdpHasInsuranceNo", clientInsurance);
        setRadioButtonState("rdpHasDriversLicenseYes", "rdpHasDriversLicenseNo", clientDriversLicense);
        setRadioButtonState("rdpIsDisabledYes", "rdpIsDisabledNo", clientDisabled);

        document.getElementById("btnIDType").value = clientIDType;
        document.getElementById("btnIDType").innerHTML = clientIDType;

        document.getElementById("btnDDLJobStatus").value = clientJobStatusID;
        document.getElementById("btnDDLJobStatus").innerHTML = clientJobStatusDescription;

        document.getElementById("btnDDLMaritalStatus").value = clientMaritalStatusID;
        document.getElementById("btnDDLMaritalStatus").innerHTML = clientMaritalStatusDescription;

        document.getElementById("btnLivingSituation").value = clientLivingSituation;
        document.getElementById("btnLivingSituation").innerHTML = clientLivingSituation;

        document.getElementById("btnStudentStatus").value = clientStudentStatus;
        document.getElementById("btnStudentStatus").innerHTML = clientStudentStatus;

        document.getElementById("btnHighestEducationLevel").value = clientHighestEducation;
        document.getElementById("btnHighestEducationLevel").innerHTML = clientHighestEducation;

        document.getElementById("btnState").value = clientEmployerState;
        document.getElementById("btnState").innerHTML = clientEmployerState;
        
        let idIssueDateObj = new Date(clientIDIssueDate);
        let convertedIssueDate = moment(idIssueDateObj).format('YYYY-MM-DD');     
        document.getElementById("txtIDIssueDate").value = convertedIssueDate;

        let idExpirationDate = new Date(clientIDExpirationDate);
        let convertedIDExpirationDate = moment(idExpirationDate).format('YYYY-MM-DD');
        document.getElementById("txtIDExpirationDate").value = convertedIDExpirationDate;

        


            //Job Status
            setJobStatusValues(jobStatuses);

            //Marital Status
            setMaritalStatusValues(maritalStatuses);

        });
        

    function handleJobStatusChange(event) {
        let selectedValue = event.currentTarget.getAttribute('value');

        document.getElementById("btnDDLJobStatus").value = selectedValue;

        let selectedJobStatus =  jobStatuses.filter(function(jobStatus) {
            return jobStatus.ID === parseInt(selectedValue);
        });

        document.getElementById("btnDDLJobStatus").innerHTML = selectedJobStatus[0].Description;
    }

    function handleMaritalStatusChange(event) {
        let selectedValue = event.currentTarget.getAttribute('value');

        document.getElementById("btnDDLMaritalStatus").value = selectedValue;

        let selectedMaritalStatus  = maritalStatuses.filter(function(maritalStatus) {
            return maritalStatus.ID === parseInt(selectedValue);
        });

        document.getElementById("btnDDLMaritalStatus").innerHTML = selectedMaritalStatus[0].Description;
    }

    function idTypeSelectHandler(event) {
      
        let selectedValue = event.currentTarget.getAttribute('value');
      
        document.getElementById("btnIDType").value = selectedValue;
        document.getElementById("btnIDType").innerHTML = selectedValue;
    }

    function livingSituationSelectHandler(event) {
        
        let selectedValue = event.currentTarget.getAttribute('value');
        
        document.getElementById("btnLivingSituation").value = selectedValue;
        document.getElementById("btnLivingSituation").innerHTML = selectedValue;
    }

    function highestEdLevelSelectHandler(event) {
    
        let selectedValue = event.currentTarget.getAttribute('value');

        document.getElementById("btnHighestEducationLevel").value = selectedValue;
        document.getElementById("btnHighestEducationLevel").innerHTML = selectedValue;
    }

    function stateSelectHandler(event) {
        let selectedValue = event.currentTarget.getAttribute('value');
        document.getElementById("btnState").value = selectedValue;
        document.getElementById("btnState").innerHTML = selectedValue;
    }

    function studentStatusSelectHandler(event) {
        let selectedValue = event.currentTarget.getAttribute('value');
        document.getElementById("btnStudentStatus").value = selectedValue;
        document.getElementById("btnStudentStatus").innerHTML = selectedValue;
    }


     function updateClickHandler() {
        let apiAddress = sessionStorage.getItem("baseApiAddress");
        let fullPersonSupplementalAddress = `${apiAddress}/api/PersonSupplemental`;
        let sessionStorageData = getSessionData();

        let issueDate;
        let issueDateTextBoxValue = getElementValue("txtIDIssueDate");
        if (issueDateTextBoxValue !== null) {
            issueDate = new Date(issueDateTextBoxValue);
        } else {
            issueDate = null;
        }

        let expirationDate;
        let expirationDateTextBoxValue = getElementValue("txtIDExpirationDate");
        if (expirationDateTextBoxValue !== null) {
            expirationDate = new Date(expirationDateTextBoxValue);
        } else {
            expirationDate = null;
        }

        //the CWB fields
        let personSupplemental = 
        {
            ID: clientSupplementalID,
            PersonID: props.clientProfilePersonID,
            HeightFt: getElementValue("txtHeightFeet"),
            HeightIn: getElementValue("txtHeightInches"),  
            Weight: getElementValue("txtWeight"), 
            HairColor: getElementValue("txtHairColor"), 
            EyeColor: getElementValue("txtEyeColor"), 
            HomePhone: getElementValue("txtHomePhone"), 
            // //HouseholdIncome: $("#txtPlaceOfBirth").val(), //not in the database?
            Language: getElementValue("txtLanguage"),  

            HasInterpreter: getRadioButtonState("rdpInterpreterNeededYes"),
            HasMedicaid: getRadioButtonState("rdpMedicaidNeededYes"),
            HasInsurance: getRadioButtonState("rdpHasInsuranceYes"),
            HasDriversLicense: getRadioButtonState("rdpHasDriversLicenseYes"),
            OtherAgencyContacts: getElementValue("txtOtherAgency"), 
            Comments: getElementValue("txtNotes"), 

            // //Employer Details
            IDType: getElementValue("btnIDType"),
            IDNumber: getElementValue("txtIDNumber"), 
            IssueDate: issueDate,  
            ExpirationDate: expirationDate,
            JobStatusID: getElementValue("btnDDLJobStatus"), 
            MaritalStatusID: getElementValue("btnDDLMaritalStatus"), 
            ScarMarks: getElementValue("txtScarsMarks"), 
            IsDisable: getRadioButtonState("rdpIsDisabledYes"),
            LivingSituation: getElementValue("btnLivingSituation"), 
            StudentStatus: getElementValue("btnStudentStatus"), 
            HighestEducation: getElementValue("btnHighestEducationLevel"), 
            Employer: getElementValue("txtEmployer"), 
            Supervisor: getElementValue("txtSupervisor"), 
            JobTitle: getElementValue("txtJobTitle"), 
            HoursPerWeek: getElementValue("txtHoursPerWeek"), 
            EmployerAddress: getElementValue("txtEmployerAddress"), 
            EmployerAddressState: getElementValue("btnState"), 
            EmployerAddressCity: getElementValue("txtEmployerCity"), 
            EmployerAddressZip: getElementValue("txtEmployerZipCode"), 
            Active: true,
            CreatedDate: clientCreatedDate,
            CreatedBy: clientCreatedBy,
            UpdatedDate: new Date(),
            UpdatedBy: sessionStorageData.CurrentUser
        }



        fetch(fullPersonSupplementalAddress, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorageData.Token
            },
            body: JSON.stringify(personSupplemental)
        }).then(result => result.json())
        .then(result => {
            console.log(result);
            props.createNotification('The client profile was successfully updated.');
        });
     }

     function resetClickHandler() {
        setIsRefreshed(isRefreshed + 1);
     }


     //job statuses
     let jobStatusValueOptions = [];
     if (jobStatusValues.length > 0) {
         jobStatusValueOptions = jobStatusValues.map((value) =>
            <a key={value.ID} value={value.ID} description={value.Description} onClick={ handleJobStatusChange } className="dropdown-item">{value.Description}</a>
        );
     }

     //marital status values
     let maritalStatusValueOptions = [];
     if (maritalStatusValues.length > 0) {
         maritalStatusValueOptions  = maritalStatusValues.map((value) => 
            <a key={value.ID} value={value.ID} description={value.Description} onClick={ handleMaritalStatusChange } className="dropdown-item">{value.Description}</a>
         );
     }

    return  <div>
                <br></br>
                <div id="accordion">
                    <div className="card">
                        <div className="card-header">
                            <a className="card-link" data-toggle="collapse" href="#collapsibleSupplementalSection">
                                Supplemental Adult
                            </a>
                        </div>
                        
                        <div id="collapsibleSupplementalSection" className="collapse show" data-parent="#accordion">
                            <div className="card-body">
                                <br></br>
                                <div className="form-row">
                                    <div className="col-3">
                                        <div className="form-group">
                                            <label htmlFor="txtHeightFeet"><strong>Height (Feet)</strong></label>
                                            <input type="text" className="form-control" defaultValue=""  id="txtHeightFeet"></input>
                                        </div>
                                    </div>
                                    <div className="col-3">
                                        <label htmlFor="txtHeightInches"><strong>Height (Inches)</strong></label>
                                        <input type="text" className="form-control" defaultValue=""  id="txtHeightInches"></input>
                                    </div>
                                    <div className="col-3">
                                        <label htmlFor="txtWeight"><strong>Weight (lbs.)</strong></label>
                                        <input type="text" className="form-control" defaultValue="" id="txtWeight"></input>
                                    </div>
                                    <div className="col-3">
                                        <label htmlFor="txtHairColor"><strong>Hair Color</strong></label>
                                        <input type="text" className="form-control" defaultValue=""  id="txtHairColor"></input>
                                    </div>
                                </div>
                                <div className="form-row">          
                                    <div className="col-3">
                                        <label htmlFor="txtEyeColor"><strong>Eye Color</strong></label>
                                        <input type="text" className="form-control" defaultValue=""  id="txtEyeColor"></input>
                                    </div>
                                    <div className="col-3">
                                        <label htmlFor="txtHomePhone"><strong>Home Phone</strong></label>
                                        <input type="text" className="form-control" defaultValue=""  id="txtHomePhone"></input>
                                    </div>
                                    <div className="col-3">
                                        <label htmlFor="txtPlaceOfBirth"><strong>Place of Birth</strong></label>
                                        <input type="text" className="form-control" defaultValue=""  id="txtPlaceOfBirth"></input>
                                    </div>
                                    <div className="col-3">
                                        <label htmlFor="txtLanguage"><strong>Primary Language</strong></label>
                                        <input type="text" className="form-control" defaultValue=""  id="txtLanguage"></input>
                                    </div>                          
                                </div>
                                <br></br>
                                <div className="form-row">
                                    <div className="col-3">
                                        <label><strong>Is Interpreter Needed</strong></label>
                                        <div>
                                            <div className="form-check form-check-inline">
                                                <input className="form-check-input" type="radio" name="rdpInterpreterNeeded" id="rdpInterpreterNeededYes"  />
                                                <label className="form-check-label">Yes</label>         
                                            </div>
                                            <div className="form-check form-check-inline">
                                                <input className="form-check-input" type="radio" name="rdpInterpreterNeeded" id="rdpInterpreterNeededNo"  />
                                                <label className="form-check-label">No</label>
                                            </div>
                                        </div> 
                                    </div>
                                    <div className="col-3">
                                        <label><strong>Medicaid*</strong></label>
                                        <div>
                                            <div className="form-check form-check-inline">
                                                <input className="form-check-input" type="radio" name="rdpMedicaidNeeded" id="rdpMedicaidNeededYes"  />
                                                <label className="form-check-label">Yes</label>         
                                            </div>
                                            <div className="form-check form-check-inline">
                                                <input className="form-check-input" type="radio" name="rdpMedicaidNeeded" id="rdpMedicaidNeededNo"  />
                                                <label className="form-check-label">No</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-3">
                                        <label><strong>Insurance</strong></label>
                                        <div>
                                            <div className="form-check form-check-inline">
                                                <input className="form-check-input" type="radio" name="rdpHasInsurance" id="rdpHasInsuranceYes"  />
                                                <label className="form-check-label">Yes</label>         
                                            </div>
                                            <div className="form-check form-check-inline">
                                                <input className="form-check-input" type="radio" name="rdpHasInsurance" id="rdpHasInsuranceNo"  />
                                                <label className="form-check-label">No</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-3">
                                        <label><strong>Driver's License</strong></label>
                                        <div>
                                            <div className="form-check form-check-inline">
                                                <input className="form-check-input" type="radio" name="rdpHasDriversLicense" id="rdpHasDriversLicenseYes"  />
                                                <label className="form-check-label">Yes</label>         
                                            </div>
                                            <div className="form-check form-check-inline">
                                                <input className="form-check-input" type="radio" name="rdpHasDriversLicense" id="rdpHasDriversLicenseNo"  />
                                                <label className="form-check-label">No</label>
                                            </div>
                                        </div>
                                    </div>                   
                                </div>
                                <br></br>
                                <div className="form-row">
                                    <div className="col-6">
                                        <label><strong>Other Agency</strong></label>
                                        <input type="text" className="form-control" defaultValue=""  id="txtOtherAgency"></input>
                                    </div>
                                    <div className="col-6">
                                        <label><strong>Notes</strong></label>
                                        <input type="text" className="form-control" defaultValue=""  id="txtNotes"></input>
                                    </div>
                                </div>                      
                            </div> 
                        </div>
                    </div> 
                    <div className="card">
                        <div className="card-header">
                            <a className="collapsed card-link" data-toggle="collapse" href="#collapsibleIdentityDetailsSection">
                                Identity and Employment Details
                            </a>
                        </div>
                        <div id="collapsibleIdentityDetailsSection" className="collapse" data-parent="#accordion">
                            <div className="card-body">
                                <br></br>
                                <div className="form-row">
                                    <div className="col-3">
                                       <label htmlFor="ddlIDType"><strong>ID Type</strong></label>
                                        <div className="dropdown">
                                            <button type="button" id="btnIDType" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">                        
                                                
                                            </button>
                                            <div className="dropdown-menu">
                                                <a key="Please Select" value="Please Select" onClick={idTypeSelectHandler} className="dropdown-item">Please Select</a>                                                
                                                <a key="Birth Certificate" value="Birth Certificate" onClick={idTypeSelectHandler} className="dropdown-item">Birth Certificate</a>
                                                <a key="Driver's License" value="Driver's License" onClick={idTypeSelectHandler} className="dropdown-item">Driver's License</a>
                                                <a key="Green Card" value="Green Card" onClick={idTypeSelectHandler} className="dropdown-item">Green Card</a>
                                                <a key="Military" value="Military" onClick={idTypeSelectHandler} className="dropdown-item">Military</a>
                                                <a key="Other" value="Other" onClick={idTypeSelectHandler} className="dropdown-item">Other</a>
                                                <a key="Passport" value="Passport" onClick={idTypeSelectHandler} className="dropdown-item">Passport</a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-3">
                                        <label htmlFor="txtIDNumber"><strong>ID Number</strong></label>
                                        <input type="text" defaultValue="" className="form-control" id="txtIDNumber"></input>
                                    </div>
                                    <div className="col-3">
                                        <label htmlFor="txtIssueDate"><strong>ID Issue Date</strong></label>
                                        <input type="date" defaultValue="" id="txtIDIssueDate" className="form-control"></input>
                                    </div>
                                    <div className="col-3">
                                        <label htmlFor="txtIdExpirationDate"><strong>ID Expiration Date</strong></label>
                                        <input type="date" defaultValue="" id="txtIDExpirationDate" className="form-control"></input>                               
                                    </div>
                                </div>
                                <br></br>
                                <div className="form-row">
                                    <div className="col-3">
                                        <label htmlFor="ddlJobStatus"><strong>Job Status</strong></label>
                                        <div className="dropdown">
                                            <button type="button" id="btnDDLJobStatus" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                                
                                            </button>
                                            <div className="dropdown-menu">
                                                { jobStatusValueOptions }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-3">
                                        <label htmlFor="ddlMaritalStatus"><strong>Marital Status</strong></label>
                                        <div className="dropdown">
                                            <button type="button" id="btnDDLMaritalStatus" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                                
                                            </button>
                                            <div className="dropdown-menu">
                                                { maritalStatusValueOptions }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-3">
                                        <label htmlFor="txtScarsMarks"><strong>Scars/Marks/Tattoos</strong></label>
                                        <input id="txtScarsMarks" defaultValue="" type="text" className="form-control"></input>
                                    </div>
                                    <div className="col-3">
                                        <label><strong>Is Disabled</strong></label>
                                        <div>
                                            <div className="form-check form-check-inline">
                                                <input className="form-check-input" type="radio" name="rdpIsDisabled" id="rdpIsDisabledYes"  />
                                                <label className="form-check-label">Yes</label>         
                                            </div>
                                            <div className="form-check form-check-inline">
                                                <input className="form-check-input" type="radio" name="rdpIsDisabled" id="rdpIsDisabledNo"  />
                                                <label className="form-check-label">No</label>
                                            </div>
                                        </div> 
                                    </div>
                                </div>
                                <br></br>
                                <div className="form-row">
                                    <div className="col-4">
                                        <label htmlFor="ddlIDType"><strong>Living Situation</strong></label>
                                        <div className="dropdown">
                                            <button type="button" id="btnLivingSituation" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">                        
                                                 
                                            </button>
                                            <div className="dropdown-menu">
                                                <a key="Please Select" value="Please Select" onClick={livingSituationSelectHandler} className="dropdown-item">Please Select</a>
                                                <a key="Foster Care" value="Foster Care" onClick={livingSituationSelectHandler} className="dropdown-item">Foster Care</a>
                                                <a key="Hospital Treatment Center" value="Hospital Treatment Center" onClick={livingSituationSelectHandler} className="dropdown-item">Hospital Treatment Center</a>
                                                <a key="Hotel/Motel" value="Hotel/Motel" onClick={livingSituationSelectHandler} className="dropdown-item">Hotel/Motel</a>
                                                <a key="Living with parent/legal guardian (youth)" value="Living with parent/legal guardian (youth)" onClick={livingSituationSelectHandler} className="dropdown-item">Living with parent/legal guardian (youth)</a>
                                                <a key="Other" value="Other" onClick={livingSituationSelectHandler} className="dropdown-item">Other</a>
                                                <a key="Parole Housing" value="Parole Housing" onClick={livingSituationSelectHandler} className="dropdown-item">Parole Housing</a>
                                                <a key="Prison/Jail" value="Prison/Jail" onClick={livingSituationSelectHandler} className="dropdown-item">Prison/Jail</a>
                                                <a key="Renting" value="Renting" onClick={livingSituationSelectHandler} className="dropdown-item">Renting</a>
                                                <a key="Shelter" value="Shelter" onClick={livingSituationSelectHandler} className="dropdown-item">Shelter</a>
                                                <a key="Staying with friend or relative" value="Staying with friend or relative" onClick={livingSituationSelectHandler} className="dropdown-item">Staying with friend or relative</a>
                                                <a key="Youth group home" value="Youth group home" onClick={livingSituationSelectHandler} className="dropdown-item">Youth group home</a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <label htmlFor="ddlStudentStatus"><strong>Student Status</strong></label>
                                        <div className="dropdown">
                                            <button type="button" id="btnStudentStatus" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">                        
                                                
                                            </button>
                                            <div className="dropdown-menu">
                                                <a key="Please Select" value="Please Select" onClick={studentStatusSelectHandler} className="dropdown-item">Please Select</a>
                                                <a key="Enrolled but not attending" value="Enrolled but not attending" onClick={studentStatusSelectHandler} className="dropdown-item">Enrolled but not attending</a>
                                                <a key="Expelled" value="Expelled" onClick={studentStatusSelectHandler} className="dropdown-item">Expelled</a>
                                                <a key="Full-time student" value="Full-time student" onClick={studentStatusSelectHandler} className="dropdown-item">Full-time student</a>
                                                <a key="Part-time student" value="Part-time student" onClick={studentStatusSelectHandler} className="dropdown-item">Part-time student</a>
                                                <a key="Suspended Long-term" value="Suspended Long-term" onClick={studentStatusSelectHandler} className="dropdown-item">Suspended Long-term</a>
                                                <a key="Suspended Short-term" value="Suspended Short-term" onClick={studentStatusSelectHandler} className="dropdown-item">Suspended Short-term</a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <label htmlFor="ddlHighestEdLevel"><strong>Highest Education Level</strong></label>
                                        <div className="dropdown">
                                            <button type="button" id="btnHighestEducationLevel" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">                        
                                                
                                            </button>
                                            <div className="dropdown-menu">
                                                <a key="Please Select" value="Please Select" onClick={highestEdLevelSelectHandler} className="dropdown-item">Please Select</a>
                                                <a key="Associate's Degree" value="Associate's Degree" onClick={highestEdLevelSelectHandler} className="dropdown-item">Associate's Degree</a>
                                                <a key="Current student" value="Current student" onClick={highestEdLevelSelectHandler} className="dropdown-item">Current student</a>
                                                <a key="Doctorate" value="Doctorate" onClick={highestEdLevelSelectHandler} className="dropdown-item">Doctorate</a>
                                                <a key="GED" value="GED" onClick={highestEdLevelSelectHandler} className="dropdown-item">GED</a>
                                                <a key="High School Graduate" value="High School Graduate" onClick={highestEdLevelSelectHandler} className="dropdown-item">High School Graduate</a>
                                                <a key="No high school diploma or GED and not a current student" value="No high school diploma or GED and not a current student" onClick={highestEdLevelSelectHandler} className="dropdown-item">No high school diploma or GED and not a current student</a>
                                                <a key="Some college but no degree" value="Some college but no degree" onClick={highestEdLevelSelectHandler} className="dropdown-item">Some college but no degree</a>
                                                <a key="Undergraduate Degree" value="Undergraduate Degree" onClick={highestEdLevelSelectHandler} className="dropdown-item">Undergraduate Degree</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <br></br>
                                <hr></hr>
                                <br></br>
                                <h4>Employer Details</h4>
                                <div className="form-row">
                                    <div className="col-3">
                                        <label htmlFor="txtEmployer"><strong>Employer</strong></label>
                                        <input type="text" id="txtEmployer" defaultValue="" className="form-control"></input>
                                    </div>
                                    <div className="col-3">
                                        <label htmlFor="txtSupervisor"><strong>Supervisor</strong></label>
                                        <input type="text" id="txtSupervisor" defaultValue="" className="form-control"></input>
                                    </div>
                                    <div className="col-3">
                                        <label htmlFor="txtJobTitle"><strong>Job Title</strong></label>
                                        <input type="text" id="txtJobTitle" defaultValue="" className="form-control"></input>
                                    </div>
                                    <div className="col-3">
                                        <label htmlFor="txtHoursPerWeek"><strong>Average Hours Per Week</strong></label>
                                        <input type="text" id="txtHoursPerWeek" defaultValue="" className="form-control"></input>
                                    </div>
                                </div>
                                <br></br>
                                <div className="form-row">
                                    <div className="col-8">
                                        <label htmlFor="txtEmployerAddress"><strong>Address</strong></label>
                                        <input type="text" id="txtEmployerAddress" defaultValue="" className="form-control"></input>
                                    </div>
                                </div>
                                <br></br>
                                <div className="form-row">
                                    <div className="col-4">
                                        <label htmlFor="ddlState"><strong>Select State</strong></label>
                                        <div className="dropdown">
                                            <button type="button" id="btnState" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">                        
                                                
                                            </button>
                                            <div className="dropdown-menu">
                                                <a key="Please Select" value="Please Select" onClick={stateSelectHandler} className="dropdown-item">Please Select</a>
                                                <a key="AL" value="AL" onClick={stateSelectHandler} className="dropdown-item">AL</a>
                                                <a key="AK" value="AK" onClick={stateSelectHandler} className="dropdown-item">AK</a>
                                                <a key="AR" value="AR" onClick={stateSelectHandler} className="dropdown-item">AR</a>
                                                <a key="AZ" value="AZ" onClick={stateSelectHandler} className="dropdown-item">AZ</a>
                                                <a key="CA" value="CA" onClick={stateSelectHandler} className="dropdown-item">CA</a>
                                                <a key="CO" value="CO" onClick={stateSelectHandler} className="dropdown-item">CO</a>
                                                <a key="CT" value="CT" onClick={stateSelectHandler} className="dropdown-item">CT</a>
                                                <a key="DC" value="DC" onClick={stateSelectHandler} className="dropdown-item">DC</a>
                                                <a key="DE" value="DE" onClick={stateSelectHandler} className="dropdown-item">DE</a>
                                                <a key="FL" value="FL" onClick={stateSelectHandler} className="dropdown-item">FL</a>
                                                <a key="GA" value="GA" onClick={stateSelectHandler} className="dropdown-item">GA</a>
                                                <a key="HI" value="HI" onClick={stateSelectHandler} className="dropdown-item">HI</a>
                                                <a key="IA" value="IA" onClick={stateSelectHandler} className="dropdown-item">IA</a>
                                                <a key="ID" value="ID" onClick={stateSelectHandler} className="dropdown-item">ID</a>
                                                <a key="IL" value="IL" onClick={stateSelectHandler} className="dropdown-item">IL</a>
                                                <a key="IN" value="IN" onClick={stateSelectHandler} className="dropdown-item">IN</a>
                                                <a key="KS" value="KS" onClick={stateSelectHandler} className="dropdown-item">KS</a>
                                                <a key="KY" value="KY" onClick={stateSelectHandler} className="dropdown-item">KY</a>
                                                <a key="LA" value="LA" onClick={stateSelectHandler} className="dropdown-item">LA</a>
                                                <a key="MA" value="MA" onClick={stateSelectHandler} className="dropdown-item">MA</a>
                                                <a key="MD" value="MD" onClick={stateSelectHandler} className="dropdown-item">MD</a>
                                                <a key="ME" value="ME" onClick={stateSelectHandler} className="dropdown-item">ME</a>
                                                <a key="MI" value="MI" onClick={stateSelectHandler} className="dropdown-item">MI</a>
                                                <a key="MN" value="MN" onClick={stateSelectHandler} className="dropdown-item">MN</a>
                                                <a key="MO" value="MO" onClick={stateSelectHandler} className="dropdown-item">MO</a>
                                                <a key="MS" value="MS" onClick={stateSelectHandler} className="dropdown-item">MS</a>
                                                <a key="MT" value="MT" onClick={stateSelectHandler} className="dropdown-item">MT</a>
                                                <a key="NC" value="NC" onClick={stateSelectHandler} className="dropdown-item">NC</a>
                                                <a key="NE" value="NE" onClick={stateSelectHandler} className="dropdown-item">NE</a>
                                                <a key="NH" value="NH" onClick={stateSelectHandler} className="dropdown-item">NH</a>
                                                <a key="NJ" value="NJ" onClick={stateSelectHandler} className="dropdown-item">NJ</a>
                                                <a key="NM" value="NM" onClick={stateSelectHandler} className="dropdown-item">NM</a>
                                                <a key="NV" value="NV" onClick={stateSelectHandler} className="dropdown-item">NV</a>
                                                <a key="NY" value="NY" onClick={stateSelectHandler} className="dropdown-item">NY</a>
                                                <a key="ND" value="ND" onClick={stateSelectHandler} className="dropdown-item">ND</a>
                                                <a key="OH" value="OH" onClick={stateSelectHandler} className="dropdown-item">OH</a>
                                                <a key="OK" value="OK" onClick={stateSelectHandler} className="dropdown-item">OK</a>
                                                <a key="OR" value="OR" onClick={stateSelectHandler} className="dropdown-item">OR</a>
                                                <a key="PA" value="PA" onClick={stateSelectHandler} className="dropdown-item">PA</a>
                                                <a key="RI" value="RI" onClick={stateSelectHandler} className="dropdown-item">RI</a>
                                                <a key="SC" value="SC" onClick={stateSelectHandler} className="dropdown-item">SC</a>
                                                <a key="SD" value="SD" onClick={stateSelectHandler} className="dropdown-item">SD</a>
                                                <a key="TN" value="TN" onClick={stateSelectHandler} className="dropdown-item">TN</a>
                                                <a key="TX" value="TX" onClick={stateSelectHandler} className="dropdown-item">TX</a>
                                                <a key="UT" value="UT" onClick={stateSelectHandler} className="dropdown-item">UT</a>
                                                <a key="VT" value="VT" onClick={stateSelectHandler} className="dropdown-item">VT</a>
                                                <a key="VA" value="VA" onClick={stateSelectHandler} className="dropdown-item">VA</a>
                                                <a key="WA" value="WA" onClick={stateSelectHandler} className="dropdown-item">WA</a>
                                                <a key="WI" value="WI" onClick={stateSelectHandler} className="dropdown-item">WI</a>
                                                <a key="WV" value="WV" onClick={stateSelectHandler} className="dropdown-item">WV</a>
                                                <a key="WY" value="WY" onClick={stateSelectHandler} className="dropdown-item">WY</a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <label htmlFor="txtEmployerCity"><strong>City</strong></label>
                                        <input type="text" id="txtEmployerCity" defaultValue="" className="form-control"></input>
                                    </div>
                                    <div className="col-4">
                                        <label htmlFor="txtEmployerZipCode"><strong>Zip Code</strong></label>
                                        <input type="text" id="txtEmployerZipCode" defaultValue="" className="form-control"></input>
                                    </div>
                                </div>
                         
                            </div>
                        </div>
                    </div>
                </div>
                <br></br>
                <div className="form-row float-right">
                    <div className="col-auto">
                        <input type="submit" onClick={updateClickHandler}  className="btn btn-primary mb-2" value="Update" />     
                    </div>
                    <div className="col-auto">
                        <button type="button" onClick={resetClickHandler}  className="btn btn-primary mb-2">Reset</button>
                    </div>
                </div>

            </div>;
};

export default SupplementalAdult;