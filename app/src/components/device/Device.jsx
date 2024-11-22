import { View, Text, StyleSheet, Switch } from 'react-native'
import tw from 'twrnc'
import { Icon } from 'react-native-elements'
import { useEffect, memo , useMemo, useCallback } from 'react'
import { useToggleSwitch } from '../../hooks/useToggleSwitch'
import { useTheme } from '../../hooks/useTheme'
import useMessageStore from '../../zustand/messageStore'

 const DeviceComponent = memo(
  ({
    device,
    iconName,
    iconType,
    typename,
    deviceMessage,
    sendMessage
  }) => {
    const deviceSwitch = useToggleSwitch()
    useEffect(() => {
      if (deviceMessage?.command !== undefined) {
        if (deviceMessage.command === 'on') {
          deviceSwitch.setIsEnabled(true)
        } else {
          deviceSwitch.setIsEnabled(false)
        }
      } else {
        deviceSwitch.setIsEnabled(false)
      }
    }, [deviceMessage])
    const toggleSwitch = useCallback(() => {
      deviceSwitch.toggleSwitch()
      const command = deviceSwitch.isEnabled ? 'off' : 'on'
      const message = {
        device_id: device.id.toString(),
        port: device.port,
        command: command
      }
      sendMessage(JSON.stringify(message))
      addMessage(message)
    }, [deviceSwitch, device.id, device.port, sendMessage, addMessage])
  
    const { theme } = useTheme()
    const isDarkTheme = theme === 'dark'
  
    const { sensorData, addMessage } = useMessageStore(state => ({
      sensorData: state.sensorData,
      addMessage: state.addMessage
    }))
  
    return (
      <View
        style={[
          tw`p-4 min-h-16 gap-2`,
          deviceSwitch.isEnabled
            ? isDarkTheme
              ? tw`bg-white border border-white`
              : tw`bg-black border border-black`
            : isDarkTheme
            ? tw`bg-zinc-800 border border-zinc-800`
            : tw`bg-white border border-gray-300`,
          styles.iconContainer
        ]}
      >
        <View style={tw`flex-row justify-between `}>
          <Icon
            name={iconName}
            type={iconType}
            color={
              deviceSwitch.isEnabled
                ? isDarkTheme
                  ? '#000000'
                  : '#ffffff'
                : isDarkTheme
                ? '#ffffff'
                : '#000000'
            }
            size={26}
          />
          {typename !== 'SENSOR' ? (
            <Switch
              style={[
                tw`ml-2`,
                { transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }
              ]}
              trackColor={{
                false: '#767577',
                true: isDarkTheme ? '#555555' : '#f4f3f4'
              }}
              thumbColor={
                deviceSwitch.isEnabled
                  ? '#ffffff'
                  : isDarkTheme
                  ? '#555555'
                  : '#f4f3f4'
              }
              onValueChange={toggleSwitch}
              value={deviceSwitch.isEnabled}
            />
          ) : (
            <Text
              style={tw`${
                isDarkTheme ? 'text-gray-200' : 'text-black'
              } font-bold`}
            >
              {sensorData.temperature}°C/
              {sensorData.humidity}%
            </Text>
          )}
        </View>
        <Text
          style={[
            tw`font-medium`,
            deviceSwitch.isEnabled
              ? isDarkTheme
                ? tw`text-black`
                : tw`text-white`
              : isDarkTheme
              ? tw`text-gray-300`
              : tw`text-black`
          ]}
        >
          {device?.device_name}
        </Text>
      </View>
    )
  }
 )
export default DeviceComponent
const styles = StyleSheet.create({
  iconContainer: {
    borderRadius: 12
  }
})
