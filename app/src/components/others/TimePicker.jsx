import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import tw from 'twrnc'
import ScrollPicker from 'react-native-wheel-scrollview-picker'
import { useTranslation } from 'react-i18next'

export default TimePicker = ({
  selectedHour,
  selectedMinute,
  onHourChange,
  onMinuteChange,
  isDarkTheme
}) => {
  const { t } = useTranslation()
  return (
    <View style={tw`flex-row justify-center px-10`}>
      <View style={tw`flex-1 flex-row items-center`}>
        <ScrollPicker
          dataSource={[...Array(24).keys()].map(num =>
            num < 10 ? `0${num}` : `${num}`
          )}
          selectedIndex={parseInt(selectedHour)}
          renderItem={(data, index, isSelected) => {
            return (
              <Text
                style={tw`pl-8  ${
                  isSelected
                    ? isDarkTheme
                      ? 'text-lg text-white'
                      : 'text-lg '
                    : 'text-xs text-gray-400'
                }`}
              >
                {data}
              </Text>
            )
          }}
          onValueChange={onHourChange}
          wrapperHeight={100}
          wrapperBackground={isDarkTheme ? '#171717' : '#ffffff'}
          wrapperWidth={20}
          itemHeight={30}
          highlightColor={'#d8d8d8'}
          highlightBorderWidth={0}
        />
        <Text
          style={tw`${
            isDarkTheme ? 'text-white' : 'text-black'
          } flex-1 text-xs`}
        >
          {t('timePicker.hour')}
        </Text>
      </View>
      <View style={tw`flex-1 flex-row items-center`}>
        <ScrollPicker
          dataSource={[...Array(60).keys()].map(num =>
            num < 10 ? `0${num}` : `${num}`
          )}
          selectedIndex={parseInt(selectedMinute)}
          renderItem={(data, index, isSelected) => {
            return (
              <Text
                style={tw` ${
                  isSelected
                    ? isDarkTheme
                      ? 'text-lg text-white'
                      : 'text-lg '
                    : 'text-xs text-gray-400'
                }`}
              >
                {data}
              </Text>
            )
          }}
          onValueChange={onMinuteChange}
          wrapperHeight={100}
          wrapperBackground={isDarkTheme ? '#171717' : '#ffffff'}
          wrapperWidth={2}
          itemHeight={30}
          highlightBorderWidth={0}
        />
        <Text
          style={tw`${
            isDarkTheme ? 'text-white' : 'text-black'
          } py-2 pr-14 text-xs`}
        >
          {t('timePicker.minute')}
        </Text>
      </View>
    </View>
  )
}
