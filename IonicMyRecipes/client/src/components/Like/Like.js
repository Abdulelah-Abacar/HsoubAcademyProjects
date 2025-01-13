import { IonButtons, IonCol, IonIcon } from "@ionic/react"
import {heartOutline, heart} from 'ionicons/icons'
import { useContext, useEffect, useState } from "react"
import axios from '../../config/axios'
import { GET_ALL_POSTS } from "../../config/urls"
import { AuthContext } from "../../context/AuthContext"

const Like = (props) => {

    const [likeCount, setLikeCount] = useState()
    const [userLiked, setUserLiked] = useState()
    const [refreshLike, setRefeshLike] = useState()

    const {jwt} = useContext(AuthContext);

    const postId = window.location.pathname.split('/')[3]

    useEffect(() => {
        getLikes()
        sendLikeCount()
    }, [likeCount, refreshLike])

    const getLikes = async () => {
        try {
            await axios.get(GET_ALL_POSTS + '/' + postId + '/like-count', {
                headers: {
                    Authorization: jwt
                }
            }).then(res => {
                console.log(res);
                setLikeCount(res.data.likes)
                setUserLiked(res.data.userLiked)
            })
        } catch(e) {
            console.log(e.response);
        }
    }

    const like = async () => {
        try {
            await axios.put(GET_ALL_POSTS + '/' + postId + '/like', {}, {
                headers: {
                    Authorization: jwt
                }
            }).then(res => {
                console.log(res);
                setRefeshLike(res.data)
            })
        } catch(e) {
            console.log(e.response);
        }
    }

    const sendLikeCount = () => {
        props.sendToParent(likeCount)
    }

    return (
        <IonCol size="2">
            <IonButtons onClick={() => {
                like();
            }}>
                {userLiked 
                ?
                <IonIcon icon={heart} color="danger" className="post-icon" />
                :
                <IonIcon icon={heartOutline} color="primary" className="post-icon" />
                }
            </IonButtons>
        </IonCol>
    )
}

export default Like;