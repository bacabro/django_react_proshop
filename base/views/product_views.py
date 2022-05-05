from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from rest_framework import status

from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from base.models import Product, Review
from base.serializers import ProductSerializer
# Create your views here.

@api_view(['GET'])
def getProducts(request):
    query = request.query_params.get('keyword')
    print(query)
    if query == None:
        query = ''
    #products = Product.objects.all()
    products = Product.objects.filter(name__icontains=query) #i means case insensitive

    page = request.query_params.get('page')
    paginator = Paginator(products, 2)
    try:
        products = paginator.page(page)
    except PageNotAnInteger:
        products = paginator.page(1)
    except EmptyPage: #Page that not exist, return the last page
        products = paginator.page(paginator.num_pages)

    if page == None:
        page = 1

    page = int(page)

    serializer = ProductSerializer(products, many=True)
    return Response({'products' : serializer.data, 'page': page, 'pages': paginator.num_pages})
    #return Response(serializer.data)


@api_view(['GET'])
def getTopProducts(request):
    products = Product.objects.filter(rating__gte=4).order_by('-rating')[0:5] #gte
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)



@api_view(['GET'])
def getProduct(request, pk):
    product = Product.objects.get(_id=pk)
    serializer = ProductSerializer(product, many=False)
    #product = None
    #for i in products:
       #if i['_id'] in pk:
            #product = i
            #break
    return Response(serializer.data)



@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteProduct(request, pk):
    product = Product.objects.get(_id=pk)
    product.delete()
    serializer = ProductSerializer(product, many=False)
    return Response('Product Deleted')



@api_view(['POST'])
@permission_classes([IsAdminUser])
def createProduct(request):
    #product = Product.objects.get(_id=pk)
    user = request.user
    product = Product.objects.create(
        user = user,
        name = request.data['name'],
        price = request.data['price'],
        brand = request.data['brand'],
        countInStock = request.data['countInStock'],
        category = request.data['category'],
        description = request.data['description'],   
    )
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateProduct(request, pk):
    data = request.data
    product = Product.objects.get(_id=pk)

    product.name = data['name']
    product.price = data['price']
    product.brand = data['brand']
    product.category = data['category']
    product.countInStock = data['countInStock']
    product.description = data['description']
    product.save()

    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)


@api_view(['POST'])
def uploadImage(request):
    data = request.data
    product_id = data['product_id']
    product = Product.objects.get(_id=product_id)

    product.image = request.FILES.get('image')
    product.save()
    
    return Response('Image was uploaded')

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createProductReview(request, pk):
    user = request.user
    data = request.data
    try:
        product = Product.objects.get(_id=pk)
        #1 - Review already exists
        alreadyExists = product.review_set.filter(user = user).exists() #query set

        if alreadyExists:
            content = {'detail': 'Product already reviewed'}
            return Response(content, status=status.HTTP_400_BAD_REQUEST)
        #2 - No rating or 0
        elif data['rating'] == 0:
            content = {'detail': 'Please select a rating'}
            return Response(content, status=status.HTTP_400_BAD_REQUEST)
        #3 - Create review
        else:
            review = Review.objects.create(
                user = user,
                product = product,
                name = user.first_name,
                rating = data['rating'],
                comment=data['comment']
            )
            reviews = product.review_set.all() #query set

            product.numReviews = len(reviews)
            
            total = 0
            for i in reviews:
                total += i.rating

            product.rating = total / len(reviews)
            product.save()

            return Response({'detail': 'Review was added'}, status=status.HTTP_200_OK)
    except Product.DoesNotExist:
        return Response({'detail': 'This product does not exist or it was deleted'}, status=status.HTTP_400_BAD_REQUEST)


    


