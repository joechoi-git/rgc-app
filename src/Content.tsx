import * as React from "react";
// eslint-disable-next-line
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

type ClinicalConcept = {
    id: number;
    displayName: string;
    description: string;
    parentIds: string;
    childIds: string;
    alternateNames: string;
};

type ClinicalConceptToDisplay = ClinicalConcept & {
    depth: number;
};

const columns: GridColDef[] = [
    { field: "id", headerName: "Concept ID", type: "number", width: 100 },
    { field: "displayName", headerName: "Display Name", width: 150 },
    { field: "description", headerName: "Description", width: 300 },
    { field: "parentIds", headerName: "Parent IDs", width: 100 },
    { field: "childIds", headerName: "Child IDs", width: 100 },
    { field: "alternateNames", headerName: "Alternate Names", width: 150 }
];

const rows: Array<ClinicalConcept> = [
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

const visualized: Array<ClinicalConceptToDisplay> = [];

const prepareVisualized = (data: ClinicalConcept, depth: number): void => {
    console.log("prepareVisualized", data.displayName, depth);
    visualized.push({ ...data, depth });
};

const recursion = (parentId: number, depth: number) => {
    // find all children
    const children = rows.filter((row: ClinicalConcept) => {
        const parentIds: Array<number> = row.parentIds.split(",").map((value) => parseInt(value));
        return parentIds.includes(parentId);
    });
    for (const child of children) {
        prepareVisualized(child, depth);
        recursion(child.id, depth + 1);
    }
};

// find the top level (without parents)
const parents = rows.filter((row: ClinicalConcept) => {
    return row.parentIds === "";
});
// start the recursion from each top level
for (const parent of parents) {
    prepareVisualized(parent, 0);
    recursion(parent.id, 1);
}

console.log("visualized", visualized);

export default function Content() {
    return (
        <>
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                <Typography
                    component="h6"
                    variant="h6"
                    color="inherit"
                    noWrap
                    sx={{ flexGrow: 1 }}
                    className="pb-3"
                >
                    Table Representation with Column Sorting and Pagination
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
            </Paper>

            <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }} className="mt-10">
                <Typography
                    component="h6"
                    variant="h6"
                    color="inherit"
                    noWrap
                    sx={{ flexGrow: 1 }}
                    className="pb-3 pt-3"
                >
                    Relationship Representation
                </Typography>
                {visualized.map((row, index) => (
                    <div key={index} className="p-1" style={{ marginLeft: 50 * row.depth }}>
                        {row.displayName}
                    </div>
                ))}
            </Paper>
        </>
    );
}
