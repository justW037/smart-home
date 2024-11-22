import { View, Text, TouchableOpacity, Switch } from 'react-native'
import tw from 'twrnc'
import { useDaysLogic } from '../../hooks/useDaysLogic'
import { useToggleSwitch } from '../../hooks/useToggleSwitch'
import useDeviceStore from '../../zustand/deviceStore'
import { useEffect } from 'react'

export default function DeviceSchedule({
  title,
  scheduleData,
  isDarkTheme,
  isTurnOn,
  setIsTurnOn,
  scheduleModal,
  sendMessage
}) {
  const { reverseDayMapping } = useDaysLogic()
  const scheduleSwitch = useToggleSwitch()
  const { setTurnOnSchedules, setTurnOffSchedules } = useDeviceStore(state => ({
    setTurnOnSchedules: state.setTurnOnSchedules,
    setTurnOffSchedules: state.setTurnOffSchedules
  }))
  useEffect(() => {
    scheduleSwitch.setIsEnabled(scheduleData.isTurnOn)
  }, [scheduleData.isTurnOn])
  const handleSetSchedule = () => {
    scheduleSwitch.toggleSwitch()
    const newScheduleData = {
      time: scheduleData.time,
      days: scheduleData.days,
      isTurnOn: scheduleSwitch.isEnabled ? false : true
    }
    const isTurnOnScheduleType = isTurnOn ? 'turnOn' : 'turnOff'
    const message = {
      device_id: scheduleData.device_id,
      device_port: scheduleData.device_port,
      action: isTurnOnScheduleType,
      ...newScheduleData
    }
    if (isTurnOn) {
      setTurnOnSchedules(
        scheduleData.device_id,
        scheduleData.device_port,
        newScheduleData
      )
    } else {
      setTurnOffSchedules(
        scheduleData.device_id,
        scheduleData.device_port,
        newScheduleData
      )
    }
    sendMessage(JSON.stringify(message))
    // console.log(sendMessage(JSON.stringify(message)))
  }
  return (
    <View style={tw`flex-col gap-2 rounded-3xl`}>
      <Text style={tw`${isDarkTheme ? 'text-white' : 'text-black'} pl-3`}>
        {title}
      </Text>
      <View
        style={tw`${
          isDarkTheme
            ? 'bg-zinc-800 border-zinc-800'
            : 'bg-white border-gray-300'
        }  p-3 border rounded-2xl flex-row justify-between items-center`}
      >
        <TouchableOpacity
          onPress={async () => {
            await setIsTurnOn(isTurnOn)
            scheduleModal.toggleModal()
          }}
        >
          <Text
            style={tw`${isDarkTheme ? 'text-white' : 'text-black'} font-bold`}
          >
            {scheduleData?.time}
          </Text>
          <Text style={tw`${isDarkTheme ? 'text-white' : 'text-black'}`}>
            {scheduleData?.days
              .map(dayValue => reverseDayMapping[dayValue])
              .join(' ')}
          </Text>
        </TouchableOpacity>
        <View style={tw`border-l pl-4 border-gray-300`}>
          <Switch
            style={[
              tw`ml-2`,
              { transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }
            ]}
            trackColor={{
              false: '#767577',
              true: isDarkTheme ? '#555555' : '#f4f3f4'
            }}
            thumbColor={
              scheduleSwitch.isEnabled
                ? '#ffffff'
                : isDarkTheme
                ? '#555555'
                : '#f4f3f4'
            }
            onValueChange={handleSetSchedule}
            value={scheduleSwitch.isEnabled}
          />
        </View>
      </View>
    </View>
  )
}
