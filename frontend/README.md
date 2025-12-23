# PyArud Web Frontend

Modern, responsive web interface for PyArud - Arabic Poetry Prosody Analysis Tool.

## 🎯 Features

- ✨ Clean, modern UI built with React & Tailwind CSS
- 📱 Fully responsive design (mobile, tablet, desktop)
- 🎨 Beautiful gradient themes and smooth animations
- 🌐 RTL (Right-to-Left) support for Arabic text
- 🔍 Real-time poem analysis
- 📊 Detailed verse-by-verse results
- ⚡ Fast and optimized performance
- 🎭 Meter (Baḥr) detection and visualization

## 📂 Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── Header.jsx           # App header
│   │   ├── PoemInput.jsx        # Poem input form
│   │   ├── Results.jsx          # Analysis results display
│   │   ├── VerseCard.jsx        # Individual verse analysis
│   │   ├── ErrorAlert.jsx       # Error messages
│   │   ├── LoadingSpinner.jsx   # Loading indicator
│   │   └── index.js             # Component exports
│   ├── services/        # API services
│   │   └── api.js               # Backend API client
│   ├── utils/           # Utility functions
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # App entry point
│   └── index.css        # Global styles
├── .env                 # Environment variables
├── .env.example         # Environment variables template
├── index.html           # HTML template
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
└── README.md            # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running (default: http://localhost:8000)

### Installation

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Configure environment variables:**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` if your backend API URL is different:

   ```env
   VITE_API_URL=http://localhost:8000/api
   ```

3. **Start development server:**

   ```bash
   npm run dev
   ```

   The app will be available at http://localhost:5173

### Build for Production

```bash
npm run build
```

The optimized files will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## 🎨 Component Overview

### Header

Displays the application title and description with a gradient background.

### PoemInput

- Textarea for entering Arabic poetry verses
- RTL text direction support
- Clear and analyze buttons
- Loading state handling

### Results

- Displays detected meter (Baḥr)
- Shows verse-by-verse analysis
- Handles both new and legacy API formats

### VerseCard

- Individual verse analysis display
- Status badges (correct/warning)
- Tafʿīla and Ziḥāf information
- Additional details for problematic verses

### ErrorAlert

- User-friendly error messages
- Dismissible alerts
- Red-themed styling for visibility

## 🔌 API Integration

The app communicates with the PyArud backend API using axios. All API calls are centralized in `src/services/api.js`:

- **POST /api/analyze** - Analyze poem verses
- **GET /api/bahr/:name** - Get meter information
- **POST /api/validate** - Validate single verse
- **GET /api/status** - Check API status

## 🎨 Styling

This project uses:

- **Tailwind CSS 4** - Utility-first CSS framework
- **Custom gradients** - Emerald to teal color scheme
- **Responsive design** - Mobile-first approach
- **Custom animations** - Smooth fade-in effects
- **Arabic font stack** - Optimized for RTL text

### Color Scheme

- Primary: Emerald (Green) - `emerald-600`, `emerald-700`
- Secondary: Teal - `teal-600`, `teal-700`
- Success: Green - `green-100`, `green-800`
- Warning: Amber - `amber-100`, `amber-800`
- Error: Red - `red-50`, `red-500`, `red-800`

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

All components are fully responsive and adapt to different screen sizes.

## 🔧 Configuration

### Vite Config

The project uses Vite for fast development and optimized builds. Configuration is in `vite.config.js`.

### Tailwind CSS

Tailwind CSS 4 is configured using the new `@import "tailwindcss"` syntax in `index.css`.

### ESLint

Code quality is maintained with ESLint. Configuration is in `eslint.config.js`.

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 Development Guidelines

### Adding New Components

1. Create component file in `src/components/`
2. Use functional components with hooks
3. Add prop validation if needed
4. Export from `src/components/index.js`
5. Keep components focused and reusable

### Code Style

- Use functional components
- Prefer const over let
- Use arrow functions
- Keep components small and focused
- Use Tailwind CSS classes for styling
- Add comments for complex logic

## 🐛 Troubleshooting

### API Connection Issues

- Ensure backend is running on the correct port
- Check `.env` file has correct API URL
- Verify CORS is enabled on backend

### Build Issues

- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`

## 📄 License

This project is part of the PyArud Web application.

## 🤝 Contributing

1. Follow the existing code style
2. Test on multiple screen sizes
3. Ensure accessibility standards
4. Keep components modular and reusable
