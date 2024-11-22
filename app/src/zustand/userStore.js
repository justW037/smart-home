// store.js
import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { persist } from 'zustand/middleware'
import { API_URL } from '@env'
import axios from 'axios'

const useUserStore = create(
  persist(
    set => ({
      user: null,
      isLoggedIn: false,
      token: null,
      tokenType: null,
      loading: false,
      setToken: (token, tokenType) => set({ token, tokenType }),
      register: async (username, email, password, retypePassword, roleId) => {
        try {
          const response = await axios.post(API_URL + `/users/register`, {
            username,
            email,
            password,
            retype_password: retypePassword,
            role_id: roleId
          })
          if (response.status === 200) {
            console.error('Abc')
          } else {
            console.error('Xyz')
          }
        } catch (error) {
          console.error('Error during user registration:', error)
          throw error
        }
      },
      login: async (email, password) => {
        try {
          console.log(API_URL)
          const response = await axios.post(API_URL + `/users/login`, {
            email,
            password
          })
          const {
            token,
            refresh_token: refreshToken,
            token_type: tokenType
          } = response.data

          await AsyncStorage.setItem(
            'user-storage',
            JSON.stringify({
              token,
              refreshToken,
              tokenType,
              isLoggedIn: true
            })
          )
          set({
            token,
            refreshToken,
            tokenType,
            isLoggedIn: true
          })
        } catch (error) {
          console.error('Login failed 123:', error)
        }
      },
      logout: async () => {
        await AsyncStorage.removeItem('user-storage')
        set({
          user: null,
          token: null,
          refreshToken: null,
          tokenType: null,
          isLoggedIn: false,
          loading: false
        })
      },
      setUser: user => set({ user }),
      fetchUser: async () => {
        set({ loading: true })
        const { token, tokenType, setUser } = useUserStore.getState()
        try {
          const response = await axios.get(API_URL + `/users/details`, {
            headers: { Authorization: `${tokenType} ${token}` }
          })
          if (response.status === 200) {
            const userDetails = response.data
            setUser(userDetails)
          } else {
            console.error('Failed to fetch user data:', response.status)
          }
        } catch (error) {
          console.error('Error fetching user data:', error)
        } finally {
          set({ loading: false }) 
        }
      }
    }),
    {
      name: 'user-storage',
      storage: {
        getItem: async name => {
          const item = await AsyncStorage.getItem(name)
          return item ? JSON.parse(item) : null
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value))
        },
        removeItem: async name => {
          await AsyncStorage.removeItem(name)
        }
      }
    }
  )
)

export default useUserStore
