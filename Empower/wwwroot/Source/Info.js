import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useStore } from './StateStores/store';
import moment from 'moment';
import { useForm } from 'react-hook-form';
import { Api } from './commonAdmin';
import { GenerateUniqueID } from './NewClient';
import { getSessionData } from './commonAdmin';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { findDOMNode } from 'react-dom';
import $ from 'jquery';
import {getSystems} from './Constants';
import {modal} from 'bootstrap/js/dist/modal';
//const {state, dispatch} = useStore();

//using forwardRef as described here: https://stackoverflow.com/questions/37949981/call-child-method-from-parent
//this allows the updateBirthDate() function to be called from the CaseManagement parent component
const Info = (props, ref) => {
    //to test the global state
    const { state, dispatch } = useStore();

    let clientLastName = '';
    let clientFirstName = '';
    let clientMiddleName = '';
    let clientSuffixID = '';
    let clientSuffixDescription = '';
    let clientSSN = '';
    let clientFbiNcic = '';
    let clienttJTS = '';
    let clientStateVcin = '';
    let clientAlias = '';
    let clientGenderID = '';
    let clientGenderDescription = ''
    let clientRaceID = '';
    let clientRaceDescription = '';
    let clientBirthDate;
    let utcBirthDate = new Date();
    let diffInYears = '';
    let saveButtonShow = false;
    let personID = '';
    let cProfileId = '';
    let clientCreatedDate = '';
    let clientCreatedBy = '';
    let clientUpdatedDate = '';
    let clientUpdatedBy = '';
    let systemID = getSessionData().SystemID;
    let systems = getSystems();
    
    let genderStatuses = props.genderValues;
    let raceStatuses = props.raceValues;
    let suffixStatuses = props.suffixValues;

    //the user clicked on a row in the search grid
    if (props.clientProfilePerson !== undefined) {
        //this is the Person data
        let clientInfo = props.clientProfilePerson.Person;

        //need to create variables for each- if it's null, set to empty string for React controlled components
        clientLastName = (clientInfo.LastName !== null) ? clientInfo.LastName : '';
        clientFirstName = (clientInfo.FirstName !== null) ? clientInfo.FirstName : '';
        clientMiddleName = (clientInfo.MiddleName !== null) ? clientInfo.MiddleName : '';
        clientSuffixID = (clientInfo.SuffixID !== null) ? clientInfo.SuffixID : '';
        clientSuffixDescription = (clientInfo.Suffix !== null) ? clientInfo.Suffix.Description : 'Please Select';
        clientSSN = (clientInfo.SSN !== null) ? clientInfo.SSN : '';
        clientFbiNcic = (clientInfo.FBINCIC !== null) ? clientInfo.FBINCIC : '';
        clientStateVcin = (clientInfo.StateORVCIN !== null) ? clientInfo.StateORVCIN : '';
        clientBirthDate = (clientInfo.DOB !== null ) ? clientInfo.DOB : new Date();
        clientAlias = (clientInfo.Alias !== null) ? clientInfo.Alias : '';
        clientGenderID = (clientInfo.GenderID !== null) ? clientInfo.GenderID : '';
        clientGenderDescription = (clientInfo.Gender !== null) ? clientInfo.Gender.Description : 'Please Select';
        clientRaceID = (clientInfo.RaceID !== null) ? clientInfo.RaceID : '';
        clientRaceDescription = (clientInfo.Race !== null ) ? clientInfo.Race.Description : 'Please Select';
        clienttJTS = (clientInfo.JTS !== null) ? clientInfo.JTS : '';
        personID = (clientInfo.ID !== null) ? clientInfo.ID : '';
        cProfileId = (props.clientProfile.ID !== null) ? props.clientProfile.ID : '';
        clientCreatedDate = (clientInfo.CreatedDate !== null) ? clientInfo.CreatedDate : '';
        clientCreatedBy = (clientInfo.CreatedBy !== null) ? clientInfo.CreatedBy : '';
        clientUpdatedDate = (clientInfo.UpdatedDate !== null) ? clientInfo.UpdatedDate : '';
        clientUpdatedBy = (clientInfo.UpdatedBy !== null) ? clientInfo.UpdatedBy : '';

        //get the birthdate in UTC format- the datepicker plugin needs it that way
        let birthDateJavascriptDateObject = new Date(clientInfo.DOB);

        utcBirthDate = convertDateToUtcFormat(clientInfo.DOB);


        //calculate age
        diffInYears = calculateAge(birthDateJavascriptDateObject);

        saveButtonShow = false;
    } else {
        saveButtonShow = true;
        
    }

    //for validation
    //const { register, handleSubmit, watch, errors, triggerValidation } = useForm();

    //set the state variables
    // const [lastName, setLastName] = useState(clientLastName);
    // const [firstName, setFirstName] = useState(clientFirstName);
    // const [middleName, setMiddleName] = useState(clientMiddleName);
    // const [suffixID, setSuffixID] = useState(clientSuffixID);
    // const [ssn, setSSN] = useState(clientSSN);
    // const [fbiNcicNumber, setFbiNcicNumber] = useState(clientFbiNcic);
    // const [birthDate, setBirthDate] = useState(utcBirthDate);
    // const [stateVcin, setStateVcin] = useState(clientStateVcin);
    // const [jts, setJts] = useState(clienttJTS);
    // const [alias, setAlias] = useState(clientAlias);
    // const [genderID, setGenderID] = useState(clientGenderID);
    // const [raceID, setRaceID] = useState(clientRaceID);
    //const [currentAge, setCurrentAge] = useState(diffInYears);
    //const [ID, setPersonID] = useState(personID);
    //const [clientProfileId, setClientProfileId] = useState(cProfileId);
    //const [createdDate, setCreatedDate] = useState(clientCreatedDate);
    //const [createdBy, setCreatedBy] = useState(clientCreatedBy);
    //const [updatedDate, setUpdatedDate] = useState(clientUpdatedDate);
    //const [updatedBy, setUpdatedBy] = useState(clientUpdatedBy);

    const [isSaveButtonVisible, setIsSaveButtonVisible] = useState(saveButtonShow);

    //for the reset button, it will enable if anything is changed
    const [isResetButtonDisabled, setResetButtonDisabled] = useState(true);
    //SSN field 
    const [isSsnRequired, setSsnRequired] = useState(false);
    const [errorDivCss, setErroDivCss] = useState('invalid-feedback');
    //Date of Birth field
    const [isBirthDateRequired, setBirthDateRequired] = useState(false);
    const [dobErrorDivCss, setDobErrorDivCss] = useState('invalid-feedback');
    //Race dropddown
    const [isRaceDropdownRequired, setIsRaceDropdownRequired] = useState(false);
    const [raceDdlErrorDivCss, setRaceDdlErrorDivCss] = useState('invalid-feedback');

    //for the dropdowns
    const [genderValues, setGenderValues] = useState(genderStatuses);
    const [suffixValues, setSuffixValues] = useState(suffixStatuses);
    const [raceValues, setRaceValues] = useState(raceStatuses);

    const [hideLastNameError, setHideLastNameError] = useState(true);
    const [hideFirstNameError, setHideFirstNameError] = useState(true);
    const [hideGenderError, setHideGenderError] = useState(true);
    const [hideRaceError, setHideRaceError] = useState(true);
    const [hideJTSError, setHideJTSError] = useState(true);


    //let clientSuffixDescription = 'Please Select';
    //let clientGenderDescription = 'Please Select';
    //let clientRaceDescription = 'Please Select';


    //const [genderDescription, setGenderDescription] = useState(clientGenderDescription);
    //const [raceDescription, setRaceDescription] = useState(clientRaceDescription);
    //const [suffixDescription, setSuffixDescription] = useState(clientSuffixDescription);


    //variables to hold previous state- for when a value changes
    // const [prevLastName, setPrevLastName] = useState(clientLastName);
    // const [prevFirstName, setPrevFirstName] = useState(clientFirstName);
    // const [prevMiddleName, setPrevMiddleName] = useState(clientMiddleName);
    // const [prevSsn, setPrevSsn] = useState(clientSSN);
    // const [prevFbiNcicNumber, setPrevFbiNcicNumber] = useState(clientFbiNcic);
    // const [prevBirthDate, setPrevBirthDate ] = useState(utcBirthDate);
    // const [prevStateVcin, setPrevStateVcin] = useState(clientStateVcin);
    // const [prevJts, setPrevJts] = useState(clienttJTS);
    // const [prevAlias, setPrevAlias] = useState(clientAlias);
    // const [prevGenderID, setPrevGenderId] = useState(clientGenderID);
    // const [prevRaceID, setPrevRaceId] = useState(clientRaceID);
    // const [prevSuffixID, setPrevSuffixID] = useState(clientSuffixID);
    // const [prevGenderDescription, setPrevGenderDescription] = useState(clientGenderDescription);
    // const [prevRaceDescription, setPrevRaceDescription] = useState(clientRaceDescription);
    // const [prevSuffixDescription, setPrevSuffixDescription] = useState(clientSuffixDescription);

    //for the Merge function
    const [selectedRowClientProfileId, setSelectedRowClientProfileId ] = useState(0);
    const [mergeCandidateClientProfileIds, setMergeCandidateClientProfileIds] = useState([]);
    const [mergeCandidateSelections, setMergeCandidateSelections] = useState([]);
    const [mergeOptions, setMergeOptions ] = useState([]);

    //Audit details
    // const [prevID, setPrevId] = useState(personID);
    // const [prevCreatedDate, setPrevCreatedDate] = useState(clientCreatedDate);
    // const [prevCreatedBy, setPrevCreatedBy] = useState(clientCreatedBy);
    // const [prevUpdatedDate, setPrevUpdatedDate] = useState(clientUpdatedDate);
    // const [prevUpdatedBy, setPrevUpdatedBy ] = useState(clientUpdatedBy);

    const [formClass, setFormClass] = useState('needs-validation');
    

    if (state.isNewClient) {
        document.getElementById("btnDDLSuffix").innerHTML = 'Please Select';
        document.getElementById("btnDDLRace").innerHTML = 'Please Select';
        document.getElementById("btnDDLGender").innerHTML = 'Please Select';
    }

    function toggle() {
        $('#possibleDuplicatesModal').modal('toggle');
    }

    function toggleMergeCandidatesModal() {
        $('#mergeCandidatesModal').modal('toggle');
    }

    function generateMergeCandidateRows(mergeOptions, tableName) {
    
        let sessionStorageData = getSessionData();
        let constants = getSystems();

        let tableRef = document.getElementById(tableName).getElementsByTagName('tbody')[0];
        tableRef.innerHTML = "";
        mergeOptions.forEach(element => {
            let newRow = tableRef.insertRow();

            //do a row for the select button
            let checkboxCell = newRow.insertCell(0);
            let checkBox = document.createElement("input");
            //hide the input if it's not the Juvenile app
            if ( parseInt(sessionStorageData.SystemID) !== constants.Juvenile && tableName === "duplicatesTable") {
                checkBox.setAttribute("type", "hidden");
            } else { //it's the Merge Modal
                checkBox.setAttribute("type", "checkbox");

                if (tableName === "duplicatesTable") {
                    //if it's the duplicates modal, shown when creating a new person record
                    checkboxCell.addEventListener('change', function(event) {duplicateCheckBoxClickHandler(event);  }, false);
                } else {
                    //this will be the checkbox if it's the merge Modal
                    checkboxCell.addEventListener('change', function(event) {mergeCandidateCheckBoxClickHandler(event);  }, false);
                }
            }
            checkBox.setAttribute("data-id", element.ID);
            checkboxCell.appendChild(checkBox);

            //Last Name
            let lastNameCell = newRow.insertCell(1);
            let lastNameCellText = document.createTextNode(element.LastName);
            lastNameCell.appendChild(lastNameCellText);

            //First Name
            let firstNameCell = newRow.insertCell(1);
            let firstNameCellText = document.createTextNode(element.FirstName);
            firstNameCell.appendChild(firstNameCellText);

            //Middle Name
            let middleNameCell = newRow.insertCell(3);
            let middleNameeCellText = document.createTextNode(element.MiddleName);
            middleNameCell.appendChild(middleNameeCellText);

            //DOB
            let formattedBirthDate = new Date(element.DOB).toLocaleDateString();
            let dobCell = newRow.insertCell(4);
            let dobCellText = document.createTextNode(formattedBirthDate);
            dobCell.appendChild(dobCellText);

            //Gender
            let genderCell = newRow.insertCell(5);
            let genderCellText = document.createTextNode(element.Gender.Description);
            genderCell.appendChild(genderCellText);

        });

      }

      //this is for the Merge modal
      function mergeCandidateCheckBoxClickHandler(event) {
        let $input = $(event.currentTarget.innerHTML);
    
        let clientProfileId = $input.data("id");

        mergeCandidateSelections.push(clientProfileId);
        setMergeCandidateSelections(mergeCandidateSelections);
      }

      //this one is for when creating a new client
      function duplicateCheckBoxClickHandler(event) {
        
        let checkbox =  event.currentTarget.childNodes[0];
        let selectedValue = checkbox.getAttribute('data-id'); 

        let sessionStorageData = getSessionData();
        let apiAddress = sessionStorage.getItem("baseApiAddress");
        
        let clientProfileAddress = `${apiAddress}/api/ClientProfile/${selectedValue}`;

        try
        {
           var promise = fetch(clientProfileAddress, {
                method: 'get',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorageData.Token 
                }               
            }); 

            promise.then(result =>  {
                if (result.status === 200) {
                    return result.json();
                
                } else {
                    props.createErrorNotification("an error occurred while retrieving the data.");
                } 
    
            }).then(finalResult => {

                let person = finalResult.ClientProfile.Person;
                
                //let birthDateJavascriptDateObject = new Date(person.DOB);
                //let utcBirthDate = convertDateToUtcFormat(birthDateJavascriptDateObject);
                //let diffInYears = calculateAge(birthDateJavascriptDateObject);
                let birthDateObj = new Date(person.DOB);
                let convertedBirthDate = moment(birthDateObj).format("YYYY-MM-DD");

                //setPersonID(person.ID);

                $("#txtLastName").val(person.LastName);
                $("#txtFirstName").val(person.FirstName);
                $("#txtMiddleName").val(person.MiddleName);
                $("#txtStateVCIN").val(person.StateORVCIN);
                $("#txtFbiNcicNumber").val(person.FBINCIC);
                $("#txtDateOfBirth").val(convertedBirthDate);
                $("#txtSSN").val(person.SSN);

                //document.getElementById("btnDDLGender").value = person.GenderID;
                document.getElementById("btnDDLGender").value = (person.GenderID !== null ) ? person.GenderID : "";

                if (person.Gender !== null) {
                    document.getElementById("btnDDLGender").innerHTML = person.Gender.Description;
                }

                //document.getElementById("btnDDLRace").value = person.RaceID;
                document.getElementById("btnDDLRace").value = (person.RaceID !== null) ? person.RaceID : '';

                if (person.Race !== null) {
                    document.getElementById("btnDDLRace").innerHTML = person.Race.Description;
                }

                document.getElementById("btnDDLSuffix").value = (person.SuffixID !== null) ? person.SuffixID : '';

                if (person.Suffix !== null) {
                    document.getElementById("btnDDLSuffix").innerHTML = person.Suffix.Description;
                }


                //setLastName(person.LastName);
                //setFirstName(person.FirstName);
                //setMiddleName(person.MiddleName);
                //setSuffixID(person.SuffixID);
                //setRaceID(person.RaceID);
                //setRaceDescription(person.Race.Description);
                //setStateVcin(person.StateORVCIN);
                //setFbiNcicNumber(person.FBINCIC);
                //setBirthDate(utcBirthDate); 
                //setGenderID(person.GenderID);
                //setGenderDescription(person.Gender.Description);
                

                //setCurrentAge(diffInYears);

                $("#hdnCreatedDate").val(person.CreatedDate);
                $("#hdnCreatedBy").val(person.CreatedBy);
                $("#hdnPersonID").val(person.ID);
                $("#hdnClientProfileID").val(finalResult.ClientProfile.ID); //TODO: how to populate this?

                //setCreatedDate(person.CreatedDate);
                //setCreatedBy(person.CreatedBy);
                //setUpdatedDate(new Date()); 
                //setUpdatedBy(sessionStorageData.CurrentUser);

                toggle();

            });
        }
        catch(error)
        {
            console.log(error);
            alert('an error occurred while retrieving the Client Profile;');
        }

      }


    //this will re-render the first name, last name, middle name, etc each time something changes, but NOT the dropdown values- those are handled in the select event handlers.
    //otherwise, when a selection in the dropdown is made, the useEffect overwrites what was just selected
    useEffect(() => {

        $("#txtLastName").val(clientLastName);
        $("#txtFirstName").val(clientFirstName);
        $("#txtMiddleName").val(clientMiddleName);
        $("#txtSSN").val(clientSSN);
        $("#txtFbiNcicNumber").val(clientFbiNcic);

        let birthDateObj = new Date(clientBirthDate);
        let convertedBirthDate = moment(birthDateObj).format('YYYY-MM-DD');  
        $("#txtDateOfBirth").val(convertedBirthDate);
        $("#txtAlias").val(clientAlias);
        $("#txtStateVCIN").val(clientStateVcin);
        $("#txtJTS").val(clienttJTS);

        document.getElementById("btnDDLGender").value = clientGenderID;
        document.getElementById("btnDDLGender").innerHTML = clientGenderDescription;

        document.getElementById("btnDDLRace").value = clientRaceID;
        document.getElementById("btnDDLRace").innerHTML = clientRaceDescription;

        document.getElementById("btnDDLSuffix").value = clientSuffixID;
        document.getElementById("btnDDLSuffix").innerHTML = clientSuffixDescription;

        $("#hdnCreatedDate").val(clientCreatedDate);
        $("#hdnCreatedBy").val(clientCreatedBy);
        $("#hdnPersonID").val(personID);
        $("#hdnClientProfileID").val(cProfileId);


        setGenderValues(genderStatuses);
        setSuffixValues(suffixStatuses);
        setRaceValues(raceStatuses);


    }); //see this article: https://reactjs.org/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects

    function calculateAge(birthDate) {
        let difference = moment(new Date()).diff(birthDate);
        let duration = moment.duration(difference, 'milliseconds');
        diffInYears = Math.round(duration.asYears());
        return diffInYears;
    }



    function convertDateToUtcFormat(date) {
        let birthDateJavascriptDateObject = new Date(date);
        let formattedBirthDate = birthDateJavascriptDateObject.toUTCString();
        let utcBirthDate = new Date(formattedBirthDate);
        return utcBirthDate;
    }

 

    function isValidDate(d) {
        let dateObject = new Date(d.date);
        return Object.prototype.toString.call(dateObject) === '[object Date]';
    }


    function isDateofBirthValid(birthDate) {

        let isValid = isValidDate(birthDate);

        if (!isValid) {
            return false;
        }

        return true;
    }

 

    function resetForm() {
     
    }


    const TriggerValidationHandler = () => {

        //setFormClass('needs-validation was-validated');

        let lastName = $("#txtLastName").val();
        let firstName = $("#txtFirstName").val();
        let middleName = $("#txtMiddleName").val();
        let raceID = document.getElementById("btnDDLRace").value;
        let genderID = document.getElementById("btnDDLGender").value;
        let suffixID = document.getElementById("btnDDLSuffix").value;
        let stateVcin = $("#txtStateVCIN").val();
        let jts = $("#txtJTS").val();
        let fbiNcicNumber = $("#txtFbiNcicNumber").val();
        let alias = $("#txtAlias").val();
        let ssn = $("#txtSSN").val();
        let birthDateString = $("#txtDateOfBirth").val();
        
        //validate first and last name
        if (lastName === '') {
            $("#frmInfo").addClass("was-validated");
            //return;
            //setHideLastNameError(false);
        }

        if (firstName === '') {
            $("#frmInfo").addClass("was-validated");
            //return;
            //setHideFirstNameError(false);
        }

        if (birthDateString === '') {
            $("#frmInfo").addClass("was-validated");
        }

        //validate the dropdowns
        if (raceID === '') {
            $("#frmInfo").addClass("was-validated");
            //setHideRaceError(false);
            //return;
            document.getElementById("divRaceError").removeAttribute("style");
        }

        if (genderID === '') {
            $("#frmInfo").addClass("was-validated");
            //setHideGenderError(false);
            document.getElementById("divGenderError").removeAttribute("style");
            //return;

        }

        //TODO: is JTS required?
        if (jts === '') {
            $("#frmInfo").addClass("was-validated");
            //return;
            //setHideJTSError(false);
        }

        if (lastName === "" || firstName === "" ||  raceID === "" || genderID === "" || jts === "") {
            return;
        }

        //need to convert the birthDate a date object first
        //let birthDateObj = new Date(birthDate);
        let birthDate = new Date($("#txtDateOfBirth").val());

        let isBirthDateValid = isDateofBirthValid(birthDate);
        if (!isBirthDateValid) {
            //setBirthDateRequired(true);
            //setDobErrorDivCss('invalid-feedback d-block')
        } else {
            //setBirthDateRequired(false);
            //setDobErrorDivCss('invalid-feedback');
        }

        //need to check last name, first name, date of birth, race/ethnicity, and gender
        let currentDate = new Date();
        //all data is valid
        if (lastName !== '' && firstName !== '' && birthDate < currentDate && raceID !== '' && genderID !== '') {

            let id = GenerateUniqueID(lastName, firstName, middleName, birthDate, genderID);

            let apiAddress = sessionStorage.getItem("baseApiAddress");
            let fullPersonAddress = `${apiAddress}/api/Person`;
            let sessionStorageData = getSessionData();

            let postData = {
                LastName: lastName,
                FirstName: firstName,
                MiddleName: middleName,
                SuffixID: suffixID,
                StateORVCIN: stateVcin,
                JTS: jts,
                FBINCIC: fbiNcicNumber,
                Alias: alias,
                DOB: birthDate,
                RaceID: raceID,
                GenderID: genderID,
                SSN: ssn,
                Active: true,
                UniqueID: id,
            }

            //they already exist, and this is an update
            let hdnPersonID = $("#hdnPersonID").val();
            if (hdnPersonID !== '') {
       
                let uniqueID = GenerateUniqueID(lastName, firstName, middleName, birthDate, genderID);
                alert('The Unique License Number is: ' + uniqueID);

                UpdateClient(fullPersonAddress, postData);

            }
            else //this is a new client
            {
                postData.CreatedDate =  new Date();
                postData.CreatedBy = sessionStorageData.CurrentUser;
                postData.UpdatedDate = new Date();
                postData.UpdatedBy = sessionStorageData.CurrentUser;

                let uniqueID = GenerateUniqueID(lastName, firstName, middleName, birthDate, genderID);

                alert('The Unique License Number is: ' + uniqueID);

                let duplicatesPromise = getDuplicateClients(apiAddress, uniqueID, sessionStorageData);
                duplicatesPromise.then(result => {
                    if (result.length > 0 ) {
                        toggle();
                        generateMergeCandidateRows(result, "duplicatesTable");
                    } else {
                        CreateNewClient(postData, uniqueID);
                    }
                })
            }

            //setHideRaceError(true);
            //setHideGenderError(true);
            //setHideLastNameError(true);
            //setHideFirstNameError(true);
        }
    }

    function getDuplicateClients(apiAddress, uniqueID, sessionStorageData) {

        let duplicatePersonsAddress = `${apiAddress}/api/Person/GetduplicatePersons/${uniqueID}`;

       return  fetch(duplicatePersonsAddress, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorageData.Token
            }
        })
        .then(result => result.json());
    }


    function UpdateClient(fullPersonAddress, postData) {
        let sessionStorageData = getSessionData();

        let hdnCreatedDate = $("#hdnCreatedDate").val();
        let hdnCreatedBy = $("#hdnCreatedBy").val();
        let hdnPersonID = $("#hdnPersonID").val();

        postData.CreatedDate = hdnCreatedDate;
        postData.CreatedBy = hdnCreatedBy;
        postData.UpdatedDate = new Date();
        postData.UpdatedBy = sessionStorageData.CurrentUser
        postData.ID = hdnPersonID;

         //make a PUT call with all of the parameters
         fetch(fullPersonAddress, {
            //mode: 'cors',
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorageData.Token
            },
            body: JSON.stringify(postData)
        })
        .then(result => result.json())
        .then(result => {

            if  (result === null || result === 0) {
                props.createErrorNotification("An error occurred while updating the record.");
                return;
            }

            if (result === "SSN" || result === "JTS") {
                handleJTSOrSSNError(result);
                return;
            }

            props.createNotification('The client profile was successfully updated.');
        });
    }

    function handleJTSOrSSNError(result) {
        //if the return result is "SSN", then a record with this SSN already exists in the database
        if (result === "SSN") {
            props.createErrorNotification("A record with this social security number already exists.");
            return;
        }

        if (result === "JTS") {
            props.createErrorNotification("A record with this JTS number already exists.");
            return;
        }
    }


    function CreateNewClient(postData, uniqueID){

        let apiAddress = sessionStorage.getItem("baseApiAddress");
        let createPersonAddress = `${apiAddress}/api/Person`;
        let sessionStorageData = getSessionData();

        fetch(createPersonAddress, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorageData.Token
        },
            body: JSON.stringify(postData)
        })
        .then(result => result.json())
        .then(savedPersonResult => {

            if (savedPersonResult === null) {
                props.createErrorNotification("An error occurred while saving the record.");
                return;
            }

            if (savedPersonResult === "SSN" || savedPersonResult === "JTS") {
                handleJTSOrSSNError(savedPersonResult);
                return;
            }

            sessionStorage.setItem("PersonID", savedPersonResult.PersonID);
        
            //update unique ID for the newly added person
            let uniqueIdPostData = [];

            uniqueIdPostData[0] = {
                PersonId: savedPersonResult.PersonID,
                UniqueId: uniqueID
            }

            let listToUpdate = {
                "list": uniqueIdPostData
            }

            let updateUniquIdUrl = `${apiAddress}/api/Person/UpdateAlluniqueIds`;

            fetch(updateUniquIdUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorageData.Token
                },
                body: JSON.stringify(listToUpdate)
            }).then(result => {
      
                //need to update the state with the return result
                //let birthDateJavascriptDateObject = new Date(savedPersonResult.Person.DOB);
                //let utcBirthDate = convertDateToUtcFormat(birthDateJavascriptDateObject);
                //let diffInYears = calculateAge(birthDateJavascriptDateObject);

        

                //saveButtonShow = false;
                //setIsSaveButtonVisible(false);
                
                props.createNotification('The client profile was successfully created.');
            });
            
        });
    }

    function createNewClientFromDuplicateModal() {

        let lastName = $("#txtLastName").val();
        let firstName = $("#txtFirstName").val();
        let middleName = $("#txtMiddleName").val();
        let raceID = document.getElementById("btnDDLRace").value;
        let genderID = document.getElementById("btnDDLGender").value;
        let suffixID = document.getElementById("btnDDLSuffix").value;
        let stateVcin = $("#txtStateVCIN").val();
        let jts = $("#txtJTS").val();
        let fbiNcicNumber = $("#txtFbiNcicNumber").val();
        let alias = $("#txtAlias").val();
        let ssn = $("#txtSSN").val();
        let birthDate = new Date($("#txtDateOfBirth").val());

        let uniqueID = GenerateUniqueID(lastName, firstName, middleName, birthDate, genderID);

        let sessionStorageData = getSessionData();

        let postData = {
            LastName: lastName,
            FirstName: firstName,
            MiddleName: middleName,
            SuffixID: suffixID,
            StateORVCIN: stateVcin,
            JTS: jts,
            FBINCIC: fbiNcicNumber,
            Alias: alias,
            DOB: birthDate,
            RaceID: raceID,
            GenderID: genderID,
            SSN: ssn,
            Active: true,
            UniqueID: uniqueID,
            CreatedDate: new Date(),
            CreatedBy: sessionStorageData.CurrentUser,
            UpdatedDate: new Date(),
            UpdatedBy: sessionStorageData.CurrentUser
        }

        toggle();

        CreateNewClient(postData, uniqueID);
    }


    function onSelectGenderHandler(event) {

        let selectedValue = event.currentTarget.getAttribute('value');
        //setGenderID(selectedValue);

        let selectedGenderOption = genderValues.filter(function (gender) {
            return gender.ID === parseInt(selectedValue)
        });

        document.getElementById("btnDDLGender").value = selectedValue;
        document.getElementById("btnDDLGender").innerHTML = selectedGenderOption[0].Description;


        if (selectedValue !== '') {
            document.getElementById("divGenderError").setAttribute("style", "display:none");
        }

        //setGenderDescription(selectedGenderOption[0].Description);

        // if (selectedValue !== '' && parseInt(selectedValue) !== 0) {
        //     setHideGenderError(true);
        // } else {
        //     setHideGenderError(false);
        // }

    }

    function onSelectSuffixHandler(event) {
        let selectedValue = event.currentTarget.getAttribute('value');
        //setSuffixID(selectedValue);


        let selectedSuffixOption = suffixValues.filter(function (suffix) {
            return suffix.ID === parseInt(selectedValue)
        });

        //setSuffixDescription(selectedSuffixOption[0].Description);

        document.getElementById("btnDDLSuffix").value = selectedValue;
        document.getElementById("btnDDLSuffix").innerHTML = selectedSuffixOption[0].Description;
    }

    function onSelectRaceHandler(event) {
        let selectedValue = event.currentTarget.getAttribute('value');
        //setRaceID(selectedValue);

        let selectedRaceOption = raceValues.filter(function (race) {
            return race.ID === parseInt(selectedValue);
        });

        document.getElementById("btnDDLRace").value = selectedValue;
        document.getElementById("btnDDLRace").innerHTML = selectedRaceOption[0].Description;


        if (selectedValue !== '') {
            document.getElementById("divRaceError").setAttribute("style", "display:none");
        }

        //setRaceDescription(selectedRaceOption[0].Description);

        // if (selectedValue !== '' && parseInt(selectedValue) !== 0) {
        //     setHideRaceError(true);
        // } else {
        //     setHideRaceError(false);
        // }

    }

    function getMergeCandidates() {

        let lastName = $("#txtLastName").val();
        let firstName = $("#txtFirstName").val();
        let middleName = $("#txtMiddleName").val();
        //let raceID = document.getElementById("btnDDLRace").value;
        let genderID = document.getElementById("btnDDLGender").value;
        //let suffixID = document.getElementById("btnDDLSuffix").value;
        //let stateVcin = $("#txtStateVCIN").val();
        //let jts = $("#txtJTS").val();
        //let fbiNcicNumber = $("#txtFbiNcicNumber").val();
        //let alias = $("#txtAlias").val();
        //let ssn = $("#txtSSN").val();
        let birthDate = new Date($("#txtDateOfBirth").val());

        let apiAddress = sessionStorage.getItem("baseApiAddress");

        let uniqueID = GenerateUniqueID(lastName, firstName, middleName, birthDate, genderID);

        let sessionStorageData = getSessionData();

        let fullMergeClientAddress = `${apiAddress}/api/Person/GetduplicatePersons/${ uniqueID }`;

            //retrieve a merge candidate by the unique ID
            fetch(fullMergeClientAddress, {
                method: 'get',
                mode: 'cors',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + sessionStorageData.Token
                }
            }).then(result => {
              return result.json();
            }).then(result => {

                if (result.length === 0) {
                    alert("No merge candidates found");
                    return;
                }

              //We only want to display records that don't match the person ID of the row clicked
              let mergeCandidates = result.filter(function(item) {
                return item.ID !== parseInt(personID);
              });

              
              //this will trigger the useEffect defined elsewhere. This is necessary to only show the modal window once the mergeOptions is set- 
              //because setMergeOptions is asynchronous
              setMergeOptions(mergeCandidates);

            }).catch((error) => {
              console.log(error);
              alert(error);
            });
    }

    function mergeProfiles() {
    
        let sessionStorageData = getSessionData();
        let apiAddress = sessionStorage.getItem("baseApiAddress");

        let mergeClientProfileAddress = `${apiAddress}/api/Person/MeargePerson`;

        let deleteMergedClientProfilesAddress = `${apiAddress}/api/ClientProfile/DeleteMultipleClients`

        //the id parameter here is the ClientProfileID of the currently selected person. The PersonIdList are the people being merged into the current record.
        let hdnClientProfileID = $("#hdnClientProfileID").val();

        let postData = {
            id: hdnClientProfileID,
            PersonIdList: mergeCandidateSelections
        }

        fetch(mergeClientProfileAddress, {
            method: 'post',
            mode: 'cors',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorageData.Token 
            },
            body: JSON.stringify(postData)
        }).then(result => {
            if (result.status === 200) {
                return result.json();
            }
        }).then(result => {
            if (result === "Success") {

            //next delete the client profiles that were merged in
            fetch(deleteMergedClientProfilesAddress, {
                method: 'post',
                mode: 'cors',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorageData.Token //sessionStorageData.Token
                },
                body: JSON.stringify(mergeCandidateSelections)
            }).then(result => {
                return result.json();
            }).then(result => {
                if (result === "success") {
                //toggle(); //close the modal
                alert('the client profiles were successfully merged');  
                }
            });
            }
        });
  
        //toggle();
        toggleMergeCandidatesModal();
      }

    //handle whether to show a Save or Update button
    let buttonType;
    if (isSaveButtonVisible) {

        buttonType = <div className="col-auto">
            <button type="button" onClick={TriggerValidationHandler} className="btn btn-primary mb-2">Save</button>
        </div>;

    } else {

        buttonType = <div className="col-auto">
            <input type="submit" onClick={TriggerValidationHandler} className="btn btn-primary mb-2" value="Update" />
        </div>;
    }

    //handle whether to show the JTS field (if Juvenile) or State/VCIN (if the others)
    let jtsOrVcin;
    if (parseInt(systemID) !== parseInt(systems.Juvenile)) {

        jtsOrVcin =  <div className="col-3">
            <label htmlFor="txtStateVCIN"><strong>State/VCIN Number</strong></label>
            <div className="input-group mb-3">
                <input type="text" defaultValue="" className="form-control" id="txtStateVCIN"></input>
            </div>
        </div>;
    } else {
        jtsOrVcin =  <div className="col-3">
                <label htmlFor="txtJTS"><strong>JTS Number *</strong> </label>
                <div className="input-group mb-3">
                    <input type="text" defaultValue="" className="form-control" id="txtJTS" name="txtJTS" required></input>
                    {/* {hideJTSError || <div className='errorDiv'>Please enter the JTS number.</div>} */}
                </div>
            </div>;
    }



    //set up the options for the Gender dropdown
    let genderValueOptions = [];
    if (genderValues.length > 0) {

        genderValueOptions = genderValues.map((value) =>
            <a key={value.ID} value={value.ID} description={value.Description} onClick={onSelectGenderHandler} className="dropdown-item">{value.Description}</a>
        );

    }

    let suffixValueOptions = [];
    if (suffixValues.length > 0) {
        suffixValueOptions = suffixValues.map((value) =>
            <a key={value.ID} value={value.ID} description={value.Description} onClick={onSelectSuffixHandler} className="dropdown-item">{value.Description}</a>
        );
    }

    let raceValueOptions = [];
    if (raceValues.length > 0) {
        raceValueOptions = raceValues.map((value) =>
            <a key={value.ID} value={value.ID} description={value.Description} onClick={onSelectRaceHandler} className="dropdown-item">{value.Description}</a>
        );
    }

  

    return <div>
            <form id="frmInfo">
                <br></br>
                <input type="hidden" id="hdnCreatedDate" value=""/>
                <input type="hidden" id="hdnCreatedBy" value="" />
                <input type="hidden" id="hdnPersonID" value="" />
                <input type="hidden" id="hdnClientProfileID" value="" />
                <div className="form-row">
                    <div className="col-3">
                        <div className="form-group">
                            <label htmlFor="txtLastName"><strong>Last Name *</strong></label>
                            <input type="text"
                                defaultValue=""
                                className="form-control"
                                id="txtLastName"
                                name="txtLastName"
                                required>
                            </input>
                            {/* {hideLastNameError || <div className='errorDiv'>Please enter the last name.</div>} */}
                        </div>
                    </div>
                    <div className="col-3">
                        <div className="form-group">
                            <label htmlFor="txtFirstName"><strong> First Name *</strong></label>
                            <input type="text"
                                defaultValue=""
                                className="form-control"
                                id="txtFirstName"
                                name="txtFirstName"
                                required>
                            </input>
                            {/* { hideFirstNameError || <div className='errorDiv'>Please enter the first name.</div> } */}
                        </div>

                    </div>
                    <div className="col-3">
                        <div className="form-group">
                            <label htmlFor="txtMiddleName"><strong>Middle Name</strong></label>
                            <input type="text"
                                defaultValue=""
                                className="form-control"
                                id="txtMiddleName"
                                name="txtMiddleName">
                            </input>
                            {/* {errors.txtMiddleName && <div className="invalid-feedback" >This field may not exceed 50 characters.</div>} */}
                        </div>

                    </div>
                    <div className="col-3">
                        <label htmlFor="ddlSuffix"><strong>Suffix</strong></label>
                        <div className="dropdown">
                            <button type="button" id="btnDDLSuffix" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                
                            </button>
                            <div className="dropdown-menu">
                                {suffixValueOptions}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="form-row">
                    <div className="col-3">
                        <div className="form-group">
                            <label htmlFor="txtSSN"><strong> SSN</strong></label>
                            <input type="text"
                                defaultValue=""
                                className="form-control"
                                id="txtSSN"
                                name="txtSSN">
                            </input>
                            {/* <div className={errorDivCss}>Please enter the SSN in a valid format.</div> */}
                        </div>
                    </div>
                    {
                        parseInt(systemID) !== parseInt(systems.Juvenile) ?
                        <div className="col-3">
                            <label htmlFor="txtFbiNcicNumber"><strong> FBI/NCIC Number </strong></label>
                            <div className="input-group mb-3">
                                <input type="text"
                                    defaultValue=""
                                    className="form-control"
                                    id="txtFbiNcicNumber">
                                </input>
                            </div>
                        </div> : <div></div>
                    }
            
                    <div className="col-3">
                        <label htmlFor="txtCurrentAge"><strong>Current Age</strong></label>
                        <div className="inpu-group mb-3">
                            <input type="text" readOnly value="" className="form-control"></input>
                        </div>
                    </div>
                    <div className="col-3">
                        <label htmlFor="txtDateOfBirth"><strong> Date of Birth *</strong></label>
                        <div className="input-group mb-3">
                            <input type="date" defaultValue="" required id="txtDateOfBirth" className="form-control"></input>
                            {/* <DatePicker
                                selected={birthDate}
                                required={isBirthDateRequired}
                                onChange={date => handleDatePickerChange({ date })}
                                className="form-control"
                                strictParsing
                            />
                            <div className={dobErrorDivCss}>Please enter a valid birth date.</div> */}
                        </div>
                    </div>
                </div>
                <div className="form-row">
                    {jtsOrVcin}
                    {
                        parseInt(systemID) !== parseInt(systems.Juvenile) ?
                        <div className="col-2">
                            <label htmlFor="txtAlias"><strong>Alias</strong></label>
                            <div className="input-group mb-3">
                                <input type="text" defaultValue="" className="form-control" id="txtAlias"></input>
                            </div>
                        </div> : <div></div>
                    }
                
                    <div className="col-2">
                        <label htmlFor="ddlGender"><strong>Gender*</strong></label>
                        <div className="dropdown">
                            <button type="button" id="btnDDLGender" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                
                            </button>
                            <div className="dropdown-menu">
                                {genderValueOptions}
                            </div>
                        </div>
                        <div style={{display:'none'}} id="divGenderError" className='errorDiv'>Please select a value.</div>
                    </div>
                    <div className="col-4">
                        <label><strong>Race/Ethnicity*</strong></label>
                        <div className="dropdown">
                            <button type="button" id="btnDDLRace" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                
                            </button>
                            <div className="dropdown-menu">
                                {raceValueOptions}
                            </div>
                        </div>
                        <div style={{display:'none'}} id="divRaceError" className='errorDiv'>Please select a value.</div>
                    </div>
                </div>
                <div className="form-row float-right">
                    {buttonType}
                    <div className="col-auto">
                        <button type="button" onClick={getMergeCandidates} className="btn btn-primary mb-2">Get Merge Candidates</button>
                    </div>
                    <div className="col-auto">
                        <button type="button" onClick={resetForm} disabled={isResetButtonDisabled} className="btn btn-primary mb-2">Reset</button>
                    </div>
                </div>
            <div className="modal fade" id="possibleDuplicatesModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Duplicates</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                        <table id="duplicatesTable" className="table">
                        <thead>
                            <tr>
                            <th scope="col"></th>
                            <th scope="col">First Name</th>
                            <th scope="col">Last Name</th>
                            <th scope="col">Middle Name</th>
                            <th scope="col">Date of Birth</th>
                            <th scope="col">Gender</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                        </table>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={createNewClientFromDuplicateModal} >Save New</button>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                        </div>
                    </div>
                </div>
                <div className="modal fade" id="mergeCandidatesModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Merge Candidates</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                        <table id="mergeTable" className="table">
                        <thead>
                            <tr>
                            <th scope="col"></th>
                            <th scope="col">First Name</th>
                            <th scope="col">Last Name</th>
                            <th scope="col">Middle Name</th>
                            <th scope="col">Date of Birth</th>
                            <th scope="col">Gender</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                        </table>
                        </div>
                        <div className="modal-footer">
                            <button type="button" onClick={mergeProfiles} className="btn btn-primary">Merge</button>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                        </div>
                    </div>
                </div>
            </form>
    </div>;

};

export default Info;