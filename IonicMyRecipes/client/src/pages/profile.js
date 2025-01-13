import { 
    IonAlert,
    IonCol,
    IonContent, 
    IonGrid, 
    IonLoading, 
    IonPage, 
    IonRow
} from "@ionic/react";
import Header from "../components/Header/Header";
import './styles/profile.css';
import { useContext, useEffect, useState } from "react";
import axios from '../config/axios';
import { PROFILE_URL, PROFILE_UPDATE_URL } from "../config/urls";
import { AuthContext } from "../context/AuthContext";
import UserDetails from "../components/UserProfile/UserDetails";
import UserAvatar from "../components/UserProfile/UserAvatar";


const Profile = () => {

    const [showLoading, setShowLoading] = useState(false);
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [userImg, setUserImg] = useState()
    const [password, setPassword] = useState()
    const [showAlert, setShowAlert] = useState(false)
    const [blobUrl, setBlobUrl] = useState()

    const {jwt} = useContext(AuthContext);


    useEffect(() => {
        getProfile();
    }, [blobUrl])


    const getProfile = async () => {
        setShowLoading(true);
        try {
            await axios.get(PROFILE_URL, {
                headers: {
                    Authorization: jwt
                }
            }).then(res => {
                console.log(res.data);
                setName(res.data.name)
                setEmail(res.data.email)
                setUserImg(res.data.img_uri)
                setShowLoading(false)
            })
        } catch(e) {
            console.log(e.response)
            setShowLoading(false)
        }
    }

    const onSubmit = async () => {
        setShowLoading(true)
        const updateForm = {
            'name': name,
            'password': password
        }
        try {
            await axios.put(PROFILE_UPDATE_URL, updateForm, {
                headers: {
                    Authorization: jwt
                }
            }).then(res => {
                console.log(res);
                setShowLoading(false)
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
            :
            <>
            <IonAlert 
            isOpen={showAlert}
            header="تنبيه!"
            message="هل تريد بالفعل تعديل البيانات الشخصية؟"
            onDidDismiss={() => {setShowAlert(false)}}
            buttons={[
                {
                    text: "موافق",
                    handler: () => {onSubmit()}
                },
                {
                    text: "إلغاء",
                    role: "cancel"
                }
            ]}
            />
            <Header headerTitle="صفحة المستخدم" />
            <IonContent className="ion-padding">
                <IonGrid>
                    <IonRow>
                        <IonCol size-md="6" size-lg="4" offset-md="3" offset-lg="4">
                            <UserAvatar userImg={userImg} imgUri={setBlobUrl} />
                            <UserDetails name={name} email={email} userName={setName} password={setPassword} showAlert={setShowAlert} />
                        </IonCol>
                    </IonRow>
                </IonGrid>
              
            </IonContent>
            </>
        }

        </IonPage>
    )
}

export default Profile;