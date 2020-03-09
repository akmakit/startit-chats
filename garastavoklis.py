from flask import json, jsonify
from datetime import datetime
from os import path

GARASTAVOKLIS = "garastavoklis.txt"

def pieraksti_garastavokli(dati):
    # Sākumā ielasām visus garastāvokļus masīvā no faila
    faila_esosie_garastavokli = []

    # Uzstādām karogu uz False, jo sākumā neko neesam meklējuši
    lietotajam_jau_eksiste_garastavoklis = False

    if (path.exists(GARASTAVOKLIS)):
        with open(GARASTAVOKLIS, "r", encoding="utf-8") as faila_rindas:
            for rinda in faila_rindas:
                ielasita_rinda_json_formata = json.loads(rinda)
                # Ja atradām lietotāju ar vārdu
                if (ielasita_rinda_json_formata["vards"] == dati["vards"]):
                    # tad nomainām garastāvokli uz jauno vērtību
                    ielasita_rinda_json_formata["garastavoklis"] = dati["garastavoklis"]
                    # Uzstādām mūsu karogu uz True, jo atradām lietotāju ar vārdu
                    lietotajam_jau_eksiste_garastavoklis = True
                faila_esosie_garastavokli.append(ielasita_rinda_json_formata)
    
    # Ja nebijām atraduši lietotāju ar šādu vārdu, tad ieliekam masīva beigās atsūtītos datus
    if (lietotajam_jau_eksiste_garastavoklis == False):
        faila_esosie_garastavokli.append(dati)

    # Pārrakstām mūsu failu no jauna ar mūsu aktuālo garastāvokļu masīvu
    with open(GARASTAVOKLIS, 'w') as file:
        for line in faila_esosie_garastavokli:
            file.write(json.dumps(line, ensure_ascii=False) + "\n")

def lasi_garastavokli():
    garastavoklis_failasaturs = []

    if (path.exists(GARASTAVOKLIS)):
        with open(GARASTAVOKLIS, "r", encoding="utf-8") as f:
            for rinda in f:
                garastavoklis_failasaturs.append(json.loads(rinda))

    return garastavoklis_failasaturs
