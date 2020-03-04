from flask import Flask, json, jsonify, render_template, request
import chats, garastavoklis

app = Flask('app')

@app.route('/')
def index_lapa():
  return render_template('chats.html')

@app.route('/health')
def health_check():
  return "OK"

@app.route('/chats/lasi')
def ielasit_chatu():
  return jsonify({ "chats": chats.lasi(), "mood": garastavoklis.lasi_garastavokli() })

@app.route('/chats/suuti', methods=['POST'])
def suutiit_zinju():
  dati = request.json
  chats.pieraksti_zinju(dati)
  return jsonify(chats.lasi())

@app.route('/garastavoklis/pierakstit_grarastavokli', methods=['POST'])
def pierakstit_garastavokli():
  gStavoklis = request.json
  garastavoklis.pieraksti_garastavokli(gStavoklis)
  return jsonify(garastavoklis.lasi_garastavokli())

if __name__ == '__main__':
    # Threaded option to enable multiple instances for multiple user access support
    app.run(threaded=True, port=5000)
