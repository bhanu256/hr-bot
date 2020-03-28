import logging
import mysql.connector
import json
import string
import random

import azure.functions as func


def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    batch = req.params.get('b')
    name = req.params.get('n')
    # if not name:
    #     try:
    #         req_body = req.get_json()
    #     except ValueError:
    #         pass
    #     else:
    #         name = req_body.get('name')

    if name:
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

        passw = ''.join(random.choices(string.ascii_letters+string.digits,k=6))

        sql = "insert into "+batch+"(name,pass,score,comp) values(%s,%s,%s,%s)"
        val = (name,passw,0,"false")

        cursor.execute(sql,val)
        mydb.commit()

        return func.HttpResponse(str(passw))

    else:
        return func.HttpResponse(
             "Please pass a name on the query string or in the request body",
             status_code=400
        )
