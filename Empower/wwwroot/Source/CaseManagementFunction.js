import React, { useState, useRef } from 'react';
import Search from './Search'
import Info from './Info';
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import { useCacheService } from './useCacheService';
import Supplemental from './Supplemental';
import { useStore } from './StateStores/store';

const CaseManagementFunction = (props) => {
    const [isTabDisabled, setEnabled] = useState(true);
    const [isParticipantTabDisabled, setParticipantTabEnabled] = useState(true);
    const [defaultTab, setDefaultTab] = useState("search");
    const [activeTab, setActiveTab] = useState("search");
    const [clientProfile, setClientProfile] = useState(Object);
    const infoRef = useRef();
    const cacheService = useCacheService();
    const { state, dispatch } = useStore();

    //console.log('the case management function');
    //console.log(cacheService.fundingSourceValues);

    //console.log('this is the state store in CaseManagementFunction');
    //console.log(state);

    function EnableTabs() {
        setEnabled(false);
        setDefaultTab("participantinfo");
        setActiveTab("participantinfo");
    }

    function SetActiveTab(key) {
        setActiveTab(key);

        //   if (state.isNewClient) {
        //       setClientProfile(Object);
        //   }

    }

    //to handle clicking on a row in the search grid, so this data is accessible elsewhere
    function SetClientProfile(clientProfile) {

        //check to see if the Add New Profile button was clicked, set clienProfile to undefined if it was

        setClientProfile(clientProfile); //updates the local state

        //to handle the birth date changing when a new row in the search grid is selected. this is because the datepicker is a third party library
        infoRef.current.updateBirthDate(clientProfile.ClientProfile.Person.DOB);

    }

    return <div>
        <Tabs defaultActiveKey={defaultTab} activeKey={activeTab} onSelect={k => SetActiveTab(k)} id="caseManagementTabs">
            <Tab eventKey="search" title="Search">
                <Search enableTabsHandler={EnableTabs} setParticipantInfoAsActiveTab={SetActiveTab} onSearchGridRowClick={e => SetClientProfile(e)} ></Search>
            </Tab>
            <Tab eventKey="participantinfo" title="Participant Info" disabled={isTabDisabled}>
                <Info clientProfile={!state.isNewClient ? clientProfile.Person : undefined}
                    ref={infoRef}
                    genderValues={cacheService.genderValues}
                    raceValues={cacheService.raceValues} />
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
