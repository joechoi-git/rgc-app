import * as React from "react";
import {
    DataGrid,
    GridActionsCellItem,
    // eslint-disable-next-line
    GridRowId,
    // eslint-disable-next-line
    GridColDef,
    // eslint-disable-next-line
    GridActionsCellItemProps
} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

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

// a custom action for delete
function DeleteUserActionItem({
    deleteUser,
    ...props
}: GridActionsCellItemProps & { deleteUser: () => void }) {
    const [open, setOpen] = React.useState(false);

    return (
        <React.Fragment>
            <GridActionsCellItem {...props} onClick={() => setOpen(true)} />
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Delete this?</DialogTitle>
                <DialogContent>
                    <DialogContentText>This action cannot be undone.</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button
                        onClick={() => {
                            setOpen(false);
                            deleteUser();
                        }}
                        color="warning"
                        variant="contained"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default function Content() {
    const [rows, setRows] = React.useState<Array<ClinicalConcept>>([]);
    const [open, setOpen] = React.useState(false);
    const [form, setForm] = React.useState<ClinicalConcept>({
        id: -1,
        displayName: "",
        description: "",
        parentIds: "",
        childIds: "",
        alternateNames: ""
    });

    React.useEffect(() => {
        const initialRows: Array<ClinicalConcept> = [
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
        setRows(initialRows);
    }, []);

    const handleClickOpen = (id: number) => {
        // pre-populate
        if (id !== -1) {
            const match = rows.filter((row: ClinicalConcept) => {
                if (row.id === id) {
                    return row;
                }
            });
            if (match.length > 0) {
                setForm({
                    id: match[0].id,
                    displayName: match[0].displayName,
                    description: match[0].description,
                    parentIds: match[0].parentIds,
                    childIds: match[0].childIds,
                    alternateNames: match[0].alternateNames
                });
            }
        } else {
            setForm({
                id: -1,
                displayName: "",
                description: "",
                parentIds: "",
                childIds: "",
                alternateNames: ""
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const addRow = () => {
        handleClickOpen(-1);
    };

    const editRow = React.useCallback(
        (id: GridRowId) => () => {
            handleClickOpen(parseInt(id.toString()));
            /*
setRows(
                (prevRows) => prevRows.map((row) => (row.id === id ? { ...row } : row)) // , isAdmin: !row.isAdmin
            );
            */
        },
        [rows]
    );

    const deleteRow = React.useCallback(
        (id: GridRowId) => () => {
            setTimeout(() => {
                setRows((prevRows) => prevRows.filter((row) => row.id !== id));
            });
        },
        [rows]
    );

    const columns: GridColDef[] = [
        { field: "id", headerName: "Concept ID", type: "number", width: 100 },
        { field: "displayName", headerName: "Display Name", width: 200 },
        { field: "description", headerName: "Description", width: 300 },
        { field: "parentIds", headerName: "Parent IDs", width: 100 },
        { field: "childIds", headerName: "Child IDs", width: 100 },
        { field: "alternateNames", headerName: "Alternate Names", width: 200 },
        {
            field: "actions",
            type: "actions",
            headerName: "Options",
            width: 100,
            getActions: (params) => [
                <GridActionsCellItem
                    key="Edit"
                    label="Edit"
                    icon={<EditIcon />}
                    onClick={editRow(params.id)}
                />,
                <DeleteUserActionItem
                    key="Delete"
                    label="Delete"
                    icon={<DeleteIcon />}
                    deleteUser={deleteRow(params.id)}
                />
            ]
        }
    ];

    const visualized: Array<ClinicalConceptToDisplay> = [];
    const prepareVisualized = (data: ClinicalConcept, depth: number): void => {
        visualized.push({ ...data, depth });
    };

    const recursion = (parentId: number, depth: number) => {
        const children = rows.filter((row: ClinicalConcept) => {
            const parentIds: Array<number> = row.parentIds
                .split(",")
                .map((value) => parseInt(value));
            return parentIds.includes(parentId);
        });
        for (const child of children) {
            prepareVisualized(child, depth);
            recursion(child.id, depth + 1);
        }
    };

    // start the recursion from each top level
    const parents = rows.filter((row: ClinicalConcept) => {
        return row.parentIds === "";
    });
    for (const parent of parents) {
        prepareVisualized(parent, 0);
        recursion(parent.id, 1);
    }

    return (
        <>
            {/* Modal for Add and Edit */}
            <React.Fragment>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                        component: "form",
                        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                            event.preventDefault();
                            const formData = new FormData(event.currentTarget);
                            const formJson = Object.fromEntries(
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                (formData as any).entries()
                            ) as ClinicalConcept;

                            // TO DO: handle submission
                            console.log("submitted!", formJson);

                            handleClose();
                        }
                    }}
                >
                    <DialogTitle>Clinical Concept</DialogTitle>
                    <DialogContent>
                        <DialogContentText>{form.id === -1 ? "Add New" : "Edit"}</DialogContentText>
                        <TextField
                            required
                            label="Concept ID"
                            name="id"
                            type="number"
                            defaultValue={form.id === -1 ? "" : form.id}
                            variant="outlined"
                            fullWidth
                            margin="dense"
                        />
                        <TextField
                            required
                            label="Display Name"
                            name="displayName"
                            type="text"
                            defaultValue={form.displayName}
                            variant="outlined"
                            fullWidth
                            margin="dense"
                        />
                        <TextField
                            required
                            label="Description"
                            name="description"
                            type="text"
                            defaultValue={form.description}
                            variant="outlined"
                            fullWidth
                            margin="dense"
                        />
                        <TextField
                            label="Parent IDs"
                            name="parentIds"
                            type="text"
                            defaultValue={form.parentIds}
                            variant="outlined"
                            fullWidth
                            margin="dense"
                        />
                        <TextField
                            label="Child IDs"
                            name="childIds"
                            type="text"
                            defaultValue={form.childIds}
                            variant="outlined"
                            fullWidth
                            margin="dense"
                        />
                        <TextField
                            label="Alternate Names"
                            name="alternateNames"
                            type="text"
                            defaultValue={form.alternateNames}
                            variant="outlined"
                            fullWidth
                            margin="dense"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit" variant="contained">
                            Submit
                        </Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
            {/* Table */}
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
                    <Button onClick={addRow} variant="contained" className="float-right">
                        Add
                    </Button>
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
                        pageSizeOptions={[5, 10, 25]}
                        checkboxSelection={false}
                    />
                </div>
            </Paper>
            {/* Visualization */}
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
