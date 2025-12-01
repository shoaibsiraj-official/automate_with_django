from django.core.management.base import BaseCommand

from dataentry.models import Student
import csv

class Command(BaseCommand):
    help = "Import data from the csv file"


    def add_arguments(self, parser):
        parser.add_argument('file_path',type=str,help='path to the csv file')

    def handle(self, *args, **kwargs):
        file_path = kwargs['file_path']
        with open(file_path,'r') as file:
            reader = csv.DictReader(file)

            for row in reader:
                Student.objects.create(**row)

        return self.stdout.write(self.style.SUCCESS("Data imported from csv sucessfully"))