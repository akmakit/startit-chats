from flask import json, jsonify
from datetime import datetime
from  pupinas import convert_beens
from os import path

LOGFAILS = "chats.txt"

def lasi():
    chata_rindas = []
    if (path.exists(LOGFAILS)):
        with open(LOGFAILS, "r", encoding="utf-8") as f:
            for rinda in f:
                chata_rindas.append(json.loads(rinda))
    return chata_rindas


def pieraksti_zinju(dati):
    json_data = dati["chats"]
    json_data["laiks"] = datetime.now()
    if json_data["pupinu"]:
        json_data["zinja"] = convert_beens(json_data["zinja"])
    with open(LOGFAILS, "a", newline="", encoding="utf-8") as f:
        f.write(json.dumps(json_data, ensure_ascii=False) + "\n")
