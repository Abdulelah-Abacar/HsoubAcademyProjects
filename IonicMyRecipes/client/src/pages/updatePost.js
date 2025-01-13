import { IonAlert, IonButton, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonItem, IonLabel, IonList, IonLoading, IonPage, IonRow, IonTextarea, IonTitle, IonToast, IonToolbar } from "@ionic/react"
import { useContext, useEffect, useState } from "react";
import Header from "../components/Header/Header";
import TextEditor from "../components/TextEditor/TextEditor";
import axios from '../config/axios'
import { GET_MY_POSTS } from "../config/urls";
import { AuthContext } from "../context/AuthContext";
import {EditorState, convertFromRaw} from 'draft-js'


const UpdatePost = () => {

    const [showLoading, setShowLoading] = useState(false)
    const [title, setTitle] = useState()
    const [contents, setContents] = useState()
    const [editor, setEditor] = useState()
    const [steps, setSteps] = useState()
    const [showAlert, setShowAlert] = useState(false)
    const [showToast, setShowToast] = useState(false)

    const {jwt} = useContext(AuthContext);
    

    const postId  = window.location.pathname.split('/')[3]

    useEffect(() => {
        getPost()
    }, [])

    const validator = () => {
        if(title && contents && steps) {
            setShowAlert(true);
        } else {
            setShowToast(true)
        }   
    }


    const getPost = async () => {
        setShowLoading(true)
        try {
            await axios.get(GET_MY_POSTS + '/' + postId, {
                headers: {
                    Authorization: jwt
                }
            }).then(res => {
                console.log(res);
                setTitle(res.data.title)
                setContents(res.data.contents)
                const contentState = convertFromRaw(JSON.parse(res.data.steps));
                const editorState = EditorState.createWithContent(contentState);
                setEditor(editorState);
                setShowLoading(false)
            })
        } catch(e) {
            console.log(e.response);
            setShowLoading(false)
        }
    }

    const onSubmit = async () => {
        const postForm = {
            'title': title,
            'contents': contents,
            'steps': steps
        }
        try {
            await axios.put(GET_MY_POSTS + '/' + postId + '/update', postForm, {
                headers : {
                    Authorization: jwt
                }
            }).then(res => {
                console.log(res);
            })
        } catch(e) {
            console.log(e.response);
        }
    }

    return (
        <IonPage>
            {showLoading 
            ? 
            <IonLoading isOpen={showLoading} />
            : editor &&
            <>
            <IonAlert
            isOpen={showAlert}
            onDidDismiss={() => {setShowAlert(false)}}
            header={"تنبيه!"}
            subHeader={'تعديل البيانات'}
            message={'أنت على وشك تعديل المنشور، هل تريد بالفعل تعديل المنشور'}
            buttons={[
                {
                    text: "نعم",
                    handler: () => {onSubmit()}
                },
                {
                    text: "إلغاء",
                    role: "cancel"
                }
            ]}
            />
            <Header headerTitle="تعديل المنشور" />
            <IonContent className="ion-padding">
                <IonGrid>
                    <IonRow>
                        <IonCol size-md="7" offset-md="1">
                            <IonList>
                                <IonItem>
                                    <IonLabel position="floating" color="warning">العنوان</IonLabel>
                                    <IonInput value={title} onIonChange={(e) => {setTitle(e.target.value)}} />
                                </IonItem>
                                <IonItem className="ion-margin-bottom">
                                    <IonLabel position="floating" color="warning">المكونات</IonLabel>
                                    <IonTextarea value={contents} onIonChange={(e) => {setContents(e.target.value)}} />
                                </IonItem>
                                <IonLabel className="ion-margin">خطوات التحضير</IonLabel>
                                <IonItem lines="none" className="ion-margin-top">
                                    <TextEditor editorState={editor} sendToParent={setSteps} />
                                </IonItem>
                                <div className="btn">
                                    <IonButton expand="block" onClick={validator}>تعديل المنشور</IonButton>
                                </div>
                            </IonList>
                            <IonToast
                            isOpen={showToast}
                            onDidDismiss={() => {setShowToast(false)}}
                            message="يجب عليك إدخال جميع الحقول"
                            duration={1500}
                            color="danger"
                            />
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
            </>
            }
        </IonPage>
    )
}

export default UpdatePost;