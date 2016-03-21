import sys
import os

from twisted.python import log
from twisted.internet import reactor
from twisted.internet.protocol import DatagramProtocol

from twisted.web.server import Site
from twisted.web.static import File

from autobahn.twisted.websocket import WebSocketServerProtocol, WebSocketServerFactory

# constants

SERVER_UDP_PORT = 7400

SERVER_WS_PORT = 8001
SERVER_HTTP_PORT = 9000
SERVER_HTTP_RESOURCES = 'app'

CLIENT_IP = '127.0.0.1'
CLIENT_UDP_PORT = 7500


# [HTTP] > [CLIENT WS] > [SERVER WS] > bridge > [SERVER UDP] > [CLIENT UDP]

class Bridge():

    def __init__(self):
        self.udpServer = None
        self.wsServer = []

    def setUdpServer(self, udpServer):
        self.udpServer = udpServer

    def setWebsocketServer(self, wsServer):
        self.wsServer.append(wsServer)

    def udpToWebsocket(self, data):

        for wsClient in self.wsServer:
            wsClient.sendMessage(data, True)

    def websocketToUdp(self, data):
        if self.udpServer is not None:
            self.udpServer.transport.write(data, (CLIENT_IP, CLIENT_UDP_PORT))

        for wsClient in self.wsServer:
            wsClient.sendMessage(data, True)


# udp server

class UDPServer(DatagramProtocol):

    def __init__(self, bridge):
        self.bridge = bridge
        self.bridge.setUdpServer(self)

    def datagramReceived(self, data, (host, port)):
        self.bridge.udpToWebsocket(data)


# websocket server

class BridgedWebSocketServerFactory(WebSocketServerFactory):

    def __init__(self, url, debug, debugCodePaths, bridge):

        WebSocketServerFactory.__init__(
            self,
            url,
            debug=debug,
            debugCodePaths=debugCodePaths
        )

        self.bridge = bridge


class WebSocketServer(WebSocketServerProtocol):

    def onOpen(self):
        print 'WebSocket connection open.'

    def onConnect(self, request):
        self.factory.bridge.setWebsocketServer(self)
        print 'Client connecting: {0}'.format(request.peer)

    def onMessage(self, payload, isBinary):
        self.factory.bridge.websocketToUdp(payload)

    def onClose(self, wasClean, code, reason):
        print 'WebSocket connection closed: {0}'.format(reason)

# initalize servers

if __name__ == '__main__':

    bridge = Bridge()

    log.startLogging(sys.stdout)

    # websocket setup

    wsAddress = 'ws://%s:%d' % ('127.0.0.1', SERVER_WS_PORT)

    factory = BridgedWebSocketServerFactory(wsAddress, False, False, bridge)
    factory.protocol = WebSocketServer
    reactor.listenTCP(SERVER_WS_PORT, factory)

    # http setup

    webdir = os.path.abspath(SERVER_HTTP_RESOURCES)
    site = Site(File(webdir))
    reactor.listenTCP(SERVER_HTTP_PORT, site)

    # udp setup

    reactor.listenUDP(SERVER_UDP_PORT, UDPServer(bridge))

    # start session

    reactor.run()
