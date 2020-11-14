import json
import logging

import time


from django.shortcuts import render
from django.http import HttpResponse, JsonResponse, HttpResponseServerError
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from interop.models import UasMission, UasTelemetry

from interop.client import Client

from pylibuuas.telem import deserialize_telem_msg

logger = logging.getLogger(__name__)
        
"""
Uas_client connection status
0 - Disconnected
1 - Connected
2 - Connected Sending data
3 - Connected Sending data Failed
"""

connect_stat = 0
current_mission_id = -1

telemetrythread = None

def get_connect_stat():
    global connect_stat
    return connect_stat

def get_telemetrythread():
    global telemetrythread
    return telemetrythread


def sendTelemetry(uasclient):
    connected = get_connect_stat()
    if connected > 0:
        if UasTelemetry.objects.count() != 0:

            uas_telem = UasTelemetry.objects.latest('created_at')
            if not uas_telem.uploaded:
                try:
                    uasclient.post_telemetry(uas_telem.marshal())
                    connect_stat = 2
                    uas_telem.uploaded = True
                    uas_telem.save()
                    logger.debug('Posted telemtry data')
                    return True
                except Exception as error:
                    connect_stat = 3
                    logger.exception('Unable to send telemtry data error: %s' % error)
            else:
                logger.debug("No new telemtry!")
    else:
        logger.debug('UBC uas interop not connected or smurf not connected')
    return False

@csrf_exempt
@require_http_methods(["GET", "POST"])
def telemetry(request):
    if request.method == 'GET':
        uas_telem = UasTelemetry.objects.all().order_by('-created_at')
        if uas_telem:
            return JsonResponse(uas_telem[0].marshal())
        else:
            return HttpResponse(status=204)  # No content

    if request.method == 'POST':        
        telem = deserialize_telem_msg(request.body)
        new_telem = UasTelemetry(latitude=telem.latitude_dege7 / 1.0E7,
                                 longitude=telem.longitude_dege7 / 1.0E7,
                                 altitude_msl=telem.altitude_msl_m,
                                 uas_heading=telem.heading_deg)
        new_telem.save()
        gcom_client = Client()
        sendTelemetry(gcom_client)
        return HttpResponse(status=200)

    return HttpResponse(status=400)  # Bad request


@csrf_exempt
@require_http_methods(["POST"])
def login(request):
    global connect_stat
    global current_mission_id

    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    username = body['username']
    password = body['password']

    logger.info('Login: username - %s, password - %s', username, password)
    logger.info('Login: url - %s, port - %s', body['url'], body['portNum'])

    try:
        gcomclient = Client()
        gcomclient.login(body['url'], body['portNum'], username, password)

    except Exception as e:
        logger.exception(e)
        return HttpResponseServerError(e)

    connect_stat = 1
    response = {
        'status': connect_stat,
        'mission_id': current_mission_id,
    }
    return JsonResponse(response)

@csrf_exempt
@require_http_methods(["GET"])
def status(request):
    global connect_stat
    global current_mission_id

    response = {
        'status': connect_stat,
        'mission_id': current_mission_id,
    }

    return JsonResponse(response)

@csrf_exempt
@require_http_methods(["POST"])
def mission(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    current_mission_id = int(body['mission_id'])

    try:
        gcomclient = Client()

        mission = gcomclient.get_mission(mission_id=current_mission_id)
        logger.debug(mission)
        UasMission.create(mission)

    except Exception as e:
        logger.exception(e)
        return HttpResponseServerError(e)

    response = {
        'status': connect_stat,
        'mission_id': current_mission_id,
    }

    return JsonResponse(response)
