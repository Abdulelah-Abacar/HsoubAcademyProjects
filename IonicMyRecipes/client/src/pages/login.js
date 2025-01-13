import { 
    IonAlert,
    IonButton,
    IonCol,
    IonContent, 
    IonGrid, 
    IonIcon, 
    IonInput, 
    IonItem, 
    IonLabel, 
    IonList, 
    IonLoading, 
    IonPage, 
    IonRouterLink,
    IonRow
} from "@ionic/react";
import Header from "../components/Header/Header";
import { logIn } from "ionicons/icons";
import './styles/login.css'
import { useContext, useState } from "react";
import axios from '../config/axios';
import { LOGIN_URL } from "../config/urls";
import {Storage} from '@capacitor/storage';
import { useHistory } from "react-router";
import { AuthContext } from "../context/AuthContext";


const Login = () => {

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [showLoading, setShowLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    const {setLoggedIn, setJwt} = useContext(AuthContext)

    const history = useHistory()

    const onSubmit = async () => {
        setShowLoading(true)
        const logInForm = {
            email,
            password
        }
        try {
            await axios.post(LOGIN_URL, logInForm).then(res => {
                Storage.set({
                    key: 'accessToken',
                    value: res.data.accessToken
                });
                setLoggedIn(true);
                setJwt(res.data.accessToken)
                history.push('/my-recipe/all-posts')
                setShowLoading(false)
            })
        } catch(e) {
            if (e.response.status === 401) {
                setShowAlert(true)
                setShowLoading(false)
            } else {
                console.log(e.response);
                setShowLoading(false)
            }
        }
    }

    return (
        <IonPage>
            {showLoading 
            ? 
            <IonLoading isOpen={showLoading} />
            :
            <>
            <IonAlert
            isOpen={showAlert}
            onDidDismiss={() => {setShowAlert(false)}}
            header="تنبيه!"
            message="البريد الإلكتروني أو كلمة المرور غير صحيح"
            buttons={[
                {
                    text: "موافق",
                    role: 'ok'
                }
            ]}
            />
            <Header headerTitle="تسجيل الدخول" />
            <IonContent>
                <IonGrid>
                    <IonRow>
                        <IonCol size-md="6" offset-md="3" size-lg="4" offset-lg="4">
                        <IonIcon icon={logIn} className="icon" />
                        <IonList>
                            <IonItem className="ion-margin-bottom">
                                <IonLabel position="floating" color="warning">البريد الإلكتروني</IonLabel>
                                <IonInput value={email} onIonChange={(e) => {setEmail(e.target.value)}} />
                            </IonItem>
                            <IonItem>
                                <IonLabel position="floating" color="warning">كلمة المرور</IonLabel>
                                <IonInput type="password" value={password} onIonChange={(e) => {setPassword(e.target.value)}} />
                            </IonItem>
                        </IonList>
                        <div className="ion-text-center btn">
                            <IonButton onClick={() => {onSubmit()}}>تسجيل الدخول</IonButton>
                            <IonRouterLink routerLink="/account/register" className="router-link" color="warning">تسجيل مستخدم</IonRouterLink>
                        </div>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
            </>
            }

        </IonPage>
    )
}

export default Login;