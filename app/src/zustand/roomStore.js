import { create } from 'zustand'
import { API_URL } from '@env'
import axios from 'axios'
import useUserStore from './userStore'

const useRoomStore = create(set => ({
  rooms: [],
  room: null,
  message: '',
  totalPage: '',
  loading: false,
  fetchRooms: async homeId => {
    const { token, tokenType } = useUserStore.getState()
    set({ loading: true })
    console.log(API_URL)
    try {
      const response = await axios.get(API_URL + `/rooms/get-all/` + homeId, {
        headers: {
          Authorization: `${tokenType} ${token}`
        }
      })
      if (response.status === 200) {
        const { rooms, message, total_page: totalPage } = response.data
        set({ rooms, message, totalPage })
        if (rooms.length > 0) {
          set({ room: rooms[0] })
        }
        console.log(rooms)
      } else {
        console.error('Failed to fetch rooms:', response.status)
      }
    } catch (error) {
      console.error('Error fetching rooms:', error)
    } finally {
      set({ loading: false })
    }
  },
  addRoom: async (room_name, home_id) => {
    const { token, tokenType } = useUserStore.getState()
    try {
      const response = await axios.post(
        `${API_URL}/rooms/add-room`,
        { room_name, home_id },
        {
          headers: {
            Authorization: `${tokenType} ${token}`
          }
        }
      )
      if (response.status === 200) {
        set(state => ({
          rooms: [...state.rooms, response.data.room]
        }))
      } else {
        console.error('Failed to add new room:', response.status)
      }
    } catch (error) {
      console.error('Error adding new room:', error)
    }
  },
  updateRoom: async (room_id, room_name, home_id) => {
    const { token, tokenType } = useUserStore.getState()
    try {
      const response = await axios.put(
        `${API_URL}/rooms/update-room`,
        { room_id, room_name, home_id },
        {
          headers: {
            Authorization: `${tokenType} ${token}`
          }
        }
      )
      if (response.status === 200) {
        set(state => ({
          rooms: state.rooms.map(room =>
            room.id === room_id ? { ...room, ...response.data.room } : room
          )
        }))
      } else {
        console.error('Failed to update room:', response.status)
      }
    } catch (error) {
      console.error('Error updating room:', error)
    }
  },
  deleteRoom: async room_id => {
    const { token, tokenType } = useUserStore.getState()
    set({ loading: true })
    try {
      const response = await axios.delete(
        `${API_URL}/rooms/${room_id}`,
        {
          headers: {
            Authorization: `${tokenType} ${token}`
          }
        }
      )
  
      if (response.status === 200 && response.data.message.includes('successfully')) {
        set(state => {
          const updatedRooms = state.rooms.filter(room => room.id !== room_id)
          return {
            rooms: updatedRooms,
            message: 'Room deleted successfully',
            room: updatedRooms.length > 0 ? updatedRooms[0] : null
          }
        })
      } else {
        console.error('Failed to delete room:', response.status, response.data.message)
      }
    } catch (error) {
      console.error('Error deleting room:', error)
    } finally {
      set({ loading: false })
    }
  },
  setRoom: room => set({ room }),
  resetRooms: () => {
    set({
      rooms: [],
      room: null,
      message: '',
      totalPage: '',
      loading: false
    })
  }
}))

export default useRoomStore
