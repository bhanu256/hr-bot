import logging
import smtplib

import azure.functions as func


def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    name = req.params.get('n')
    profile = req.params.get('p')
    lastdate = req.params.get('ld')
    mail = req.params.get('m')
    passw = req.params.get('pw')
    batch = req.params.get('b')
    # if not name:
    #     try:
    #         req_body = req.get_json()
    #     except ValueError:
    #         pass
    #     else:
    #         name = req_body.get('name')

    if name:
        s = smtplib.SMTP('smtp.gmail.com',587)
        s.starttls()
        s.login("bhanuphani100@gmail.com","chowd@ry")
        mes = ("Subject : Shortlisted\n\n Dear "+name+",\n You have been shortlisted for the job profile of "+profile
        +". Please login to the below link with given cedentials and attend the interview before "+lastdate
        +"\nLink : https://autoview.azurewebsites.net/?b="+batch+"\n Username : "+name
        +"\nPassword : "+passw)
        s.sendmail("bhanuphani100@gmail.com",mail,mes)
        s.quit()
        return func.HttpResponse(f"suc")
    else:
        return func.HttpResponse(
             "Please pass a name on the query string or in the request body",
             status_code=400
        )
