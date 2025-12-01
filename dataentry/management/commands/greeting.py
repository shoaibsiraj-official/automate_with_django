from django.core.management.base import BaseCommand

class Greeting(BaseCommand):
    help = "print greeting message"

    def handle(self, *args, **kwargs):
        self.stdout.write("hello shoaib")