import React, { useState, memo } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import tw from 'twrnc'
import Modal from 'react-native-modal'
import TimePicker from '../others/TimePicker'
import { Icon } from 'react-native-elements'
import DaySelector from '../others/DaySelector'
import { useDaysLogic } from '../../hooks/useDaysLogic'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../../hooks/useTheme'

const ScheduleModal = memo(({ isScheduleModalVisible, toggleScheduleModal, isTurnOn, scheduleData, onSaveSchedule }) => {
  const [selectedHour, setSelectedHour] = useState('00')
  const [selectedMinute, setSelectedMinute] = useState('00')

  const {
    selectedDays,
    dayMapping,
    setSelectedDays,
    reverseDayMapping,
    daysOfWeek,
    toggleDaySelection
  } = useDaysLogic()

  useEffect(() => {
    if (scheduleData) {
      const [hour, minute] = scheduleData.time.split(':')
      setSelectedHour(hour)
      setSelectedMinute(minute)
      setSelectedDays(scheduleData.days || [])
    }
  }, [isScheduleModalVisible, scheduleData])

  const { t } = useTranslation()
  const { theme } = useTheme()
  const isDarkTheme = theme === 'dark'

  const handleSave = () => {
    const schedule = {
      time: `${selectedHour}:${selectedMinute}`,
      days: selectedDays,
      isTurnOn
    }
    onSaveSchedule(schedule)
    toggleScheduleModal()
  }
    // console.log("modalcheck"+  isTurnOn)
  // console.log(scheduleData)

  return (
    <Modal
      isVisible={isScheduleModalVisible}
      onBackdropPress={toggleScheduleModal}
      style={tw`m-0 justify-end h-100 `}
    >
      <View
        style={tw`${
          isDarkTheme ? 'bg-neutral-900' : 'bg-white'
        } p-4 rounded-t-3xl gap-3`}
      >
        <View style={tw`flex-row justify-between items-center`}>
          <TouchableOpacity onPress={toggleScheduleModal}>
            <Icon
              name="close"
              type="material"
              color={isDarkTheme ? '#ffffff' : '#000000'}
              size={26}
              style={tw`pt-1`}
            />
          </TouchableOpacity>
          <Text style={tw`${isDarkTheme ? 'text-white' : 'text-black'} `}>
            {isTurnOn
              ? t('scheduleModal.setTurnOn')
              : t('scheduleModal.setTurnOff')}
          </Text>
          <TouchableOpacity onPress={handleSave}>
            <Icon
              name="check"
              type="material"
              color={isDarkTheme ? '#ffffff' : '#000000'}
              size={26}
              style={tw`pt-1`}
            />
          </TouchableOpacity>
        </View>
        <TimePicker
          isDarkTheme={isDarkTheme}
          selectedHour={selectedHour}
          selectedMinute={selectedMinute}
          onHourChange={setSelectedHour}
          onMinuteChange={setSelectedMinute}
        />
        <DaySelector
          isDarkTheme={isDarkTheme}
          selectedDays={selectedDays}
          toggleDaySelection={toggleDaySelection}
          dayMapping={dayMapping}
          reverseDayMapping={reverseDayMapping}
          daysOfWeek={daysOfWeek}
        />
      </View>
    </Modal>
  )
})
export default ScheduleModal