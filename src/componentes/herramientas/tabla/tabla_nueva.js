import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function DenseHeightGrid() {
    const [pinnedColumns, setPinnedColumns] = React.useState({
        left: ['Desk'],
      });
    const { data } = useDemoData({
        dataSet: 'Commodity',
        rowLength: 100,
        maxColumns: 6,
    });

    return (
        <div style={{ height: 400, width: '100%' }}>
        <DataGrid rowHeight={25} {...data}  
                pinnedColumns={pinnedColumns}
                disableColumnPinning={false}
        
        />
        </div>
    );
}
