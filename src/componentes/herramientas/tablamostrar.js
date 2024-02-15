import React,{useEffect} from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridOverlay } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Titulos_todos } from '../../constantes';
import moment from 'moment';


export default function TablaMostrar(props) {
    const [rows, setRows] = React.useState([]);
    const [columns, setColumns] = React.useState([]);
    const {datos,style} = props;
    const titulos = Titulos_todos(props.titulos)
    // console.log(titulos)
    const InicarColumnas=(rows)=>{
        // console.log('>>>>', rows)
        let width= titulos ? window.innerWidth * 0.50 / titulos.length : window.innerWidth;
        const columnas= titulos 
          ? titulos.map(titulo=>{
            // console.log('>>>>>>>>>>>>>>>>>>>>',titulo)
            return {
              headerAlign: 'center', 
              headerName:titulo.title,
              minWidth:titulo.width ? titulo.width : 153.0,
              flex: titulo.flex ? titulo.flex : 1,
              width,
              ...titulo,
              editable:false,
              valueGetter:(dato)=>{
                let valor =titulo.formato ? titulo.formato(dato) : dato.value; 
                // console.log(dato, titulo, valor)
                if (titulo.type==='date'){
                  titulo.formato=(dato)=>{
                    dato = dato.row ? dato.row : dato;
                    // console.log(dato[titulo.field])
                    return moment(dato[titulo.field]===null ? new Date() : dato[titulo.field]).format('DD/MM/YYYY');
                  }
                }
                if (!valor || valor==='NaN'){
                  valor=titulo.formato ? titulo.formato(dato.row): dato.row[titulo.field] ;
                }
                
                if (!valor || valor==='NaN')
                  valor=titulo.formato ? titulo.formato(rows[dato.id]) : null
                if (valor===null)
                  valor= titulo.default ? titulo.default : '';
                if (typeof valor==='object')
                  valor = valor.value ? valor.value : valor.titulo;
                
                if(typeof valor==='string'){
                  if (valor && valor.split(',')[0]==='listar'){
                    const listar = valor.split(',');
                    let resulta= '';
                    dato.value.map(v=>{
                      let texto='';
                      for (var i=1; i<listar.length; i++){
                        texto+= `${String(v[listar[i]]).toUpperCase()} `;
                      }
                      resulta += `${texto},`;
                      return v
                    })
                    valor=resulta;
                  }
                } 
                // console.log('>>>>>>',valor)
                
                // if (dato.field==='total')
                // console.log(valor, typeof valor, rows[dato.id]) 
                return titulo.type==='number' ? Number(['NaN',NaN].indexOf(String(valor))===-1 ? valor : 0).toLocaleString() : valor
              }//titulo.formato ? titulo.formato : null
            }
          })
          : []
        setColumns([
          ...columnas,
        ])
    }
    useEffect(() => {
        // console.log(datos)
        let nuevo = datos 
          ? datos.movimiento.map((data,i)=>{
            let resultado={...data, id: data.id ? data.id : i}
            if (titulos){
              titulos.map(titulo=>{
                let valor =titulo.formato ? titulo.formato(resultado) : null
                valor= String(valor)==='NaN' 
                        ? titulo.default
                        ? titulo.default
                        : 0
                        : valor
                resultado[titulo.field]= resultado[titulo.field] ? resultado[titulo.field] : valor
                return titulo
              })
            }
  
            return resultado
          })
          : []
        setRows(nuevo)
        InicarColumnas(nuevo)
        
    }, [props]);
    const StyledGridOverlay = styled(GridOverlay)(({ theme }) => ({
      flexDirection: 'column',
      '& .ant-empty-img-1': {
        fill: theme.palette.mode === 'light' ? '#aeb8c2' : '#262626',
      },
      '& .ant-empty-img-2': {
        fill: theme.palette.mode === 'light' ? '#f5f5f7' : '#595959',
      },
      '& .ant-empty-img-3': {
        fill: theme.palette.mode === 'light' ? '#dce0e6' : '#434343',
      },
      '& .ant-empty-img-4': {
        fill: theme.palette.mode === 'light' ? '#fff' : '#1c1c1c',
      },
      '& .ant-empty-img-5': {
        fillOpacity: theme.palette.mode === 'light' ? '0.8' : '0.08',
        fill: theme.palette.mode === 'light' ? '#f5f5f5' : '#fff',
      },
    }));
    function CustomNoRowsOverlay() {
      return (
        <StyledGridOverlay>
          <svg
            width="120"
            height="100"
            viewBox="0 0 184 152"
            aria-hidden
            focusable="false"
          >
            <g fill="none" fillRule="evenodd">
              <g transform="translate(24 31.67)">
                <ellipse
                  className="ant-empty-img-5"
                  cx="67.797"
                  cy="106.89"
                  rx="67.797"
                  ry="12.668"
                />
                <path
                  className="ant-empty-img-1"
                  d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
                />
                <path
                  className="ant-empty-img-2"
                  d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
                />
                <path
                  className="ant-empty-img-3"
                  d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
                />
              </g>
              <path
                className="ant-empty-img-3"
                d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
              />
              <g className="ant-empty-img-4" transform="translate(149.65 15.383)">
                <ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815" />
                <path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z" />
              </g>
            </g>
          </svg>
          <Box sx={{ mt: 1 }}>Sin datos</Box>
        </StyledGridOverlay>
      );
    }
    return (
        <Box sx={{  width: '100%' , ...style ? style : {}}}>
            <Typography variant="h6" gutterBottom noWrap title={`${props.label ? props.label : ''}`}>
                {`${props.label ? props.label : ''}`}
            </Typography>
            <DataGrid
                rows={rows}
                columns={columns}
                
                disableSelectionOnClick
                // hideFooterPagination
                hideFooter
                // hideFooterRowCount
                // hideFooterSelectedRowCount
                experimentalFeatures={{ newEditingApi: true }}
                components={{Pagination:null, NoRowsOverlay: CustomNoRowsOverlay}}
                localeText={local}
                sx={{
                    boxShadow: 2,
                    border: 2,
                    borderColor: 'primary.light',
                    '& .MuiDataGrid-cell:hover': {
                      color: 'primary.main',
                    },
                    height:'100%',
                    ...props && props.style ? props.style : {}
                  }}
            />
        </Box>
    );
}


