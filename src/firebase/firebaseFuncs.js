
import database from '@react-native-firebase/database'
// import { getDistance, convertDegreeToRad } from '../utils/utils'


export const addUser = async (username) => {
    console.log('hello')
    const newRef = database().ref('Users').push()

    newRef.push
}

export const checkUser = async (username) => {
    let validLogin = false
    if(username === ''){
        alert('Please Enter a Username')
        return false
    }
    await database().ref(`/Users/Username/${username}`).once('value').then(snapshot =>  {
        if(snapshot.exists() === true) {
            validLogin = true
        }
        else {
            alert('User not Found, Please Try Again')
        }
    })
    return validLogin
}

export const updatePosition = async (username, position) => {
    await database().ref(`Users/Username/${username}/position`).update({
        latitude: position.latitude,
        longitude: position.longitude,
    }).then(() => console.log('Data Updated'))
}

export const getBins = async () => {
    let vals = null
    let bins = null
    await database().ref('Users/Username/Alex/position').once('value').then(snapshot => {
        vals = snapshot.val()
    })
    await database().ref('opendata/features').once('value').then(snapshot => {
        bins = snapshot.val()
    })
    const closeBins = await getDistance(bins, vals)
}
