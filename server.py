from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket
import os
import glob
import time
import RPi.GPIO as GPIO
import threading
import requests
import json
os.system('modprobe w1-gpio')
os.system('modprobe w1-therm')
base_dir = '/sys/bus/w1/devices/'
device_folder = glob.glob(base_dir + '28*')[0]
device_file = device_folder + '/w1_slave'
GPIO.setmode(GPIO.BCM)
GPIO_1 = 17
GPIO_2 = 2
GPIO.setup(GPIO_1, GPIO.IN)

import ast
clients = []

class SimpleEcho(WebSocket):

    def handleMessage(self):
        print(type(self.data))
        data = str(self.data)
        data = ast.literal_eval(data)
        print(data)
        print(type(data))
        if data["Message"] == "hello":
            self.boilWater(data)

        # data = ast.literal_eval(self.data)        
        # self.sendMessage(json.dumps({"Type": "Pong", "Message": "ALIVE"}))
        # if self.data["Message"] == "hello":
        #     self.boilWater()
        # echo message back to client
        # print(self.data["Message"])
        # message = self.data["Message"]
        # print(message)
        # print(message)
        # if message == "hello":
        #     self.boilWater()

        # if message == "Ping":
        #     self.sendMessage(json.dumps({"Type": "Ping", "Message": "Pong"}))
        # self.sendMessage(self.data)
        # self.sendMessage(json.dumps({"data": {"Message": "Yolo"}}))
        # print("ETTET")

    def handleConnected(self):
        # for client in clients:
        #     client.sendMessage(self.address[0])
        # print("YAAAA")
        print(self.address, 'connected')
        clients.append(self)

    def handleClose(self):
        print("@@@@@@@@@@@@@")
        clients.remove(self)
        print(self.address, 'closed')

    def boilWater(self, data):
        print("#########")
        print("Boiling", data)
        message = {"Type": "State", "Message": "Boiling"}
        # message = unicode(message)
        # self.sendMessage(message)
        oz = data["Data"]["Oz"]
        coffee_type = data["Data"]["Type"]
        print(coffee_type, oz)

        wait_time = 420
        # wait_time = 1
        fcm_event = threading.Event()
        device_id = "dVtCi3loRKCgsAyuQrW8bP:APA91bGIUCspZLJ2nJ3TrNRM775ANsGF5C2ra6_6ZaSETY4YKEFHWWcBhS4KXuL3m0YQ-HzRK8KZhtHU5tDszMyjtvGwJlARW_sZBGwZbesL8Yu_llUp0u7Ouvv-WMI0tixrlBxqL1L4"
        threading.Timer(wait_time, self.send_fcm_notif, [device_id]).start()

        print("start to boil")
        GPIO.setup(GPIO_1, False)
        print("LOG GPIO1 FALSE ")
        print("GET TEMP")
        self.get_temp(coffee_type)
        GPIO.setup(GPIO_1, True)
        print("LOG GPIO1 TRUE")
        print("off")
        time.sleep(1)

        message = {"Type": "State", "Message": "Drip"}
        message = unicode(message)
        self.sendMessage(message)

    def send_fcm_notif(self, device_id):
        data = {
             "to" : device_id,
            "data":{
                "body" : "Drink up!",
                "title": "Your Coffee is ready! :)"
                }
        }
        headers = {
            'Authorization': 'key=AAAAAfyOCVQ:APA91bGZcP0JCEDgootuc-M9d-Q-l3Xuip7_ox2B0e5jZXLgfW4fTVOjfi61eGXafZxZEvqtf4awk3kOHvTXaBf-KutFyxhXir7PgC9pbgwzywDHNEVpGpsVdBU36NbajS-cYr5UFl8G',
            'Content-Type': 'application/json'
        }
        r = requests.post('https://fcm.googleapis.com/fcm/send', data=json.dumps(data), headers=headers)
        print("looool")


    def read_temp_raw(self):
        f = open(device_file, 'r')
        lines = f.readlines()
        f.close()
        return lines

    def read_temp(self):
        print("read temp")
        lines = self.read_temp_raw()
        while lines[0].strip()[-3:] != 'YES':
            time.sleep(0.2)
            lines = self.read_temp_raw()
        print("read lines")
        equals_pos = lines[1].find('t=')
        if equals_pos != -1:
            print("equal_pos")
            temp_string = lines[1][equals_pos+2:]
            temp_c = float(temp_string) / 1000.0
            temp_f = temp_c * 9.0 / 5.0 + 32.0
            print(temp_c, temp_f, "LOG")
            return temp_c, temp_f

    def get_temp(self, coffee_type):
        print(1)
        temp = 195
        if coffee_type != "Regular Coffee":
            temp = 205
        print(2, temp, coffee_type)
        while True:
            print(3)
            c, f = self.read_temp()
            print(4, c, f)
            if f >= temp:
                break


server = SimpleWebSocketServer("0.0.0.0", 12345, SimpleEcho)
print("ya")
server.serveforever()
