import React, { useState } from 'react';
import { Grid, Table, TableHeaderRow } from '@devexpress/dx-react-grid-bootstrap4';
import moment from 'moment';
import { Api } from './commonAdmin';

const Search = () => {
    const [lastName, setLastName] = useState('Smith');
    const [firstName, setFirstName] = useState('John');

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

        console.log(firstName);
        console.log(lastName);

        // let postData = {
        //     lastName: this.state.lastName,
        //     firstName: this.state.firstName
        // }

        // try
        // {
        //    var promise = fetch(fullSearchAddress, {
        //         method: 'post',
        //         mode: 'cors',
        //         headers: {
        //             'Content-Type': 'application/json',
        //             'Authorization': 'Bearer ' + token
        //         },
        //         body: JSON.stringify(postData)
        //     }); 

        //     promise.then(result =>  {
        //         if (result.status === 200) {
        //             return result.json();
                
        //         } else {
        //             return result.json();
        //         } 
    
        //     }).then(finalResult => {
        //         this.setState({
        //             rows: finalResult,
        //             isGridVisible: true
        //         });
        //     });
        // }
        // catch(error)
        // {
        //     console.log(error);
        //     alert('an error occurred while searching;');
        // }
    }

    function ClearSearchFields() {
        setLastName('');
        setFirstName('');
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
                    </div>
                </div>
                <br/>
                {/* {
                    this.state.isGridVisible === true ?
                    
                    <Grid className="card"
                        rows={this.state.rows }
                        columns={this.state.columns}>
                        <Table tableComponent={this.TableComponent} rowComponent={this.TableRow}  />
                        <TableHeaderRow />
                    </Grid> : <div></div>
                
                } */}
            </div>;
}

export default Search;