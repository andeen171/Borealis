from rest_framework import serializers
from .models import Order, Category, Offer, Contract, Image


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
                      category=validated_data['category'], user=validated_data['user'])
        order.save()
        return order


class OrderImageSerializer(serializers.Serializer):
    images = ImageSerializer(many=True)
    info = OrderSerializer()


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


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
