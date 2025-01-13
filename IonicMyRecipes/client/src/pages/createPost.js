import { 
    IonAlert,
    IonButton,
    IonCol,
    IonContent, 
    IonGrid, 
    IonIcon, 
    IonImg, 
    IonInput, 
    IonItem, 
    IonLabel, 
    IonList, 
    IonPage,
    IonRow,
    IonText,
    IonTextarea,
    IonToast
} from "@ionic/react"
import Header from "../components/Header/Header";
import {images} from 'ionicons/icons'
import './styles/createPost.css'
import TextEditor from "../components/TextEditor/TextEditor";
import { useContext, useEffect, useRef, useState } from "react";
import { usePhotoGallery } from "../hooks/usePhotoGallery";
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css'
import {Pagination, Navigation, Autoplay} from 'swiper'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import GetLocation from "../components/Location/GetLocation";
import axios from '../config/axios'
import { CREATE_POST } from "../config/urls";
import { AuthContext } from "../context/AuthContext";
import { useHistory } from "react-router";
import {EditorState} from 'draft-js'


const CreatePost = () => {


    const [steps, setSteps] = useState()
    const [photos, setPhotos] = useState([])
    const [country, setCountry] = useState()
    const [region, setRegion] = useState()
    const [title, setTitle] = useState()
    const [content, setContent] = useState()
    const [showImageToast, setShowImageToast] = useState(false)
    const [showContentToast, setShowContentToast] = useState(false)
    const [showAlert, setShowAlert] = useState(false)

    const {takePhoto, blobUrl} = usePhotoGallery();

    const history = useHistory()

    const {jwt} = useContext(AuthContext)

    const takePhotoRef = useRef()

    useEffect(() => {
        if(blobUrl) {
            const imgUrls = [blobUrl, ...photos]
            setPhotos(imgUrls)
        }
    }, [blobUrl])

    const swiper_settings = {
        navigation: true,
        pagination: {
            clickable: true
        },
        autoplay: {
            delay: 3000,
        }
    }

    const onSubmit = async () => {
        const postData = new FormData();
        try{
            postData.append('title', title)
            postData.append('contents', content)
            postData.append('steps', steps)
            postData.append('country', country)
            postData.append('region', region)
            for (let i = 0; i < photos.length; i++) {
                const response = await fetch(photos[i])
                const blob = await response.blob()
                postData.append('postImg', blob)
            }

            await axios.post(CREATE_POST, postData, {
                headers: {
                    Authorization: jwt
                }
            }).then(res => {
                console.log(res);
                setPhotos([])
                setTitle("")
                setContent("")
                setShowAlert(true)
            }) 
        } catch(e) {
            console.log(e.response);
        }
    }

    const validator = () => {
        if(photos.length > 0) {
            if (steps && title && content) {
                onSubmit()
            } else {
                setShowContentToast(true)
            }
        } else {
            setShowImageToast(true)
        }
    }

    return (
        <IonPage>
            <IonAlert
            isOpen={showAlert}
            onDidDismiss={() => setShowAlert(false)}
            header={'عملية النشر تمت بنجاح'}
            message={'لقد تم نشر المنشور، هل ترغب بالانتقال لصفحة المنشورات؟'}
            buttons={[
                {
                    text: 'موافق',
                    handler: () => {
                        history.push('/my-recipe/all-posts')
                    }
                }
            ]}
            />
            <Header headerTitle="نشر منشور" defaultHref="all-posts" />
            <IonContent className="ion-padding">
                <IonGrid>
                    <IonRow>
                        <IonCol size-md="7" offset-md="1">
                            <IonList>
                                <IonItem>
                                    <IonLabel position="floating" color="warning">العنوان</IonLabel>
                                    <IonInput
                                    value={title}
                                    onIonChange={(e) => {setTitle(e.target.value)}}
                                    />
                                </IonItem>
                                <IonItem className="ion-margin-bottom">
                                    <IonLabel position="floating" color="warning">المكونات</IonLabel>
                                    <IonTextarea
                                    value={content}
                                    onIonChange={(e) => {setContent(e.target.value)}}
                                    />
                                </IonItem>
                                    <IonLabel className="ion-margin">خطوات التحضير</IonLabel>
                                <IonItem className="ion-margin">
                                    <TextEditor sendToParent={setSteps} editorState={EditorState.createEmpty()} />
                                </IonItem>
                                <IonItem lines="none" ref={takePhotoRef} onClick={takePhoto}>
                                    <IonText>اضغط هنا لإضافة صورة</IonText>
                                </IonItem>
                                <IonItem className="ion-margin-bottom" lines="none">
                                    {photos.length > 0 ? 
                                    <Swiper {...swiper_settings} modules={[Pagination, Navigation, Autoplay]}>
                                        {photos.map((img, index) => {
                                            return(
                                                <SwiperSlide key={index}>
                                                    <IonImg src={img} onClick={() => takePhotoRef.current.click()} />
                                                </SwiperSlide>
                                            )
                                        })}
                                    </Swiper>
                                    :
                                    <div className="icon-container">
                                        <IonIcon 
                                        icon={images} 
                                        color="primary" 
                                        className="icon-images" 
                                        onClick={() => takePhotoRef.current.click()}
                                        />
                                    </div>
                                    }
                                </IonItem>
                                <GetLocation country={setCountry} region={setRegion} />
                                <div>
                                    <IonButton expand="block" className="ion-margin" onClick={validator}>
                                        نشر
                                    </IonButton>
                                </div>
                            </IonList>
                            <IonToast
                            isOpen={showImageToast}
                            onDidDismiss={() => setShowImageToast(false)}
                            message="يجب عليك إدخال صورة على الأقل"
                            duration={1500}
                            color="danger"
                            />
                            <IonToast
                            isOpen={showContentToast}
                            onDidDismiss={() => setShowContentToast(false)}
                            message="يجب عليك إدخال جميع الحقول"
                            duration={1500}
                            color="danger"
                            />
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    )
}

export default CreatePost;