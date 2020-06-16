import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import { getSessionData } from './commonAdmin';
import moment from 'moment';

const PrintEnrollment = (props) => {

    // if (props.clientProfile !== undefined) {
    //     personId = props.clientProfile.Person.ID;
    //     clientProfileId = props.clientProfile.ID;
    // }

    // $("#printModal").on('show.bs.modal', function() {
    //     //alert('The modal is about to be shown.');
    //     //console.log('the print modal');
    //     //console.log($("#hdnPrintSelectedEnrollmentID").val());
    //     //console.log(props.clientProfileID);

    //     //getPlacementsByClientProfileID(props.clientProfileID);

    //   });

    //   function getPlacementsByClientProfileID(clientProfileID) {
    //     let apiAddress = sessionStorage.getItem("baseApiAddress");
        
    //     //let fullGetPlacementsAddress = `${apiAddress}/api/Placement/GetPlacementsByClientProfileID/${clientProfileID}`;
    //     let fullGetPlacementsAddress = `${apiAddress}/api/ClientProfile/GetPlacementsByClientProfileId/${clientProfileID}`;
    //     let sessionStorageData = getSessionData();

    //     fetch(fullGetPlacementsAddress, {
    //         method: 'GET',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': 'Bearer ' + sessionStorageData.Token
    //         }
    //     }).then(result => result.json())
    //     .then(result => {
    //         console.log(result);
    //         //console.log('the new method');
    //         //console.log(result);
    //         //generateTable(result);
    //     });
    // }

    return <div>
        <form id="frmPrint">
            <div className="modal fade" id="printModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Enrollment</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                           <div className="form-row">
                               <div className="col-6">
                                    <label><strong>Participant's Name</strong></label>
                                    <div id="divParticipantName" ></div>
                               </div>
                                <div  className="col-6">
                                    <label><strong>SSN</strong></label>
                                    <div id="divClientSSN"></div>
                                </div>
                           </div>
                           <div className="form-row">
                               <div className="col-6">
                                   <label><strong>Gender</strong></label>
                                   <div id="divGender"></div>
                               </div>
                               <div className="col-6">
                                   <label><strong>Race</strong></label>
                                   <div id="divRace"></div>
                               </div>
                           </div>
                           <div className="form-row">
                               <div className="col-6">
                                    <label><strong>State/VCIN</strong></label>
                                    <div id="divStateVCIN"></div>
                               </div>
                               <div className="col-6">
                                   <label><strong>Current Age</strong></label>
                                   <div id="divCurrentAge"></div>
                               </div>
                           </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" >Save</button>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
}

export default PrintEnrollment;