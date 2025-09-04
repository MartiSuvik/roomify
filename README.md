# Roomify - Interior Design AI Platform

A modern web application for AI-powered interior design with secure user authentication and API key management.

## Features

- **User Authentication**: Secure sign-up/sign-in with Supabase
- **API Key Management**: Encrypted storage of user's OpenAI/Anthropic API keys
- **Interior Design Tools**: HomeGPT chat and image stylization features
- **Image Annotations**: Interactive annotation system for design feedback
- **Responsive Design**: Modern UI with dark/light theme support

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Animations**: Framer Motion

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ENCRYPTION_KEY=your_32_character_encryption_key
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the migration file `supabase/migrations/create_auth_tables.sql` in your Supabase SQL editor
3. Configure authentication settings:
   - Enable Email authentication
   - Set up email templates (optional)
   - Configure redirect URLs if needed

### 3. Installation

```bash
npm install
npm run dev
```

## Authentication Flow

### User Registration
1. User enters email/password on sign-up form
2. Supabase creates account and sends confirmation email
3. User confirms email and is redirected to dashboard

### API Key Management
1. Users add their OpenAI/Anthropic API keys in Settings
2. Keys are encrypted using AES encryption before storage
3. Keys are decrypted only when needed for API calls
4. Users can activate/deactivate or remove keys at any time

### Session Management
- Sessions persist across browser refreshes
- Automatic token refresh handles expired sessions
- Protected routes redirect unauthenticated users to sign-in

## Security Features

### API Key Protection
- All API keys encrypted with AES-256 before database storage
- Encryption key stored as environment variable (never in client)
- Keys only decrypted server-side for API calls
- Input validation prevents malformed keys

### Authentication Security
- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- HTTPS required for all authentication endpoints
- Rate limiting on authentication attempts

### Data Privacy
- Usage logging (feature tracking) without exposing API keys
- No sensitive data in client-side storage
- Secure session management with automatic cleanup

## Database Schema

### user_api_keys
- Stores encrypted API keys for each user
- Supports multiple providers (OpenAI, Anthropic)
- Tracks active/inactive status

### usage_logs
- Records feature usage for cost tracking
- Links to user accounts
- Includes token usage where applicable

## Usage Examples

### Adding an API Key
```typescript
import { useApiKeys } from '@/hooks/useApiKeys';

const { addApiKey } = useApiKeys();

// Add OpenAI key
await addApiKey('sk-...', 'openai');
```

### Using Protected Routes
```typescript
import { ProtectedRoute } from '@/components/Auth/ProtectedRoute';

<Route path="/chat" element={
  <ProtectedRoute>
    <ChatPage />
  </ProtectedRoute>
} />
```

### Checking Authentication
```typescript
import { useAuth } from '@/hooks/useAuth';

const { user, loading, signIn, signOut } = useAuth();
```

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure
```
src/
├── components/          # React components
│   ├── Auth/           # Authentication components
│   ├── Layout/         # Layout components
│   └── ui/             # shadcn/ui components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── pages/              # Page components
└── types/              # TypeScript types
```

## Deployment

### Environment Requirements
- Node.js 18+
- Supabase project with migrations applied
- Environment variables configured

### Build Process
1. Set production environment variables
2. Run `npm run build`
3. Deploy `dist/` folder to hosting provider
4. Configure redirects for client-side routing

## Security Considerations

- Never store API keys in plain text
- Use environment variables for sensitive configuration
- Enable HTTPS in production
- Regularly rotate encryption keys
- Monitor usage logs for anomalies
- Keep dependencies updated

## Support

For issues or questions:
1. Check the [Supabase documentation](https://supabase.com/docs)
2. Review the authentication hooks in `/src/hooks/`
3. Check browser console for detailed error messages