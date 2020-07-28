import React, { useState, useRef, useEffect } from 'react';
import SearchJuvenile from './SearchJuvenile';
import Search from './Search';
import Info from './Info';
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import { useCacheService } from './useCacheService';
import SupplementalCWB from './SupplementalCWB';
import SupplementalAdult from './SupplementalAdult';
import SupplementalJuvenile from './SupplementalJuvenile';
import {useStore} from './StateStores/store';
import {ToastContainer, toast} from 'react-toastify';
import {triggerToastMessage, triggerErrorMessage  } from './ToastHelper';
import 'react-toastify/dist/ReactToastify.css';
import {getSessionData } from './commonAdmin';
import { getRoles, getSystems } from './Constants';
import {  Api } from './commonAdmin';
import AddressJuvenile from './AddressJuvenile';
import AddressAdult from './AddressAdult';
import AddressCWB from './AddressCWB';
import FamilyInfo from './FamilyInfo';
import CWBEnrollment from './CWBEnrollment';
import EnrollmentCaseModal from './EnrollmentCaseModal';
import EnrollmentCaseModalAdult from './EnrollmentCaseModalAdult';
import Assessment from './Assessment';

const CaseManagementFunction = (props) => {
    const [isTabDisabled, setEnabled] = useState(true);
    const [isParticipantTabDisabled, setParticipantTabEnabled] = useState(true);
    const [defaultTab, setDefaultTab] = useState("search");
    const [activeTab, setActiveTab] = useState("search");
    const [clientProfile, setClientProfile] = useState(Object);
    const [ isSpinnerVisible, setIsSpinnerVisible ] = useState(false);
    //const infoRef = useRef();
    const supplementalRef = useRef();
    const cacheService = useCacheService();
    const {state, dispatch} = useStore();

    const [personID, setPersonID] = useState(0);

    const [genderOptions, setGenderOptions] = useState([]);
    const [raceOptions, setRaceOptions] = useState([]);
    const [suffixOptions, setSuffixOptions] = useState([]);
    const [educationLevelsOptions, setEducationLevelOptions] = useState([]);
    const [fundingSourceOptions, setFundingSourceOptions] = useState([]);
    const [jobStatusOptions, setJobStatusOptions] = useState([]);
    const [maritalStatusOptions, setMaritalStatusOptions] = useState([]);
    const [schoolOptions, setSchoolOptions] = useState([]);
    const [propertyTypeOptions, setPropertyTypes] = useState([]);
    const [relationshipOptions, setRelationshipOptions] = useState([]);
    const [assistanceTypeOptions, setAssistanceTypeOptions ] = useState([]);
    const [careerPathwayOptions, setCareerPathWayOptions ] = useState([]);
    const [staffOptions, setStaffOptions] = useState([]);
    const [serviceReleaseOptions, setServiceReleaseOptions] = useState([]);
    const [serviceOutcomeOptions, setServiceOutcomeOptions] = useState([]);
    const [contactTypeOptions, setContactTypeOptions ] = useState([]);
    const [subContactTypeOptions, setSubContactTypeOptions] = useState([]);
    const [offenseOptions, setOffenseOptions ] = useState([]);
    const [placementLevelOptions, setPlacementLevelOptions] = useState([]);
    const [judgeOptions, setJudgeOptions] = useState([]);
    const [courtNameOptions, setCourtNameOptions] = useState([]);
    const [assessmentTypeOptions, setAssessmentTypeOptions ] = useState([]);
    const [assessmentSubTypeOptions, setAssessmentSubTypeOptions] = useState([]);

    useEffect(() => {
        Api.getConfigDataByType("Gender").then(genders => setGenderOptions(genders));
        Api.getConfigDataByType("Race").then(races => setRaceOptions(races));
        Api.getConfigDataByType("Suffix").then(suffixes => setSuffixOptions(suffixes));
        Api.getConfigDataByType("EducationLevel").then(educationLevels => setEducationLevelOptions(educationLevels));
        Api.getConfigDataByType("FundingSource").then(fundingSources => setFundingSourceOptions(fundingSources));
        
        Api.getConfigDataByType("JobStatus").then(jobStatuses => setJobStatusOptions(jobStatuses)); 
        Api.getConfigDataByType("MaritalStatus").then(maritalStatuses => setMaritalStatusOptions(maritalStatuses));
        Api.getConfigDataByType("School").then(schools => setSchoolOptions(schools));
        Api.getConfigDataByType("PropertyType").then(propertyTypes => setPropertyTypes(propertyTypes));
        Api.getConfigDataByType("Relationship").then(relationships => setRelationshipOptions(relationships));
        Api.getConfigDataByType("AssistanceType").then(assistanceTypes => setAssistanceTypeOptions(assistanceTypes));
        Api.getConfigDataByType("CareerPathway").then(careerPathways => setCareerPathWayOptions(careerPathways));
        Api.getConfigDataByType("ContactType").then(contactTypes => setContactTypeOptions(contactTypes));
        Api.getConfigDataByType("SubContactType").then(subContactTypes => setSubContactTypeOptions(subContactTypes));
        
        //TODO: how to reduce the number of API calls?
        if (staffOptions.length === 0) {
            Api.getConfigDataByType("Staff").then(staff => setStaffOptions(staff));
        }
        Api.getConfigDataByType("ServiceRelease").then(serviceReleases => setServiceReleaseOptions(serviceReleases));
        Api.getConfigDataByType("ServiceOutcome").then(serviceOutcomes => setServiceOutcomeOptions(serviceOutcomes));
        Api.getConfigDataByType("Offense").then(offenses => setOffenseOptions(offenses));
        Api.getConfigDataByType("PlacementLevel").then(placementLevels => setPlacementLevelOptions(placementLevels));
        Api.getConfigDataByType("Judge").then(judges => setJudgeOptions(judges));
        Api.getConfigDataByType("CourtName").then(courtNames => setCourtNameOptions(courtNames));
        Api.getConfigDataByType("AssessmentType").then(assessmentTypes => setAssessmentTypeOptions(assessmentTypes));
        Api.getConfigDataByType("AssessmentSubtype").then(assessmentSubTypes => setAssessmentSubTypeOptions(assessmentSubTypes));
        
     }, []);


    toast.configure();

    let sessionData = getSessionData();

    let systems = getSystems();

    function EnableTabs() {
        setEnabled(false);
        setDefaultTab("participantinfo");
        setActiveTab("participantinfo");     
    }

    function SetActiveTab(key) {
      setActiveTab(key);
    
      if (state.isNewClient) {
          //infoRef.current.clearForm();
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

        sessionStorage.setItem('clientProfileID', clientProfile.ClientProfile.ID);
        sessionStorage.setItem('clientProfilePersonID', clientProfile.ClientProfile.PersonID);

        //to handle the birth date changing when a new row in the search grid is selected. this is because the datepicker is a third party library
        //infoRef.current.updateBirthDate(clientProfile.ClientProfile.Person.DOB);
    }

    let infoTabTitle = '';
    if (parseInt(sessionData.SystemID) === parseInt(systems.Juvenile)) {
        infoTabTitle = "Juvenile Info";
    } else if (parseInt(sessionData.SystemID) === parseInt(systems.Adult)) {
        infoTabTitle = "Adult Info";
    } else if (parseInt(sessionData.SystemID) === parseInt(systems.OCWB)) {
        infoTabTitle = "Participant Info";
    }

    let referralTabTitle = '';
    if (parseInt(sessionData.SystemID) === parseInt(systems.Juvenile)) {
        referralTabTitle = "Referral";
    } else if (parseInt(sessionData.SystemID) === parseInt(systems.Adult)) {
        referralTabTitle = "Referral";
    } else if (parseInt(sessionData.SystemID) === parseInt(systems.OCWB)) {
        referralTabTitle = "Program";
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
                        
                         genderValues={genderOptions }
                         raceValues={raceOptions}
                         suffixValues={suffixOptions}
                         createNotification={triggerToastMessage}
                         createErrorNotification={triggerErrorMessage} />                       
                    </Tab>
                    <Tab eventKey="supplemental" title="Supplemental" disabled={isTabDisabled}>
                        {
                            parseInt(sessionData.SystemID) === systems.OCWB ?
                            <SupplementalCWB 
                            clientProfile={clientProfile.Person}
                            clientProfilePersonID={personID}
                            educationLevelValues={educationLevelsOptions}
                            fundingSourceValues={fundingSourceOptions  }
                            jobStatusValues={ jobStatusOptions } 
                            maritalStatusValues={ maritalStatusOptions }
                            createNotification={triggerToastMessage} /> : <div></div>
                        }
                        {
                            parseInt(sessionData.SystemID) === systems.Adult ?
                            
                            <SupplementalAdult
                                clientProfile={clientProfile.Person}
                                clientProfilePersonID={personID}
                                educationLevelValues={educationLevelsOptions}
                                fundingSourceValues={fundingSourceOptions  }
                                jobStatusValues={ jobStatusOptions } 
                                maritalStatusValues={ maritalStatusOptions }
                                createNotification={triggerToastMessage}
                             /> : <div></div>
                        }
                        {
                            parseInt(sessionData.SystemID) === systems.Juvenile ?
                            <SupplementalJuvenile
                                clientProfile={clientProfile.Person}
                                clientProfilePersonID={personID}
                                schoolValues={schoolOptions}
                                educationLevelValues={educationLevelsOptions}
                                jobStatusValues={ jobStatusOptions } 
                                maritalStatusValues={ maritalStatusOptions }
                                createNotification={triggerToastMessage}
                             /> : <div></div>
                        }                  
                    </Tab>
                    <Tab eventKey="address" title="Address" disabled={isTabDisabled}>
                        {
                            parseInt(sessionData.SystemID) === systems.Juvenile ? 
                            <AddressJuvenile
                                clientProfile={clientProfile.Person}
                                createNotification={triggerToastMessage}
                                createErrorNotification={triggerErrorMessage} 
                            /> : <div></div>
                        }
                        {
                            parseInt(sessionData.SystemID) === systems.Adult ?
                            <AddressAdult
                                clientProfile={clientProfile.Person}
                                createNotification={triggerToastMessage}
                                createErrorNotification={triggerErrorMessage}
                            /> : <div></div>
                        }
                        {
                            parseInt(sessionData.SystemID) === systems.OCWB ?
                            <AddressCWB
                                clientProfile={clientProfile.Person}
                                propertyTypeValues={propertyTypeOptions}
                                createNotification={triggerToastMessage}
                                createErrorNotification={triggerErrorMessage}
                             /> : <div></div>
                        }
               
                    </Tab>
                    <Tab eventKey="familyinfo" title="Family Info" disabled={isTabDisabled}>
                       <FamilyInfo
                            clientProfile={clientProfile.Person}
                            clientProfileID={clientProfile.ClientProfile }
                            maritalStatusValues={ maritalStatusOptions }
                            relationshipValues = {relationshipOptions }
                            suffixValues= { suffixOptions }
                            createNotification={triggerToastMessage}
                            createErrorNotification={triggerErrorMessage}
                        />
                    </Tab>
                    <Tab eventKey="program" title={referralTabTitle} disabled={isTabDisabled}>
                        {
                            parseInt(sessionData.SystemID) === systems.OCWB ?
                            <CWBEnrollment 
                                assistanceTypeValues = { assistanceTypeOptions }
                                careerPathwayValues = { careerPathwayOptions }
                                serviceReleaseValues = { serviceReleaseOptions }
                                serviceOutcomeValues = { serviceOutcomeOptions }
                                contactTypeValues = { contactTypeOptions }
                                subContactTypeValues = { subContactTypeOptions }
                                staffValues = { staffOptions }
                                clientProfile={clientProfile.ClientProfile }
                                familyProfiles={clientProfile.Person }
                                placement={clientProfile.Placement }
                                createNotification={triggerToastMessage}
                                createErrorNotification={triggerErrorMessage}
                             /> 
                            : <div></div>
                        }
                        {
                            parseInt(sessionData.SystemID) === systems.Juvenile ? 
                            <EnrollmentCaseModal
                                clientProfile={clientProfile.ClientProfile } 
                                offenseValues = { offenseOptions }
                                placementLevelValues = { placementLevelOptions }
                                serviceReleaseValues = { serviceReleaseOptions }
                                serviceOutcomeValues = { serviceOutcomeOptions }
                                judgeValues = { judgeOptions }
                                contactTypeValues = { contactTypeOptions }
                                subContactTypeValues = { subContactTypeOptions }
                                staffValues = { staffOptions }
                                placement={clientProfile.Placement }
                                familyProfiles={clientProfile.Person }
                                createNotification={triggerToastMessage}
                                createErrorNotification={triggerErrorMessage}
                             /> : <div></div>
                        }
                        {
                            parseInt(sessionData.SystemID) === systems.Adult ?
                            <EnrollmentCaseModalAdult
                                clientProfile={clientProfile.ClientProfile } 
                                offenseValues = { offenseOptions }
                                placementLevelValues = { placementLevelOptions }
                                serviceReleaseValues = { serviceReleaseOptions }
                                serviceOutcomeValues = { serviceOutcomeOptions }
                                judgeValues = { judgeOptions }
                                contactTypeValues = { contactTypeOptions }
                                subContactTypeValues = { subContactTypeOptions }
                                staffValues = { staffOptions }
                                placement={clientProfile.Placement }
                                familyProfiles={clientProfile.Person }
                                courtNameValues={courtNameOptions}
                                createNotification={triggerToastMessage}
                                createErrorNotification={triggerErrorMessage}
                             /> : <div></div> 
                        }

                    </Tab>
                    <Tab eventKey="assessment" title="Assessment" disabled={isTabDisabled}>
                       <Assessment
                            clientProfile={clientProfile.ClientProfile }
                            assessmentTypeValues={assessmentTypeOptions}
                            assessmentSubTypeValues={assessmentSubTypeOptions}
                            staffValues={staffOptions}
                            createNotification={triggerToastMessage}
                            createErrorNotification={triggerErrorMessage}
                        />
                    </Tab>
                   
                </Tabs>
            </div>

}

export default CaseManagementFunction;
