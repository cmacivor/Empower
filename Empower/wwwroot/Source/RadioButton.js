import React, { useState } from 'react';

const RadioButton = (props) => {

    function yesButtonOnChangeHandler(event) {
        props.setCheckedValue(true);
    }

    function noButtonOnChangeHandler(event) {      
        props.setCheckedValue(false);
    }

    return <div>
                <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" onChange={yesButtonOnChangeHandler} name={props.name} checked={props.isChecked}  />
                        <label className="form-check-label">Yes</label>         
                </div>
                <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" onChange={noButtonOnChangeHandler} name={props.name} checked={!props.isChecked}  />
                    <label className="form-check-label">No</label>
                </div>
            </div>
}

export default RadioButton;