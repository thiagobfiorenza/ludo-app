import React, {useState, useEffect, useContext} from "react";
import useStyles from "./css";
import {withRouter} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Grid from "@material-ui/core/Grid";
import firebase from "../firebase";
import {AuthContext} from "../App";

const PlayersSearch = () => {
    const componentClasses = useStyles();
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const [players, setPlayers] = useState([{name: 'João Gabriel', uid: 'asdfasfasfd'}]);
    const [friendPlayers, setFriendPlayers] = useState([]);
    const loading = open && options.length === 0;

    const {t} = useTranslation();
    const {userInfo} = useContext(AuthContext);

    useEffect(() => {
        let active = true;

        if (!loading) {
            return undefined;
        }

        (async () => {
            console.log("start");
            console.log(friendPlayers.length);
            if (friendPlayers.length === 0 ) {
                let usersInfoRef = firebase.firestore().collection('usersInfo');
                try {
                    var usersInfoSnapShot = await usersInfoRef.where("userInfo.uid", "==", userInfo.uid).get();
                    console.log(usersInfoSnapShot.docs[0].data());
                    setFriendPlayers(usersInfoSnapShot.docs[0].data());
                    console.log("end")
                } catch (err) {
                    console.log('Error getting documents', err);
                }

                if (friendPlayers !== undefined && friendPlayers !== null && friendPlayers.length !== 0) {
                    if (active) {
                        setOptions(Object.keys(friendPlayers).map((key) => friendPlayers[key]));
                    }
                }
            }
        })();

        return () => {
            active = false;
        };
    }, [loading, userInfo.uid]);

    useEffect(() => {
        if (!open) {
            setOptions([]);
        }
    }, [open]);

    return (
        <div>
            <Autocomplete
                id="asynchronous-player-search"
                style={{width: 300}}
                open={open}
                onOpen={() => {
                    setOpen(true);
                }}
                onClose={() => {
                    setOpen(false);
                }}
                getOptionSelected={(option, value) => {
                    if (option.name === value.name) {
                        setPlayers([...players, {name: option.name, uid: option.name}]);
                        return true
                    }
                }
                }
                getOptionLabel={(option) => option.name}
                options={options}
                loading={loading}
                renderInput={(params) => (
                    <TextField
                        required
                        {...params}
                        label={t('players')}
                        variant="outlined"
                        placeholder={t('search-match-players')}
                        fullWidth={true}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <React.Fragment>
                                    {loading ? <CircularProgress color="inherit"
                                                                 size={20}/> : null}
                                    {params.InputProps.endAdornment}
                                </React.Fragment>
                            ),
                        }}
                    />
                )}
            />
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} className={componentClasses.item}>
                {t('players')}
                {players.map(data => <div key={data.uid}>{data.name}</div>)}
            </Grid>
        </div>
    );
};

export default withRouter(PlayersSearch);
