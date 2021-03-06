import React, {useEffect, useState} from "react";
import firebase from "../../firebase";
import useStyles from "./css";
import Grid from '@material-ui/core/Grid';
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import ShareIcon from '@material-ui/icons/Share';
import Paper from '@material-ui/core/Paper';
import {useTranslation} from "react-i18next";
import zombicide from "../../temp-images/zombicide.jpg";
import UserAvatar from "../../components/UserAvatar";
import Comments from "../../components/Comments";
import PersonAvatar from "../../components/PersonAvatar";
import CommentInput from "../../components/CommentInput";

const Community = () => {
        const componentClasses = useStyles();
        const {t} = useTranslation();
        const [communityList, setCommumnityList] = useState();

        const communityListItems = () => {
            return firebase.firestore().collection('matches')
                .get()
                .then(dataCommunitySnapShot => {
                    let list = [];
                    dataCommunitySnapShot.forEach(doc => {
                        list = [...list, {id: doc.id, ...doc.data()}];
                    });

                    return list;
                });
        };

        useEffect(() => {
            communityListItems().then(data => {
                setCommumnityList(data);
            });
        }, [setCommumnityList]);

        return (
            <div className={componentClasses.root}>
                {communityList &&
                communityList.map((value, index) => {
                    return (
                        <Paper className={componentClasses.paper} key={"community_" + index}>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}
                                  className={componentClasses.item}
                                  container
                                  spacing={0}>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    {value.game ? value.game.name : ''}
                                </Grid>
                                <Grid container className={componentClasses.hLine}>
                                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                        <UserAvatar showName={true}/>
                                        {/*<PersonAvatar displayName={value.uid} showName={true}/>*/}
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6} container>
                                        {
                                            value.players &&
                                            value.players.map((player, index) =>
                                                <PersonAvatar
                                                    key={"person_" + index}
                                                    displayName={player.name}
                                                    showName={false}/>
                                            )
                                        }
                                    </Grid>
                                </Grid>
                                <Grid container className={componentClasses.hLine}>
                                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                        <img src={zombicide} alt={t('logo-ludoapp')} height="300"/>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                        <Grid container spacing={0} item xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Comments arrComments={value.comments}/>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid container>
                                    <Grid item xs={6} sm={6} md={3} lg={3} xl={3}>
                                        <ThumbUpAltIcon/> Like
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={3} lg={3} xl={3}>
                                        <ShareIcon/> Share
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                        <CommentInput match={value.id}/>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Paper>
                    )
                })
                }
            </div>
        );
    }
;

export default Community;
