from bottle import request, Bottle, abort, template
from bottle import SimpleTemplate
app = Bottle()
index_bottle=''' 
<!DOCTYPE html>
<html>
<head>
<h1>HI</h1>
  <script type="text/javascript">
    var ws = new WebSocket("ws://example.com:8080/websocket");
    ws.onopen = function() {
        ws.send("Hello, world");
    };
    ws.onmessage = function (evt) {
        alert(evt.data);
    };
  </script>
</head>
<body>
<p>"hello world"</p>
</body>
</html>

'''

@app.route('/')
def handle_websocket():
    #template = SimpleTemplate('index_bottle.html')
    #tpl.render("index_bottle.html")
    return template("index_bottle")
    wsock = request.environ.get('wsgi.websocket')
    if not wsock:
        abort(400, 'Expected WebSocket request.')

    while True:
        try:
            message = wsock.receive()
            wsock.send("Your message was: %r" % message)
        except WebSocketError:
            break

from gevent.pywsgi import WSGIServer
from geventwebsocket import WebSocketError
from geventwebsocket.handler import WebSocketHandler
server = WSGIServer(("0.0.0.0", 8080), app,
                    handler_class=WebSocketHandler)
server.serve_forever()