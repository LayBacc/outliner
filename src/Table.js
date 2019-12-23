import React from "react";
import {
  useTable
  // useGroupBy,
  // useFilters,
  // useSortBy,
  // useExpanded,
  // usePagination
} from 'react-table';

export class Table extends React.Component {
  constructor(props, context) {
    super(props, context);

    const columns = this.defaultColumns();
    const data = this.defaultData();

    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      prepareRow,
    } = useTable({
      columns,
      data,
    });
  }

  defaultColumns() {
  	// return React.useMemo(
  		// () => [
	  return [
	  		{
	  			Header: 'Name',
	        columns: [
	          {
	            Header: 'First Name',
	            accessor: 'firstName',
	          },
	          {
	            Header: 'Last Name',
	            accessor: 'lastName',
	          },
	        ],
	  		}
  		];
  	// 	[]
  	// );
  }

  defaultData() {
  	// const data = React.useMemo(() => makeData(20), [])
  	return [{firstname: 'foo',lastname:'bar'},{firstname: 'foo',lastname:'bar'}];
  	// return React.useMemo([{firstname: 'foo',lastname:'bar'},{firstname: 'foo',lastname:'bar'}] ,[]);
  }

  render() {
    return(
      <table>
        <tr>
          <th>Criteria</th>
          <th>Project</th>
        </tr>
      </table>
    );
  }
}
