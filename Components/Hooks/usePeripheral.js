
import { useState } from 'react';

export function usePeripheral() {

    const [scanning, setScanning] = useState(false)
    const [device, setDevice] = useState(new Map)
    const [appState, setAppState] = useState('')
    const [scannedDevices, setScannedDevices] = useState(new Map)
    const [userSSID, setUserSSID] = useState('')
    const [userSSIDPassword, setUserSSIDPassword] = useState('')

	return {
		scanning,
		device,
		appState, 
        setScanning,
        scannedDevices,
        setDevice,
        setAppState,
        setScannedDevices
	};
}