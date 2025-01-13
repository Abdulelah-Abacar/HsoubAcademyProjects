import { IonButtons, IonIcon, IonItem, IonTextarea, IonToast } from "@ionic/react";
import { send } from "ionicons/icons";
import { useContext, useState } from "react";
import axios from '../../config/axios'
import { GET_ALL_POSTS } from "../../config/urls";
import { AuthContext } from "../../context/AuthContext";



const CreateComment = (props) => {

    const [newComment, setNewComment] = useState()
    const [showToast, setShowToast] = useState(false)

    const {jwt} = useContext(AuthContext)

    const postId = window.location.pathname.split("/")[3]

    const onSubmit = async () => {
        const comment = {
            "text": newComment
        }
        try {
            await axios.post(GET_ALL_POSTS + '/' + postId + '/create-comment', comment, {
                headers: {
                    Authorization: jwt
                }
            }).then(res => {
                console.log(res);
            })
        } catch(e) {
            console.log(e.response);
        }
    }

    const validation = () => {
        if(newComment) {
            onSubmit()
            setNewComment("")
            props.sendToParent(newComment)
        } else {
            setShowToast(true)
        }
    }


    return (
        <>
        <IonItem className="ion-margin-bottom">
            <IonTextarea 
                className="ion-margin" 
                value={newComment} 
                onIonChange={(e) => {setNewComment(e.target.value)}} 
            />
            <IonButtons onClick={() => validation()}>
                <IonIcon icon={send} className="send-icon" color="light" />
            </IonButtons>
        </IonItem>
        <IonToast 
            isOpen={showToast}
            onDidDismiss={() => {setShowToast(false)}}
            message="يجب عليك إدخال تعليق"
            duration={1500}
            color="danger"
        />
        </>
    )
}

export default CreateComment;