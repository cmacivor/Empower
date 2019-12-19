import React, { Component } from 'react';
import {Tabs, Tab } from 'react-bootstrap-tabs'


export default class CaseManagement extends Component { 

    render() {
        return (
            <Tabs onSelect={(index, label) => console.log(label + ' selected')}>
                <Tab label="Search">Search content</Tab>
                <Tab label="Participant Info">Participant info content</Tab>
                <Tab label="Supplemental">Supplemental content</Tab>
                <Tab label="Address">Address content</Tab>
                <Tab label="Family Info">Family Info</Tab>
                <Tab label="Program">Program</Tab>
                <Tab label="Assessment">Assessment</Tab>
            </Tabs>
        );
    }
}