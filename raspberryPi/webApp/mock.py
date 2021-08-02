from flask import Flask, request, Response
from waitress import serve

import sphero_control as bot

app = Flask(__name__)

@app.route('/brow-up', methods=['GET'])
def brow_up():
    print('brow up!')
    bot.moveForward()
    return Response(status=200)

@app.route('/brow-down', methods=['GET'])
def brow_down():
    print('brow down!')
    return Response(status=200)

@app.route('/concentration/<value>', methods=['GET'])
def concentration(value):
    print('concentration!', value)
    return Response(status=200)


#bot.connect()

serve(app, host='0.0.0.0', port=14739, threads=1) #WAITRESS!




