import { IonList, IonItem, IonLabel, IonInput, IonButton, IonToast } from "@ionic/react";
import { useState } from "react";

const UserDetails = (props) => {

    const [name, setName] = useState(props.name);
    const [password, setPassword] = useState();
    const [disabled, setDisabled] = useState(true)
    const [showToast, setShowToast] = useState(false);
    const [showPassToast, setShowPassToast] = useState(false);

    const handleClick = () => {
        if (name && password){
            if(password.length < 5){
                setShowPassToast(true)
            } else {
                props.userName(name)
                props.password(password)
                props.showAlert(true)
            }
        } else {
            setShowToast(true)
        }
    }


    return (
    <IonList>
        <IonItem>
            <IonLabel position="floating" color="warning">الاسم</IonLabel>
            <IonInput value={name} onIonChange={(e) => {setName(e.target.value)}} />
        </IonItem>
        <IonItem>
            <IonLabel position="floating" color="warning">البريد الإلكتروني</IonLabel>
            <IonInput value={props.email} disabled />
        </IonItem>
        <IonItem>
            <IonLabel position="floating" color="warning">كلمة المرور</IonLabel>
            <IonInput type="password" value={password} onIonChange={(e) => {
                setPassword(e.target.value)
                setDisabled(false)
                }} />
        </IonItem>
        <div className="btn">
            <IonButton onClick={() => {handleClick()}} expand="block" disabled={disabled}>تعديل البيانات</IonButton>
        </div>
        <IonToast
        isOpen={showToast}
        onDidDismiss={() => {setShowToast(false)}}
        message="يجب عليك إدخال جميع الحقول"
        duration={1500}
        color="danger"
        />
        <IonToast
        isOpen={showPassToast}
        onDidDismiss={() => {setShowPassToast(false)}}
        message="يجب عليك إدخال أكثر من خمسة محارف لكلمة المرور"
        duration={1500}
        color="danger"
        />
    </IonList>
    )
}

export default UserDetails;