import json

from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from channels.layers import get_channel_layer

from asgiref.sync import async_to_sync

from interop import odlc as interop_odlc
from imp_module.models import ImpImage, ImpODLC
from imp_module.serializer import ImpImageSerializer, ImpODLCSerializer
from imp_module.odlc_handler import ODLCHandler
from common.utils.uas_web_message import UASWebMessage


class ImpImageConsumer(AsyncWebsocketConsumer):
    """
    ImpImage WebSocket Consumer
    """
    GROUP_NAME = 'image'

    async def connect(self):
        """
        On Connect handler: Sets up channel
        """
        await get_channel_layer().group_add(ImpImageConsumer.GROUP_NAME, self.channel_name)
        await self.accept()
        await ImpImageConsumer._send_image_data()

    async def disconnect(self, close_code):
        """
        On Disconnect handler: Cleans up channel
            :param close_code: close code
        """
        await get_channel_layer().group_discard(ImpImageConsumer.GROUP_NAME, self.channel_name)

    @staticmethod
    async def receive(text_data):
        """
        On Receive handler: Receives data and broadcasts to channel
            :param text_data: string representing transferred data
        """
        message = UASWebMessage(text_data)

        if message.get_type() == UASWebMessage.Type.UPDATE:
            ImpImage.update(message.get_pk(), message.get_data())

        await ImpImageConsumer._send_image_data()

    @staticmethod
    def update_image_data():
        """
        Broadcasts updates to channel
        """
        async_to_sync(ImpImageConsumer._send_image_data)()

    @staticmethod
    async def _send_image_data():
        """
        Broadcasts updates to channel
        """
        image_query_set = await database_sync_to_async(ImpImage.objects.all)()
        image_json = ImpImageSerializer(image_query_set, many=True).data
        await get_channel_layer().group_send(ImpImageConsumer.GROUP_NAME, {
            'type': 'image_message',
            'message': image_json
        })

    async def image_message(self, event):
        """
        Sends an image message
            :param event: {
                message: message to send
            }
        """
        message = event['message']

        await self.send(text_data=json.dumps(message))


class ImpObjectConsumer(AsyncWebsocketConsumer):
    """
    ImpODLC WebSocket Consumer
    """
    GROUP_NAME = 'object'

    async def connect(self):
        """
        On Connect handler: Sets up channel
        """
        await get_channel_layer().group_add(ImpObjectConsumer.GROUP_NAME, self.channel_name)
        await self.accept()
        await self._send_object_data()

    async def disconnect(self, close_code):
        """
        On Disconnect handler: Cleans up channel
            :param close_code: close code
        """
        await self.channel_layer.group_discard(ImpObjectConsumer.GROUP_NAME, self.channel_name)

    @staticmethod
    async def receive(text_data):
        """
        On Receive handler: Receives data and broadcasts to channel
            :param text_data: string representing transferred data
        """
        message = UASWebMessage(text_data)

        if message.get_type() == UASWebMessage.Type.CREATE:
            new_odlc = ImpODLC.create(message.get_data())
            ODLCHandler.create_odlc(new_odlc)
            await interop_odlc.post_odlc_thumbnail(new_odlc)

        elif message.get_type() == UASWebMessage.Type.UPDATE:
            ImpODLC.update(message.get_pk(), message.get_data())
            up_odlc = ImpODLC.objects.get(pk=message.get_pk())
            ODLCHandler.update_odlc(up_odlc)

        elif message.get_type() == UASWebMessage.Type.DELETE:
            ImpODLC.delete(message.get_pk())
            ODLCHandler.delete_odlc(message.get_pk())

        elif message.get_type() == UASWebMessage.Type.COMBINE:
            ImpODLC.combine(message.get_pk(), message.get_data())
            up_odlc = ImpODLC.objects.get(pk=message.get_pk())
            ODLCHandler.update_odlc(up_odlc)

        await ImpObjectConsumer._send_object_data()

    @staticmethod
    async def _send_object_data():
        """
        Broadcasts updates to channel
        """
        object_query_set = await database_sync_to_async(ImpODLC.objects.all)()
        object_json = ImpODLCSerializer(object_query_set, many=True).data
        await get_channel_layer().group_send(ImpObjectConsumer.GROUP_NAME, {
            'type': 'object_message',
            'message': object_json
        })

    async def object_message(self, event):
        """
        Sends an object message
            :param event: {
                message: message to send
            }
        """
        message = event['message']

        await self.send(text_data=json.dumps(message))
