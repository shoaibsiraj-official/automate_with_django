from django.shortcuts import render
from django.http import HttpResponse
from dataentry.tasks import celery_test_task


def home(request):
    return render(request,'home.html')

def celery_test(request):
    #Here we set a timer it take that much to execute\
    celery_test_task.delay()
    return HttpResponse("<h1>Sucessfully run</h1>")