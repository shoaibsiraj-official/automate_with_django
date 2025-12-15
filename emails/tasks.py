from awd_main.celery import app
from dataentry.utils import send_email_notification

@app.task
def email_send_task(mail_subject,message ,to_email ):
    send_email_notification(mail_subject,message ,to_email)
    return 'your email task is complete'