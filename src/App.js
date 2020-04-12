import React, {useState} from "react";
import useStyles from "./css";
import Grid from '@material-ui/core/Grid';
import {BrowserRouter, Switch, Route} from "react-router-dom";
import {withStyles} from "@material-ui/core/styles";

import Header from "./Header";
import Footer from "./Footer";
import routes from "./routes";

export const AuthContext = React.createContext(null);

const App = () => {
    const [isLoggedIn, setLoggedIn] = useState(false);
    const classes = useStyles();

    return (
        <AuthContext.Provider value={{isLoggedIn, setLoggedIn}}>
            Is logged in? {JSON.stringify(isLoggedIn)}
            <BrowserRouter>
                <Grid container className={classes.root}>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Header/>
                    </Grid>
                    <Grid container
                          direction="column"
                          justify="center"
                          alignItems="center">
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Switch>
                                {routes.map(route => (
                                    <Route
                                        key={route.path}
                                        path={route.path}
                                        exact={route.exact}
                                        component={route.main}
                                    />
                                ))}
                            </Switch>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Footer/>
                    </Grid>
                </Grid>
            </BrowserRouter>
        </AuthContext.Provider>
    );
};

export default withStyles()(App);
