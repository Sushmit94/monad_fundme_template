import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';

// Import polyfills
import { Buffer } from 'buffer';
import process from 'process';

// Set up global polyfills
global.Buffer = Buffer;
global.process = process;

export default function RootLayout() {
  useEffect(() => {
    // Additional polyfill setup if needed
    if (typeof global.crypto === 'undefined') {
      const crypto = require('crypto-browserify');
      global.crypto = crypto;
    }
  }, []);

  return (
    <>
      <StatusBar style="light" backgroundColor="#0a0e27" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0a0e27',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
          headerTitleAlign: 'center',
          contentStyle: {
            backgroundColor: '#0a0e27',
          },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{ 
            title: 'FundMe DApp - Monad',
            headerShown: true,
          }} 
        />
      </Stack>
    </>
  );
}