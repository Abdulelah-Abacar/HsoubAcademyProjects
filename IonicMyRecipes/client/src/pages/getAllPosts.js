import { 
    IonAlert,
    IonAvatar,
    IonCard,
    IonCardContent,
    IonCardSubtitle,
    IonCardTitle,
    IonCol,
    IonContent, 
    IonGrid, 
    IonImg, 
    IonLoading, 
    IonPage, 
    IonRefresher, 
    IonRefresherContent, 
    IonRow,
    IonText,
    useIonRouter
} from "@ionic/react"
import Header from '../components/Header/Header'
import noImage from './assets/images/no_image.png'
import avatar from './assets/images/avatar.png'
import './styles/getAllPosts.css'
import axios from '../config/axios'
import { GET_ALL_POSTS, API_URL } from "../config/urls"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import moment from 'moment';
import 'moment/locale/ar';
import { useHistory } from "react-router"
import {Storage} from '@capacitor/storage'


moment.locale('ar')

const GetAllPosts = () => {

    const [showLoading, setShowLoading] = useState(false);
    const [posts, setPosts] = useState()
    const [showAlert, setShowAlert] = useState(false)

    const {jwt, setLoggedIn} = useContext(AuthContext);

    const ionRouter = useIonRouter()

    const history = useHistory()

    console.log(ionRouter);

    useEffect(() => {
        getPosts()
    }, [])

    document.addEventListener('ionBackButton', (ev) => {
        ev.detail.register(10, () => {
            if(ionRouter.routeInfo.lastPathname === '/account/login') {
                setShowAlert(true)
            } else {
                history.push(ionRouter.routeInfo.lastPathname)
            }
        });
      });

    const getPosts = async () => {
        setShowLoading(true)
        try {
            await axios.get(GET_ALL_POSTS, {
                headers: {
                    Authorization:  jwt
                }
            }).then(res => {
                console.log(res);
                setPosts(res.data)
                setShowLoading(false)
            })
        } catch(e) {
            console.log(e.response);
            setShowLoading(false)
        }
    }

    const logOut = async () => {
        await Storage.remove({key: 'accessToken'})
        setLoggedIn(false)
        history.push('/account/login')
    }

    function doRefresh(event) {
        setTimeout(() => {
            getPosts()
        }, 1000)
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
            header={"تنبيه!"}
            subHeader={"أنت على وشك تسجيل الخروج"}
            message={"هل تريد تسجيل الخروج بالفعل؟"}
            buttons={[
                {
                    text: "موافق",
                    handler: () => {logOut()}
                },
                {
                    text: "إلغاء",
                    role: "cancel"
                }
            ]}
            />
            <Header headerTitle="وصفاتي" disabledBackButton="true" />
            <IonContent className="ion-padding">
                <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>
                <IonGrid>
                    <IonRow>
                    {posts.length > 0 
                    ?
                    posts.slice().reverse().map((post) => {
                        return (
                            <IonCol size-md="6" size="12" key={post.id}>
                                <IonCard routerLink={`/my-recipe/all-posts/${post.id}`}>
                                    <IonImg src={ API_URL + post.Post_Images[0].img_uri} className="post-image" />
                                    <IonCardContent>
                                        <IonGrid>
                                            <IonRow>
                                                <IonAvatar className="post-avatar">
                                                    {post.User.img_uri 
                                                    ? 
                                                    <IonImg src={ API_URL + post.User.img_uri} />
                                                    :
                                                    <IonImg src={avatar} />
                                                    }
                                                </IonAvatar>
                                                <IonCol>
                                                    <IonText className="post-user">{post.User.name}</IonText>
                                                    <IonText className="post-moment" color="warning">{moment(post.createdAt).fromNow()}</IonText>
                                                </IonCol>
                                            </IonRow>
                                            <IonCardTitle className="post-title" color="primary">{post.title}</IonCardTitle>
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

export default GetAllPosts;