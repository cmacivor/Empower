import React, { useState } from 'react';
import { Grid, Table, TableHeaderRow } from '@devexpress/dx-react-grid-bootstrap4';
import moment from 'moment';
import { Api } from './commonAdmin';
//import { useClientProfile} from './useClientProfile';
import {useStore} from './StateStores/store';
import PropTypes from 'prop-types';


const Search = (props) => {
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    //const [races, setRaces] = useState([]);
    //const [genders, setGenders] = useState([]);

    //grid state
    const [columns] = useState([
        { name: 'FirstName', title: 'First Name' },
        { name: 'LastName', title: 'Last Name' },
        { name: 'MiddleName', title: 'Middle Name' },
        { name: 'StateORVCIN', title: 'State/VCIN #' },
        { name: 'SSN', title: 'SSN' },
        { name: 'FormattedBirthDate', title: 'Birth Date' }, 
        { name: 'Gender', title: 'Gender' },        
      ]);
     const [rows, setRows] = useState([]);
     const [isGridVisible, setGridVisible] = useState(false);

     //to test the global state
     const {state, dispatch} = useStore();


     //client profile
    //const clienProfile = useClientProfile();


     //Api.getConfigDataByType("Race").then(races => this.setState({races}));
     //Api.getConfigDataByType("Race").then(races => setRaces({races}));

     //Api.getConfigDataByType("Gender").then(genders => this.setState({genders}));
     //Api.getConfigDataByType("Gender").then(genders => setGenders({genders}));

     function SetClientProfile(clientProfile) {
         props.onSearchGridRowClick(clientProfile);
     }

    function handleLastNameChange (event)  {
        setLastName(event.target.value);
    }

    function handleFirstNameChange (event) {
        setFirstName(event.target.value);
    }

    function SearchButtonClickHandler() {
        let apiAddress = sessionStorage.getItem("baseApiAddress");

        let token = sessionStorage.getItem("token");
        
        let fullSearchAddress = `${apiAddress}/api/ClientProfile/Search`;

        let postData = {
            lastName: lastName,
            firstName: firstName
        }

        try
        {
           var promise = fetch(fullSearchAddress, {
                method: 'post',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(postData)
            }); 

            promise.then(result =>  {
                if (result.status === 200) {
                    return result.json();
                
                } else {
                    return result.json();
                } 
    
            }).then(finalResult => {
                //rows = finalResult;
                setRows(finalResult);
                setGridVisible(true);
                //isGridVisible === true;
                // this.setState({
                //     rows: finalResult,
                //     isGridVisible: true
                // });
            });
        }
        catch(error)
        {
            console.log(error);
            alert('an error occurred while searching;');
        }
    }

   const TableComponent = ({ ...restProps }) => (
        <Table.Table
          {...restProps}
          className="table-hover"
        />
      );

   const TableRow = ({ row, ...restProps }) => (
        <Table.Row
          {...restProps}
          onClick={() => GetSelectedRow(row) }/>
      );

    function ClearSearchFields() {
        setLastName('');
        setFirstName('');
    }

    function testMethod() {
        console.log(clienProfile);
    }

    function GetSelectedRow(row) {
        //console.log(row);


        props.enableTabsHandler();
        
        let apiAddress = sessionStorage.getItem("baseApiAddress");

        let token = sessionStorage.getItem("token");
        
        let clientProfileAddress = `${apiAddress}/api/ClientProfile/${row.ID}`;

        try
        {
           var promise = fetch(clientProfileAddress, {
                method: 'get',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }               
            }); 

            promise.then(result =>  {
                if (result.status === 200) {
                    return result.json();
                
                } else {
                    return result.json();
                } 
    
            }).then(finalResult => {
                console.log(finalResult);
                SetClientProfile(finalResult);

                //now we get the gender values and dispatch them to the global state


        
                
            });
        }
        catch(error)
        {
            console.log(error);
            alert('an error occurred while retrieving the Client Profile;');
        }
    }

    return <div>
                <br></br>
                <h4>Search Client Profiles</h4>
                <p>Please search for an existing Client Profile, before creating a new one.</p>
                <div className="form-row">
                    <div className="col-3">
                        <input type="text" className="form-control" onChange={handleLastNameChange} value={lastName}  placeholder="Enter Last Name"></input>
                    </div>
                    <div className="col-3">
                        <input type="text" className="form-control" onChange={handleFirstNameChange} value={firstName} placeholder="Enter First Name"></input>
                    </div>
                    <div className="col-auto">
                        <button type="submit" onClick={SearchButtonClickHandler}  className="btn btn-primary mb-2">Search</button>
                    </div>
                    <div className="col-auto">
                        <button type="button" onClick={ClearSearchFields} className="btn btn-primary mb-2">Clear Search</button>
                        <button type="button" onClick={testMethod}>Test state</button>
                    </div>
                </div>
                <br/>
                {state.count}
                <button onClick={() => dispatch({type: "increment", message:"Incremented"})}>+</button>
                <button onClick={() => dispatch({type: "decrement", message: "Decremented"})}>-</button>
                <button onClick={() => dispatch({type: "reset", message: "Reset"})}>Reset</button>
                {state.message}
                <br/>
                {
                    isGridVisible === true ?
                    

                    <Grid className="card"
                        rows={rows }
                        columns={columns}>
                        <Table tableComponent={TableComponent} rowComponent={TableRow}></Table>
                        <TableHeaderRow />
                    </Grid> : <div></div>
                
                }
            </div>;
}

export default Search;