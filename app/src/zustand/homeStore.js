import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { persist } from 'zustand/middleware'
import { API_URL } from '@env'
import axios from 'axios'
import useUserStore from './userStore'

const useHomeStore = create(set => ({
  homes: [],
  message: '',
  totalPage: '',
  loading: false,
  fetchHomes: async () => {
    const { token, tokenType } = useUserStore.getState()
    set({ loading: true })
    try {
      console.log(API_URL)
      const response = await axios.get(API_URL + `/homes`, {
        headers: {
          Authorization: `${tokenType} ${token}`
        }
      })
  
      if (response.status === 200) {
        const { homes, message, total_page: totalPage } = response.data
        set({ homes, message, totalPage })
        console.log(homes)
      } else {
        console.error('Failed to fetch homes:', response.status)
      }
    } catch (error) {
      console.error('Error fetching homes:', error)
    } finally {
      set({ loading: false })
    }
  },
  addHome: async (home_name, u_id) => {
    const { token, tokenType } = useUserStore.getState()
    try {
      const response = await axios.post(
        `${API_URL}/homes/add-home`,
        { home_name, u_id },
        {
          headers: {
            Authorization: `${tokenType} ${token}`
          }
        }
      )
      if (response.status === 200) {
        set(state => ({
          homes: [...state.homes, response.data.home]
        }))
      } else {
        console.error('Failed to add new home:', response.status)
      }
    } catch (error) {
      console.error('Error adding new home:', error)
    }
  },
  updateHome: async (home_name, u_id, id) => {
    const { token, tokenType } = useUserStore.getState()
    try {
      const response = await axios.put(
        `${API_URL}/homes/update-home`,
        { home_name, u_id, id },
        {
          headers: {
            Authorization: `${tokenType} ${token}`
          }
        }
      )
      if (response.status === 200) {
        set(state => ({
          homes: state.homes.map(home =>
            home.id === id ? { ...home, ...response.data.home } : home
          )
        }))
      } else {
        console.error('Failed to update home:', response.status)
      }
    } catch (error) {
      console.error('Error updating home:', error)
    }
  },
  resetHomes: () => {
    set({ homes: [], message: '', totalPage: '', loading: false })
  },
  registerNotificationToken: async (home_id, notification_token) => {
    const { token, tokenType } = useUserStore.getState()
    try {
      const response = await axios.post(
        `${API_URL}/notification-tokens/add-token`,
        { home_id, notification_token },
        {
          headers: {
            Authorization: `${tokenType} ${token}`
          }
        }
      )
      if (response.status === 200) {
        console.log('Register notification token successfully')
      } else {
        console.error('Failed to add new notification token:', response.status)
      }
    } catch (error) {
      console.error('Error adding new notification token:', error)
    }
  },
}))

export default useHomeStore
