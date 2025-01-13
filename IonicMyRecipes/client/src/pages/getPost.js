import { 
    IonAvatar,
    IonCard,
    IonCardSubtitle,
    IonCol,
    IonContent, 
    IonGrid, 
    IonIcon, 
    IonImg, 
    IonItem, 
    IonItemDivider, 
    IonList, 
    IonListHeader, 
    IonLoading, 
    IonPage, 
    IonRow,
    IonText
} from "@ionic/react"
import Header from "../components/Header/Header";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import avatar from './assets/images/avatar.png';
import {heartOutline, chatboxEllipsesOutline} from 'ionicons/icons';
import './styles/getPost.css';
import axios from '../config/axios';
import { GET_ALL_POSTS, API_URL } from "../config/urls";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext"; 
import moment from 'moment';
import 'moment/locale/ar';
import {Pagination, Navigation, Autoplay} from 'swiper'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import Like from '../components/Like/Like'
import GetComment from '../components/Comment/GetComment'
import CreateComment from '../components/Comment/CreateComment'
import {Editor, EditorState, convertFromRaw} from 'draft-js'


moment.locale('ar')


const GetPost = (props) => {

    const [showLoading, setShowLoading] = useState(false)
    const [post, setPost] = useState()
    const [likeCount, setLikeCount] = useState()
    const [newComment, setNewComment] = useState()
    const [steps, setSteps] = useState()

    const postId = window.location.pathname.split("/")[3]

    const {jwt} = useContext(AuthContext)

    useEffect(() => {
        getPost()
    }, [])

    const getPost = async () => {
        setShowLoading(true)
        try {
            await axios.get(GET_ALL_POSTS + '/' + postId, {
                headers: {
                    Authorization: jwt
                }
            }).then(res => {
                console.log(res);
                setPost(res.data)
                const contentState = convertFromRaw(JSON.parse(res.data.steps))
                const editorState = EditorState.createWithContent(contentState)
                setSteps(editorState)
                setShowLoading(false)
            })
        } catch(e) {
            console.log(e.response);
            setShowLoading(false)
        }
    }

    const swiper_settings = {
        navigation: true,
        pagination: {
            clickable: true
        },
        autoplay: {
            delay: 3000,
        }
    }

    function getContent() {
        return document.querySelector('#content')
    }

    function scrollToBottom() {
        getContent().scrollToBottom(500)
    }
 

    return (
        <IonPage>
            {showLoading 
            ? 
            <IonLoading isOpen={showLoading} />
            : post &&
            <>
            <Header headerTitle={post.title} />
            <IonContent scrollEvents={true} id="content">
                <IonGrid>
                    <IonRow>
                        <IonCol size-md="7" offset-md="1">
                        <Swiper {...swiper_settings} modules={[Pagination, Navigation, Autoplay]}>
                            {post.Post_Images.map(img => {
                                return(
                                <SwiperSlide key={img.id}>
                                    <IonImg src={ API_URL + img.img_uri} />
                                </SwiperSlide>
                                )
                            })}
                        </Swiper>
                        <IonGrid>
                            <IonRow>
                                <Like sendToParent={setLikeCount} />
                                <IonCol size="3">
                                    <IonIcon 
                                    icon={chatboxEllipsesOutline} 
                                    color="primary" 
                                    className="post-icon"
                                    onClick={() => {scrollToBottom()}}
                                    />
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCardSubtitle className="post-like">{likeCount} إعجاب</IonCardSubtitle>
                            </IonRow>
                        </IonGrid>
                        <IonCard className="ion-no-margin ion-margin-bottom">
                            <IonGrid>
                                <IonRow className="ion-margin-top">
                                    <IonAvatar>
                                        {post.User.img_uri ?
                                        <IonImg src={ API_URL + post.User.img_uri} />
                                        :
                                        <IonImg src={avatar} />             
                                        }
                                    </IonAvatar>
                                    <IonCol>
                                        <IonCardSubtitle className="post-username">{post.User.name}</IonCardSubtitle>
                                        <IonCardSubtitle className="post-time" color="warning">{moment(post.createdAt).fromNow()}</IonCardSubtitle>
                                    </IonCol>
                                    <IonCol className="ion-text-center">
                                        <IonCardSubtitle>{post.country} ،</IonCardSubtitle>
                                        <IonCardSubtitle>{post.region}</IonCardSubtitle>
                                    </IonCol>
                                </IonRow>
                            </IonGrid>
                            <IonList>
                                <IonListHeader>
                                    <IonText color="primary">
                                        <h3>المكونات</h3>
                                    </IonText>
                                </IonListHeader>
                                <IonItem lines="none">
                                    <IonText>
                                        <p>{post.contents}</p>
                                    </IonText>
                                </IonItem>
                            </IonList>
                            <IonList>
                                <IonListHeader>
                                    <IonText color="primary">
                                        <h3>خطوات التحضير</h3>
                                    </IonText>
                                </IonListHeader>
                                <IonItem lines="none">
                                    <IonText>
                                        <Editor editorState={steps} readOnly={true} />
                                    </IonText>
                                </IonItem>
                            </IonList>
                        </IonCard>
                        <IonItemDivider color="light">
                            <IonText color="primary">
                                <h3 className="ion-no-margin">التعليقات</h3>
                            </IonText>
                        </IonItemDivider>
                        <GetComment comment={newComment} />
                        <IonItemDivider color="light">
                            <IonText color="primary">
                                اكتب تعليقًا
                            </IonText>
                        </IonItemDivider>
                        <CreateComment sendToParent={setNewComment} />
                        </IonCol>
                    </IonRow>
                </IonGrid>

            </IonContent>
            </>
        }
        </IonPage>
    )
}

export default GetPost;