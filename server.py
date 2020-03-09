from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket
import ast
print("yeet")
clients = []
class SimpleEcho(WebSocket):

    def handleMessage(self):
        print(type(self.data))
        data = str(self.data)
        data = ast.literal_eval(data)
        print(data)
        print(type(data))
        if data["Message"] == "hello":
            self.boilWater()

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

    def boilWater(self):
        print("#########")
        print("Boiling")
        message = {"Type": "State", "Message": "Boiling"}
        message = unicode(message)
        # mydict = {k: unicode(v).encode("utf-8") for k,v in message.iteritems()}
        self.sendMessage(message)
        # self.sendMessage(json.dump({"data": {"message": "Boiling"}}))


server = SimpleWebSocketServer("0.0.0.0", 12345, SimpleEcho)
print("ya")
server.serveforever()