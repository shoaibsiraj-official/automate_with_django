from django.core.management.base import BaseCommand,CommandError

# from dataentry.models import Student
from django.apps import apps
import csv

class Command(BaseCommand):
    help = "Import data from the csv file"


    def add_arguments(self, parser):
        parser.add_argument('file_path',type=str,help='path to the csv file')
        parser.add_argument('model_name',type=str,help='Name of the model')

    def handle(self, *args, **kwargs):
        file_path = kwargs['file_path']
        model_name = kwargs['model_name'].capitalize()
        model = None

        #Search for the model across all installed app

        for app_config in apps.get_app_configs():
            #Try to search the model

            try:
                model = apps.get_model(app_config.label,model_name)
                break #stop searching once the model is found
            except LookupError:
                continue #model not found in this app,continue searching in next app

        if not model:
            raise CommandError (f'Model"{model_name}" not found in any apps') 


        with open(file_path,'r') as file:
            reader = csv.DictReader(file)

            for row in reader:
                model.objects.create(**row)

        return self.stdout.write(self.style.SUCCESS("Data imported from csv sucessfully"))