import React, { useState } from 'react';
import {
  Grid,
  Table,
  TableHeaderRow,
} from '@devexpress/dx-react-grid-bootstrap4';

const SearchGrid = ({searchResults}) => {
    const [columns] = useState([
      { name: 'FirstName', title: 'First Name' },
      { name: 'LastName', title: 'Last Name' },
  
    ]);

    const [rows] = useState([]);
  
    return (
      <div className="card">
        <Grid
          rows={rows}
          columns={columns}
        >
          <Table />
          <TableHeaderRow />
        </Grid>
      </div>
    );
  };

  export default SearchGrid;