import React, { useState, useRef, useEffect } from 'react';
import SearchJuvenile from './SearchJuvenile';
import Search from './Search';
import Info from './Info';
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import { useCacheService } from './useCacheService';
import Supplemental from './Supplemental';
import {useStore} from './StateStores/store';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {getSessionData } from './commonAdmin';
import { getRoles, getSystems } from './Constants';
import {  Api } from './commonAdmin';

const CaseManagementFunction = (props) => {
    const [isTabDisabled, setEnabled] = useState(true);
    const [isParticipantTabDisabled, setParticipantTabEnabled] = useState(true);
    const [defaultTab, setDefaultTab] = useState("search");
    const [activeTab, setActiveTab] = useState("search");
    const [clientProfile, setClientProfile] = useState(Object);
    const [ isSpinnerVisible, setIsSpinnerVisible ] = useState(false);
    const infoRef = useRef();
    const supplementalRef = useRef();
    const cacheService = useCacheService();
    const {state, dispatch} = useStore();

    const [personID, setPersonID] = useState(0);

    const [educationLevelsOptions, setEducationLevelOptions] = useState([]);
    const [fundingSourceOptions, setFundingSourceOptions] = useState([]);
    const [jobStatusOptions, setJobStatusOptions] = useState([]);
    const [maritalStatusOptions, setMaritalStatusOptions] = useState([]);

    useEffect(() => {
        //Api.getConfigDataByType("Gender").then(genders => setGenders(genders));
        //Api.getConfigDataByType("Race").then(races => setRaces(races));
        Api.getConfigDataByType("EducationLevel").then(educationLevels => setEducationLevelOptions(educationLevels));
        Api.getConfigDataByType("FundingSource").then(fundingSources => setFundingSourceOptions(fundingSources));
        //Api.getConfigDataByType("Suffix").then(suffixes => setSuffixes(suffixes));
        Api.getConfigDataByType("JobStatus").then(jobStatuses => setJobStatusOptions(jobStatuses)); 
        Api.getConfigDataByType("MaritalStatus").then(maritalStatuses => setMaritalStatusOptions(maritalStatuses));
        //Api.getConfigDataByType("PropertyType").then(propertyTypes => setPropertyTypes(propertyTypes));
     }, []);


    toast.configure();

    let sessionData = getSessionData();

    let systems = getSystems();

    //let genderValueDropDownOptions = [];
    //let raceValueDropDownOptions = [];


    function triggerToastMessage(message) {       
        toast.success(message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
            });
    }

    function triggerErrorMessage(message){
        toast.error(message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
        });
    }

    function EnableTabs() {
        setEnabled(false);
        setDefaultTab("participantinfo");
        setActiveTab("participantinfo");     
    }

    function SetActiveTab(key) {
      setActiveTab(key);
    
      if (state.isNewClient) {
          infoRef.current.clearForm();
      }

    }

    function showSpinner() {
        setIsSpinnerVisible(true);
    }

    function hideSpinner() {
        setIsSpinnerVisible(false);
    }

    //to handle clicking on a row in the search grid, so this data is accessible elsewhere
    function SetClientProfile(clientProfile) {
      
        //check to see if the Add New Profile button was clicked, set clienProfile to undefined if it was   
        setClientProfile(clientProfile); //updates the local state
        setPersonID(clientProfile.ClientProfile.Person.ID);

        //to handle the birth date changing when a new row in the search grid is selected. this is because the datepicker is a third party library
        infoRef.current.updateBirthDate(clientProfile.ClientProfile.Person.DOB);
    }

    let infoTabTitle = '';
    if (parseInt(sessionData.SystemID) === parseInt(systems.Juvenile)) {
        infoTabTitle = "Juvenile Info";
    } else if (parseInt(sessionData.SystemID) === parseInt(systems.Adult)) {
        infoTabTitle = "Adult Info";
    } else if (parseInt(sessionData.SystemID) === parseInt(systems.OCWB)) {
        infoTabTitle = "Participant Info";
    }

    return <div>
            {
                isSpinnerVisible ? 
                <div className="spinner"></div> : <div></div>
            }
            <Tabs defaultActiveKey={defaultTab} activeKey={activeTab} onSelect={k => SetActiveTab(k) } id="caseManagementTabs">
                    <Tab eventKey="search" title="Search">
                        {
                           parseInt(sessionData.SystemID) === systems.Juvenile ?

                            <SearchJuvenile enableTabsHandler={EnableTabs}
                                setParticipantInfoAsActiveTab={SetActiveTab} 
                                onSearchGridRowClick={e => SetClientProfile(e)}
                                showSpinner={showSpinner}
                                hideSpinner={hideSpinner}
                                createNotification={triggerToastMessage}>
                           </SearchJuvenile> : <div></div>
                        }

                        {
                           parseInt(sessionData.SystemID) === systems.Adult || parseInt(sessionData.SystemID) === systems.OCWB ?

                            <Search enableTabsHandler={EnableTabs}
                                setParticipantInfoAsActiveTab={SetActiveTab} 
                                onSearchGridRowClick={e => SetClientProfile(e)}
                                showSpinner={showSpinner}
                                hideSpinner={hideSpinner}
                                createNotification={triggerToastMessage}>
                           </Search> : <div></div>
                        }                    
                    </Tab>
                    <Tab eventKey="participantinfo" title={infoTabTitle} disabled={isTabDisabled}>
                        <Info clientProfilePerson={!state.isNewClient ? clientProfile.Person :  undefined }
                         clientProfile={clientProfile.ClientProfile }  
                         ref={infoRef}
                         genderValues={cacheService.genderValues}
                         raceValues={cacheService.raceValues}
                         createNotification={triggerToastMessage}
                         createErrorNotification={triggerErrorMessage} />                       
                    </Tab>
                    <Tab eventKey="supplemental" title="Supplemental" disabled={isTabDisabled}>
                        
                       <Supplemental 
                       clientProfile={clientProfile.Person}
                       clientProfilePersonID={personID}
                       educationLevelValues={educationLevelsOptions}
                       fundingSourceValues={fundingSourceOptions  }
                       jobStatusValues={ jobStatusOptions } 
                       maritalStatusValues={ maritalStatusOptions }
                       createNotification={triggerToastMessage} />
                    </Tab>
                    <Tab eventKey="address" title="Address" disabled={isTabDisabled}>
                       address content
                    </Tab>
                    <Tab eventKey="familyinfo" title="Family Info" disabled={isTabDisabled}>
                       Family info content
                    </Tab>
                    <Tab eventKey="program" title="Program" disabled={isTabDisabled}>
                       program content
                    </Tab>
                    <Tab eventKey="assessment" title="Assessment" disabled={isTabDisabled}>
                       assessment content
                    </Tab>
                    <Tab eventKey="contact" title="Contact" disabled={isTabDisabled}>
                        contact content
                    </Tab>
                </Tabs>
            </div>

}

export default CaseManagementFunction;
