// DaySelector.js
import {memo} from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import tw from 'twrnc'
import { useTranslation } from 'react-i18next'

export default function DaySelector({
  selectedDays,
  toggleDaySelection,
  dayMapping,
  reverseDayMapping,
  daysOfWeek,
  isDarkTheme
}) {
  const { t } = useTranslation()
  return (
    <View
      style={tw`${
        isDarkTheme ? 'bg-zinc-800' : 'bg-gray-100'
      }  p-4 rounded-2xl gap-3`}
    >
      <Text
        style={tw`${isDarkTheme ? 'text-white' : 'text-black'} font-semibold`}
      >
        {t('repeat')}
      </Text>
      <Text style={tw`${isDarkTheme ? 'text-white' : 'text-black'} text-sm`}>
        {selectedDays.length > 0
          ? selectedDays.map(dayValue => reverseDayMapping[dayValue]).join(', ')
          : reverseDayMapping[7]}
      </Text>
      <View style={tw`flex-row justify-between`}>
        {daysOfWeek.map((day, index) => (
          <TouchableOpacity
            key={index}
            style={tw`px-2 py-1 rounded-xl ${
              selectedDays.includes(dayMapping[day])
                ? isDarkTheme
                  ? 'bg-white'
                  : 'bg-black'
                : 'bg-gray-500'
            }`}
            onPress={() => toggleDaySelection(day)}
          >
            <Text
              style={tw`text-xs ${
                selectedDays.includes(dayMapping[day])
                  ? isDarkTheme
                    ? 'text-black'
                    : 'text-white'
                  : ''
              }`}
            >
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}
