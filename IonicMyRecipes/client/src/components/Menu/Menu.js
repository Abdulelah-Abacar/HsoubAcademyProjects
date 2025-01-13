import { IonContent, IonHeader, IonMenu, IonTitle, IonList, IonItem, IonToolbar, IonLabel, IonIcon, IonAvatar, IonImg, IonText, IonLoading } from "@ionic/react"
import {personCircleOutline, clipboardOutline, logOutOutline} from 'ionicons/icons'
import avatar from '../../pages/assets/images/avatar.png'
import axios from '../../config/axios'
import { PROFILE_URL, API_URL } from "../../config/urls"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import { Storage } from "@capacitor/storage"
import { useHistory } from "react-router"

const Menu = () => {

    const [showLoading, setShowLoading] = useState(false)
    const [name, setName] = useState()
    const [profileImg, setProfileImg] = useState()
    const [side, setSide] = useState()

    const {jwt, setLoggedIn} = useContext(AuthContext)

    let x = window.matchMedia("(max-width: 992px)")

    useEffect(() => {
        myFunction(x)
        x.addListener(myFunction)
    }, [])

    const myFunction = (x) => {
        if(x.matches) {
            setSide("end")
        } else {
            setSide("start")
        }
    }

    const history = useHistory()

    useEffect(() => {
        getProfile()
    }, [])

    const logOut = async () => {
        await Storage.remove({key: 'accessToken'})
        setLoggedIn(false)
        history.push('/account/login')
    }

    const getProfile = async () => {
        setShowLoading(true)
        try {
            await axios.get(PROFILE_URL, {
                headers: {
                    Authorization: jwt
                }
            }).then(res => {
                console.log(res);
                setName(res.data.name)
                setProfileImg(res.data.img_uri)
                setShowLoading(false)
            })
        } catch(e) {
            console.log(e.response);
            setShowLoading(false)
        }
    }

    return (
        <IonMenu side={side} contentId="menu">
            {showLoading 
            ? 
            <IonLoading isOpen={showLoading} />
            :
            <>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>قائمة</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonAvatar className="avatar">
                    {profileImg ? 
                    <IonImg src={ API_URL + profileImg} />
                    :
                    <IonImg src={avatar} />
                    }
                </IonAvatar>
                <div className="ion-text-center ion-margin-top">
                    <IonText color="warning">
                        <h3>{name}</h3>
                    </IonText>
                </div>
                <IonList>
                    <IonItem routerLink="/my-recipe/account/profile">
                        <IonIcon color="primary" icon={personCircleOutline} />
                        <IonLabel className="ion-margin">الصفحة الشخصية</IonLabel>
                    </IonItem>
                    <IonItem routerLink="/my-recipe/my-posts">
                        <IonIcon color="primary" icon={clipboardOutline} />
                        <IonLabel className="ion-margin">منشوراتي</IonLabel>
                    </IonItem>
                    <IonItem onClick={() => {logOut()}}>
                        <IonIcon color="primary" icon={logOutOutline} />
                        <IonLabel className="ion-margin">تسجيل الخروج</IonLabel>
                    </IonItem>
                </IonList>
            </IonContent>
            </>
            }
        </IonMenu>
    )
}

export default Menu;