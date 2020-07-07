import React, {useContext, useEffect } from "react";
import useStyles from "./css";
import Grid from "@material-ui/core/Grid";
import Button from '@material-ui/core/Button';
import firebase from "../firebase";
import {withRouter} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import Paper from "@material-ui/core/Paper";
import UserAvatar from "../UserAvatar";
import TextField from '@material-ui/core/TextField';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import GameSearch from "../GameSearch";
import PlayersSearch from "../PlayerSearch";
import {AuthContext} from "../App";
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import ShowSnackbar from "../ShowSnackbar";

const AddMatch = () => {
    const componentClasses = useStyles();
    const {t} = useTranslation();
    const {userInfo} = useContext(AuthContext);
    const [match, setMatch] = React.useState({
        "uid": null,
        "gameMoment": "play-now",
        "game": null
    });
    const [readyForm, setReadyForm] = React.useState(false);
    const snackbarRef = React.createRef();

    const toggleChange = (event, newGameMoment) => {
        setMatch({
            ...match,
            "gameMoment": newGameMoment
        });
    };

    const handleForm = e => {
        e.preventDefault();
        if (readyForm === true) {
            let matches = firebase.firestore().collection("matches").doc();

            setMatch({
                ...match
            })

            matches.set(match, {merge: true});
        } else {
            snackbarRef.current.handleClick(t('fill-in-the-required-fields'), 'warning');
        }
    };

    let gameCallback = (gameData) => {
        setMatch({
            ...match,
            "game": {
                "name": gameData.name._text,
                "yearPublished": gameData.yearpublished._text,
                "objectId": gameData._attributes.objectid
            }
        });
    }

    let playersSearchCallback = (playersData) => {
        setMatch({
            ...match,
            "players": [...playersData]
        });
    }

    useEffect(() => {
        // console.log('Do something after counter has changed');
        const formValidation = () => {
            let boolValidation = true;
            console.log("formValidation");
            console.log(match);
            // if (match.uid === null) {
            //     console.log("uid formValidation");
            //     boolValidation = false;
            // }
            match.uid = userInfo.uid;

            if (match.game === null) {
                console.log("game formValidation");
                boolValidation = false;
            }
            if (match.gameMoment === null) {
                console.log("gameMoment formValidation");
                boolValidation = false;
            }

            if (boolValidation === true) {
                setReadyForm(true);
            } else {
                setReadyForm(false);
            }
        };
        formValidation();
    }, [match]);

    return (
        <div className={componentClasses.root}>
            <ShowSnackbar ref = {snackbarRef} />
            <Grid container spacing={0}>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className={componentClasses.item}>
                    <Paper className={componentClasses.paper}>
                        <Grid container spacing={0}>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <form noValidate onSubmit={e => handleForm(e)}>
                                    <h3>{t('add-match')}</h3>
                                    <hr/>
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}
                                          className={componentClasses.item}>
                                        <TextField
                                            required
                                            label={t('host')}
                                            InputProps={{
                                                readOnly: true,
                                                startAdornment: (
                                                    <UserAvatar showName={false}/>
                                                ),
                                            }}
                                            defaultValue={userInfo.displayName}
                                            variant="outlined"
                                            helperText={t('the-host-cannot-be-changed')}
                                            placeholder={t('search-match-game')}
                                            fullWidth={true}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}
                                          className={componentClasses.item}>
                                        <GameSearch parentCallback={gameCallback}/>
                                    </Grid>
                                    {/* @TODO This function will be necessary in future */}
                                    {/*<Grid item xs={6} sm={6} md={6} lg={6} xl={6} className={componentClasses.item}>*/}
                                    {/*    <Button variant="contained" onClick={() => history.push('/gameRegister')}>{t('register-a-new-game')}</Button>*/}
                                    {/*</Grid>*/}
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}
                                          className={componentClasses.item}>
                                        <ToggleButtonGroup size="small" value={match.gameMoment} exclusive
                                                           onChange={toggleChange}>
                                            [
                                            <ToggleButton key={1} value="play-now">
                                                {t('play-now')}
                                            </ToggleButton>,
                                            <ToggleButton key={2} value="schedule">
                                                {t('schedule')}
                                            </ToggleButton>,
                                            <ToggleButton key={3} value="register-match">
                                                {t('register-match')}
                                            </ToggleButton>,
                                            ]
                                        </ToggleButtonGroup>
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={6} lg={6} xl={6} className={componentClasses.item}>
                                        <PlayersSearch parentCallback={playersSearchCallback}/>
                                    </Grid>

                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}
                                          className={componentClasses.item}>
                                        <Button variant="contained" startIcon={<CloudDownloadIcon />}>{t('game-rules-manual')}</Button>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                        {readyForm ?
                                            <Button variant="contained" type="submit"
                                                    color="primary">{t('save')}</Button>
                                            :
                                            <Button variant="contained" type="submit" color="primary"
                                                    disabled>{t('save')}</Button>
                                        }
                                    </Grid>
                                </form>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
};

export default withRouter(AddMatch);
