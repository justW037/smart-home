import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native'
import tw from 'twrnc'
import React, { useState } from 'react'
import useUserStore from '../../zustand/userStore'
import useHomeStore from '../../zustand/homeStore'
import useInputFocus from '../../hooks/useInputFocus'
import useTypeStore from '../../zustand/typeStore'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../../hooks/useTheme'

export default function Login({ navigation }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { focusedInput, handleFocus, handleBlur } = useInputFocus()
  // const [loading, setLoading] = useState(false)
  const { login, fetchUser } = useUserStore(state => ({
    login: state.login,
    fetchUser: state.fetchUser
  }))
  const { fetchHomes } = useHomeStore(state => ({
    fetchHomes: state.fetchHomes
  }))

  const { fetchTypes } = useTypeStore(state => ({
    fetchTypes: state.fetchTypes
  }))

  const { t } = useTranslation()
  const { theme } = useTheme()
  const isDarkTheme = theme === 'dark'

  const handleLogin = async () => {
    if (email && password) {
      try {
        // setLoading(true)
        await login(email, password)

        const currentIsLoggedIn = useUserStore.getState().isLoggedIn
        if (currentIsLoggedIn) {
          await Promise.all([fetchUser(), fetchHomes(), fetchTypes()])
        } else {
          // setLoading(false)
          alert(t('login.emailAndPasswordCheck'))
        }
      } catch (error) {
        // setLoading(false)
        alert(t('login.loginTryAgain'))
      }
    } else {
      alert(t('login.emailPasswordEnter'))
    }
  }

  return (
    <>
      {1 == 0 ? (
        <ActivityIndicator
          size="large"
          color="#000000"
          style={tw`flex-1 justify-center items-center bg-white px-14`}
        />
      ) : (
        <View
          style={tw`flex-1 justify-center items-center px-14 ${
            isDarkTheme ? 'bg-neutral-900' : 'bg-white '
          }`}
        >
          <Text
            style={tw`text-2xl font-bold mb-4 text-center ${
              isDarkTheme && 'text-white'
            }`}
          >
            {t('login.loginTitle')}
          </Text>
          <View style={tw`w-full max-w-md`}>
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
              onFocus={() => handleFocus('email')}
              onBlur={handleBlur}
              value={email}
              onChangeText={setEmail}
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
              onFocus={() => handleFocus('password')}
              onBlur={handleBlur}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              style={tw`${
                isDarkTheme ? 'bg-white' : 'bg-black'
              } rounded-3xl py-3 px-4 mb-4 w-full`}
              onPress={handleLogin}
            >
              <Text
                style={tw`${
                  isDarkTheme ? 'text-black' : 'text-white'
                } font-bold text-center`}
              >
                {t('login.loginTitle')}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={tw`flex-row justify-center items-center mt-4`}>
            <Text style={tw`text-gray-500 mr-2`}>
              {t('login.doNotHaveAccount')}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={tw`text-blue-500 font-bold`}>
                {t('register.registerTitle')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  )
}
