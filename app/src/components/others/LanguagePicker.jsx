import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next'
import AsyncStorage from '@react-native-async-storage/async-storage'
import tw from 'twrnc'
import Modal from 'react-native-modal'
import { Icon } from 'react-native-elements'

const LanguagePicker = ({ isVisible, toggleModal, isDarkTheme }) => {
  const { i18n } = useTranslation()
  const [selectedLanguage, setSelectedLanguage] = useState(null)

  const languages = [
    { label: 'English', value: 'en' },
    { label: 'Tiếng Việt', value: 'vi' },
    { label: '日本語', value: 'ja' },
    { label: '简体中文', value: 'zh' },
    { label: '繁體中文', value: 'tw' },
    { label: '한국어', value: 'ko' }
  ]

  const handleLanguageChange = async value => {
    setSelectedLanguage(value)
    i18n.changeLanguage(value)
    await AsyncStorage.setItem('language', value)
    toggleModal()
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={tw`${
        isDarkTheme ? 'border-gray-700' : 'border-gray-300'
      } p-2 px-3 border-b  flex-row items-center justify-between`}
      onPress={() => handleLanguageChange(item.value)}
    >
      <Text style={tw`${isDarkTheme ? 'text-white' : 'text-black'}  text-lg`}>
        {item.label}
      </Text>
      {selectedLanguage === item.value && (
        <View
          style={tw`w-2 h-2 rounded-full ${
            isDarkTheme ? 'bg-white' : 'bg-black '
          }`}
        ></View>
      )}
    </TouchableOpacity>
  )

  const { t } = useTranslation()

  useEffect(() => {
    const loadLanguage = async () => {
      const savedLanguage = await AsyncStorage.getItem('language')
      if (savedLanguage) {
        setSelectedLanguage(savedLanguage)
        i18n.changeLanguage(savedLanguage)
      }
    }

    loadLanguage()
  }, [])

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
        } p-4 rounded-t-3xl max-h-80`}
      >
        <View
          style={tw`${
            isDarkTheme ? 'bg-white' : 'bg-black'
          } h-1 w-10 rounded-lg self-center`}
        ></View>
        <View style={tw`flex-row justify-between`}>
          <Text
            style={tw`${
              isDarkTheme ? 'text-white' : 'text-black'
            } text-xl font-semibold mb-4`}
          >
            {t('selectLanguage')}
          </Text>
          <TouchableOpacity onPress={toggleModal}>
            <Icon
              name="close"
              type="material"
              color={isDarkTheme ? '#ffffff' : '#000000'}
              size={26}
              style={tw`pt-1`}
            />
          </TouchableOpacity>
        </View>
        <FlatList
          data={languages}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.value}
          style={tw`max-h-60 `}
        />
      </View>
    </Modal>
  )
}

export default LanguagePicker
