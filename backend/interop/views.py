import json
import logging

from django.shortcuts import render
from django.http import HttpResponse, JsonResponse, HttpResponseServerError
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from interop.models import UasMission, UasTelemetry
from interop.telemetry import telemThread

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
        new_telem = UasTelemetry(latitude = telem.latitude,
                                longitude = telem.longitude,
                                altitude_msl = telem.altitude_msl_m,
                                uas_heading = telem.heading_deg)
        new_telem.save()
        return HttpResponse(status=200)

    return HttpResponse(status=400)  # Bad request

@csrf_exempt
@require_http_methods(["GET", "POST", "PUT", "DELETE"])
def telemetrythread_control(request):
    global telemetrythread
    global uasclient

    ## Start thread with conf
    if request.method == 'POST':
        if telemetrythread and telemetrythread.is_alive():
            logger.warning("telemetrythread has already started!")
            return HttpResponse(status=400)  # Bad request

        conf = json.loads(request.body)
        telemetrythread = telemThread(conf=conf)
        logger.info("Telem thread starting")
        telemetrythread.start()

    ## Update configuration in running thread
    if request.method == 'PUT':
        if not telemetrythread:
            logger.warning("telemetrythread has NOT started! Can't update")
            return HttpResponse(status=400)  # Bad request

        conf = json.loads(request.body)
        telemetrythread.update_conf(conf)

    ## Stop the thread
    if request.method == 'DELETE':
        if not telemetrythread:
            logger.warning("telemetrythread Already stopped")
        else:
            telemetrythread.stop()

    ## Get status and configuration
    if request.method == 'GET':
        pass

    ## Return the status and thread conf
    if telemetrythread:
        payload = {
                'status': telemetrythread.is_alive(),
                'conf': telemetrythread.conf,
            }
        return JsonResponse(payload)
    else:
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
