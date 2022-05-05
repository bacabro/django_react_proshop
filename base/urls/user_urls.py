from django.urls import path
from base.views import user_views as views

urlpatterns = [
    #path('users/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    #path('', views.getRoutes, name="routes"),

    path('register/', views.registerUser, name='register-user'),

    path('profile/', views.getUserProfile, name="user-profile-update"),

    path('profile/update/', views.updateUserProfile, name="user-profile"),

    path('', views.getUsers, name="users"),

    path('<str:pk>/', views.getUserById, name='user'),

    path('update/<str:pk>/', views.updateUser, name='user-update'),

    path('delete/<str:pk>/', views.deleteUser, name='user-delete'),


]