// ConfirmModal.js
import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Modal from 'react-native-modal'
import tw from 'twrnc'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../../hooks/useTheme'

export default function ConfirmModal({ isVisible, onCancel, onConfirm, message, confirmText }) {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const isDarkTheme = theme === 'dark'
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onCancel}
      style={tw`m-0 justify-center px-20`}
    >
      <View style={tw`${
          isDarkTheme ? 'bg-neutral-900' : 'bg-white'
        } p-6 rounded-lg`}>
        <Text style={tw`${
              isDarkTheme ? 'text-white' : 'text-black'
            } text-lg font-bold mb-4`}>
          {message}
        </Text>
        <View style={tw`flex-row justify-end`}>
          <TouchableOpacity onPress={onCancel} style={tw`mr-4`}>
            <Text style={tw`${
              isDarkTheme ? 'text-white' : 'text-black'
            }`}>{t('cancel')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onConfirm}>
            <Text style={tw`text-red-500`}>{confirmText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}
