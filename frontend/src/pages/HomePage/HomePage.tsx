import * as React from "react";
import { Paper, Grid, Typography, List, ListItem, Divider, Button } from "@mui/material";

const HomePage = () => {
    return <>
        <Paper style={{ margin: 15, padding: 15 }}>
            <Grid container spacing={4}>
                <Grid item container xs={4} justifyContent="center">
                    <Typography variant="h6">
                        FAQ
                    </Typography>
                    <Typography variant="body2" align="center">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce iaculis a ex hendrerit tempor. Pellentesque pellentesque dignissim cursus. Vestibulum nec mauris eget diam ornare venenatis a fermentum purus. Vestibulum tincidunt neque sapien, ac cursus ante tristique id. Quisque vitae pulvinar libero. Sed bibendum lorem ut est porta pretium a suscipit massa. Vestibulum sit amet dolor facilisis, dictum libero vitae, consequat lorem. Praesent cursus, orci nec eleifend pulvinar, magna libero dictum nisl, vitae ullamcorper libero erat in eros. Suspendisse neque lorem, porta at est eget, tristique pellentesque sapien. Praesent faucibus congue orci ac rhoncus. Nam scelerisque vestibulum mi, ac posuere ipsum gravida tincidunt. Proin ac metus viverra libero consectetur ultricies. Sed aliquam urna nec facilisis efficitur.
                    </Typography>
                </Grid>
                <Grid item container xs={4}>
                    <Grid item container xs={12} justifyContent="center">
                        <Typography variant="h6">
                            Actions
                        </Typography>
                    </Grid>

                    <Grid container item xs={12} spacing={1}>
                        <Grid container item xs={6} direction="column" spacing={1}>
                            <Grid item>
                                <Button fullWidth variant="outlined">Apply Migrations</Button>
                            </Grid>
                            <Grid item>
                                <Button fullWidth variant="outlined">Update Backend Build</Button>
                            </Grid>
                            <Grid item>
                                <Button fullWidth variant="outlined">Action 3</Button>
                            </Grid>
                        </Grid>
                        <Grid container item xs={6} direction="column" spacing={1}>
                            <Grid item>
                                <Button fullWidth variant="outlined">Action 4</Button>
                            </Grid>
                            <Grid item>
                                <Button fullWidth variant="outlined">Action 5</Button>
                            </Grid>
                            <Grid item>
                                <Button fullWidth variant="outlined">Action 6</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item container xs={4} justifyContent="center">
                    <Typography variant="h6">
                        Stats
                    </Typography>
                </Grid>
            </Grid>
        </Paper>
    </>
}

export default HomePage