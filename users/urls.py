from django.urls import path
from .views import (
    RegisterView,
    LoginView,
    LogoutView,
    UserProfileView,
    ChangePasswordView,
    UserListView,
    UserDetailView,
    DashboardStatsView,
    MonthlyActivityView,
    TopPerformersView,
    BulkApprovalView,
    PendingApprovalsView,
    ExportRatingsExcelView,
    ExportRatingsPDFView,
    ExportLessonAnalysisExcelView,
    ChartDataView,
    AnalyticsOverviewView,
)

urlpatterns = [
    # Auth
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('users/', UserListView.as_view(), name='user-list'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),

    # Analytics
    path('dashboard/', DashboardStatsView.as_view(), name='dashboard'),
    path('monthly-activity/', MonthlyActivityView.as_view(), name='monthly-activity'),
    path('top-performers/', TopPerformersView.as_view(), name='top-performers'),
    path('bulk-approval/', BulkApprovalView.as_view(), name='bulk-approval'),
    path('pending-approvals/', PendingApprovalsView.as_view(), name='pending-approvals'),

    # Charts & Analytics
    path('charts/', ChartDataView.as_view(), name='chart-data'),
    path('analytics-overview/', AnalyticsOverviewView.as_view(), name='analytics-overview'),

    # Export
    path('export/ratings/excel/', ExportRatingsExcelView.as_view(), name='export-ratings-excel'),
    path('export/ratings/pdf/', ExportRatingsPDFView.as_view(), name='export-ratings-pdf'),
    path('export/lesson-analysis/excel/', ExportLessonAnalysisExcelView.as_view(), name='export-analysis-excel'),
]