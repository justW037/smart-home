import React, { useState, useEffect } from 'react'
import { View, Text, Dimensions } from 'react-native'
import { LineChart } from 'react-native-chart-kit'
import tw from 'twrnc'
import { useTranslation } from 'react-i18next'

export default function SensorChart({ newSensorData, isDarkTheme }) {
  const [temperatureData, setTemperatureData] = useState([0])
  const [humidityData, setHumidityData] = useState([0])
  const { t } = useTranslation()
  const screenWidth = Dimensions.get('window').width

  const MAX_DATA_POINTS = 10
  useEffect(() => {
    if (newSensorData) {
      setTemperatureData(prevData => {
        const updatedData = [...prevData, newSensorData.temperature]
        if (updatedData.length > MAX_DATA_POINTS) {
          updatedData.shift()
        }
        return updatedData
      })

      setHumidityData(prevData => {
        const updatedData = [...prevData, newSensorData.humidity]
        if (updatedData.length > MAX_DATA_POINTS) {
          updatedData.shift()
        }
        return updatedData
      })
    }
  }, [newSensorData])

  const labels = temperatureData.map((_, index) => {
    if (index % 2 === 0) {
      const now = new Date()
      return `${now.getHours()}:${now.getMinutes()}`
    }
    return ''
  })

  const data = {
    labels: labels,
    datasets: [
      {
        data: temperatureData,
        color: () => `rgb(255, 154, 162)`,
        strokeWidth: 2
      },
      {
        data: humidityData,
        color: () => `rgb(153, 192, 248)`,
        strokeWidth: 2
      }
    ]
  }

  return (
    <View>
      <Text
        style={tw`${
          isDarkTheme ? 'text-white' : 'text-black'
        } font-semibold mb-5`}
      >
        {t('device.sensorData')}
      </Text>
      <View style={tw`${
          isDarkTheme ? 'bg-zinc-800 border-zinc-800' : 'bg-white border-gray-300'
        }  border  p-2 rounded-2xl`}>
        <LineChart
          data={data}
          width={screenWidth - 50}
          height={260}
          style={{ marginLeft: -5 }}
          chartConfig={{
            backgroundColor: isDarkTheme ? '#27272a' : '#ffffff',
            backgroundGradientFrom: isDarkTheme ? '#27272a' : '#ffffff',
            backgroundGradientTo: isDarkTheme ? '#27272a' : '#ffffff',
            decimalPlaces: 1,
            color: (opacity = 1) =>
              isDarkTheme
                ? `rgba(255, 255, 255, ${opacity})`
                : `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) =>
              isDarkTheme
                ? `rgba(255, 255, 255, ${opacity})`
                : `rgba(0, 0, 0, ${opacity})`,
            propsForBackgroundLines: {
              strokeDasharray: '',
              stroke: isDarkTheme ? '#555555' : '#e3e3e3'
            }
          }}
          withShadow={false}
          bezier
        />
        <View style={tw`flex-row justify-around `}>
          <View style={tw`flex-row items-center`}>
            <View style={tw`w-4 h-4 bg-red-400 mr-2`} />
            <Text style={tw`${isDarkTheme ? 'text-white' : 'text-black'}`}>
              {t('device.temperature')}
            </Text>
          </View>
          <View style={tw`flex-row items-center`}>
            <View style={tw`w-4 h-4 bg-blue-400 mr-2`} />
            <Text style={tw`${isDarkTheme ? 'text-white' : 'text-black'}`}>
              {t('device.humidity')}
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}
