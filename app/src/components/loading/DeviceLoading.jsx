import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import tw from 'twrnc'
import { Icon } from 'react-native-elements'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../../hooks/useTheme'
export default function DeviceLoading() {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const isDarkTheme = theme === 'dark'
  return (
    <View style={tw`mt-4 flex-1`}>
      <View style={tw`flex-row justify-between`}>
        <Text style={tw`${
            isDarkTheme ? 'text-white' : 'text-black'
          } text-2xl font-bold mb-2 mr-2`}>
          {t('deviceList.devices')}
        </Text>
        <Icon
          name="add"
          type="material"
          color={isDarkTheme ? '#ffffff' : '#000000'}
          size={26}
          style={tw`pt-1`}
        />
      </View>
      <View style={tw`flex-row gap-2`}>
        <View style={tw`flex-col gap-2 flex-1`}>
          {Array.from({ length: 4 }).map((_, index) => (
            <View
              key={index}
              style={[tw`${
                isDarkTheme
                  ? 'bg-zinc-800'
                  : 'bg-zinc-100'
              } items-center mr-4 rounded-lg h-24 w-full`]}
            ></View>
          ))}
        </View>
        <View style={tw`flex-col gap-2 flex-1`}>
          {Array.from({ length: 4 }).map((_, index) => (
            <View
              key={index}
              style={[tw`${
                isDarkTheme
                  ? 'bg-zinc-800'
                  : 'bg-zinc-100'
              }  items-center mr-4 rounded-lg h-22 w-full`]}
            ></View>
          ))}
        </View>
      </View>
    </View>
  )
}
