from awd_main.celery import app
from django.core.management import call_command
import time
from .utils import send_email_notification
from django.conf import settings

@app.task
def celery_test_task():
    time.sleep(5)
    mail_subject='Test subject'
    message='Hello shoaib siraj'
    
    to_email = settings.DEFAULT_TO_EMAIL
    send_email_notification(mail_subject,message,to_email)
    return 'Hello welcome shoaib siraj'

@app.task
def import_data_task(full_path, model_name):
    try:
        call_command("importdata", full_path, model_name)
    except Exception as e:
        raise e
    mail_subject='Automated django'
    message='Your data is imported sucessfully'
    to_email=settings.DEFAULT_TO_EMAIL
    send_email_notification(mail_subject,message,to_email)
    return 'Data imported sucessfully shoaib'


@app.task
def export_data_task(model_name):
    try:
        # Call your custom Django command: python manage.py exportdata <model_name>
        call_command("exportdata", model_name)

    except Exception as e:
        raise e

    # Send email notification
    mail_subject = 'Automated Django Export'
    message = f'Your data for model "{model_name}" has been exported successfully.'
    to_email = settings.DEFAULT_TO_EMAIL

    send_email_notification(mail_subject, message, to_email)

    return f'Data exported successfully for model {model_name}'
