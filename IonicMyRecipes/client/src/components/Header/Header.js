import { IonBackButton, IonButtons, IonHeader, IonMenuButton, IonTitle, IonToolbar } from "@ionic/react"


const Header = (props) => {
    return (
        <IonHeader>
            <IonToolbar color="primary">
                <IonTitle>{props.headerTitle}</IonTitle>
                <IonButtons slot="end">
                    <IonMenuButton />
                </IonButtons>
                <IonButtons slot="start">
                    <IonBackButton defaultHref={props.defaultHref} disabled={props.disabledBackButton}/>
                </IonButtons>
            </IonToolbar>
        </IonHeader>
    )
}

export default Header;