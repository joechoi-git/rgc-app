import * as React from "react";
// eslint-disable-next-line
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";

const columns: GridColDef[] = [
    { field: "id", headerName: "Concept ID", type: "number", width: 70 },
    { field: "displayName", headerName: "Display Name", width: 130 },
    { field: "description", headerName: "Description", width: 130 },
    { field: "parentIds", headerName: "Parent IDs", width: 130 },
    { field: "childIds", headerName: "Child IDs", width: 130 },
    { field: "alternateNames", headerName: "Alternate Names", width: 130 }
];

const rows = [
    {
        id: 1,
        displayName: "Diagnosis",
        description: "Entity domain",
        parentIds: "",
        childIds: "2,3",
        alternateNames: ""
    },
    {
        id: 2,
        displayName: "Disease of Nervous System",
        description: "Diseases targeting the nervous system",
        parentIds: "1",
        childIds: "4",
        alternateNames: ""
    },
    {
        id: 3,
        displayName: "Disease of Eye",
        description: "Diseases targeting the eye",
        parentIds: "1",
        childIds: "8,9",
        alternateNames: ""
    },
    {
        id: 4,
        displayName: "Physical Disorders",
        description: "Physical Disorders",
        parentIds: "1",
        childIds: "8,9",
        alternateNames: ""
    },
    {
        id: 5,
        displayName: "Multiple Sclerosis (MS)",
        description: "Multiple Sclerosis",
        parentIds: "2,4",
        childIds: "5,6,7",
        alternateNames: "MS,name1,name2"
    }
];

export default function Content() {
    return (
        <>
            <Typography
                component="h6"
                variant="h6"
                color="inherit"
                noWrap
                sx={{ flexGrow: 1 }}
                className="pb-3"
            >
                Data Grid with Column Sorting and Pagination
            </Typography>
            <div style={{ height: 400, width: "100%" }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 5 }
                        }
                    }}
                    pageSizeOptions={[5, 10]}
                    checkboxSelection={false}
                />
            </div>
            <Typography
                component="h6"
                variant="h6"
                color="inherit"
                noWrap
                sx={{ flexGrow: 1 }}
                className="pb-3 pt-10"
            >
                Relationship Representation
            </Typography>
            <div style={{ height: 400, width: "100%" }}>
                {rows.map((row) => (
                    <div key={row.id} style={{ padding: 10 }}>
                        {row.displayName}
                    </div>
                ))}
            </div>
        </>
    );
}
