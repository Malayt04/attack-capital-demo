# OpenMic Bot Control Panel

A dark-mode Next.js frontend for an OpenMic bot control panel built with Tailwind CSS and shadcn/ui components.

## Features

- **Dark Mode**: Entire application is styled with dark mode by default
- **Agent Management**: View, create, and delete agents
- **Logs Viewing**: Browse call logs for each agent
- **Detailed Logs**: View comprehensive call details including transcripts
- **Responsive Design**: Clean, minimal UI that works on all devices

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with dark mode
- **UI Components**: shadcn/ui components
- **Icons**: Lucide React
- **Language**: TypeScript

## Getting Started

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Set up environment variables**:

   Create a `.env.local` file in the root directory and add your OpenMic API key:

   ```bash
   NEXT_PUBLIC_OPENMIC_API_KEY=your_openmic_api_key_here
   ```

3. **Run the development server**:

   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/
│   ├── agent/
│   │   └── [uid]/
│   │       ├── page.tsx              # Agent logs page
│   │       └── log/
│   │           └── [logId]/
│   │               └── page.tsx      # Log details page
│   ├── globals.css                   # Global styles with dark mode
│   ├── layout.tsx                    # Root layout
│   └── page.tsx                      # Landing page with agents table
├── components/
│   └── ui/                           # shadcn/ui components
│       ├── button.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── select.tsx
│       ├── table.tsx
│       └── textarea.tsx
├── lib/
│   ├── mock-data.ts                  # Mock data for agents and logs
│   └── utils.ts                      # Utility functions
└── package.json
```

## Pages

### Landing Page (`/`)

- Displays a table of all agents with columns: Agent Name, Domain, UID
- Each row has "View Logs" and "Delete Agent" buttons
- "Create New Agent" button opens a dialog with a form
- Form includes: Agent Name (input), Domain (dropdown), Prompt (textarea)

### Agent Logs Page (`/agent/[uid]`)

- Shows logs for the selected agent
- Table columns: Call ID, Date, Duration, Transcript Preview
- Clickable rows navigate to detailed log view
- "Back to Agents" link at the top

### Log Details Page (`/agent/[uid]/log/[logId]`)

- Displays comprehensive call information
- Sections: Call Information, Summary, Full Transcript
- "Back to Logs" link at the top

## Mock Data

The application uses mock data stored in `lib/mock-data.ts`:

- **Agents**: Medical, Legal, and Receptionist agents with sample data
- **Logs**: Sample call logs for each agent with realistic data

## Dark Mode

The application is configured for dark mode by default:

- Dark theme colors defined in `globals.css`
- All components styled with dark mode classes
- Consistent dark styling throughout all pages

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Customization

To customize the application:

1. Modify mock data in `lib/mock-data.ts`
2. Update styling in `globals.css` or component files
3. Add new features by extending the existing components
4. Replace mock data with real API calls when ready
