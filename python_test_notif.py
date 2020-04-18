import threading
import requests
import json
def f(f_stop, val):
    # do something here ...
    print(val)
    # if not f_stop.is_set():
    #     # call f() again in 60 seconds
    #     threading.Timer(60, f, [f_stop]).start()

f_stop = threading.Event()
threading.Timer(1, f, [f_stop, 1]).start()
# start calling f now and every 60 sec thereafter
# f(f_stop, 1)


def send_fcm_notif(device_id):
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
device_id = "dVtCi3loRKCgsAyuQrW8bP:APA91bGIUCspZLJ2nJ3TrNRM775ANsGF5C2ra6_6ZaSETY4YKEFHWWcBhS4KXuL3m0YQ-HzRK8KZhtHU5tDszMyjtvGwJlARW_sZBGwZbesL8Yu_llUp0u7Ouvv-WMI0tixrlBxqL1L4"
threading.Timer(1, send_fcm_notif, [device_id]).start()
