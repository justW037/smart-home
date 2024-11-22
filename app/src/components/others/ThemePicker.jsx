import { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, Switch } from 'react-native'
import { useTheme } from '../../hooks/useTheme'
import tw from 'twrnc'
import Modal from 'react-native-modal'
import { useToggleSwitch } from '../../hooks/useToggleSwitch'

const ThemePicker = ({ isVisible, toggleModal }) => {
  const { theme, toggleTheme } = useTheme()
  const isDarkTheme = theme === 'dark'
  const themeSwitch = useToggleSwitch()
  return (
    <Modal
      style={tw`m-0 justify-end`}
      isVisible={isVisible}
      onBackdropPress={toggleModal}
      swipeDirection="down"
      onSwipeComplete={toggleModal}
    >
      <View
        style={tw`${
          isDarkTheme ? 'bg-neutral-900' : 'bg-white'
        } p-4 rounded-lg max-h-80 flex-col items-start`}
      >
        <Text
          style={tw`${
            isDarkTheme ? 'text-white' : 'text-black'
          } text-lg font-bold`}
        >
          Theme
        </Text>
        <Switch
          style={[tw``, { transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }]}
          trackColor={{
            false: '#767577',
            true: isDarkTheme ? '#555555' : '#f4f3f4'
          }}
          thumbColor={
            themeSwitch.isEnabled
              ? '#ffffff'
              : isDarkTheme
              ? '#ffffff'
              : '#f4f3f4'
          }
          onValueChange={toggleTheme}
          value={isDarkTheme}
        />
      </View>
    </Modal>
  )
}

export default ThemePicker
