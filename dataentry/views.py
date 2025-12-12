from rest_framework.decorators import api_view
from rest_framework.response import Response
from .tasks import import_data_task
from .tasks import export_data_task
from django.contrib import messages
from celery.result import AsyncResult
from .models import Upload
from .utils import get_all_models, check_csv_error


@api_view(['GET', 'POST'])
def data_entry_view(request):

    if request.method == "GET":
        models = get_all_models()
        return Response({"message": "Success", "data": models})

    model_name = request.data.get("model")
    file = request.FILES.get("file")

    if not model_name or not file:
        return Response({"error": "Model and file are required"}, status=400)

    # Save uploaded file
    upload = Upload.objects.create(file_model=model_name, file=file)
    full_path = upload.file.path

    # Validate CSV BEFORE Celery starts
    try:
        check_csv_error(full_path, model_name)
    except Exception as e:
        return Response({"error": str(e)}, status=400)

    # Start background Celery task
    task = import_data_task.delay(full_path, model_name)

    return Response({
        "message": "Import started.",
        "task_id": task.id,
        "status": "processing"
    })


@api_view(["GET"])
def task_status(request):
    task_id = request.GET.get("task_id")
    result = AsyncResult(task_id)
    return Response({
        "state": result.state,
        "result": result.result
    })


#Exportdata

@api_view(["GET", "POST"])
def data_export_view(request):

    if request.method == "GET":
        return Response({"message": "Success", "data": get_all_models()})

    # POST
    # print("DEBUG REQUEST.DATA =", request.data)   # <--- ADD THIS

    model_name = request.data.get("model")

    if not model_name:
        return Response({"error": "Model is required"}, status=400)
    task = export_data_task.delay(model_name)

    return Response({
        "message": "Export started.",
        "task_id": task.id,
        "status": "processing"
    })

