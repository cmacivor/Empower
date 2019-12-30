import React, { Component, useState } from 'react';
import { Grid, Table, TableHeaderRow } from '@devexpress/dx-react-grid-bootstrap4';


export default class SearchClientProfile extends Component { 

    constructor(props) {
        super(props);

        this.state = {
            isSearchButtonDisabled: true,
            firstName: '',
            lastName: '',
            columns: [
                { name: 'FirstName', title: 'First Name' },
                { name: 'LastName', title: 'Last Name' },
                { name: 'MiddleName', title: 'Middle Name' },
                { name: 'StateORVCIN', title: 'State/VCIN #' },
                { name: 'SSN', title: 'SSN' },
                { name: 'FormattedBirthDate', title: 'Birth Date' }, 
                { name: 'Gender', title: 'Gender' },        
              ],
            rows: [],
            isGridVisible: false
        }
    }

    //  TableComponent = ({ ...restProps }) => (
    //     <Table.Table
    //       {...restProps}
    //       className="table-striped"
    //     />
    //   );

    TableRow = ({ row, ...restProps }) => (
        <Table.Row
          {...restProps}
          // eslint-disable-next-line no-alert
          onClick={() => alert(JSON.stringify(row))}
        //   style={{
        //     cursor: 'pointer',
        //     ...styles[row.sector.toLowerCase()],
        //   }}
        />
      );
      

    ClearSearchFields = () => {
        this.setState({
            firstName: '',
            lastName: ''
        });
    }

    HandleSearchFieldChange = (event, field) => {
        this.setState({
            isSearchButtonDisabled: false,            
        });

        if (field === "firstname") {
            this.setState({
                firstName: event.target.value
            });
        }

        if (field === "lastname") {
            this.setState({
                lastName: event.target.value
            });
        }
    }

    SearchButtonClickHandler = () => {
        let apiAddress = sessionStorage.getItem("baseApiAddress");

        let token = sessionStorage.getItem("token");
        
        let fullSearchAddress = `${apiAddress}/api/ClientProfile/Search`;

        let postData = {
            lastName: this.state.lastName,
            firstName: this.state.firstName
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
                this.setState({
                    rows: finalResult,
                    isGridVisible: true
                });
            });
        }
        catch(error)
        {
            console.log(error);
            alert('an error occurred while searching;');
        }
    }

    render() {
        return (
            <div>
                <br></br>
                <h4>Search Client Profiles</h4>
                <p>Please search for an existing Client Profile, before creating a new one.</p>
                <div className="form-row">
                    <div className="col-3">
                        <input type="text" className="form-control" onChange={e => this.HandleSearchFieldChange(e, "lastname")} value={this.state.lastName}  placeholder="Enter Last Name"></input>
                    </div>
                    <div className="col-3">
                        <input type="text" className="form-control" onChange={e => this.HandleSearchFieldChange(e, "firstname")} value={this.state.firstName} placeholder="Enter First Name"></input>
                    </div>
                    <div className="col-auto">
                        <button type="submit" onClick={this.SearchButtonClickHandler}  disabled={this.state.isSearchButtonDisabled} className="btn btn-primary mb-2">Search</button>
                    </div>
                    <div className="col-auto">
                        <button type="button" onClick={this.ClearSearchFields} className="btn btn-primary mb-2">Clear Search</button>
                    </div>
                </div>
                <br/>
                {
                    this.state.isGridVisible === true ?
                    
                    <Grid className="card"
                        rows={this.state.rows }
                        columns={this.state.columns}>
                        <Table rowComponent={this.TableRow}  />
                        <TableHeaderRow />
                    </Grid> : <div></div>
                
                }

            </div>
        );
    }
}