import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import { getSessionData } from './commonAdmin';
import moment from 'moment';

const Referral = (props) => {

    let careerAdvisors = props.staffValues;
    let serviceReleases = props.serviceReleaseValues;
    let serviceOutcomes = props.serviceOutcomeValues;
    //console.log('the service ouutcomes');
    //console.log(serviceOutcomes);

    const [serviceProgramCategories, setServiceProgramCategories ] = useState([]);

    useEffect(() => { 
        document.getElementById('btnCareerAdvisorName').value = 'Please Select';
        document.getElementById('btnCareerAdvisorName').innerText = 'Please Select';

        document.getElementById('btnReferToService').value = 'Please Select';
        document.getElementById('btnReferToService').innerText = 'Please Select';

        //btnCaseStatus
        document.getElementById('btnCaseStatus').value = 'Please Select';
        document.getElementById('btnCaseStatus').innerText = 'Please Select';

        //btnServiceOutcome
        document.getElementById('btnServiceOutcome').value = 'Please Select';
        document.getElementById('btnServiceOutcome').innerText = 'Please Select';


        getServiceProgramCategories();
    }, []);

    function getServiceProgramCategories() {
        let apiAddress = sessionStorage.getItem("baseApiAddress");
        let fullServiceProgramCategory = `${apiAddress}/AllServiceProgramCategory`;
        let sessionStorageData = getSessionData();

        fetch(fullServiceProgramCategory, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorageData.Token
            }
        }).then(result => result.json())
        .then(result => {
            //console.log(result);
            setServiceProgramCategories(result);
        });
    }


    function ddlCareerAdvisorSelectHandler(event) {
        let selectedValue = event.currentTarget.getAttribute('value');
       
        $("#btnCareerAdvisorName").val(selectedValue);
    
        let selectedAdvisor = careerAdvisors.filter(function(advisor) {
            return advisor.ID === parseInt(selectedValue);
        });

        document.getElementById('btnCareerAdvisorName').innerText = selectedAdvisor[0].LastName + ", " + selectedAdvisor[0].FirstName;

        //console.log(selectedAdvisor);
        let txtReferralEmail = document.getElementById("txtReferralEmail");
        txtReferralEmail.innerText = selectedAdvisor[0].EMail;

        let txtReferralPhone = document.getElementById("txtReferralPhone");
        txtReferralPhone.innerText = selectedAdvisor[0].Phone;

        let txtReferralFax = document.getElementById("txtReferralFax");
        txtReferralFax.innerText = selectedAdvisor[0].Fax;

        let txtReferralTitle = document.getElementById("txtReferralTitle");
        txtReferralTitle.innerText = selectedAdvisor[0].JobTitle.Name;
    }

    function ddlServiceProgramCategorySelectHandler(event) {
        let selectedValue = event.currentTarget.getAttribute('value');

        //console.log(selectedValue);
        
        let selectedServiceProgramCategory = serviceProgramCategories.filter(function(spc) {
            return spc.ServiceProgramCategoryID === parseInt(selectedValue);
        });

        console.log(selectedServiceProgramCategory);

        $("#btnReferToService").val(selectedValue);

        document.getElementById("btnReferToService").innerText = selectedServiceProgramCategory[0].ServiceName;

    }

    
    function ddlServiceReleaseSelectHandler(event) {
        let selectedValue = event.currentTarget.getAttribute('value');


        
        let selectedRelease = serviceReleases.filter(function(serviceRelease) {
            return serviceRelease.ID === parseInt(selectedValue);
        });

        console.log(selectedRelease);

        $("#btnCaseStatus").val(selectedValue);

        document.getElementById("btnCaseStatus").innerText = selectedRelease[0].Name;

    }

    function ddlServiceOutcomeSelectHandler(event) {
        let selectedValue = event.currentTarget.getAttribute('value');
  
        let selectedOutcome = serviceOutcomes.filter(function(serviceOutcome) {
            return serviceOutcome.ID === parseInt(selectedValue);
        });

        console.log(selectedOutcome);

        $("#btnServiceOutcome").val(selectedValue);

        document.getElementById("btnServiceOutcome").innerText = selectedOutcome[0].Name;

    }

    function getElementValue(element) {
        let value = document.getElementById(element).value;

        if (value === "" || value === "Please Select") {
            return null;
        }
        return value;
    }

    function saveEnrollment() {

        let apiAddress = sessionStorage.getItem("baseApiAddress");
        let fullPersonEnrollmentAddress = `${apiAddress}/api/Enrollment`;
        let sessionStorageData = getSessionData();

        let referralDate = moment(new Date($("#txtReferralDate").val())).format('YYYY-MM-DD');
        let careerAdvisor = getElementValue("btnCareerAdvisorName"); //$("#btnCareerAdvisorName").val();
        let referToService = getElementValue("btnReferToService"); //$("#btnReferToService").val();
        let comments = $("#txtReferralNotes").val();

        //let serviceReleaseID = $("#btnCaseStatus").val();
        let serviceReleaseID = getElementValue("btnCaseStatus");
        //let serviceOutcomeID = $("#btnServiceOutcome").val();
        let serviceOutcomeID = getElementValue("btnServiceOutcome");

        let enrollment = {
            PlacementID: $("#hdnPlacementID").val(),
            ReferralDate: referralDate,
            //ServiceProgramCategoryID: $("#btnCareerAdvisorName").val(),
            CounselorID: careerAdvisor,
            ServiceProgramCategoryID: referToService,
            Comments: comments,
            SuppComments: $("#txtReferralStatusNotes").val(),
            BeginDate: moment(new Date($("#txtServiceBeginDate").val())).format('YYYY-MM-DD'),
            EndDate: moment(new Date($("#txtServiceEndDate").val())).format('YYYY-MM-DD'),
            ServiceReleaseID: serviceReleaseID, //$("#btnCaseStatus").val(),
            ServiceOutcomeID: serviceOutcomeID,//$("#btnServiceOutcome").val(),
            DateCaseAssigned: $("#txtDateCaseAssigned").val(),
            Active: true,
            //CreatedDate: new Date(),
            //CreatedBy: sessionStorageData.CurrentUser,
            UpdatedDate: new Date(),
            UpdatedBy: sessionStorageData.CurrentUser
        }

        let methodType = '';
        if ($("#hdnEnrollmentID").val() !== "") { //this is an UPDATE
            methodType  = 'PUT';
            enrollment.CreatedDate = new Date($("#hdnReferralCreatedDate").val());
            enrollment.CreatedBy = $("#hdnCreatedBy").val();
            enrollment.ID = $("#hdnEnrollmentID").val();
        } else {
            methodType = 'POST';
            enrollment.CreatedDate = new Date();
            enrollment.CreatedBy = sessionStorageData.CurrentUser;
        }

   

        //console.log(enrollment);

        fetch(fullPersonEnrollmentAddress, {
            method: methodType,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorageData.Token
            },
            body: JSON.stringify(enrollment)
        }).then(result => result.json())
        .then(result => {
            console.log(result);

            if (result === null || result.Message !== undefined) {
                props.createErrorNotification("an error occurred while saving the record.");
                return;
            }

            props.createNotification('The enrollment was successfully saved.');

            props.togglePlacementModal();

            props.refreshEnrollmentGrid();
        });
    }

    
    let careerAdvisorValueOptions = [];
    if ( careerAdvisors.length > 0) {

        careerAdvisorValueOptions = careerAdvisors.map((value) =>
            <a key={value.ID} value={value.ID} description={value.LastName + ', ' + value.FirstName} onClick={ ddlCareerAdvisorSelectHandler  } className="dropdown-item">{value.LastName + ', ' + value.FirstName}</a>
        );
    }

    let serviceProgramCategoryOptions = [];
    if (serviceProgramCategories.length > 0) {
        serviceProgramCategoryOptions = serviceProgramCategories.map((value) =>
        <a key={value.ServiceProgramCategoryID} value={value.ServiceProgramCategoryID} description={value.ServiceName} onClick={ ddlServiceProgramCategorySelectHandler } className="dropdown-item">{value.ServiceName}</a>
      );
    }

    let serviceReleaseOptions = [];
    if ( serviceReleases.length > 0) {
        serviceReleaseOptions = serviceReleases.map((value) =>
        <a key={value.ID} value={value.ID} description={value.Name} onClick={ ddlServiceReleaseSelectHandler } className="dropdown-item">{value.Name}</a>
      );
    }

    let serviceOutcomeOptions = [];
    if ( serviceOutcomes.length > 0) {
        serviceOutcomeOptions = serviceOutcomes.map((value) =>
        <a key={value.ID} value={value.ID} description={value.Name} onClick={ ddlServiceOutcomeSelectHandler } className="dropdown-item">{value.Name}</a>
      );
    }
    return <div>
           <input type="hidden" id="hdnEnrollmentID" />
           <input type="hidden" id="hdnReferralCreatedDate" />
           <input type="hidden" id="hdnCreatedBy" />

           <form id="frmReferral">
            <div className="modal fade" id="referralModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Enrollment</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div id="accordion"> 
                                <div className="card">
                                    <div className="card-header">
                                        Service Details
                                    </div>
                                        <div className="card-body">
                                        <div className="form-row">
                                            <div className="col-4">
                                                <label htmlFor="txtReferralDate"><strong>Referral Date</strong></label>
                                                <input type="date" defaultValue="" id="txtReferralDate" className="form-control"></input>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="col-6">
                                                <label htmlFor="ddlReferralDate"><strong>Career Advisor Name *</strong></label>
                                                <div className="dropdown">
                                                    <button type="button" id="btnCareerAdvisorName" value="" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                                        
                                                    </button>
                                                    <div className="dropdown-menu">
                                                        { careerAdvisorValueOptions }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="col-4">
                                                <label><strong>Referral Source Details</strong></label>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="col-3">
                                                <label><strong>Phone</strong></label>
                                                <div id="txtReferralPhone">

                                                </div>
                                            </div>
                                            <div className="col-3">
                                                <label><strong>Email</strong> </label>
                                                <div id="txtReferralEmail">

                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="col-3">
                                                <label><strong>Fax</strong></label>
                                                <div id="txtReferralFax">

                                                </div>
                                            </div>
                                            <div className="col-3">
                                                <label><strong>Title</strong></label>
                                                <div id="txtReferralTitle">

                                                </div>
                                            </div>
                                        </div>            
                                        <div className="form-row">
                                            <div className="col-6">
                                                <label htmlFor="btnReferToService"><strong>Refer to this Service *</strong></label>
                                                <div className="dropdown">
                                                    <button type="button" id="btnReferToService" value="" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                                        
                                                    </button>
                                                    <div className="dropdown-menu">
                                                        {serviceProgramCategoryOptions}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="col-6">
                                                <label htmlFor="txtReferralNotes"><strong>Notes</strong></label>
                                                <textarea  className="form-control" defaultValue="" id="txtReferralNotes" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-header">
                                        <a className="collapsed card-link" data-toggle="collapse" href="#moreDetails">
                                            More Details
                                        </a>
                                    </div>
                                    <div id="moreDetails" className="collapse" data-parent="#accordion">
                                        <div className="card-body">
                                            <div className="form-row">
                                                <div className="col-6">
                                                    <label htmlFor="txtReferralStatusNotes"><strong>Referral Status Note</strong></label>
                                                    <textarea className="form-control" defaultValue="" id="txtReferralStatusNotes" className="form-control" />
                                                </div>
                                            </div>
                                            <div className="form-row">
                                                <div className="col-4">
                                                    <label htmlFor="txtServiceBeginDate"><strong>Service Begin Date</strong></label>
                                                    <input type="date" id="txtServiceBeginDate" defaultValue="" className="form-control" />
                                                </div>
                                                <div className="col-4">
                                                    <label htmlFor="txtServiceEndDate"><strong>Service End Date</strong></label>
                                                    <input type="date" id="txtServiceEndDate" defaultValue="" className="form-control" />
                                                </div>
                                            </div>
                                            <div className="form-row">
                                                <div className="col-6">
                                                    <label htmlFor="ddlCaseStatus"><strong>Case Status</strong></label>
                                                    <div className="dropdown">
                                                        <button type="button" id="btnCaseStatus" value="" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                                            
                                                        </button>
                                                        <div className="dropdown-menu">
                                                            { serviceReleaseOptions }
                                                            {/* {maritalStatusValueOptions} */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-row">
                                                <div className="col-6">
                                                    <label htmlFor="btnServiceOutcome"><strong>Referral Source</strong></label>
                                                    <div className="dropdown">
                                                        <button type="button" id="btnServiceOutcome" value="" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                                            
                                                        </button>
                                                        <div className="dropdown-menu">
                                                            { serviceOutcomeOptions }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-row">
                                                <div className="col-4">
                                                    <label htmlFor="txtDateCaseAssigned"><strong>Date Case Assigned</strong></label>
                                                    <input type="date" id="txtDateCaseAssigned" className="form-control" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={ saveEnrollment } >Save</button>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
}

export default Referral;