import React from 'react'
import { View, Text } from 'react-native'
import tw from 'twrnc'
import { roomType } from './RoomType'
import RoomType from './RoomType'
import { getDataForRoomType } from '../../utils/typeHelpers'
import { useTranslation } from 'react-i18next'

export default function RoomComponent({
  name,
  selected,
  onPress,
  isDarkTheme
}) {

  const roomTypeData = getDataForRoomType(name)
  const {t} = useTranslation()
  const namePart = name
  .slice(roomTypeData.name.length)
  .trim()

  return (
    <View style={tw`items-center`}>
      <RoomType
        isDarkTheme={isDarkTheme}
        iconName={roomTypeData.iconName}
        iconType={roomTypeData.iconType}
        selected={selected}
        onPress={onPress}
      />
      <Text
        style={tw`mt-2  ${
          isDarkTheme ? 'text-white' : 'text-gray-500'
        } w-18 text-center`}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {t(roomTypeData.tName)+ ' '+namePart}
      </Text>
    </View>
  )
}
