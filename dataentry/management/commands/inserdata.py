from django.core.management.base import BaseCommand
from dataentry.models import Student

class Command(BaseCommand):
    help = "it will inser the data"

    def handle(self, *args, **kwarge):
        dataset=[
            {'roll_number':102,'name':'Nasir','age':'18'},
            {'roll_number':106,'name':'Rajendra','age':'20'},
            {'roll_number':104,'name':'Mozakir','age':'21'},
            {'roll_number':105,'name':'Nitesh','age':'22'},
        ]
        for data in dataset:
            roll_number = data['roll_number']
            existing_record=Student.objects.filter(roll_number=roll_number).exists()

            if not existing_record:
                Student.objects.create(roll_number=data['roll_number'],name=data['name'],age =data['age'])
            else:
                self.stdout.write(self.style.WARNING(f"Student with roll_no{roll_number} already exist"))



        self.stdout.write(self.style.SUCCESS("Data inserted sucessfully"))
        