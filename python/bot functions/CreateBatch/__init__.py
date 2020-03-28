import logging
import mysql.connector
import json

import azure.functions as func


def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    profile = req.params.get('p')
    skills = req.params.get('s')
    lastdate = req.params.get('ld')
    # if not profile:
    #     try:
    #         req_body = req.get_json()
    #     except ValueError:
    #         pass
    #     else:
    #         name = req_body.get('name')

    if profile:
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

        mycursor = mydb.cursor()

        mycursor.execute("select count(*) from batches")
        table = str(mycursor.fetchone()[0]+1)
        table = "batch"+table

        mycursor.execute("create table "+table+"(name varchar(30),pass varchar(10),score float,comp varchar(10))")

        sql = "insert into batches(profile,tablename,lastdate,skills) values(%s,%s,%s,%s)"
        val = (profile,table,lastdate,skills)

        mycursor.execute(sql,val)

        mydb.commit()

        return func.HttpResponse(str(table))

    else:
        return func.HttpResponse(
             "Please pass a name on the query string or in the request body",
             status_code=400
        )
