import { roomType } from '../components/room/RoomType'

const toTitleCase = (str) => {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export async function getCommandByTranScript(transcript) {
  const actions = ['on', 'off']
  const findKeyword = (input, keywords) => {
    for (let keyword of keywords) {
      if (input.includes(keyword)) {
        return keyword
      }
    }
    return null
  }

  const action = findKeyword(transcript.toLowerCase(), actions)

  // Tìm phòng trong transcript
  const roomMatch = roomType.find(room =>
    transcript.toLowerCase().includes(room.name.toLowerCase())
  )

  let fullRoomName = ''
  if (roomMatch) {
    const roomIndex = transcript
      .toLowerCase()
      .indexOf(roomMatch.name.toLowerCase())
    if (roomIndex !== -1) {
      fullRoomName = transcript.slice(roomIndex).trim()
      fullRoomName = toTitleCase(fullRoomName)
    }
  }

  const cleanedTranscript = transcript.replace(/\bin the\b/g, '').trim()

  let deviceName = ''
  let applyToAll = false

  if (action) {
    const cleanedActionIndex = cleanedTranscript.indexOf(action)
    const cleanedRoomIndex = fullRoomName
      ? cleanedTranscript.indexOf(fullRoomName)
      : cleanedTranscript.length

    if (cleanedActionIndex !== -1) {
      deviceName = cleanedTranscript
        .slice(cleanedActionIndex + action.length, cleanedRoomIndex)
        .trim()
        .replace(/^the\s+/i, '')

      if (deviceName.toLowerCase().startsWith('all')) {
        applyToAll = true
        deviceName = deviceName.slice(3).trim() 
        if (deviceName.endsWith('s')) {
          deviceName = deviceName.slice(0, -1).trim()
        }
        deviceName = deviceName.toUpperCase() 
      }
    }
  }

  return {
    action: action || null,
    roomName: fullRoomName || null,
    deviceName: deviceName || null,
    applyToAll
  }
}
