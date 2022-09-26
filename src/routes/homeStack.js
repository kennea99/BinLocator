import { createStackNavigator } from 'react-navigation-stack'
import { createAppContainer } from 'react-navigation'
import Login from '../screens/login'
import Map from '../screens/map'

const screens = {
    loginScreen: {
        screen: Login,
        navigationOptions: {
            title: 'Bin Locator Login',
            headerStyle: {
                backgroundColor: '#dcfae5',
            },
            headerTintColor: '#343837',
        }
    },
    mapScreen: {
        screen: Map,
        navigationOptions: {
            title: 'Closest Bins To',
            headerStyle: {
                backgroundColor: '#dcfae5',
            },
            headerTintColor: '#343837',
        }
    },
}

const HomeStack = createStackNavigator(screens)

export default createAppContainer(HomeStack)