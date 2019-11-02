from django.shortcuts import render
from django.http import Http404, HttpResponse, JsonResponse

from surveyopti.models import SurveyPOI

import surveyopti.survey_algorithm as salg
import json

# Create your views here.
def calc(request):
    rawPoints = SurveyPOI.objects.filter()

    cleanPoints = [(rp.latitude, rp.longitude) for rp in rawPoints]

    distance, points = salg.calculate(cleanPoints)
    return JsonResponse({"distsnce": distance, "point": points})
