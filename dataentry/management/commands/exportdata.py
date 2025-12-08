import csv
from django.core.management.base import BaseCommand
import datetime
from django.apps import apps


class Command(BaseCommand):
    help = 'Export data from student model to save in csv file'

    # ACCEPT the arguments
    def add_arguments(self, parser):
        parser.add_argument('model_name',type=str,help='Name of the model')


    def handle(self, *args, **kwargs):
        model_name = kwargs['model_name']
        model=None
         #Search in all the installed app if the modl if the model is exits
        for app_config in apps.get_app_configs():
            try:#get_model is the builtin in django
                model = apps.get_model(app_config.label,model_name)  #here we find the given model name in app
                break
            except LookupError:
                continue
        
        if not model:
            self.stderr.write(f'Model {model_name} couldnot found')
            return

        data = model.objects.all()


        # Generate the current date and time
        timestamp=datetime.datetime.now().strftime("%y-%m-%d--%H-%M-%S")
        # Define the csv file name/path..
        file_path=f'Exported_{model_name}_data{timestamp}.csv'
        # Open the csv file and write the data
        with open(file_path,"w",newline='') as file:
            writer = csv.writer(file)

            # write the data header where data save in format
            # print all the fields of the model
            writer.writerow([field.name for field in model._meta.fields])  #_meta.fields means all the fileds in model


            # write thge data rows
            for dt in data:
                writer.writerow([getattr(dt,field.name) for field in model._meta.fields])
        self.stdout.write(self.style.SUCCESS('Data is exported sucessfully'))