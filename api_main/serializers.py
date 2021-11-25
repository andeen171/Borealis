from rest_framework import serializers
from .models import Order, Offer, Contract, Image


class ImageSerializer(serializers.ModelSerializer):
    thumbnail = serializers.ReadOnlyField(source="thumbnail.url")

    class Meta:
        model = Image
        fields = ('src', 'thumbnail')


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = "__all__"

    def create(self, validated_data):
        order = Order(title=validated_data['title'], description=validated_data['description'],
                      category=validated_data['category'], device=validated_data['device'], user=validated_data['user'])
        order.save()
        return order


class OrderImageSerializer(serializers.Serializer):
    images = ImageSerializer(many=True)
    info = OrderSerializer()


class OfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offer
        fields = "__all__"

    def create(self, validated_data):
        offer = Offer(problem=validated_data['problem'], description=validated_data['description'],
                      value_estimate=validated_data['value_estimate'],
                      need_replacement=validated_data['need_replacement'],
                      replacements=validated_data['replacements'], order=validated_data['order'],
                      user=validated_data['user'])
        offer.save()
        return offer


class ContractSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contract
        fields = "__all__"

    def create(self, validated_data):
        contract = Contract(order=validated_data["order"], offer=validated_data['offer'],
                            client=validated_data['client'], technician=validated_data['technician'],
                            value=validated_data['value'])
        contract.save()
        return contract

