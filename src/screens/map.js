import React, { useEffect, useState, useRef } from 'react'
import { StyleSheet, View, Text, Image, Button, Alert } from 'react-native'
import MapView, { Geojson, Marker } from 'react-native-maps'
import Geolocation from 'react-native-geolocation-service'
import { updatePosition } from '../firebase/firebaseFuncs'
import functions from '@react-native-firebase/functions'

const Map = ({ navigation }) => {
    const watchId = useRef(null)

    const [location, setLocation] = useState({
        latitude: 53.3498,
        longitude: -6.2603,
    })
    const [closeBins, setCloseBins] = useState({})
    const [initialOpen, setInitialOpen] = useState(true)

    const getLocation = (watchId) => {
        Geolocation.watchPosition((position) => {
            setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            })
        }),
        (error) => {

        },
        {
            accuracy: {
                android: 'high',
            },
            enableHighAccuracy: true,
            interval: 5000,
            fastestInterval: 5000,
        }
        updatePosition(navigation.getParam('username'), location)
    }
    
    const updateDB = async (username, position) => {
        await updatePosition(username, position)
    }

    const getBinInfo = (data) => {
        Alert.alert('Bin Information', `Bin ID: ${data.feature.properties.Bin_ID}\nType of Bin: ${data.feature.properties.Bin_Type}\nBin Location: ${data.feature.properties.Electoral_Area}`)
    }

    const checkBins = async () => {
        functions().httpsCallable('getClosestBins')( {username: navigation.getParam('username')} )
            .then(response => {
                setCloseBins({ type: 'FeatureCollection', features: response.data})
                setInitialOpen(false)
            })
            console.log(closeBins)
    }

    const locationClick =  async () => {
        setInitialOpen(true)
        Geolocation.getCurrentPosition((position)=> {
            setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            })
        })
        await updatePosition(navigation.getParam('username'), location)
        await checkBins()
    }

    useEffect(() => {
        getLocation(watchId)
    })

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                region={{
                    latitude: location.latitude,
                    longitude: location.longitude, 
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.0121,
                }}
            >
                <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude,}}>
                    <Image source={require('../assets/gpsMarker.png')} style={styles.gpsMarker}/>
                </Marker>
                {!initialOpen && 
                    <Geojson 
                    geojson={closeBins}
                    onPress={(data) => {
                        getBinInfo(data)
                    }}
                    markerComponent={<Image source={require('../assets/bin.png')} style={styles.binMarker}/>}
                />}
            </MapView>
            <Text>Logged in as: {navigation.getParam('username')}</Text>
            <View style={styles.btnView}>
                <Button onPress={checkBins} title='Get Bins   '/>
                <Button onPress={locationClick} title='Location ' color='#21de5c'/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      height: 600,
      width: 400,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
    gpsMarker: {
        height: 20,
        width: 20,
    },
    binMarker: {
        height: 30,
        width: 30,
    },
    btnView: {
        flexDirection: 'row',
    },
    binButton: {
        position: 'absolute',
        alignItems: 'stretch'
    },
    locationButton: {
        position: 'absolute',
        alignItems: 'stretch',
        borderRadius: 30,

    }
   });

export default Map