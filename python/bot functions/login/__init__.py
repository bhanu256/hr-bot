import logging
import json
import mysql.connector

import azure.functions as func


def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    user = req.params.get('user')
    passw = req.params.get('pass')
    batch = req.params.get('b')
    # if not name:
    #     try:
    #         req_body = req.get_json()
    #     except ValueError:
    #         pass
    #     else:
    #         name = req_body.get('name')

    if user:
        try:
            mydb = mysql.connector.connect(
                host = "remotemysql.com",
                user="y1bqmvgncQ",
                passwd="csaqN4Dz2S",
                database="y1bqmvgncQ",
                port=3306
            )

        except Exception:
            return func.HttpResponse(f"Database error")

        cursor = mydb.cursor()

        mes = "select comp from "+batch+" where name='"+user+"' and pass='"+passw+"'"

        cursor.execute(mes)
        res = cursor.fetchone()[0]

        mes = "select skills,lastdate from batches where tablename='"+batch+"'"
        cursor.execute(mes)
        ddd = cursor.fetchone()
        ski = ddd[0]
        ld = ddd[1]

        txt = {"comp" : res,"skills" : ski,"lastdate" : ld}
        return func.HttpResponse(json.dumps(txt))

    else:
        return func.HttpResponse(
             "Please pass a name on the query string or in the request body",
             status_code=400
        )
