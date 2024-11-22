import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import tw from 'twrnc'
import { Icon } from 'react-native-elements'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../../hooks/useTheme'

export default function RoomLoading() {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const isDarkTheme = theme === 'dark'
  return (
    <View style={tw`mt-4`}>
      <View style={tw`flex-row justify-between`}>
        <Text
          style={tw`${
            isDarkTheme ? 'text-white' : 'text-black'
          } text-2xl font-bold mb-2 mr-2`}
        >
          {t('roomList.rooms')}
        </Text>
        <Icon
          name="more-vert"
          type="material"
          color={isDarkTheme ? '#ffffff' : '#000000'}
          size={26}
          style={tw`pt-1`}
        />
      </View>
      <View style={tw`mt-2 flex-row`}>
        {Array.from({ length: 6 }).map((_, index) => (
          <View key={index} style={tw`items-center mr-4`}>
            <View
              style={tw`${
                isDarkTheme
                  ? 'bg-zinc-800 border-zinc-800'
                  : 'bg-zinc-100 border-zinc-100 '
              } h-16 w-16  border rounded-lg`}
            ></View>
            <View
              style={tw`mt-2 mb-4 w-14 h-4 ${
                isDarkTheme ? 'bg-zinc-800 ' : 'bg-zinc-100 '
              }  rounded-lg`}
            ></View>
          </View>
        ))}
      </View>
    </View>
  )
}
