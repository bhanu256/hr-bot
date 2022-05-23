import logging

import azure.functions as func

import mysql.connector
import json
import random

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    ques = req.params.get('q')
    if not ques:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            ques = req_body.get('q')

    if ques:
        try:
            mydb = mysql.connector.connect(
                host = "remotemysql.com",
                user="",
                passwd="",
                database="",
                port=3306
            )
        except Exception:
            return func.HttpResponse(f"Database error")

        qlist = ques.split(",")

        scount = {}

        cursor = mydb.cursor()

        for i in qlist:
            cursor.execute("select count(*) from questions where subject='{}'".format(i))
            result = cursor.fetchone()

            scount[i] = result[0]

        qna = {}

        j = 0
        ke = [j for j in scount.keys()]
        while(j<5):
            su_db = random.choice(ke)
            s_sno = random.randrange(1,int(scount[su_db])+1)

            cursor.execute("select question,answer from questions where subject='{}' and sno={}".format(su_db,s_sno))
            res = cursor.fetchall()

            q = res[0][0]
            a = res[0][1]

            if(q not in qna):
                qna[q] = a
                j = j+1
            else:
                pass

            
        return func.HttpResponse(json.dumps(qna))
    else:
        return func.HttpResponse(json.dumps("nothing"))



    # name = req.params.get('name')
    # if not name:
    #     try:
    #         req_body = req.get_json()
    #     except ValueError:
    #         pass
    #     else:
    #         name = req_body.get('name')

    # if name:
    #     return func.HttpResponse(f"Hello {name}!")
    # else:
    #     return func.HttpResponse(
    #          "Please pass a name on the query string or in the request body",
    #          status_code=400
    #     )
