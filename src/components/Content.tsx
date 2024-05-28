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
import { AuthContext } from "../context/AuthContext";
import { get, post, remove } from "../helper/Fetch";

type ClinicalConcept = {
    id: string;
    initialId?: string;
    displayName: string;
    description: string;
    parentIds: string;
    childIds: string;
    alternateNames: string;
};

type ClinicalConceptToDisplay = ClinicalConcept & {
    depth: number;
};

const apiEndpoint = "https://v936r8sd70.execute-api.us-west-2.amazonaws.com/Prod/concepts";

// a custom action for delete
function DeleteActionItem({
    deleteItem,
    ...props
}: GridActionsCellItemProps & { deleteItem: () => void }) {
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
                            deleteItem();
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
    const [visualized, setVisualized] = React.useState<Array<ClinicalConceptToDisplay>>([]);
    const [open, setOpen] = React.useState<boolean>(false);
    const [errorMessage, setErrorMessage] = React.useState<string>("");
    const [form, setForm] = React.useState<ClinicalConcept>({
        id: "",
        displayName: "",
        description: "",
        parentIds: "",
        childIds: "",
        alternateNames: ""
    });
    const { authenticated } = React.useContext(AuthContext);

    React.useEffect(() => {
        getConcepts();
    }, []);

    React.useEffect(() => {
        computeVisualized();
    }, [rows]);

    const handleClickOpen = (id: string) => {
        // pre-populate
        if (id !== "") {
            const match = rows.filter((row: ClinicalConcept) => {
                if (row.id === id) {
                    return row;
                }
            });
            if (match.length > 0) {
                setForm({
                    id: match[0].id,
                    initialId: match[0].id,
                    displayName: match[0].displayName,
                    description: match[0].description,
                    parentIds: match[0].parentIds,
                    childIds: match[0].childIds,
                    alternateNames: match[0].alternateNames
                });
            }
        } else {
            setForm({
                id: "",
                initialId: "",
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
        handleClickOpen("");
    };

    const editRow = React.useCallback(
        (id: GridRowId) => () => {
            handleClickOpen(id.toString());
        },
        [rows]
    );

    const deleteRow = React.useCallback(
        (id: GridRowId) => () => {
            deleteConcept(id.toString());
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
            getActions: (params) => {
                if (authenticated.role !== "admin") {
                    return [];
                }
                return [
                    <GridActionsCellItem
                        key="Edit"
                        label="Edit"
                        icon={<EditIcon />}
                        onClick={editRow(params.id)}
                    />,
                    <DeleteActionItem
                        key="Delete"
                        label="Delete"
                        icon={<DeleteIcon />}
                        deleteItem={deleteRow(params.id)}
                    />
                ];
            }
        }
    ];

    const getConcepts = async () => {
        const response = await get(apiEndpoint);
        const payload: Array<ClinicalConcept> = JSON.parse(JSON.stringify(response.parsedBody));
        const rows: Array<ClinicalConcept> = [];
        if (payload.length) {
            for (const row of payload) {
                rows.push({ ...row }); // , conceptId: parseInt(row.conceptId.toString())
            }
        }
        rows.sort((a, b) => {
            return parseInt(a.id) - parseInt(b.id);
        });
        console.log("getConcepts", rows.length, rows);
        setRows(rows);
    };

    const postConcept = async (item: ClinicalConcept) => {
        const response = await post<ClinicalConcept>(apiEndpoint, item);
        console.log("postConcept", item, response);
        getConcepts();
        setErrorMessage("");
        handleClose();
    };

    const deleteConcept = async (id: string) => {
        const item = {
            id: id
        };
        const response = await remove<{ id: string }>(apiEndpoint, item);
        console.log("deleteConcept", item, response);
        getConcepts();
    };

    const computeVisualized = () => {
        const visualized: Array<ClinicalConceptToDisplay> = [];
        const prepareVisualized = (data: ClinicalConcept, depth: number): void => {
            visualized.push({ ...data, depth });
        };

        const recursion = (parentId: string, depth: number) => {
            const children = rows.filter((row: ClinicalConcept) => {
                const parentIds: Array<string> = row.parentIds.split(",").map((value) => value);
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

        // console.log("compute", rows, visualized);
        setVisualized(visualized);
    };

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
                            // validate id
                            let isValid = true;
                            const match = rows.filter((row) => {
                                return row.id === formJson.id.trim();
                            });
                            if (match.length > 0) {
                                if (
                                    formJson.initialId !== "" &&
                                    formJson.initialId === formJson.id
                                ) {
                                    isValid = true;
                                } else {
                                    isValid = false;
                                    setErrorMessage(
                                        "A duplicate ID was found. Choose another one."
                                    );
                                }
                            }
                            // validate parent ids
                            const parentIds = formJson.parentIds.trim().split(",");
                            parentIds.forEach((id) => {
                                if (isNaN(Number(id))) {
                                    isValid = false;
                                    setErrorMessage(
                                        "Parent IDs can only contain numbers and commas."
                                    );
                                }
                            });
                            // validate child ids
                            const childIds = formJson.childIds.trim().split(",");
                            childIds.forEach((id) => {
                                if (isNaN(Number(id))) {
                                    isValid = false;
                                    setErrorMessage(
                                        "Child IDs can only contain numbers and commas."
                                    );
                                }
                            });
                            // submission
                            if (isValid) {
                                const submission: ClinicalConcept = {
                                    id: formJson.id.trim(),
                                    displayName: formJson.displayName.trim(),
                                    description: formJson.description.trim(),
                                    parentIds: formJson.parentIds.trim(),
                                    childIds: formJson.childIds.trim(),
                                    alternateNames: formJson.alternateNames.trim()
                                };
                                console.log("submission", submission);
                                postConcept(submission);
                            }
                        }
                    }}
                >
                    <DialogTitle>Clinical Concept</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {form.id === "" ? "Add New" : "Edit"}
                            {errorMessage ? (
                                <span style={{ color: "red" }} className="ml-3">
                                    Error: {errorMessage}
                                </span>
                            ) : null}
                        </DialogContentText>
                        <TextField
                            required
                            label="Concept ID"
                            name="id"
                            type="number"
                            defaultValue={form.id === "" ? "" : form.id}
                            variant="outlined"
                            fullWidth
                            margin="dense"
                        />
                        <TextField
                            name="initialId"
                            type="hidden"
                            defaultValue={form?.initialId || ""}
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
                    {authenticated.role === "admin" ? (
                        <Button onClick={addRow} variant="contained" className="float-right">
                            Add
                        </Button>
                    ) : null}
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
