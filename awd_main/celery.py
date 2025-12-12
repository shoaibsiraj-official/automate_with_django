import os
from celery import Celery
from dotenv import load_dotenv  # ADD THIS

# Load .env for Celery (VERY IMPORTANT)
load_dotenv()  # ADD THIS

# Set the default Django settings module for the Celery program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'awd_main.settings')

app = Celery('awd_main')

app.config_from_object('django.conf:settings', namespace='CELERY')

app.autodiscover_tasks()


@app.task(bind=True, ignore_result=True)
def debug_task(self):
    print(f'Request: {self.request!r}')
