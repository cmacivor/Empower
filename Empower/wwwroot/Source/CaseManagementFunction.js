import React, { useState } from 'react';
import Search from './Search'
import Info from './Info';
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'

const CaseManagementFunction = (props) => {
    const [isTabDisabled, setEnabled] = useState(true);
    const [isParticipantTabDisabled, setParticipantTabEnabled] = useState(true);
    const [defaultTab, setDefaultTab] = useState("search");
    const [activeTab, setActiveTab] = useState("search");

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

    return <div>
            <Tabs defaultActiveKey={defaultTab} activeKey={activeTab} onSelect={k => SetActiveTab(k) } id="caseManagementTabs">
                    <Tab eventKey="search" title="Search">
                        <Search enableTabsHandler={EnableTabs} ></Search>
                    </Tab>
                    <Tab eventKey="participantinfo" title="Participant Info" disabled={isTabDisabled}>
                        <Info />                       
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
