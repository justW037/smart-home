import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import tw from 'twrnc'
import { Icon } from 'react-native-elements'


export const roomType = [
  { name: 'Living room', iconName: 'chair', iconType: 'material', tName: 'roomType.livingRoom' },
  { name: 'Bedroom', iconName: 'bed', iconType: 'material' , tName: 'roomType.bedRoom'},
  { name: 'Bathroom', iconName: 'shower', iconType: 'material', tName: 'roomType.bathroom' },
  { name: 'Kitchen', iconName: 'kitchen', iconType: 'material', tName: 'roomType.kitchen' },
  { name: 'Dining', iconName: 'local-dining', iconType: 'material', tName: 'roomType.diningRoom' },
  { name: 'Room', iconName: 'cyclone', iconType: 'material', tName: 'roomType.other' }
]

export default RoomType = ({
  iconName,
  iconType,
  selected,
  onPress,
  isDarkTheme
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          tw`p-4 h-16 w-16`,
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
          size={26}
        />
      </View>
    </TouchableOpacity>
  )
}
const styles = StyleSheet.create({
  iconContainer: {
    borderRadius: 12
  }
})
