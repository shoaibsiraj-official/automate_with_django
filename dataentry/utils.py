from django.apps import apps
import csv
from django.core.exceptions import ValidationError
from django.core.mail import EmailMessage
from django.conf import settings

def get_all_models():
    default_models = ['Session', 'ContentType', 'LogEntry', 'Permission', 'Group', 'User', 'Upload']
    models = []
    for model in apps.get_models():
        if model.__name__ not in default_models:
            models.append(model.__name__)
    return models


def check_csv_error(file_path, model_name):
    model = None
    for app in apps.get_app_configs():
        try:
            model = apps.get_model(app.label, model_name)
            break
        except LookupError:
            continue

    if not model:
        raise ValidationError(f"Model {model_name} not found.")

    with open(file_path, 'r') as csvfile:
        reader = csv.DictReader(csvfile)
        model_fields = [field.name for field in model._meta.get_fields()]

        for row in reader:
            for key in row.keys():
                if key not in model_fields:
                    raise ValidationError(f"Column '{key}' is not a valid field for model '{model_name}'.")

def send_email_notification(mail_subject,message,to_email):
    try:
        from_email = settings.DEFAULT_FROM_EMAIL
        mail=EmailMessage(mail_subject,message,from_email,to=[to_email])
        mail.send()
    except Exception as e:
        raise e
