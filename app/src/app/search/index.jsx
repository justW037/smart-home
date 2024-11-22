import tw from 'twrnc'
import { Icon } from 'react-native-elements'
import { useState, useEffect } from 'react'
import Modal from 'react-native-modal'
import { View, TouchableOpacity, TextInput, StatusBar, FlatList, Text } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../../hooks/useTheme'
import useDebounce from '../../hooks/useDebounce'
import useHomeStore from '../../zustand/homeStore'
import useTypeStore from '../../zustand/typeStore'
import useDeviceStore from '../../zustand/deviceStore'
import useRoomStore from '../../zustand/roomStore'
import { getDataForType, getDataForRoomType }  from '../../utils/typeHelpers'

export default function SearchDevice({ navigation }) {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const isDarkTheme = theme === 'dark'
  const homes = useHomeStore(state => state.homes)
  const typesList = useTypeStore(state => state.types)
  const firstHomeId = homes?.length > 0 ? homes[0].id : null
  const rooms = useRoomStore(state => state.rooms)
  const { searchDevice, getDeviceById, setDevice, fetchDeviceById } = useDeviceStore(state => ({
    searchDevice: state.searchDevice,
    getDeviceById: state.getDeviceById,
    setDevice: state.setDevice,
    fetchDeviceById: state.fetchDeviceById
  }))
  const [deviceName, setDeviceName] = useState('')
  const debouncedDeviceName = useDebounce(deviceName, 500)
  const [searchResult, setSearchResult] = useState([])

  useEffect(() => {
    const fetchDevices = async () => {
      if (debouncedDeviceName && firstHomeId) {
        try {
            const result = await searchDevice(
            debouncedDeviceName,
            firstHomeId
          )
            setSearchResult(result)
        } catch (error) {
          console.error('Error fetching devices:', error)
        }
      }
    }
    fetchDevices()
  }, [debouncedDeviceName, firstHomeId])

  const handleGetDeviceById = async (deviceId) => {
    // const existedDevice = getDeviceById(deviceId)
    // if (existedDevice) {
    //   await setDevice(existedDevice)
    //   // navigation.navigate('Device',  {
    //   //   sendMessage
    //   // })
    // }
    //  else {
    //   const { device } = await fetchDeviceById(deviceId)
    //   console.log(device)
    //   await setDevice(device)
    // }
    
  }

  const ResultDeviceSearchItem = ({ item }) => {
    const roomTypeData = getDataForRoomType(item.room_name)
    const namePart = item.room_name
    .slice(roomTypeData.name.length)
    .trim()
    const deviceType = getDataForType(item.type_name)
    return( 
        <TouchableOpacity style={tw`flex-row py-2 items-center `} onPress={() => handleGetDeviceById(item.id)}>
           <Icon
            name={deviceType.iconName}
            type="material"
            color={isDarkTheme ? '#ffffff' : '#000000'}
            size={26}
          />
          <View style={tw`flex-col ml-2`}>
            <Text style={tw`${isDarkTheme ? 'text-white' : 'text-black'} text-lg font-semibold`}>{item.device_name}</Text>
            <Text style={tw`${isDarkTheme ? 'text-zinc-400' : 'text-gray-500'} text-xs`}>{t(deviceType.tName)} / {t(roomTypeData.tName)+ ' '+namePart}</Text>
        </View>
        </TouchableOpacity>
    )
  }

  return (
    <>
      <StatusBar
        barStyle={isDarkTheme ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkTheme ? '#000000' : '#ffffff'}
      />
      <View
        style={tw`${
          isDarkTheme ? 'bg-neutral-900' : 'bg-white '
        } flex-col flex-1 px-5 justify-start `}
      >
        <View
          style={tw`flex-row justify-between items-center pt-2 pb-3 border-b   ${
            isDarkTheme ? 'bg-neutral-900 border-b-zinc-800' : 'bg-white border-b-zinc-200'
          }`}
        >
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Icon
              name="left"
              type="antdesign"
              color={isDarkTheme ? '#ffffff' : '#000000'}
              size={22}
            />
          </TouchableOpacity>
          <View style={[tw`flex-1 px-3 text-center `]}>
            <TextInput
              placeholder={t('findDevice')}
              value={deviceName}
              onChangeText={setDeviceName}
              style={[tw`${isDarkTheme ? 'text-white' : 'text-black'} text-base`]}
              placeholderTextColor={isDarkTheme ? '#a1a1aa' : '#6b7280'}
            />
          </View>
          <TouchableOpacity>
            <Icon
              name="close"
              type="material"
              color={isDarkTheme ? '#ffffff' : '#000000'}
              size={22}
            />
          </TouchableOpacity>
        </View>
        <FlatList
          data={searchResult}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <ResultDeviceSearchItem item={item} />}
          showsVerticalScrollIndicator={false}
            // ItemSeparatorComponent={() => <View style={tw`w-full h-1 bg-zinc-200`} />}
        />
      </View>
    </>
  )
}
