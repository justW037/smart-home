import { useState, useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { View, ActivityIndicator } from 'react-native'
import Home from './src/app/home'
import Login from './src/app/login'
import Register from './src/app/register'
import useUserStore from './src/zustand/userStore'
import useHomeStore from './src/zustand/homeStore'
import useTypeStore from './src/zustand/typeStore'
import Device from './src/app/device'
import './i18n'
import { ThemeProvider } from './src/hooks/useTheme'
import SearchDevice from './src/app/search'


const Stack = createNativeStackNavigator()

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const { isLoggedIn, fetchUser, logout, setToken } = useUserStore(state => ({
    isLoggedIn: state.isLoggedIn,
    fetchUser: state.fetchUser,
    logout: state.logout,
    setToken: state.setToken
  }))

  const { fetchHomes } = useHomeStore(state => ({
    fetchHomes: state.fetchHomes
  }))

  const { fetchTypes } = useTypeStore(state => ({
    fetchTypes: state.fetchTypes
  }))

  useEffect(() => {
    const checkLoggedInStatus = async () => {
      try {
        const userStorage = await AsyncStorage.getItem('user-storage')
        if (userStorage) {
          const parsedData = JSON.parse(userStorage)
          const { token, isLoggedIn, tokenType } = parsedData.state

          if (isLoggedIn && token) {
            setToken(token, tokenType)
            await Promise.all([fetchUser(), fetchHomes(), fetchTypes()])
          } else {
            logout()
          }
        }
      } catch (error) {
        console.error('Error checking login status:', error)
        logout()
      } finally {
        setIsLoading(false)
      }
    }

    checkLoggedInStatus()
  }, [])

  // const { theme } = useTheme()
  // const isDarkTheme = theme === 'dark'

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#000000" />
      </View>
    )
  }

  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!isLoggedIn ? (
            <>
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Register" component={Register} />
            </>
          ) : (
            <>
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="Device" component={Device} />
              <Stack.Screen name="Search" component={SearchDevice} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  )
}

export default App
