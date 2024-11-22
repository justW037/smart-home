import { deviceType } from '../components/device/DeviceType'
import { roomType } from '../components/room/RoomType'

export const getDataForType = typeName => {
  const matchedType = deviceType.find(
    type => type.name.toLowerCase() === typeName.toLowerCase()
  )
  return matchedType || { name: '', iconName: 'help', iconType: 'material', tName: '' }
}

export const getDataForRoomType = typeName => {
  const matchedRoom = roomType.find(room =>
    typeName.toLowerCase().includes(room.name.toLowerCase())
  )
  return matchedRoom || { name: '', iconName: 'help', iconType: 'material', tName: '' }
}

// export const getImageForType = typeName => {
//   const matchedType = deviceType.find(
//     type => type.name.toLowerCase() === typeName.toLowerCase()
//   )
//   return matchedType || { iconName: 'help', iconType: 'material', image: '' }
// }
