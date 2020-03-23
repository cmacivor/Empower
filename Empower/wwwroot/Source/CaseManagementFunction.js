import React, { useState, useRef } from 'react';
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

const CaseManagementFunction = (props) => {
    const [isTabDisabled, setEnabled] = useState(false);
    const [isParticipantTabDisabled, setParticipantTabEnabled] = useState(true);
    const [defaultTab, setDefaultTab] = useState("search");
    const [activeTab, setActiveTab] = useState("search");
    const [clientProfile, setClientProfile] = useState(Object);
    const [ isSpinnerVisible, setIsSpinnerVisible ] = useState(false);
    const infoRef = useRef();
    const cacheService = useCacheService();
    const {state, dispatch} = useStore();


    toast.configure();

    let sessionData = getSessionData();

    let systems = getSystems();


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

    function EnableTabs() {
        setEnabled(false);
        setDefaultTab("participantinfo");
        setActiveTab("participantinfo");     
    }

    function SetActiveTab(key) {
      setActiveTab(key);
    
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

        //to handle the birth date changing when a new row in the search grid is selected. this is because the datepicker is a third party library
        infoRef.current.updateBirthDate(clientProfile.ClientProfile.Person.DOB);

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
                    <Tab eventKey="participantinfo" title="Participant Info" disabled={isTabDisabled}>
                        <Info clientProfile={!state.isNewClient ? clientProfile.Person :  undefined } 
                         ref={infoRef}
                         genderValues={cacheService.genderValues}
                         raceValues={cacheService.raceValues}/>                       
                    </Tab>
                    <Tab eventKey="supplemental" title="Supplemental" disabled={isTabDisabled}>
                        
                       <Supplemental 
                       clientProfile={clientProfile.Person} 
                       educationLevelValues={cacheService.educationLevelValues}
                       fundingSourceValues={cacheService.fundingSourceValues}
                       jobStatusValues={cacheService.jobStatusValues} 
                       maritalStatusValues={cacheService.maritalStatusValues} />
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
