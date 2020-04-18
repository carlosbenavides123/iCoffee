import threading

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