import * as React from "react";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Copyright(props: any) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            Copyright © {new Date().getFullYear()} - A demo app created by Joe Choi for{" "}
            <Link color="inherit" href="https://www.regeneron.com/">
                RGC
            </Link>
            .
        </Typography>
    );
}
