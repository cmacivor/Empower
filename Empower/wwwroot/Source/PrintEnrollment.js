import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import { getSessionData } from './commonAdmin';
import moment from 'moment';

const PrintEnrollment = (props) => {

    $("#printModal").on('show.bs.modal', function(){
        //alert('The modal is about to be shown.');
        console.log('the print modal');
      });

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
                                   Test
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