import logging
import mysql.connector
import json

import azure.functions as func


def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    user = req.params.get('n')
    passw = req.params.get('p')
    batch = req.params.get('b')
    score = req.params.get('s')
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
                user="",
                passwd="",
                database="",
                port=3306
            )

        except Exception:
            return func.HttpResponse(f"Database error")

        cursor = mydb.cursor()

        sql = "update "+batch+" set comp='true', score="+score+" where name=%s and pass=%s"
        val = (user,passw)

        cursor.execute(sql,val)
        mydb.commit()

        return func.HttpResponse(json.dumps("success"))
    else:
        return func.HttpResponse(
             "Please pass a name on the query string or in the request body",
             status_code=400
        )
