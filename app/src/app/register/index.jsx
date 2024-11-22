import { Text, View, TextInput, TouchableOpacity, Alert } from 'react-native'
import tw from 'twrnc'
import React, { useState } from 'react'
import useUserStore from '../../zustand/userStore'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../../hooks/useTheme'

export default function Register({ navigation }) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [retypePassword, setRetypePassword] = useState('')
  const [roleId, setRoleId] = useState('1')
  const [focusedInput, setFocusedInput] = useState(null)

  const { register } = useUserStore(state => ({
    register: state.register
  }))

  const handleFocus = inputName => {
    setFocusedInput(inputName)
  }

  const handleBlur = () => {
    setFocusedInput(null)
  }

  const { t } = useTranslation()
  const { theme } = useTheme()
  const isDarkTheme = theme === 'dark'

  const handleRegister = async () => {
    if (password !== retypePassword) {
      Alert.alert(t('register.error'), t('register.passwordNotMatch'))
      return
    }
    if (username && email && password && retypePassword) {
      try {
        await register(username, email, password, retypePassword, roleId)
        Alert.alert(t('register.success'), t('register.successRegistration'))
        navigation.replace('Login')
      } catch (error) {
        Alert.alert(t('register.error'), t('register.registrationFail'))
      }
    } else {
      Alert.alert(t('register.error'), t('register.fillInput'))
    }
  }

  return (
    <View
      style={tw`flex-1 justify-center items-center ${
        isDarkTheme ? 'bg-neutral-900' : 'bg-white '
      } px-14`}
    >
      <Text
        style={tw`text-2xl font-bold mb-4 text-center ${
          isDarkTheme && 'text-white'
        }`}
      >
        {t('register.createAccount')}
      </Text>
      <View style={tw`w-full max-w-md`}>
        <TextInput
          style={[
            tw`border border-gray-300 rounded-2xl py-3 px-4 mb-4 w-full`,
            focusedInput === 'username'
              ? isDarkTheme
                ? tw`border-white`
                : tw`border-black`
              : isDarkTheme
              ? tw`border-gray-500`
              : tw`border-gray-300`,
            isDarkTheme ? tw`bg-zinc-800 text-white` : 'bg-white '
          ]}
          placeholderTextColor={isDarkTheme ? '#a1a1aa' : '#6b7280'}
          placeholder={t('register.usernamePlaceHolder')}
          value={username}
          onChangeText={setUsername}
          onFocus={() => handleFocus('username')}
          onBlur={handleBlur}
        />
        <TextInput
          style={[
            tw`border border-gray-300 rounded-2xl py-3 px-4 mb-4 w-full`,
            focusedInput === 'email'
              ? isDarkTheme
                ? tw`border-white`
                : tw`border-black`
              : isDarkTheme
              ? tw`border-gray-500`
              : tw`border-gray-300`,
            isDarkTheme ? tw`bg-zinc-800 text-white` : 'bg-white '
          ]}
          placeholderTextColor={isDarkTheme ? '#a1a1aa' : '#6b7280'}
          placeholder={t('login.emailPlaceHolder')}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          onFocus={() => handleFocus('email')}
          onBlur={handleBlur}
        />
        <TextInput
          style={[
            tw`border border-gray-300 rounded-2xl py-3 px-4 mb-4 w-full`,
            focusedInput === 'password'
              ? isDarkTheme
                ? tw`border-white`
                : tw`border-black`
              : isDarkTheme
              ? tw`border-gray-500`
              : tw`border-gray-300`,
            isDarkTheme ? tw`bg-zinc-800 text-white` : 'bg-white '
          ]}
          placeholderTextColor={isDarkTheme ? '#a1a1aa' : '#6b7280'}
          placeholder={t('login.passwordPlaceHolder')}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          onFocus={() => handleFocus('password')}
          onBlur={handleBlur}
        />
        <TextInput
          style={[
            tw`border border-gray-300 rounded-2xl py-3 px-4 mb-4 w-full`,
            focusedInput === 'retypePassword'
              ? isDarkTheme
                ? tw`border-white`
                : tw`border-black`
              : isDarkTheme
              ? tw`border-gray-500`
              : tw`border-gray-300`,
            isDarkTheme ? tw`bg-zinc-800 text-white` : 'bg-white '
          ]}
          placeholderTextColor={isDarkTheme ? '#a1a1aa' : '#6b7280'}
          placeholder={t('register.retypePassword')}
          secureTextEntry
          value={retypePassword}
          onChangeText={setRetypePassword}
          onFocus={() => handleFocus('retypePassword')}
          onBlur={handleBlur}
        />
        <TouchableOpacity
          style={tw`${
            isDarkTheme ? 'bg-white' : 'bg-black'
          } rounded-lg py-3 px-4 mb-4 w-full`}
          onPress={handleRegister}
        >
          <Text
            style={tw`${
              isDarkTheme ? 'text-black' : 'text-white'
            } font-bold text-center`}
          >
            {t('register.registerTitle')}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={tw`flex-row justify-center items-center mt-4`}>
        <Text style={tw`text-gray-500 mr-2`}>
          {t('register.alreadyHaveAccount')}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={tw`text-blue-500 font-bold`}>
            {t('login.loginTitle')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
