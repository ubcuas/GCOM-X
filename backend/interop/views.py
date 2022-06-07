import json
import logging
from datetime import datetime, timezone

from django.shortcuts import render
from django.http import HttpResponse, JsonResponse, HttpResponseServerError
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from interop.models import UasMission, UasTelemetry

from interop.client import Client

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
UAS_team_id = 0

def get_connect_stat():
    global connect_stat
    return connect_stat

def sendTelemetry(uasclient):
    connected = get_connect_stat()
    if connected > 0:
        if UasTelemetry.objects.count() != 0:
            uas_telem = UasTelemetry.objects.latest('created_at')
            if not uas_telem.uploaded:
                try:
                    uasclient.post_telemetry(uas_telem.marshal())
                    global connect_stat
                    connect_stat = 2
                    uas_telem.uploaded = True
                    uas_telem.save()
                    logger.debug('Posted telemtry data')
                    return True
                except Exception as error:
                    connect_stat = 3
                    logger.exception('Unable to send telemetry data error: %s' % error)
            else:
                logger.debug("No new telemtry!")
    else:
        logger.debug('UBC uas interop not connected or smurf not connected')
    return False

@csrf_exempt
@require_http_methods(["GET", "POST"])
def ubc_id(request):
    global UAS_team_id
    if request.method == 'GET':
        try:
            return JsonResponse({'ubc_id':UAS_team_id}, json_dumps_params={"indent":2})
        except Exception as err:
            logger.exception(err)
            return HttpResponseServerError(err)
    if request.method == 'POST':
        try:
            unicode_body = request.body.decode('utf-8')
            body = json.loads(unicode_body)
            UAS_team_id = int(body['ubc_id'])

            response = {
                'ubc_id': UAS_team_id,
            }
            return JsonResponse(response)
        except Exception as err:
            logger.exception(err)
            return HttpResponseServerError(err)

@csrf_exempt
@require_http_methods(["GET", "POST"])
def telemetry(request):
    if request.method == 'GET':
        try:
            uas_telem = UasTelemetry.objects.filter(team_id=UAS_team_id).order_by('-created_at')
            return JsonResponse(uas_telem[0].marshal(), json_dumps_params={"indent":2})
        except Exception as err:
            return HttpResponse(status=204)  # No content

    if request.method == 'POST':
        unicode_body = request.body.decode('utf-8')
        telem = json.loads(unicode_body)
        new_telem = UasTelemetry(team_id=UAS_team_id,
                                 latitude=telem['latitude_dege7'] / 1.0E7,
                                 longitude=telem['longitude_dege7'] / 1.0E7,
                                 altitude_msl=telem['altitude_msl_m'],
                                 uas_heading=telem['heading_deg'])
        new_telem.save()
        gcom_client = Client()
        sendTelemetry(gcom_client)
        return HttpResponse(status=200)

    return HttpResponse(status=400)  # Bad request

@csrf_exempt
@require_http_methods(["GET"])
def teams(request):
    try:
        gcomclient = Client()

        teams = gcomclient.get_teams_telemetry()
        client_session = gcomclient.get_client_session()

        logger.debug(teams)

    except Exception as e:
        logger.exception(e)
        return HttpResponseServerError(e)

    response_payload = []

    for team in teams:
        try:
            if (team['team']['username'] != client_session.username):
                telem = team['telemetry']
                team_telem = UasTelemetry(team_id=team['team']['id'],
                            latitude=telem['latitude'],
                            longitude=telem['longitude'],
                            altitude_msl=telem['altitude'],
                            uas_heading=telem['heading'])

                team_telem.save()
                response_payload.append(team_telem.marshal())
        except:
            pass

    return JsonResponse({'teams':response_payload}, json_dumps_params={"indent":2})

# -1 error, 0 stopped, 1 sending
@csrf_exempt
@require_http_methods(["GET"])
def telem_status(request):
    # the connection errors out so we show error here
    if connect_stat == 3:
        response = {
            'status': -1,
            'mission_id': current_mission_id,
        }
        return JsonResponse(response, json_dumps_params={"indent":2})
    # no error
    else:
        team_telems = UasTelemetry.objects.filter(team_id=UAS_team_id).order_by('-created_at')

        if len(team_telems) > 0:
            last_uas_telem = team_telems[0]
            stat = 1
            delta = datetime.now(timezone.utc) - last_uas_telem.created_at
            if delta.seconds <= 5:
                stat = 1
            else:
                stat = 0
        else:
            stat = -1
        response = {
            'status': stat,
            'mission_id': current_mission_id,
        }
        return JsonResponse(response, json_dumps_params={"indent":2})


@csrf_exempt
@require_http_methods(["GET"])
def team_telem_status(request):
    try:
        gcomclient = Client()
        team_telems = gcomclient.get_teams_telemetry()
        
    except Exception as e:
        logger.exception(e)
        return HttpResponseServerError(e)

    if len(team_telems) > 0:
        try:
            team_telems = list(filter(lambda i: i['team']['id'] != UAS_team_id, team_telems))
            sorted_team_telems = sorted(team_telems, key=lambda d: d['telemetryAgeSec'])
            last_team_telem = sorted_team_telems[0]
            if last_team_telem['telemetryAgeSec'] <= 5:
                stat = 1
            else:
                stat = 0
        except:
            stat = -1
    else:
        stat = -1
    response = {
        'status': stat,
        'mission_id': current_mission_id,
    }
    return JsonResponse(response, json_dumps_params={"indent":2})




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

    return JsonResponse(response, json_dumps_params={"indent":2})

@csrf_exempt
@require_http_methods(["GET"])
def missions(request, mission_id):
    try:
        gcomclient = Client()
        missions = gcomclient.get_mission(mission_id)
        return JsonResponse(missions, json_dumps_params={"indent":2})
    except Exception as e:
        logger.exception(e)
        return HttpResponseServerError(e)

@csrf_exempt
@require_http_methods(["POST"])
def mission(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    global current_mission_id 
    current_mission_id = int(body['mission_id'])

    try:
        gcomclient = Client()

        mission = gcomclient.get_mission(mission_id=str(current_mission_id))
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
