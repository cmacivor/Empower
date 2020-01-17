import React, { useState, useRef } from 'react';
import Search from './Search'
import Info from './Info';
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'

const CaseManagementFunction = (props) => {
    const [isTabDisabled, setEnabled] = useState(true);
    const [isParticipantTabDisabled, setParticipantTabEnabled] = useState(true);
    const [defaultTab, setDefaultTab] = useState("search");
    const [activeTab, setActiveTab] = useState("search");
    const [clientProfile, setClientProfile] = useState(Object);
    const infoRef = useRef();

    function EnableTabs() {
        setEnabled(false);
        setDefaultTab("participantinfo");
        setActiveTab("participantinfo");
        // this.setState({
        //     isTabDisabled: false,
        //     defaultTab: "participantinfo",
        //     activeTab: "participantinfo"
        // });
    }

    function SetActiveTab(key) {
      setActiveTab(key);
        // this.setState({
        //     activeTab: key
        // });
    }

    //to handle clicking on a row in the search grid, so this data is accessible elsewhere
    function SetClientProfile(clientProfile) {
        console.log('this is SetClientProfile in  CaseManagementFunction ');
        console.log(clientProfile);

        setClientProfile(clientProfile); //updates the local state

        //to handle the birth date changing when a new row in the search grid is selected. this is because the datepicker is a third party library
        console.log('this is the birth date!!!!');
        console.log(clientProfile.ClientProfile.Person.DOB);
        infoRef.current.updateBirthDate(clientProfile.ClientProfile.Person.DOB);

    }

    return <div>
            <Tabs defaultActiveKey={defaultTab} activeKey={activeTab} onSelect={k => SetActiveTab(k) } id="caseManagementTabs">
                    <Tab eventKey="search" title="Search">
                        <Search enableTabsHandler={EnableTabs} onSearchGridRowClick={e => SetClientProfile(e)} ></Search>
                    </Tab>
                    <Tab eventKey="participantinfo" title="Participant Info" disabled={isTabDisabled}>
                        <Info clientProfile={clientProfile.Person} ref={infoRef} />                       
                    </Tab>
                    <Tab eventKey="supplemental" title="Supplemental" disabled={isTabDisabled}>
                       supplemental content
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
