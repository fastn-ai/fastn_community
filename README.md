# Fastn Community Platform

A modern, frontend-only community platform built with React, TypeScript, and Vite. Features comprehensive admin capabilities for content management and user administration.

## Features

### 🎯 Core Features
- **Community Platform**: Discussion forums, topics, and replies
- **Admin Dashboard**: Complete content management system
- **User Management**: User administration and monitoring
- **Analytics**: Real-time platform statistics and insights

### 🚀 Admin Capabilities
- **Content Management**: Approve, reject, and delete topics
- **User Administration**: Manage user accounts and permissions
- **Analytics Dashboard**: Monitor platform growth and engagement
- **Search & Filter**: Advanced content discovery tools

### ⚡ Performance Optimizations
- **Database Indexing**: Optimized query performance
- **Caching Layer**: LRU cache implementation
- **Request Batching**: Reduced API overhead
- **CDN Integration**: Optimized asset delivery
- **Frontend Optimizations**: Lazy loading, virtual scrolling, infinite scroll

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: Radix UI, Tailwind CSS, shadcn/ui
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Build Tool**: Vite with optimized configuration

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/fastn-ai/fastn_community.git
cd fastn_community
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
src/
├── components/
│   ├── community/          # Community-specific components
│   ├── optimized/          # Performance-optimized components
│   └── ui/                 # Reusable UI components
├── pages/                  # Application pages
├── services/               # API services and utilities
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions
└── contexts/              # React contexts (removed auth)
```

## Admin Dashboard

Access the admin dashboard at `/admin` to manage:

- **Topics**: Approve, reject, delete content
- **Users**: Manage user accounts and permissions
- **Analytics**: View platform statistics
- **Search**: Find and filter content

## Mock Data

The application includes realistic mock data for development:
- Sample users (admin and regular users)
- Topics with different statuses (approved, pending, rejected)
- Categories and tags
- Replies and interactions

## Performance Features

- **Lazy Loading**: Images and components load on demand
- **Virtual Scrolling**: Efficient rendering of large lists
- **Infinite Scroll**: Progressive content loading
- **Caching**: Intelligent data caching with LRU eviction
- **Request Batching**: Reduced API call overhead

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Performance Monitoring

Use `Ctrl+Shift+P` to access the performance dashboard in development mode.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue on GitHub or contact the development team.