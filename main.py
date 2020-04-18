import os
import glob
import time
import RPi.GPIO as GPIO

os.system('modprobe w1-gpio')
os.system('modprobe w1-therm')

base_dir = '/sys/bus/w1/devices/'
device_folder = glob.glob(base_dir + '28*')[0]
device_file = device_folder + '/w1_slave'

GPIO.setmode(GPIO.BCM)

GPIO_1 = 17
GPIO_2 = 2

GPIO.setup(GPIO_1, GPIO.OUT)


def read_temp_raw():
    f = open(device_file, 'r')
    lines = f.readlines()
    f.close()
    return lines

def read_temp():
    lines = read_temp_raw()
    while lines[0].strip()[-3:] != 'YES':
        time.sleep(0.2)
        lines = read_temp_raw()
    equals_pos = lines[1].find('t=')
    if equals_pos != -1:
        temp_string = lines[1][equals_pos+2:]
        temp_c = float(temp_string) / 1000.0
        temp_f = temp_c * 9.0 / 5.0 + 32.0
        return temp_c, temp_f

def get_temp():
	while True:
		c, f = read_temp()
		print(c, f)
		if f >= 205:
			break
while True:
    try:
        GPIO.output(GPIO_1, False)
        print("on")
        get_temp()
        GPIO.output(GPIO_1, True)
        print("off")
        time.sleep(1)
	break
    except(KeyboardInterrupt):
        # If a keyboard interrupt is detected then it exits cleanly!
        print('Finishing up!')
        GPIO.output(GPIO_1, True)
        #GPIO.output(18, False)
        GPIO.cleanup()


