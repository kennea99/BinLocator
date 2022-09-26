import React, { useState } from 'react'
import { StyleSheet, View, Text, TextInput, Button, Image, TouchableOpacity, PermissionsAndroid } from 'react-native'
import { addUser, checkUser, getBins } from '../firebase/firebaseFuncs'
import functions from '@react-native-firebase/functions'


const Login = ({ navigation }) => {
    const [username, setUsername] = useState('')

    const loginPress = async () => {
        const validLogin = await checkUser(username)
        if (validLogin === true) {
            navigation.navigate('mapScreen', {username: username})
        }
    }

    const hasLocationPermission = async () => {
        const permission = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        )

        if (permission === true)
            return true

        const checkStatus = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        )

        if (checkStatus === PermissionsAndroid.RESULTS.GRANTED)
            return true

        return false
    }

    return (
        <View style={styles.container}>
            <Image source= {require("../assets/BinLocator.png")} style={styles.title}/>
            <View style={styles.inputContainer}>
                <TextInput 
                    style={styles.input}
                    placeholder='username'
                    onChangeText={(username) => setUsername(username)}
                />
            </View>
            <TouchableOpacity style={styles.loginButton} onPress={async () => await loginPress(username)}>
                <Text style={styles.loginBtnText}>Login </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={hasLocationPermission}>
                <Text>Request Permission</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        marginBottom: 40,
    },
    inputContainer: {
        backgroundColor: '#dcfae5',
        borderRadius: 30,
        height: 45,
        width: '70%',
        marginBottom: 20,
        alignItems: 'center',
    },
    input: {
        flex: 1,
        height: 50,
        padding: 10,
        marginLeft: 20,
    },
    loginButton: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        width: '80%',
        marginTop: 40,
        height: 50,
        marginBottom: 50,
        backgroundColor: '#21de5c'
    },
    loginBtnText: {
        fontSize: 30,
        fontWeight: 'bold'
    }

})

export default Login