from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.management import call_command
from .models import Upload
from .utils import get_all_models, check_csv_error


@api_view(['GET', 'POST'])
def data_entry_view(request):

    # ⬅ GET: return model list
    if request.method == "GET":
        models = get_all_models()
        return Response({"message": "Success", "data": models})

    # ⬅ POST: upload + import csv
    model_name = request.data.get("model")
    file = request.FILES.get("file")

    if not model_name or not file:
        return Response({"error": "Model and file are required"}, status=400)

    # Save uploaded file
    upload = Upload.objects.create(file_model=model_name, file=file)


    # Full local file path
    full_path = upload.file.path

    # Validate CSV
    try:
        check_csv_error(full_path, model_name)
    except Exception as e:
        return Response({"error": str(e)}, status=400)

    # Run Django import command
    try:
        call_command("importdata", full_path, model_name)
    except Exception as e:
        return Response({"error": str(e)}, status=400)

    return Response({"message": "Data imported successfully!"})
