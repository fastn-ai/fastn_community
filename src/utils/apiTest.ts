// API Test Utility
// This file helps test the API integration

import { ApiService } from '@/services/api';

export const testApiConnection = async () => {
  try {
    console.log('🧪 Testing API connection...');
    
    const startTime = Date.now();
    const topics = await ApiService.getAllTopics();
    const endTime = Date.now();
    
    console.log('✅ API connection successful!');
    console.log('📊 Topics fetched:', topics.length);
    console.log('⏱️  Response time:', endTime - startTime, 'ms');
    
    if (topics.length > 0) {
      console.log('📝 Sample topic:', {
        id: topics[0].id,
        title: topics[0].title,
        category: topics[0].category_id,
        replies: topics[0].reply_count,
        views: topics[0].view_count
      });
    }
    
    return {
      success: true,
      topicsCount: topics.length,
      responseTime: endTime - startTime,
      sampleTopic: topics[0]
    };
  } catch (error) {
    console.error('❌ API connection failed:', error);
    
    let errorType = 'Unknown error';
    if (error instanceof Error) {
      if (error.message.includes('429')) {
        errorType = 'Rate limited (429)';
      } else if (error.message.includes('Network')) {
        errorType = 'Network error';
      } else if (error.message.includes('401')) {
        errorType = 'Authentication error';
      } else if (error.message.includes('403')) {
        errorType = 'Access denied';
      } else if (error.message.includes('500')) {
        errorType = 'Server error';
      }
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      errorType
    };
  }
};

// Test the API when this file is imported
if (typeof window !== 'undefined') {
  // Only run in browser environment
  setTimeout(() => {
    testApiConnection().then(result => {
      if (result.success) {
        console.log('🎉 API integration is working!');
        console.log(`📈 Performance: ${result.responseTime}ms for ${result.topicsCount} topics`);
      } else {
        console.error('💥 API integration failed:', result.errorType);
        console.error('🔍 Error details:', result.error);
        
        if (result.errorType === 'Rate limited (429)') {
          console.log('💡 Tip: The API is rate limited. The app will automatically retry with exponential backoff.');
        }
      }
    });
  }, 2000); // Increased delay to avoid rate limiting
} 