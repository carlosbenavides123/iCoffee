
import { useState } from 'react';

export function usePeripheral() {

    const [scanning, setScanning] = useState(false)
    const [device, setDevice] = useState(null)
    const [appState, setAppState] = useState('')

	return {
		scanning,
		device,
		appState, 
        setScanning,
        setDevice,
        setAppState
	};
}