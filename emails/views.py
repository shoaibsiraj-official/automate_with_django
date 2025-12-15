from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Sum
from django.conf import settings
from .tasks import email_send_task

# from .task import email_send_task
from .models import Emails,List,Subscriber

# from django.conf import settings

from django.http import JsonResponse


@api_view(['POST','GET'])
def send_email(request):

    if request.method == "POST":
        
        Email_list = request.POST.get('Email-List')

        
        mail_subject = request.POST.get('subject')
        message = request.POST.get('body')
        file_path = request.FILES.get('Attachment')
        
       

        list_instance, created = List.objects.get_or_create(email_list=Email_list)
        email = Emails(email_list=list_instance, subject=mail_subject, body=message)
        email.save()
        if file_path:
            email.attachment = file_path
            email.save()

        
        subscriber = Subscriber.objects.filter(email_list=list_instance)
        if email.attachment:
            attachment = email.attachment.path
        else:
            attachment = None
        
        to_email = [s.email_address for s in subscriber]
      
        
        email_id = email.id
        email_send_task.delay(mail_subject,message ,to_email )
       
        #insid  e emaill address we have all data respective to their list
        
        

        return Response({
            "message": "Email saved successfully",
            "list": Email_list,
            "subject": mail_subject,
            "body": message,
            "recipients":to_email,
        })

    # -------- GET REQUEST ----------
    all_models = List.objects.values_list("email_list", flat=True)

    return Response({
        "email_lists": list(all_models)  # convert QuerySet to list
    })

def open_email(request):
    return Response({
       ' message':"hello "
    })
def click_email(request):
    return Response({
       ' message':"bye bye "
    })