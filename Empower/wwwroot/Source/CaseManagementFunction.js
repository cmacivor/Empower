import React, { useState, useRef } from 'react';
import SearchJuvenile from './SearchJuvenile'
import Info from './Info';
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import { useCacheService } from './useCacheService';
import Supplemental from './Supplemental';
import {useStore} from './StateStores/store';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CaseManagementFunction = (props) => {
    const [isTabDisabled, setEnabled] = useState(true);
    const [isParticipantTabDisabled, setParticipantTabEnabled] = useState(true);
    const [defaultTab, setDefaultTab] = useState("search");
    const [activeTab, setActiveTab] = useState("search");
    const [clientProfile, setClientProfile] = useState(Object);
    const infoRef = useRef();
    const cacheService = useCacheService();
    const {state, dispatch} = useStore();

    toast.configure();


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

    //to handle clicking on a row in the search grid, so this data is accessible elsewhere
    function SetClientProfile(clientProfile) {

        //check to see if the Add New Profile button was clicked, set clienProfile to undefined if it was   
        setClientProfile(clientProfile); //updates the local state

        //to handle the birth date changing when a new row in the search grid is selected. this is because the datepicker is a third party library
        infoRef.current.updateBirthDate(clientProfile.ClientProfile.Person.DOB);

    }

    return <div>
            <Tabs defaultActiveKey={defaultTab} activeKey={activeTab} onSelect={k => SetActiveTab(k) } id="caseManagementTabs">
                    <Tab eventKey="search" title="Search">
                        <SearchJuvenile enableTabsHandler={EnableTabs}
                         setParticipantInfoAsActiveTab={SetActiveTab} 
                         onSearchGridRowClick={e => SetClientProfile(e)}
                         createNotification={triggerToastMessage}
                        >
                        </SearchJuvenile>
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
