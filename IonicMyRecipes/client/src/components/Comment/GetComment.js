import { IonAvatar, IonCard, IonCardSubtitle, IonGrid, IonImg, IonRow, IonText, IonSkeletonText } from "@ionic/react";
import avatar from '../../pages/assets/images/avatar.png'
import axios from '../../config/axios'
import { GET_ALL_POSTS, API_URL } from "../../config/urls";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

const GetComment = (props) => {

    const [comments, setComments] = useState()

    const {jwt} = useContext(AuthContext)

    const postId = window.location.pathname.split('/')[3]

    useEffect(() => {
        getComments()
    }, [props.comment])

    const getComments = async () => {
        try {
            await axios.get(GET_ALL_POSTS + '/' + postId + '/get-comments', {
                headers: {
                    Authorization: jwt
                }
            }).then(res => {
                console.log(res);
                setComments(res.data)
            })
        } catch(e) {
            console.log(e.response);
        }
    }

    return (
        <IonGrid className="ion-no-margin">
            {comments ?
            comments.map(comment => {
                return (
                <IonRow key={comment.id}>
                    <IonAvatar className="comment-avatar">
                        {comment.User.img_uri ?
                        <IonImg src={ API_URL + comment.User.img_uri} />
                        :
                        <IonImg src={avatar} />
                        }
                    </IonAvatar>
                    <IonCard className="comment-card ion-padding">
                        <IonCardSubtitle color="warning">{comment.User.name}</IonCardSubtitle>
                        <IonText className="comment-text">
                            {comment.text}
                        </IonText>
                    </IonCard>
                </IonRow>
                )
            })
            :
            <IonCard>
                <IonGrid className="ion-margin-right">
                    <IonRow>
                    <IonAvatar>
                        <IonSkeletonText animated style={{ width: '20%' }} />
                    </IonAvatar>
                    <IonCardSubtitle>
                        <p><IonSkeletonText animated style={{ width: '50%' }} /></p>
                    </IonCardSubtitle>
                    </IonRow>
                    <IonText>
                        <p><IonSkeletonText animated style={{ width: '50%' }} /></p>
                    </IonText>
                </IonGrid> 
            </IonCard>
            }
        </IonGrid>
    )
}

export default GetComment;