const local={
  // Root
  noRowsLabel: 'Sin datos',
  noResultsOverlayLabel: 'No se han encontrado resultados.',
  errorOverlayDefaultLabel: 'Ocurrió un error.',

  // Density selector toolbar button text
  toolbarDensity: 'Densidad',
  toolbarDensityLabel: 'Densidad',
  toolbarDensityCompact: 'Compacto',
  toolbarDensityStandard: 'Estándar',
  toolbarDensityComfortable: 'Amplio',

  // Columns selector toolbar button text
  toolbarColumns: 'Columnas',
  toolbarColumnsLabel: 'Seleccionar columnas',

  // Filters toolbar button text
  toolbarFilters: 'Filtros',
  toolbarFiltersLabel: 'Mostrar filtros',
  toolbarFiltersTooltipHide: 'Ocultar filtros',
  toolbarFiltersTooltipShow: 'Mostrar filtros',
  toolbarFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} filtros activos` : `${count} filtro activo`,

  // Export selector toolbar button text
  toolbarExport: 'Exportar',
  toolbarExportLabel: 'Exportar',
  toolbarExportCSV: 'Descargar como CSV',
  toolbarExportPrint: 'Imprimir',

  // Columns panel text
  columnsPanelTextFieldLabel: 'Buscar columna',
  columnsPanelTextFieldPlaceholder: 'Título de la columna',
  columnsPanelDragIconLabel: 'Reordenar columna',
  columnsPanelShowAllButton: 'Mostrar todo',
  columnsPanelHideAllButton: 'Ocultar todo',

  // Filter panel text
  filterPanelAddFilter: 'Añadir filtro',
  filterPanelDeleteIconLabel: 'Borrar',
  filterPanelOperators: 'Operators',
  filterPanelOperatorAnd: 'Y',
  filterPanelOperatorOr: 'O',
  filterPanelColumns: 'Columnas',
  filterPanelInputLabel: 'Valor',
  filterPanelInputPlaceholder: 'Valor del filtro',

  // Filter operators text
  filterOperatorContains: 'contains',
  filterOperatorEquals: 'equals',
  filterOperatorStartsWith: 'starts with',
  filterOperatorEndsWith: 'ends with',
  filterOperatorIs: 'is',
  filterOperatorNot: 'is not',
  filterOperatorAfter: 'is after',
  filterOperatorOnOrAfter: 'is on or after',
  filterOperatorBefore: 'is before',
  filterOperatorOnOrBefore: 'is on or before',
  filterOperatorIsEmpty: 'is empty',
  filterOperatorIsNotEmpty: 'is not empty',
  filterOperatorIsAnyOf: 'is any of',

  // Filter values text
  filterValueAny: 'any',
  filterValueTrue: 'true',
  filterValueFalse: 'false',

  // Column menu text
  columnMenuLabel: 'Menu',
  columnMenuShowColumns: 'Mostrar columnas',
  columnMenuFilter: 'Filtro',
  columnMenuHideColumn: 'Ocultar',
  columnMenuUnsort: 'Unsort',
  columnMenuSortAsc: 'Ordenar por ASC',
  columnMenuSortDesc: 'Ordenar por DESC',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} filtros activos` : `${count} filtro activo`,
  columnHeaderFiltersLabel: 'Mostrar filtros',
  columnHeaderSortIconLabel: 'Ordenar',

  // Rows selected footer text
  footerRowSelected: (count) =>
    count !== 1
      ? `${count.toLocaleString()} filas seleccionadas`
      : `${count.toLocaleString()} fila seleccionada`,

  // Total rows footer text
  footerTotalRows: 'filas totales:',

  // Total visible rows footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} of ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: 'Selección de casilla',
  checkboxSelectionSelectAllRows: 'Seleccionar todas las filas',
  checkboxSelectionUnselectAllRows: 'Deseleccionar todas las filas',
  checkboxSelectionSelectRow: 'Seleccionar fila',
  checkboxSelectionUnselectRow: 'Deseleccionar fila',

  // Boolean cell text
  booleanCellTrueLabel: 'true',
  booleanCellFalseLabel: 'false',

  // Actions cell more text
  actionsCellMore: 'more',

  // Column pinning text
  pinToLeft: 'Pin to left',
  pinToRight: 'Pin to right',
  unpin: 'Unpin',

  // Tree Data
  treeDataGroupingHeaderName: 'Group',
  treeDataExpand: 'see children',
  treeDataCollapse: 'hide children',

  // Grouping columns
  groupingColumnHeaderName: 'Group',
  groupColumn: (name) => `Group by ${name}`,
  unGroupColumn: (name) => `Stop grouping by ${name}`,

  // Master/detail
  expandDetailPanel: 'Expand',
  collapseDetailPanel: 'Collapse',

  // Used core components translation keys
  MuiTablePagination: {},
}
