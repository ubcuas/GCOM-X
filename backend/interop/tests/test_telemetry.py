import time

from django.test import Client, TestCase
from django.urls import reverse
from unittest.mock import patch, MagicMock

from interop.views import get_telemetrythread

class InteropTelemetryCase(TestCase):
    @patch('interop.telemetry.sendTelemetry')
    def test_post_telemetry_success(self, mock_sendTelemetry):
        mock_sendTelemetry.return_value = True

        c = Client()
        post_data = {'interval': 1, 'to_count': 10}
        response = c.post(reverse('interop.telemetrythread'),
                        post_data,
                        content_type="application/json")

        self.assertEqual(200, response.status_code)
        self.assertEqual(True, response.json()['status'])

        telemetrythread = get_telemetrythread()

        if telemetrythread:
            telemetrythread.stop()
            telemetrythread.join()

    def test_sendTelemetry(self):
        from interop.models import UasTelemetry
        from interop import telemetry
        mock_Client = MagicMock()

        test_telem = UasTelemetry(latitude=24.0,
                                  longitude=23.0,
                                  altitude_msl=100,
                                  uas_heading=123)
        test_telem.save()
        self.assertFalse(test_telem.uploaded)

        result = telemetry.sendTelemetry(mock_Client)
        self.assertTrue(result)

        test_telem = UasTelemetry.objects.get(id=test_telem.id)
        self.assertTrue(test_telem.uploaded)

        mock_Client.post_telemetry.assert_called()
