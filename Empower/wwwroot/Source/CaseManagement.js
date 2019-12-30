import React, { Component } from 'react';
import {Tabs, Tab } from 'react-bootstrap-tabs'
import Search from './SearchClientProfile'


export default class CaseManagement extends Component { 

    constructor(props) {
        super(props);

        this.state = {
            isTabDisabled: true,
            isParticipantTabDisabled: true
        }
    }

    render() {
        return (
            <Tabs style={{cursor: 'pointer' }} onSelect={(index, label) => console.log(label + ' selected')}>
                <Tab label="Search"><Search/></Tab>
                <Tab disabled={ this.state.isParticipantTabDisabled } label="Participant Info">Participant info content</Tab>
                <Tab disabled={ this.state.isTabDisabled } label="Supplemental">Supplemental content</Tab>
                <Tab disabled={ this.state.isTabDisabled } label="Address">Address content</Tab>
                <Tab disabled={ this.state.isTabDisabled } label="Family Info">Family Info</Tab>
                <Tab disabled={ this.state.isTabDisabled } label="Program">Program</Tab>
                <Tab disabled={ this.state.isTabDisabled } label="Assessment">Assessment</Tab>
            </Tabs>
        );
    }
}