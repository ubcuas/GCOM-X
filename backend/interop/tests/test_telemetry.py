from pylibuuas.telem import TelemetryArgs, new_telem_msg
from django.test import Client, TestCase
from django.urls import reverse
from unittest.mock import patch, MagicMock


class InteropTelemetryCase(TestCase):
    @patch('interop.views.sendTelemetry')
    def test_post_telemetry_success(self, mock_sendTelemetry):
        mock_sendTelemetry.return_value = True

        c = Client()
        post_payload = new_telem_msg(TelemetryArgs(
            latitude_dege7=1,
            longitude_dege7=2,
            altitude_agl_m=3.0,
            altitude_msl_m=4.0,
            heading_deg=5.0,
            velocityx_m_s=6.0,
            velocityy_m_s=7.0,
            velocityz_m_s=8.0,
            roll_rad=9.0,
            pitch_rad=10.0,
            yaw_rad=11.0,
            rollspeed_rad_s=12.0,
            pitchspeed_rad_s=13.0,
            yawspeed_rad_s=14.0,
            timestamp_pixhawk_ms=15,
            timestamp_msg_ms=16,
        ))
        response = c.post(reverse('interop.telemetry'),
                          post_payload,
                          content_type="application/json")

        self.assertEqual(200, response.status_code)
        mock_sendTelemetry.assert_called_once()

    def test_sendTelemetry(self):
        from interop.models import UasTelemetry
        from interop import views
        mock_Client = MagicMock()

        test_telem = UasTelemetry(team_id=0,
                                  latitude=24.0,
                                  longitude=23.0,
                                  altitude_msl=100,
                                  uas_heading=123,
                                  groundspeed_m_s=15,
                                  chan3_raw=975)
        test_telem.save()
        self.assertFalse(test_telem.uploaded)

        result = views.sendTelemetry(mock_Client)
        self.assertTrue(result)

        test_telem = UasTelemetry.objects.get(id=test_telem.id)
        self.assertTrue(test_telem.uploaded)

        mock_Client.post_telemetry.assert_called()
