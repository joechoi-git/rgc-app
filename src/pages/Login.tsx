import * as React from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
// eslint-disable-next-line
import Button, { ButtonProps } from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
// eslint-disable-next-line
import TextField, { TextFieldProps } from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Copyright from "../components/Copyright";
import { AuthContext } from "../context/AuthContext";
import { setCookie } from "../helper/Cookies";

type Login = {
    email: string;
    password: string;
};

const defaultTheme = createTheme();

const defaultPassword = "abc123";

export default function Login() {
    const { setAuthenticated } = React.useContext(AuthContext);

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const navigate = useNavigate();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const formJson = Object.fromEntries(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (data as any).entries()
        ) as Login;
        const email = formJson.email;
        const password = formJson.password;

        // TO DO: authenticate via an API endpoint
        if (
            (email === "joechoi.newyork@gmail.com" || email === "george.mitra@regeneron.com") &&
            password === defaultPassword
        ) {
            const role = email === "joechoi.newyork@gmail.com" ? "admin" : "viewer";
            setCookie("email", email);
            setCookie("role", role);

            setAuthenticated({
                role: role,
                email: email
            });

            navigate("/");
        }
    };

    const handlePopulateAdmin = () => {
        setEmail("joechoi.newyork@gmail.com");
        setPassword(defaultPassword);
    };

    const handlePopulateViewer = () => {
        setEmail("george.mitra@regeneron.com");
        setPassword(defaultPassword);
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center"
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                            }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                        />
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Remember me"
                        />
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 1 }}>
                            Sign In
                        </Button>
                        <Button
                            fullWidth
                            variant="outlined"
                            sx={{ mt: 1, mb: 1 }}
                            onClick={handlePopulateAdmin}
                        >
                            Populate with an Admin role
                        </Button>
                        <Button
                            fullWidth
                            variant="outlined"
                            sx={{ mt: 1, mb: 3 }}
                            onClick={handlePopulateViewer}
                        >
                            Populate with an Viewer role
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="#" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
        </ThemeProvider>
    );
}
