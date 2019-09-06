from rest_framework import serializers

from imp_module.models import ImpImage, ImpODLC


class ImpImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImpImage
        fields = "__all__"


class ImpODLCSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImpODLC
        fields = "__all__"
