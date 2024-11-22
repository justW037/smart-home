import { Text, View, StatusBar } from 'react-native'
import tw from 'twrnc'
import RoomListComponent from '../../components/room/RoomList'
import HeaderComponent from '../../components/others/Header'
import DeviceListComponent from '../../components/device/DeviceList'
import { useEffect } from 'react'
import useUserStore from '../../zustand/userStore'
import useHomeStore from '../../zustand/homeStore'
import GetStartedNewHome from '../../components/home/GetStartedNewHome'
import useRoomStore from '../../zustand/roomStore'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../../hooks/useTheme'
import { registerForPushNotificationsAsync } from '../../utils/pushNotifications'
import { useState } from 'react'
'react-native-android-widget'

export default function Home({ navigation }) {
  const { user, userLoading } = useUserStore(state => ({
    user: state.user,
    userLoading: state.loading
  }))
  const { homes, message, homeLoading, registerNotificationToken } =
    useHomeStore(state => ({
      homes: state.homes,
      message: state.message,
      homeLoading: state.loading,
      registerNotificationToken: state.registerNotificationToken
    }))
  const { fetchRooms } = useRoomStore(state => ({
    fetchRooms: state.fetchRooms
  }))

  const firstHomeName = homes?.length > 0 ? homes[0].home_name : null
  const firstHomeId = homes?.length > 0 ? homes[0].id : null
  const [expoPushToken, setExpoPushToken] = useState('')
  registerForPushNotificationsAsync().then(token =>
    setExpoPushToken(token ?? '')
  )
  const finalToken = expoPushToken.match(/\[(.*?)\]/)
  useEffect(() => {
    if (firstHomeId) {
      fetchRooms(firstHomeId)
    }
  }, [firstHomeId, fetchRooms])

  useEffect(() => {
    if (firstHomeId && finalToken) {
      registerNotificationToken(firstHomeId, finalToken[1])
    }
  }, [firstHomeId, registerNotificationToken])
  // if (loading) {
  //   return (
  //     <View style={tw`flex-1 justify-center items-center`}>
  //       <ActivityIndicator size="large" color="#ffffff" />
  //     </View>
  //   )
  // }

  const { t } = useTranslation()
  const { theme } = useTheme()
  const isDarkTheme = theme === 'dark'

  if (homes?.length === 0 && message.includes('successfully')) {
    return (
      <View style={tw`flex-1 bg-white`}>
        <GetStartedNewHome isDarkTheme={isDarkTheme} />
      </View>
    )
  }
  return (
    <>
      <StatusBar
        barStyle={isDarkTheme ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkTheme ? '#000000' : '#ffffff'}
      />
      <View
        style={tw`relative flex-1 px-5 ${
          isDarkTheme ? 'bg-neutral-900' : 'bg-white'
        }`}
      >
        <HeaderComponent isDarkTheme={isDarkTheme} navigation={navigation} />
        <Text
          style={tw`text-4xl font-bold mt-5 mb-1 ${
            isDarkTheme ? 'text-white' : 'text-black'
          }`}
        >
          {t('home.hello')}{' '}
          {!userLoading ? (
            user?.username
          ) : (
            <View
              style={tw`w-14 h-10 ${
                isDarkTheme ? 'bg-zinc-800' : 'bg-zinc-100'
              } rounded-lg`}
            ></View>
          )}
        </Text>
        <Text style={tw`text-gray-500`}>
          {t('home.welcome')}{' '}
          {!homeLoading ? (
            firstHomeName
          ) : (
            <View
              style={tw`w-8 h-3 ${
                isDarkTheme ? 'bg-zinc-800' : 'bg-zinc-100'
              } rounded-lg`}
            ></View>
          )}{' '}
          👋 hello
        </Text>
        <RoomListComponent />
        <DeviceListComponent navigation={navigation} />
      </View>
    </>
  )
}
