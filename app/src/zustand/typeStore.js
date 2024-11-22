import { create } from 'zustand'
import { API_URL } from '@env'
import axios from 'axios'
import useUserStore from './userStore'

const useTypeStore = create(set => ({
  types: [],
  type: null,
  message: '',
  totalPage: '',
  fetchTypes: async () => {
    const { token, tokenType } = useUserStore.getState()
    set({ loading: true })
    console.log(API_URL)
    try {
      const response = await axios.get(API_URL + `/types/`, {
        headers: {
          Authorization: `${tokenType} ${token}`
        }
      })
      if (response.status === 200) {
        const { types, message, total_page: totalPage } = response.data
        set({ types, message, totalPage })
        if (types.length > 0) {
          set({ type: types[0] })
        }
        console.log(types)
      } else {
        console.error('Failed to fetch types:', response.status)
      }
    } catch (error) {
      console.error('Error fetching types:', error)
    } finally {
      set({ loading: false })
    }
  },
  resetTypes: () => {
    set({ types: [], type: null, message: '', totalPage: '' })
  } 
}))

export default useTypeStore
