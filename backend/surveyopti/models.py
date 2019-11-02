from django.db import models

class SurveyPOI(models.Model):
    mission = models.ForeignKey('interop.UasMission', on_delete=models.CASCADE, null=True, blank=True)
    latitude = models.FloatField()
    longitude = models.FloatField()
    image = models.ForeignKey('imp_module.ImpImage', on_delete=models.CASCADE, null=True, blank=True)
    order = models.IntegerField(null=True)