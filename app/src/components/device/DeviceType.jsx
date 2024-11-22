import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import tw from 'twrnc'
import { Icon } from 'react-native-elements'

export const deviceType = [
  { name: 'Light', iconName: 'lightbulb', iconType: 'material', tName: 'deviceType.light' },
  { name: 'Fan', iconName: 'cyclone', iconType: 'material', tName: 'deviceType.fan' },
  { name: 'Screen', iconName: 'tv', iconType: 'material', tName: 'deviceType.screen' },
  { name: 'Sensor', iconName: 'sensors', iconType: 'material', tName: 'deviceType.sensor' },
  { name: 'Camera', iconName: 'videocam', iconType: 'material', tName: 'deviceType.camera' }
]

export default DeviceType = ({
  iconName,
  iconType,
  selected,
  onPress,
  name,
  isDarkTheme
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          tw`py-2 px-4 flex-row items-center gap-2`,
          selected
            ? isDarkTheme
              ? tw`bg-white border border-white`
              : tw`bg-black border border-black`
            : isDarkTheme
            ? tw`bg-zinc-800 border border-zinc-800`
            : tw`bg-white border border-gray-300`,
          ,
          styles.iconContainer
        ]}
      >
        <Icon
          name={iconName}
          type={iconType}
          color={
            selected
              ? isDarkTheme
                ? '#000000'
                : '#ffffff'
              : isDarkTheme
              ? '#ffffff'
              : '#000000'
          }
          size={20}
        />
        <Text
          style={[
            selected
              ? isDarkTheme
                ? tw`text-black`
                : tw`text-white`
              : isDarkTheme
              ? tw`text-gray-300`
              : tw`text-black`
          ]}
        >
          {name}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  iconContainer: {
    borderRadius: 12
  }
})
