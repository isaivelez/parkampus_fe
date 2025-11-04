import React from 'react';
import { Text, View } from 'react-native';

export default function TailwindTest() {
  return (
    <View className="flex-1 justify-center items-center bg-blue-500">
      <Text className="text-white text-2xl font-bold">
        ¡Tailwind funciona! 🎉
      </Text>
      <View className="mt-4 p-4 bg-white rounded-lg shadow-lg">
        <Text className="text-blue-500 text-lg font-semibold">
          Este es un test de NativeWind
        </Text>
      </View>
    </View>
  );
}