import { IonItem, IonLabel, IonInput } from "@ionic/react"
import { Geolocation } from '@capacitor/geolocation';
import { useEffect, useState } from "react";
import axios from 'axios'

const GetLocation = (props) => {

    const [region, setRegion] = useState('جاري جلب المنطقة ...')
    const [country, setCountry] = useState('جاري جلب الدولة ...')

    useEffect(() => {
        printCurrentPosition()
    }, [])

    useEffect(() => {
        handleLocation()
    }, [country, region])


    const printCurrentPosition = async () => {
        const coordinates = await Geolocation.getCurrentPosition();
        try {
            await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${coordinates.coords.latitude}&lon=${coordinates.coords.longitude}&format=json&accept-language=ar`).then(res => {
                setRegion(res.data.address.state || res.data.address.region)
                setCountry(res.data.address.country)
            })
        } catch(e) {
            console.log(e);
            setCountry("")
            setRegion("")
        }
      
        // console.log('Current position:', coordinates);
    };

    const handleLocation = () => {
        props.country(country)
        props.region(region)
    }

    return (
        <IonItem>
            <IonLabel color="warning">الدولة</IonLabel>
            <IonInput disabled value={country} />
            <IonLabel color="warning">المنطقة</IonLabel>
            <IonInput disabled value={region} />
        </IonItem>
    )
}

export default GetLocation;