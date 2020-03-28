import logging
import mysql.connector
import json

import azure.functions as func


def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    try:
        mydb = mysql.connector.connect(
                host = "remotemysql.com",
                user="y1bqmvgncQ",
                passwd="csaqN4Dz2S",
                database="y1bqmvgncQ",
                port=3306
            )
        
        cursor = mydb.cursor()
        cursor.execute("select profile,skills from batches")
        res = cursor.fetchall()

        i=1
        dt = {}
        for j in res:
            dt[i] = j
            i = i+1
        
        return func.HttpResponse(json.dumps(dt))
        
    except Exception:
        return func.HttpResponse(
             "Please pass a name on the query string or in the request body",
             status_code=400
        )
