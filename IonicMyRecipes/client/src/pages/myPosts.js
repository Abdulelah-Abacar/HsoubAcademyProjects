import { 
    IonAlert,
    IonAvatar,
    IonButtons,
    IonCard,
    IonCardContent,
    IonCardSubtitle,
    IonCardTitle,
    IonCol,
    IonContent, 
    IonGrid, 
    IonIcon, 
    IonImg, 
    IonLoading, 
    IonPage, 
    IonRow,
    IonText,
    useIonActionSheet
} from "@ionic/react"
import Header from '../components/Header/Header'
import noImage from './assets/images/no_image.png'
import avatar from './assets/images/avatar.png'
import './styles/getAllPosts.css'
import axios from '../config/axios'
import { GET_MY_POSTS, DELETE_POST, API_URL } from "../config/urls"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import {ellipsisVertical} from 'ionicons/icons'
import './styles/getMyPosts.css'
import { useHistory } from "react-router"


const MyPosts = () => {

    const [showLoading, setShowLoading] = useState(false);
    const [posts, setPosts] = useState()
    const [postId, setPostId] = useState()
    const [showAlert, setShowAlert] = useState(false)

    const [present, dismiss] = useIonActionSheet();

    const history = useHistory()

    const {jwt} = useContext(AuthContext);

    useEffect(() => {
        getPosts()
    }, [])

    const getPosts = async () => {
        setShowLoading(true)
        try {
            await axios.get(GET_MY_POSTS, {
                headers: {
                    Authorization: jwt
                }
            }).then(res => {
                console.log(res);
                setPosts(res.data);
                setShowLoading(false)
            }) 
        } catch(e) {
            console.log(e.response);
            setShowLoading(false)
        }
    }

    const deletePost = async () => {
        setShowLoading(true)
        try {
            await axios.delete(DELETE_POST, {
                data: {
                    'postId': postId
                },
                headers: {
                    Authorization: jwt
                }
            }).then(res => {
                console.log(res);
                setShowLoading(false)
                getPosts()
            })
        } catch(e) {
            console.log(e.response);
            setShowLoading(false)
        }
    }




    return (
        <IonPage>
            {showLoading 
            ? 
            <IonLoading isOpen={showLoading} />
            : posts &&
            <>
            <IonAlert
            isOpen={showAlert}
            onDidDismiss={() => setShowAlert(false)}
            header={'تنبيه!'}
            message={'هل تود بالفعل حذف المنشور'}
            buttons={[
                {
                    text: "نعم",
                    handler: () => {
                        deletePost()
                    }
                },
                {
                    text: "إلغاء",
                    role: "cancel"
                }
            ]}
            />
            <Header headerTitle="منشوراتي" />
            <IonContent className="ion-padding">
                <IonGrid>
                    <IonRow>
                    {posts.length > 0 
                    ?
                    posts.slice().reverse().map((post) => {
                        return (
                        <IonCol size-md="6" size="12"  key={post.id}>
                            <IonCard>
                                <IonImg src={ API_URL + post.Post_Images[0].img_uri} className="post-image" />
                                <IonCardContent>
                                    <IonGrid>
                                        <IonRow className="ion-justify-content-between">
                                            <IonCardTitle className="post-title" color="primary">{post.title}</IonCardTitle>
                                            <IonButtons
                                            onClick={() => {
                                                present([
                                                    {
                                                        text: "تعديل المنشور",
                                                        handler: () => {
                                                            history.push(`/my-recipe/my-posts/${post.id}`)
                                                        }
                                                    },
                                                    {
                                                        text: "الانتقال للمنشور",
                                                        handler: () => {
                                                            history.push(`/my-recipe/all-posts/${post.id}`)
                                                        }
                                                    },
                                                    {
                                                        text: "حذف المنشور",
                                                        handler: () => {
                                                            setPostId(post.id)
                                                            setShowAlert(true)
                                                        }
                                                    },
                                                    {
                                                        text: "إلغاء",
                                                        role: "cancel"
                                                    }
                                                ], 'تفاصيل المنشور')
                                            }}
                                            >
                                                <IonIcon icon={ellipsisVertical} className="post-icon" />
                                            </IonButtons>
                                        </IonRow>
                                        <IonCardSubtitle className="post-contents">{post.contents}</IonCardSubtitle>
                                    </IonGrid>
                                </IonCardContent>
                            </IonCard>
                        </IonCol>

                        )
                    })
                    :
                    <IonCol size-md="6" offset-md="3">
                        <IonCard className="ion-padding ion-text-center">
                            <IonCardTitle color="primary">لايوجد منشورات لعرضها</IonCardTitle>
                        </IonCard>
                    </IonCol>
                    }
                    </IonRow>
                </IonGrid>


            </IonContent>
            </>
            }
        </IonPage>
    )
}

export default MyPosts;