import React, { useState, useEffect } from 'react';
import DropDown from './Dropdown';
import RadioButton from './RadioButton';
import DatePicker from 'react-datepicker';
import { getSessionData } from './commonAdmin';
import { Api } from './commonAdmin';

const Supplemental = (props) => {

    let clientHeightInFeet = '';
    let clientHeighInInches = '';
    let clientWeight = '';
    let clientHouseHoldSize = '';
    let clientHomePhone = '';
    let clientIncome = '';
    let clientLanguage = '';
    let clientIEP = '';
    let clientInterpreterNeeded = '';
    let clientMedicaid = '';
    let clientInsurance = '';
    let clientDriversLicense = '';
    let clientConvictedOffense = '';
    let clientConvictedMisdemeanor = '';
    let clientConvictedFelony = '';
    let clientWorkingVehicle = '';
    let clientConvictedFelonyCrime = '';
    let clientCareerStation = '';
    let clientNotes = '';
    let clientIDType = '';
    let clientIDNumber = '';
    let clientIDIssueDate = new Date();
    let clientIDExpirationDate = new Date();
    let clientScars = '';
    let clientDisabled = '';
    
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

    //this is really important
    if (props.clientProfile === undefined) return null;

    let personSupplemental = props.clientProfile.PersonSupplemental
    let educationLevels = props.educationLevelValues;
    let fundingSources = props.fundingSourceValues;
    let jobStatuses = props.jobStatusValues;
    let maritalStatuses = props.maritalStatusValues;
    
    // console.log('this is tthe supplemental');
    // console.log(personSupplemental);
    // console.log(educationLevels);

    clientHeightInFeet = (personSupplemental.HeightFt !== null) ? personSupplemental.HeightFt : '';
    clientHeighInInches = (personSupplemental.HeightIn !== null) ? personSupplemental.HeightIn : '';
    clientWeight = (personSupplemental.Weight !== null) ? personSupplemental.Weight : '';
    clientHouseHoldSize = (personSupplemental.HouseholdSize !== null) ? personSupplemental.HouseholdSize : '';
    clientHomePhone = (personSupplemental.HomePhone !== null) ? personSupplemental.HomePhone : '';
    clientIncome = (personSupplemental.HouseholdIncome !== null) ? personSupplemental.HouseholdIncome : '';
    clientLanguage = (personSupplemental.Language !== null) ? personSupplemental.Language : '';
    clientIEP = (personSupplemental.HasExceptionEduc !== null) ? personSupplemental.HasExceptionEduc : '';
    clientInterpreterNeeded = (personSupplemental.HasInterpreter !== null) ? personSupplemental.HasInterpreter : '';
    clientMedicaid = (personSupplemental.HasMedicaid !== null ) ? personSupplemental.HasMedicaid : '';
    clientInsurance = (personSupplemental.HasInsurance !== null ) ? personSupplemental.HasInsurance : '';
    clientDriversLicense = (personSupplemental.HasDriversLicense !== null) ? personSupplemental.HasDriversLicense : '';
    clientConvictedOffense = (personSupplemental.HasConvictedOffence !== null ) ? personSupplemental.HasConvictedOffence : '';
    clientConvictedMisdemeanor = (personSupplemental.HasConvictedMisdemeanor !== null ) ? personSupplemental.HasConvictedMisdemeanor : '';
    clientConvictedFelony = (personSupplemental.HasConvictedFelony !== null) ? personSupplemental.HasConvictedFelony : ''; 
    clientWorkingVehicle = (personSupplemental.HasVehicle !== null ) ? personSupplemental.HasVehicle : '';
    clientConvictedFelonyCrime = (personSupplemental.HasConvictedCrimeIntegrity !== null) ? personSupplemental.HasConvictedCrimeIntegrity : '';
    clientCareerStation = (personSupplemental.CareerSt !== null) ? personSupplemental.CareerSt : '';
    clientNotes = (personSupplemental.Comments !== null) ? personSupplemental.Comments : '';
    clientIDType = (personSupplemental.IDType !== null) ? personSupplemental.IDType : '';
    clientIDNumber = (personSupplemental.IDNumber !== null) ? personSupplemental.IDNumber : '';
    clientIDIssueDate = (personSupplemental.IssueDate !== null) ? convertDateToUtcFormat(personSupplemental.IssueDate) : '';
    clientIDExpirationDate = (personSupplemental.ExpirationDate !== null) ? convertDateToUtcFormat(personSupplemental.ExpirationDate) : '';
    clientScars = (personSupplemental.ScarMarks !== null ) ? personSupplemental.ScarMarks : '';
    clientDisabled = (personSupplemental.IsDisable !== null) ? personSupplemental.IsDisable : '';


    //the dropdowns from database
    clientEducationLevelID = (personSupplemental.EducationLevel !== null) ? personSupplemental.EducationLevel.ID : '';
    clientEducationLevelDescription = (personSupplemental.EducationLevel !== null ) ? personSupplemental.EducationLevel.Name : '';
    clientFundingSourceID = (personSupplemental.FundingSource !== null ) ? personSupplemental.FundingSource.ID : '';
    clientFundingSourceDescription = (personSupplemental.FundingSource !== null) ? personSupplemental.FundingSource.Name : '';
    clientJobStatusID = (personSupplemental.JobStatus !== null) ? personSupplemental.JobStatus.ID : '';
    clientJobStatusDescription = (personSupplemental.JobStatus !== null) ? personSupplemental.JobStatus.Name : '';
    clientMaritalStatusID = (personSupplemental.MaritalStatus !== null ) ? personSupplemental.MaritalStatus.ID : '';
    clientMaritalStatusDescription = (personSupplemental.MaritalStatus !== null ) ? personSupplemental.MaritalStatus.Name: '';

    clientSupplementalID = (personSupplemental.ID !== null ) ? personSupplemental.ID : 0;
    clientCreatedDate = (personSupplemental.CreatedDate !== null) ? personSupplemental.CreatedDate : '';
    clientCreatedBy = (personSupplemental.CreatedBy !== null) ? personSupplemental.CreatedBy : '';
    clientUpdatedDate = (personSupplemental.UpdatedDate !== null) ? personSupplemental.UpdatedDate : '';
    clientUpdatedBy = (personSupplemental.UpdatedBy !== null) ? personSupplemental.UpdatedBy : '';



    const [personSupplementalID, setPersonSupplementalID ] = useState(clientSupplementalID);
    //the dropdowns pulling values from the database
    const [educationLevelID, setEducationLevelID] = useState(clientEducationLevelID);
    const [educationLevelDescription, setEducationLevelDescription] = useState(clientEducationLevelDescription);
    const [educationLevelValues, setEducationLevelValues] = useState(educationLevels);
    const [fundingSourceID, setFundingSourceID] = useState(clientFundingSourceID);
    const [fundingSourceDescription, setFundingSourceDescription] = useState(clientFundingSourceDescription);
    const [fundingSourceValues, setFundingSourceValues] = useState(fundingSources);
    const [jobStatusID, setJobStatusID] = useState(jobStatusID);
    const [jobStatusDescription, setJobStatusDescription] = useState(clientJobStatusDescription);
    const [jobStatusValues, setJobStatusValues] = useState(jobStatuses);
    const [maritalStatusID, setMaritalStatusID] = useState(clientMaritalStatusID);
    const [maritalStatusDescription, setMaritalStatusDescription] = useState(clientMaritalStatusDescription);
    const [maritalStatusValues, setMaritalStatusValues] = useState(maritalStatuses);
    
    //the dropdowns with hardcoded values
    const [careerStation, setCareerStation] = useState(clientCareerStation);
    const [idType, setIDType] = useState(clientIDType);
    const [livingSituation, setLivingSituation] = useState('Please Select');
    const [studentStatus, setStudentStatus] = useState('Please Select');
    const [educationLevel, setEducationLevel] = useState('Please Select');
    const [state, setState] = useState('Please Select');

    //the radio buttons
    const [isIepChecked, setIsIepChecked] = useState(clientIEP);
    const [isInterpreterNeededChecked, setIsInterpreterNeededChecked] = useState(clientInterpreterNeeded);
    const [isMedicaid, setIsMedicaid] = useState(clientMedicaid);
    const [isInsurance, setIsInsurance] = useState(clientInsurance);
    const [isDriversLicense, setIsDriversLicense] = useState(clientDriversLicense);
    const [isConvictedOffense, setIsConvictedOffense] = useState(clientConvictedOffense);
    const [isConvictedMisdemeanor, setIsConvictedMisdemeanor] = useState(clientConvictedMisdemeanor);
    const [isConvictedFelony, setIsConvictedFelony] = useState(clientConvictedFelony);
    const [isWorkingVehicle, setIsWorkingVehicle] = useState(clientWorkingVehicle);
    const [isConvictedFelonyCrime, setIsConvictedFelonyCrime] = useState(clientConvictedFelonyCrime);
    const [isDisabled, setIsDisabled] = useState(clientDisabled);
    
    //the date pickers
    const [idIssueDate, setIDIssueDate] = useState(clientIDIssueDate);
    const [idExpirationDate, setIDExpirationDate] = useState(clientIDExpirationDate);

    //textboxes
    const [heightInFeet, setHeightInFeet] = useState(clientHeightInFeet);
    const [heightInInches, setHeightInInches] = useState(clientHeighInInches);
    const [weight, setWeight] = useState(clientWeight);
    const [shoeSize, setShoeSize] = useState('');
    const [houseHoldSize, setHouseHoldSize] = useState(clientHouseHoldSize);
    const [homePhone, setHomePhone] = useState(clientHomePhone);
    const [houseHoldIncome, setHouseHoldIncome] = useState(clientIncome);
    const [primaryLanguage, setPrimaryLanguage] = useState(clientLanguage);
    const [notes, setNotes] = useState(clientNotes);
    const [idNumber, setIDNumber] = useState(clientIDNumber);
    const [scarsMarksTattos, setScarsMarksTattoos] = useState(clientScars);
    const [employer, setEmployer] = useState('');
    const [supervisor, setSupervisor] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [avgHoursPerWeek, setAvgHoursPerWeek] = useState('');
    const [employerAddress, setEmployerAddress] = useState('');

    //for the reset button, it will enable if anything is changed
    const [isResetButtonDisabled, setResetButtonDisabled] = useState(true);

    //audit
    const [createdBy, setCreatedBy] = useState(clientCreatedBy);
    const [createdDate, setCreatedDate] = useState(clientCreatedDate);
    const [updatedBy, setUpdatedBy] = useState(clientUpdatedBy);
    const [updatedDate, setUpdatedDate] = useState(clientUpdatedDate);


    //Reset variables to hold original state
    //the reset dropdown values
    const [prevEducationLevelID, setPrevEducationLevelID] = useState(3);
    const [prevEducationLevelDescription, setPrevEducationLevelDescription] = useState('Please Select');
    const [prevFundingSourceID, setPrevFundingSourceID] = useState(3);
    const [prevFundingSourceDescription, setPrevFundingSourceDescription] = useState("Please Select");
    const [prevJobStatusID, setPrevJobStatusID] = useState(3);
    const [prevJobStatusDescription, setPrevJobStatusDescription] = useState("Please Select");
    const [prevMaritalStatusID, setPrevMaritalStatusID] = useState(3);
    const [prevMaritalStatusDescription, setPrevMaritalStatusDescription] = useState("Please Select");
    
    //the reset radio button values
    const [prevIsIepChecked, setPrevIsIepChecked] = useState(false);
    const [prevIsInterpreterNeededChecked, setPrevIsInterpreterNeededChecked] = useState(false);
    const [prevIsMedicaid, setPrevIsMedicaid] = useState(false);
    const [prevIsInsurance, setPrevIsInsurance] = useState(false);
    const [prevIsDriversLicense, setPrevIsDriversLicense] = useState(false);
    const [prevIsConvictedOffense, setPrevIsConvictedOffense] = useState(false);
    const [prevIsConvictedMisdemeanor, setPrevIsConvictedMisdemeanor] = useState(false);
    const [prevIsConvictedFelony, setPrevIsConvictedFelony] = useState(false);
    const [prevIsWorkingVehicle, setPrevIsWorkingVehicle] = useState(false);
    const [prevIsConvictedFelonyCrime, setPrevIsConvictedFelonyCrime] = useState(false);
    const [prevIsDisabled, setPrevIsDisabled] = useState(false);
    
    //the reset textbox values
    const [prevHeightInFeet, setPrevHeightInFeet] = useState('');
    const [prevHeightInInches, setPrevHeightInInches] = useState('');
    const [prevWeight, setPrevWeight] = useState('');
    const [prevShoeSize, setPrevShoeSize] = useState('');
    const [prevHouseHoldSize, setPrevHouseHoldSize] = useState('');
    const [prevHomePhone, setPrevHomePhone] = useState('');
    const [prevHouseHoldIncome, setPrevHouseHoldIncome] = useState('');
    const [prevPrimaryLanguage, setPrevPrimaryLanguage] = useState('');
    const [prevNotes, setPrevNotes] = useState('');
    const [prevIdNumber, setPrevIDNumber] = useState('');
    const [prevScarsMarksTattos, setPrevScarsMarksTattoos] = useState('');


    
    useEffect(() => {
        setHeightInFeet(clientHeightInFeet);
        setHeightInInches(clientHeighInInches);
        setWeight(clientWeight);
        setHouseHoldSize(clientHouseHoldSize);
        setHomePhone(clientHomePhone);
        setHouseHoldIncome(clientIncome);
        setPrimaryLanguage(clientLanguage);

        //Education Level
        setEducationLevelID(clientEducationLevelID);
        setEducationLevelDescription(clientEducationLevelDescription);
        setEducationLevelValues(educationLevels);

        //Funding Source
        setFundingSourceID(clientFundingSourceID);
        setFundingSourceDescription(clientFundingSourceDescription);
        setFundingSourceValues(fundingSources);

        //Job Status
        setJobStatusID(clientJobStatusID);
        setJobStatusDescription(clientJobStatusDescription);
        setJobStatusValues(jobStatuses);

        //Marital Status
        setMaritalStatusID(clientMaritalStatusID);
        setMaritalStatusDescription(clientMaritalStatusDescription);
        setMaritalStatusValues(maritalStatuses);


    }, []);

    function addPleaseSelect(options) {
        let pleaseSelectItem = {
            Name: "PleaseSelect",
            Description: "Please Select",
            Active: true,
            ID: 0,
            CreatedDate: new Date()
        }

        options.splice(0, 0, pleaseSelectItem);

        return options;
    }

    function convertDateToUtcFormat(date) {
        let javascriptDateObject = new Date(date);
        let formattedDate = javascriptDateObject.toUTCString();
        let utcDate = new Date(formattedDate);
        return utcDate;
    }

    function handleMaritalStatusChange(maritalStatus) {
        setResetButtonDisabled(false);
        setMaritalStatusID(maritalStatus);
    }

    function handleMaritalStatusDescriptionChange(maritalStatusDescription) {
        setMaritalStatusDescription(maritalStatusDescription);
    }

    // function handleJobStatusChange(jobStatus) {
    //     setResetButtonDisabled(false);
    //     setJobStatusID(jobStatus);
    // }

    function handleJobStatusDescriptionChange(jobStatusDescription) {
        setJobStatusDescription(jobStatusDescription);
    }


    function handleEducationLevelChange(event){        
        let selectedValue = event.currentTarget.getAttribute('value');
        
        setEducationLevelID(selectedValue);
        
        let selectedEducationLevel = educationLevels.filter(function (educationLevel) {
            return educationLevel.ID === parseInt(selectedValue)
        });

        setEducationLevelDescription(selectedEducationLevel[0].Description);
  
    }

    function handleFundingSourceChange(event) {
        let selectedValue = event.currentTarget.getAttribute('value');

        setFundingSourceID(selectedValue);

        let selectedFundingSource =  fundingSources.filter(function(fundingSource) {
            return fundingSource.ID === parseInt(selectedValue);
        });

        setFundingSourceDescription(selectedFundingSource[0].Description);
    }

    function handleJobStatusChange(event) {
        let selectedValue = event.currentTarget.getAttribute('value');

        setJobStatusID(selectedValue);

        let selectedJobStatus =  jobStatuses.filter(function(jobStatus) {
            return jobStatus.ID === parseInt(selectedValue);
        });

        setJobStatusDescription(selectedJobStatus[0].Description);
    }

    function handleMaritalStatusChange(event) {
        let selectedValue = event.currentTarget.getAttribute('value');

        setMaritalStatusID(selectedValue);

        let selectedMaritalStatus  = maritalStatuses.filter(function(maritalStatus) {
            return maritalStatus.ID === parseInt(selectedValue);
        });

        setMaritalStatusDescription(selectedMaritalStatus[0].Description);
    }

    // function handleEducationLevelDescriptionChange(educationLevel) {
    //     setEducationLevelDescription(educationLevel);
    // }

    // function handleFundingSourceChange(fundingSource) {
    //     setResetButtonDisabled(false);
    //     setFundingSourceID(fundingSource);
    // }

    function handleFundingSourceDescriptionChange(fundingSourceDesc) {
        setFundingSourceDescription(fundingSourceDesc);
    }

    function setCheckedValueHandler(iep) {
        setResetButtonDisabled(false);
        console.log('the iep value is:');
        console.log(iep);       
        setIsIepChecked(iep);
    }

    function setIsInterpreterNeededHandler(isInterpreter) {
        setResetButtonDisabled(false);
        setIsInterpreterNeededChecked(isInterpreter);
    }

    function setIsMedicaidHandler(medicaid) {
        setResetButtonDisabled(false);
        setIsMedicaid(medicaid);
    }

    function setIsInsuranceHandler(insurance) {
        setResetButtonDisabled(false);
        setIsInsurance(insurance);
    }

    function setIsDriversLicenseHandler(license) {
        setResetButtonDisabled(false);
        setIsDriversLicense(license);
    }

    function setIsConvictedOffenseHandler(offense) {
        setResetButtonDisabled(false);
        setIsConvictedOffense(offense);
    }

    function setIsConvictedMisdemeanorHandler(misdemeanor) {
        setResetButtonDisabled(false);
        setIsConvictedMisdemeanor(misdemeanor);
    }

    function setIsConvictedFelonyHandler(felony) {
        setResetButtonDisabled(false);
        setIsConvictedFelony(felony);
    }

    function setIsWorkingVehicleHandler(vehicle) {
        setResetButtonDisabled(false);
        setIsWorkingVehicle(vehicle);
    }

    function setIsConvictedFelonyCrimeHandler(crime) {
        setResetButtonDisabled(false);
        setIsConvictedFelonyCrime(crime);
    }

    function setIsDisalbedHandler(disabled) {
        setResetButtonDisabled(false);
        setIsDisabled(disabled);
    }

    function careerStationSelectHandler(event) {
        //console.log(career);
        setResetButtonDisabled(false);
        let selectedValue = event.currentTarget.getAttribute('value');
        console.log(selectedValue);

        setCareerStation(selectedValue);
    }

    function notesChangeHandler(event) {
        //console.log(event.target.value);
        setResetButtonDisabled(false);
        setNotes(event.target.value);
    }

    function idTypeSelectHandler(event) {
        setResetButtonDisabled(false);
        let selectedValue = event.currentTarget.getAttribute('value');
        console.log(selectedValue);
        setIDType(selectedValue);
    }

    function livingSituationSelectHandler(event) {
        setResetButtonDisabled(false);
        let selectedValue = event.currentTarget.getAttribute('value');
        console.log(selectedValue);
        setLivingSituation(selectedValue);
    }

    function highestEdLevelSelectHandler(event) {
        setResetButtonDisabled(false);
        let selectedValue = event.currentTarget.getAttribute('value');
        console.log(selectedValue);
        setEducationLevel(selectedValue);
    }

    function stateSelectHandler(event) {
        setResetButtonDisabled(false);
        let selectedValue = event.currentTarget.getAttribute('value');
        console.log(selectedValue);
        setState(selectedValue);
    }

    function studentStatusSelectHandler(event) {
        setResetButtonDisabled(false);
        let selectedValue = event.currentTarget.getAttribute('value');
        console.log(selectedValue);
        setStudentStatus(selectedValue);
    }

    function setIDNumberHandler(event) {
        setResetButtonDisabled(false);
        setIDNumber(event.target.value);
    }

    function setScarsHandler(event) {
        setResetButtonDisabled(false);
        setScarsMarksTattoos(event.target.value);
    }

    //TODO: put this into common file- see Info.js
    function isValidDate(d) {
        //return d.date instanceof Date && !isNaN(d);
        return Object.prototype.toString.call(d.date) === '[object Date]';
    }

    function handleIDIssueDateChange(idIssueDate) {
        setResetButtonDisabled(false);
        // console.log('this is the birth date');
        // console.log(birthDate);
         let isValid = isValidDate(idIssueDate);
        // console.log(isValid);
 
         if (!isValid) {
             //setBirthDateRequired(true);
             //setDobErrorDivCss('invalid-feedback d-block')
         } else {
             //setBirthDateRequired(false);
             //setDobErrorDivCss('invalid-feedback');
         }
 
         //setResetButtonDisabled(false); 
         //setBirthDate(birthDate.date);
         console.log(idIssueDate.date);
         setIDIssueDate(idIssueDate.date);
     }

     function handleIdExpirationDateChange(idExpirationDate) {
         let isValid = isValidDate(idExpirationDate);

         if (!isValid) {

         } else {

         }

         setIDExpirationDate(idExpirationDate.date);
     }

     function heightInFeetChangeHandler(event) {
        setResetButtonDisabled(false);
        setHeightInFeet(event.target.value);
     }

     function heightInInchesChangeHandler(event) {
        setResetButtonDisabled(false);
         setHeightInInches(event.target.value);
     }

     function weightChangeHandler(event) {
        setResetButtonDisabled(false);
         setWeight(event.target.value);
     }

     function shoeSizeChangeHandler(event) {
        setResetButtonDisabled(false);
         setShoeSize(event.target.value);
     }

     function houseHoldSizeHandler(event) {
        setResetButtonDisabled(false);
         setHouseHoldSize(event.target.value);
     }

     function homePhoneChangeChandler(event) {
        setResetButtonDisabled(false);
         setHomePhone(event.target.value);
     }

     function houseHoldIncomeChangeHandler(event) {
        setResetButtonDisabled(false);
         setHouseHoldIncome(event.target.value);
     }

     function primaryLanguangeChangeHandler(event) {
        setResetButtonDisabled(false);
         setPrimaryLanguage(event.target.value);
     }

     function employerChangeHandler(event) {
         setResetButtonDisabled(false);
         setEmployer(event.targe.value);
     }

     function supervisorChangeHandler(event) {
         setResetButtonDisabled(false);
         setSupervisor(event.target.value);
     }

     function jobTitleChangeHandler(event) {
         setResetButtonDisabled(false);
         setJobTitle(event.target.value);
     }

     function hoursPerWeekChangeHandler(event) {
         setResetButtonDisabled(false);
         setAvgHoursPerWeek(event.target.value);
     }

     function employerAddressChangeHandler(event) {
         setResetButtonDisabled(false);
         setEmployerAddress(false);
     }

     function updateClickHandler() {
        let personID = sessionStorage.getItem('PersonID');
        let apiAddress = sessionStorage.getItem("baseApiAddress");
        let fullPersonSupplementalAddress = `${apiAddress}/api/PersonSupplemental`;
        let sessionStorageData = getSessionData();

        //the CWB fields
        let personSupplemental = {
            ID: personSupplementalID,
            PersonID: personID,
            HeightFt: heightInFeet,
            HeightIn: heightInInches,
            Weight: weight,
            HouseholdSize: houseHoldSize,
            HomePhone: homePhone,
            HouseholdIncome: houseHoldIncome,
            Language: primaryLanguage,
            EducationLevelID: educationLevelID,
            HasExceptionEduc: isIepChecked,
            HasInterpreter: isInterpreterNeededChecked,
            HasMedicaid: isMedicaid,
            HasInsurance: isInsurance,
            HasDriversLicense: isDriversLicense,
            HasConvictedOffence: isConvictedOffense,
            HasConvictedMisdemeanor: isConvictedMisdemeanor,
            HasConvictedFelony: isConvictedFelony,
            HasVehicle: isWorkingVehicle,
            HasConvictedCrimeIntegrity: isConvictedFelonyCrime,
            FundingSourceID: fundingSourceID,
            CareerSt: careerStation,
            Comments: notes,
            IDType: idType,
            IDNumber: idNumber,
            IssueDate: idIssueDate,
            ExpirationDate: idExpirationDate,
            JobStatusID: jobStatusID,
            MaritalStatusID: maritalStatusID,
            ScarMarks: scarsMarksTattos,
            IsDisable: isDisabled,
            LivingSituation: livingSituation,
            StudentStatus: studentStatus,
            HighestEducation: educationLevel,
            Employer: employer,
            Supervisor: supervisor,
            JobTitle: jobTitle,
            HoursPerWeek: avgHoursPerWeek,
            EmployerAddress: employerAddress,
            EmployerAddressState: state,
            Active: true,
            CreatedDate: createdDate,
            CreatedBy: createdBy,
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

     }

   

     //set up the education level dropdown
     let educationLevelValueOptions = [];
     if (educationLevelValues.length > 0) {
 
        educationLevelValueOptions = educationLevelValues.map((value) =>
             <a key={value.ID} value={value.ID} description={value.Description} onClick={handleEducationLevelChange} className="dropdown-item">{value.Description}</a>
         );
     }

     //funding sources
     let fundingSourceValueOptions = [];
     if (fundingSourceValues.length > 0) {
        fundingSourceValueOptions = fundingSourceValues.map((value) =>
            <a key={value.ID} value={value.ID} description={value.Description} onClick={ handleFundingSourceChange} className="dropdown-item">{value.Description}</a>
          );
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
                                Supplemental
                            </a>
                        </div>
                        
                        <div id="collapsibleSupplementalSection" className="collapse show" data-parent="#accordion">
                            <div className="card-body">
                                <br></br>
                                <div className="form-row">
                                    <div className="col-3">
                                        <div className="form-group">
                                            <label htmlFor="txtHeightFeet"><strong>Height (Feet)</strong></label>
                                            <input type="text" className="form-control" value={heightInFeet} onChange={heightInFeetChangeHandler} id="txtHeightFeet"></input>
                                        </div>
                                    </div>
                                    <div className="col-3">
                                        <label htmlFor="txtHeightInches"><strong>Height (Inches)</strong></label>
                                        <input type="text" className="form-control" value={heightInInches} onChange={heightInInchesChangeHandler} id="txtHeightInches"></input>
                                    </div>
                                    <div className="col-3">
                                        <label htmlFor="txtWeight"><strong>Weight (lbs.)</strong></label>
                                        <input type="text" className="form-control" value={weight} onChange={weightChangeHandler} id="txtWeight"></input>
                                    </div>
                                    <div className="col-3">
                                        <label htmlFor="txtShoeSize"><strong>Shoe size (inches)</strong></label>
                                        <input type="text" className="form-control" value={shoeSize} onChange={shoeSizeChangeHandler} id="txtShoeSize"></input>
                                    </div>
                                </div>
                                <div className="form-row">          
                                    <div className="col-2">
                                        <label htmlFor="txtHouseSize"><strong>Household Size</strong></label>
                                        <input type="text" className="form-control" value={houseHoldSize} onChange={houseHoldSizeHandler} id="txtHouseSize"></input>
                                    </div>
                                    <div className="col-2">
                                        <label htmlFor="txtHomePhone"><strong>Home Phone</strong></label>
                                        <input type="text" className="form-control" value={homePhone} onChange={homePhoneChangeChandler} id="txtHomePhone"></input>
                                    </div>
                                    <div className="col-2">
                                        <label htmlFor="txtHouseIncome"><strong>Household Income</strong></label>
                                        <input type="text" className="form-control" value={houseHoldIncome } onChange={houseHoldIncomeChangeHandler} id="txtHouseIncome"></input>
                                    </div>
                                    <div className="col-2">
                                        <label htmlFor="txtLanguage"><strong>Primary Language</strong></label>
                                        <input type="text" className="form-control" value={primaryLanguage} onChange={primaryLanguangeChangeHandler} id="txtLanguage"></input>
                                    </div>
                                    <div className="col-4">
                                        <label htmlFor="ddlEducationLevels"><strong>Highest Grade Completed</strong></label>
                                        <div className="dropdown">
                                            <button type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                                {educationLevelDescription }
                                            </button>
                                            <div className="dropdown-menu">
                                                {educationLevelValueOptions}
                                            </div>
                                        </div>
                                        {/* <DropDown
                                                onSelectValue={handleEducationLevelChange}
                                                onSelectValueDescription={handleEducationLevelDescriptionChange}
                                                selected={educationLevelID}
                                                valueDescription={educationLevelDescription}
                                                values={educationLevels}
                                                isRequired={true} >
                                        </DropDown> */}
                                    </div> 
                                </div>
                                <br></br>
                                <div className="form-row">
                                    <div className="col-4">
                                        <label><strong> IEP</strong></label>
                                        <RadioButton name={"IEP"} isChecked={isIepChecked} setCheckedValue={setCheckedValueHandler} />
                                    </div>
                                    <div className="col-4">
                                        <label><strong>Is Interpreter Needed</strong></label>
                                        <RadioButton name={"rdIsInterpreterNeeded"} isChecked={isInterpreterNeededChecked} setCheckedValue={setIsInterpreterNeededHandler}/>
                                    </div>
                                    <div className="col-4">
                                        <label><strong>Medicaid*</strong></label>
                                        <RadioButton name={"rdMedicaid"} isChecked={isMedicaid} setCheckedValue={setIsMedicaidHandler}/>
                                    </div>                   
                                </div>
                                <br></br>
                                <div className="form-row">
                                    <div className="col-4">
                                        <label><strong>Insurance</strong></label>
                                        <RadioButton name={"rdInsurance"} isChecked={isInsurance} setCheckedValue={setIsInsuranceHandler}/>
                                    </div>
                                    <div className="col-4">
                                        <label><strong>Driver's License</strong></label>
                                        <RadioButton name={"rdDriversLicense"} isChecked={isDriversLicense} setCheckedValue={setIsDriversLicenseHandler}/>
                                    </div>
                                    <div className="col-4">
                                        <label><strong>Convicted Offense</strong></label>
                                        <RadioButton name={"rdConvictedOffense"} isChecked={isConvictedOffense} setCheckedValue={setIsConvictedOffenseHandler}/>
                                    </div>
                                </div>
                                <br></br>
                                <div className="form-row">
                                    <div className="col-3">
                                        <label><strong>Convicted Misdemeanor</strong></label>
                                        <RadioButton name={"rdConvictedMisdemeanor" } isChecked={isConvictedMisdemeanor} setCheckedValue={setIsConvictedMisdemeanorHandler }/>
                                    </div>
                                    <div className="col-3">
                                        <label><strong>Convicted Felony</strong></label>
                                        <RadioButton name={"rdConvictedFelony"} isChecked={isConvictedFelony} setCheckedValue={setIsConvictedFelonyHandler}/>
                                    </div>
                                    <div className="col-3">
                                        <label><strong>Working Vehicle</strong> </label>
                                        <RadioButton name={"rdWorkingVehicle"} isChecked={isWorkingVehicle} setCheckedValue={setIsWorkingVehicleHandler}/>
                                    </div>
                                    <div className="col-3">
                                        <label><strong>Convicted Felony Crime (Integrity) </strong></label>
                                        <RadioButton name={"rdConvictedFelonyCrime"} isChecked={isConvictedFelonyCrime} setCheckedValue={setIsConvictedFelonyCrimeHandler} />
                                    </div>
                                </div>
                                <br></br>
                                <div className="form-row">
                                    <div className="col-4">
                                        <label htmlFor="ddlFundingSources"><strong>Potential Funding Source</strong></label>
                                        <div className="dropdown">
                                            <button type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                                {fundingSourceDescription }
                                            </button>
                                            <div className="dropdown-menu">
                                                { fundingSourceValueOptions }
                                            </div>
                                        </div>
                                        {/* <DropDown
                                            onSelectValue={handleFundingSourceChange }
                                            onSelectValueDescription={handleFundingSourceDescriptionChange }
                                            selected={fundingSourceID }
                                            valueDescription={fundingSourceDescription}
                                            values={fundingSources }
                                            isRequired={false} >
                                        </DropDown> */}
                                    </div>
                                    <div className="col-4">
                                        <label htmlFor="ddlCareerStation"><strong>Career Station</strong></label>
                                        <div className="dropdown">
                                            <button type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">                        
                                                {careerStation}
                                            </button>
                                            <div  className="dropdown-menu">
                                                <a key={"Please Select"} value={"Please Select"} onClick={careerStationSelectHandler} className="dropdown-item">Please Select</a>
                                                <a key={"Marshall"} value={"Marshall"} onClick={careerStationSelectHandler} className="dropdown-item">Marshall</a>
                                                <a key={"East End"} value={"East End"} onClick={careerStationSelectHandler} className="dropdown-item">East End</a>
                                                <a key={"South Side"} value={"South Side"} onClick={careerStationSelectHandler} className="dropdown-item">South Side</a>
                                                <a key={"Other"} value={"Other"} onClick={careerStationSelectHandler} className="dropdown-item">Other</a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <label htmlFor="txtNotes"><strong>Notes</strong></label>
                                        <textarea value={notes} onChange={notesChangeHandler} className="form-control"></textarea>
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
                                            <button type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">                        
                                                { idType }
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
                                        <input type="text" value={idNumber} onChange={setIDNumberHandler} className="form-control" id="txtIDNumber"></input>
                                    </div>
                                    <div className="col-3">
                                        <label htmlFor="txtIssueDate"><strong>ID Issue Date</strong></label>
                                        <DatePicker 
                                            selected={ idIssueDate }
                                            required={false}
                                            onChange={date => handleIDIssueDateChange({date})}
                                            className="form-control"                             
                                        />
                                    </div>
                                    <div className="col-3">
                                        <label htmlFor="txtIdExpirationDate"><strong>ID Expiration Date</strong></label>
                                        <DatePicker
                                           selected={idExpirationDate}
                                           required={false}
                                           onChange={date => handleIdExpirationDateChange({date})}
                                           className="form-control"
                                           >
                                        </DatePicker>
                                    </div>
                                </div>
                                <br></br>
                                <div className="form-row">
                                    <div className="col-3">
                                        <label htmlFor="ddlJobStatus"><strong>Job Status</strong></label>
                                        <div className="dropdown">
                                            <button type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                                { jobStatusDescription }
                                            </button>
                                            <div className="dropdown-menu">
                                                { jobStatusValueOptions }
                                            </div>
                                        </div>
                                        {/* <DropDown
                                                onSelectValue={handleJobStatusChange }
                                                onSelectValueDescription={handleJobStatusDescriptionChange}
                                                selected={jobStatusID}
                                                valueDescription={jobStatusDescription }
                                                values={jobStatuses}
                                                isRequired={false} >
                                        </DropDown> */}
                                    </div>
                                    <div className="col-3">
                                        <label htmlFor="ddlMaritalStatus"><strong>Marital Status</strong></label>
                                        <div className="dropdown">
                                            <button type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                                { maritalStatusDescription }
                                            </button>
                                            <div className="dropdown-menu">
                                                { maritalStatusValueOptions }
                                            </div>
                                        </div>
                                        {/* <DropDown
                                             onSelectValue={handleMaritalStatusChange}
                                             onSelectValueDescription={handleMaritalStatusDescriptionChange}
                                             selected={maritalStatusID}
                                             valueDescription={maritalStatusDescription}
                                             values={maritalStatuses}
                                             isRequired={false}> 
                                        </DropDown> */}
                                    </div>
                                    <div className="col-3">
                                        <label htmlFor="txtScarsMarks"><strong>Scars/Marks/Tattoos</strong></label>
                                        <input id="txtScarsMarks" value={scarsMarksTattos} onChange={setScarsHandler} type="text" className="form-control"></input>
                                    </div>
                                    <div className="col-3">
                                        <label><strong>Is Disabled</strong></label>
                                        <RadioButton name={"rdIsDisabled"} isChecked={isDisabled} setCheckedValue={setIsDisalbedHandler} />
                                    </div>
                                </div>
                                <br></br>
                                <div className="form-row">
                                    <div className="col-4">
                                        <label htmlFor="ddlIDType"><strong>Living Situation</strong></label>
                                        <div className="dropdown">
                                            <button type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">                        
                                                 { livingSituation }
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
                                            <button type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">                        
                                                { studentStatus }
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
                                            <button type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">                        
                                                { educationLevel }
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
                                        <input type="text" value={employer} onChange={employerAddressChangeHandler} className="form-control"></input>
                                    </div>
                                    <div className="col-3">
                                        <label htmlFor="txtSupervisor"><strong>Supervisor</strong></label>
                                        <input type="text" value={supervisor} onChange={supervisorChangeHandler} className="form-control"></input>
                                    </div>
                                    <div className="col-3">
                                        <label htmlFor="txtJobTitle"><strong>Job Title</strong></label>
                                        <input type="text" value={jobTitle} onChange={jobTitleChangeHandler} className="form-control"></input>
                                    </div>
                                    <div className="col-3">
                                        <label htmlFor="txtJobTitle"><strong>Average Hours Per Week</strong></label>
                                        <input type="text" value={avgHoursPerWeek} onChange={hoursPerWeekChangeHandler} className="form-control"></input>
                                    </div>
                                </div>
                                <br></br>
                                <div className="form-row">
                                    <div className="col-8">
                                        <label htmlFor="txtEmployerAddress"><strong>Address</strong></label>
                                        <input type="text" value={employerAddress} onChange={employerAddressChangeHandler} className="form-control"></input>
                                    </div>
                                </div>
                                <br></br>
                                <div className="form-row">
                                    <div className="col-4">
                                        <label htmlFor="ddlState"><strong>Select State</strong></label>
                                        <div className="dropdown">
                                            <button type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">                        
                                                { state }
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
                        <button type="button" onClick={resetClickHandler} disabled={isResetButtonDisabled} className="btn btn-primary mb-2">Reset</button>
                    </div>
                </div>

            </div>;
}

export default Supplemental;