import { create } from 'zustand'
import { API_URL } from '@env'
import axios from 'axios'
import useUserStore from './userStore'

const useDeviceStore = create(set => ({
  devices: [],
  device: null,
  message: '',
  totalPages: {},
  loading: false,
  turnOnSchedules: [],
  turnOffSchedules: [],
  fetchDevices: async (roomId, page = 0) => {
    const { token, tokenType } = useUserStore.getState()
    set({ loading: true })
    console.log(API_URL)
    try {
      const response = await axios.get(API_URL + `/devices/get-all/` + roomId, {
        headers: {
          Authorization: `${tokenType} ${token}`
        },
        params: {
          page,
          limit: 10
        }
      })
      if (response.status === 200) {
        const {
          devices: newDevices,
          message,
          total_page: totalPage
        } = response.data

        set(state => {
          const updatedDevices = state.devices.filter(
            existingDevice =>
              !newDevices.some(newDevice => newDevice.id === existingDevice.id)
          )
          return {
            devices: [...updatedDevices, ...newDevices],
            message,
            totalPages: { ...state.totalPages, [roomId]: totalPage }
          }
        })
      } else {
        console.error('Failed to fetch devices:', response.status)
      }
    } catch (error) {
      console.error('Error fetching devices:', error)
    } finally {
      set({ loading: false })
    }
  },
  addDevice: async (device_name, type_id, room_id, port) => {
    const { token, tokenType } = useUserStore.getState()
    try {
      const response = await axios.post(
        `${API_URL}/devices/add-device`,
        { device_name, type_id, room_id, port },
        {
          headers: {
            Authorization: `${tokenType} ${token}`
          }
        }
      )
      if (response.status === 200) {
        set(state => ({
          devices: [...state.devices, response.data.device]
        }))
      } else {
        console.error('Failed to add new device:', response.status)
      }
    } catch (error) {
      console.error('Error adding new device:', error)
    }
  },
  updateDevice: async (device_id, device_name, type_id, room_id, port) => {
    const { token, tokenType } = useUserStore.getState()
    try {
      const response = await axios.put(
        `${API_URL}/devices/update-device`,
        { device_id, device_name, type_id, room_id, port },
        {
          headers: {
            Authorization: `${tokenType} ${token}`
          }
        }
      )
      if (response.status === 200) {
        const updatedDevice = response.data.device
        set(state => ({
          devices: state.devices.map(device =>
            device.id === device_id ? { ...device, ...updatedDevice } : device
          ),
          device: updatedDevice
        }))
      } else {
        console.error('Failed to update device:', response.status)
      }
    } catch (error) {
      console.error('Error updating device:', error)
    }
  },
  deleteDevice: async device_id => {
    const { token, tokenType } = useUserStore.getState()
    set({ loading: true })
    try {
      const response = await axios.delete(`${API_URL}/devices/${device_id}`, {
        headers: {
          Authorization: `${tokenType} ${token}`
        }
      })

      if (
        response.status === 200 &&
        response.data.message.includes('successfully') &&
        response.data.device_id === device_id
      ) {
        set(state => ({
          devices: state.devices.filter(device => device.id !== device_id),
          message: 'Device deleted successfully'
        }))
      } else {
        console.error('Failed to delete device:', response.status)
      }
    } catch (error) {
      console.error('Error deleting device:', error)
    } finally {
      set({ loading: false })
    }
  },
  deleteDevicesByRoomId: roomId => {
    set(state => ({
      devices: state.devices.filter(device => device.room_id !== roomId),
      message: 'Devices for room deleted successfully'
    }))
  },
  resetDevices: () => {
    set({
      devices: [],
      device: null,
      message: '',
      totalPage: {},
      loading: false,
      turnOnSchedules: [],
      turnOffSchedules: []
    })
  },
  setDevice: device => set({ device }),
  setTurnOnSchedules: (device_id, device_port, schedule) => {
    set(state => {
      const existingScheduleIndex = state.turnOnSchedules.findIndex(
        item => item.device_id === device_id
      )

      if (existingScheduleIndex !== -1) {
        const updatedSchedules = [...state.turnOnSchedules]
        updatedSchedules[existingScheduleIndex] = {
          ...updatedSchedules[existingScheduleIndex],
          ...schedule
        }
        return { turnOnSchedules: updatedSchedules }
      } else {
        return {
          turnOnSchedules: [
            ...state.turnOnSchedules,
            {
              device_id,
              device_port,
              ...schedule
            }
          ]
        }
      }
    })
  },
  setTurnOffSchedules: (device_id, device_port, schedule) => {
    set(state => {
      const existingScheduleIndex = state.turnOffSchedules.findIndex(
        item => item.device_id === device_id
      )

      if (existingScheduleIndex !== -1) {
        const updatedSchedules = [...state.turnOffSchedules]
        updatedSchedules[existingScheduleIndex] = {
          ...updatedSchedules[existingScheduleIndex],
          ...schedule
        }
        return { turnOffSchedules: updatedSchedules }
      } else {
        return {
          turnOffSchedules: [
            ...state.turnOffSchedules,
            {
              device_id,
              device_port,
              ...schedule
            }
          ]
        }
      }
    })
  },
  getTurnOnSchedules: device_id => {
    const { turnOnSchedules } = useDeviceStore.getState()
    return (
      turnOnSchedules.find(schedule => schedule.device_id === device_id) || null
    )
  },
  getTurnOffSchedules: device_id => {
    const { turnOffSchedules } = useDeviceStore.getState()
    return (
      turnOffSchedules.find(schedule => schedule.device_id === device_id) ||
      null
    )
  },
  getTotalPage: roomId => {
    const { totalPages } = useDeviceStore.getState()
    return totalPages[roomId] || 0
  },
  searchDevice: async (deviceName, homeId, roomId = null, typeId = null) => {
    const { token, tokenType } = useUserStore.getState()
    try {
      const response = await axios.get(
        API_URL + `/devices/search/` + deviceName,
        {
          headers: {
            Authorization: `${tokenType} ${token}`
          },
          params: {
            roomId,
            typeId,
            homeId
          }
        }
      )
      return response.data
    } catch (error) {
      console.error('Error searching for device:', error)
      throw error
    }
  },
  getDeviceById: deviceId => {
    const { devices } = useDeviceStore.getState()
    return devices.find(device => device.id === deviceId) || null
  },
  fetchDeviceByNameAndRoomName: async (deviceName, roomName = null, homeId) => {
    const { token, tokenType } = useUserStore.getState()
    try {
      const response = await axios.get(API_URL + `/devices/search`, {
        headers: {
          Authorization: `${tokenType} ${token}`
        },
        params: {
          deviceName,
          roomName,
          homeId
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching device by name and room name:', error)
    }
  },
  fetchDeviceByTypeId: async (typeId, homeId, roomName) => {
    const { token, tokenType } = useUserStore.getState()

    try {
      const response = await axios.get(API_URL + `/devices/all-by-type`, {
        headers: {
          Authorization: `${tokenType} ${token}`
        },
        params: {
          typeId,
          homeId,
          roomName
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching device by name and room name:', error)
    }
  }
}))

export default useDeviceStore
