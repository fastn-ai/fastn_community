// Onboarding Service - Frontend Only (Mock Data)
// This is a frontend-only implementation with local storage for persistence
import { getUser } from "@/services/users/user-manager";

// Types
export interface OnboardingJourney {
  id: number;
  name: string;
  description?: string;
  role_id?: number;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OnboardingTask {
  id: number;
  journey_id: number;
  title: string;
  description?: string;
  task_type: 'manual' | 'automatic' | 'link' | 'form';
  action_url?: string;
  action_data?: any;
  order_index: number;
  is_required: boolean;
  estimated_minutes?: number;
  icon?: string;
  articles?: Array<{
    id: number;
    title: string;
    content: string;
    order_index: number;
  }>;
  videos?: Array<{
    id: number;
    title: string;
    youtube_url: string;
    order_index: number;
  }>;
  resources?: Array<{
    id: number;
    title: string;
    url: string;
    description?: string;
    order_index: number;
  }>;
  questions?: Array<{
    id: number;
    question: string;
    options: Array<{
      id: string;
      text: string;
      isCorrect: boolean;
    }>;
    explanation?: string;
    order_index: number;
  }>;
  created_at: string;
  updated_at: string;
}

export interface OnboardingProgress {
  id: number;
  user_id: string;
  journey_id: number;
  task_id: number;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  completed_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface OnboardingBuddy {
  id: number;
  new_member_id: string;
  buddy_id: string;
  journey_id?: number;
  assigned_at: string;
  status: 'active' | 'completed' | 'inactive';
  notes?: string;
  slack_channel_url?: string;
  created_at: string;
  updated_at: string;
}

export interface JourneyWithTasks extends OnboardingJourney {
  tasks: OnboardingTask[];
  progress?: OnboardingProgress[];
}

// Mock data - Frontend only
const mockJourneys: OnboardingJourney[] = [
  {
    id: 1,
    name: 'Default Community Onboarding',
    description: 'Welcome to the Fastn Community! Complete these steps to get started.',
    is_default: true,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

const mockTasks: OnboardingTask[] = [
  {
    id: 1,
    journey_id: 1,
    title: 'Complete Your Profile on Slack',
    description: 'Set up your Slack profile to connect with the Fastn community',
    task_type: 'link',
    action_url: '/profile',
    order_index: 1,
    is_required: true,
    estimated_minutes: 5,
    icon: 'user',
    articles: [
      {
        id: 1,
        title: 'Setting Up Your Slack Profile',
        content: 'Your Slack profile is your identity in the Fastn community workspace. A complete profile helps other members recognize and connect with you.\n\n**Steps to complete your profile:**\n\n1. **Profile Picture**\n   • Click on your name in the top left corner\n   • Select "Profile" from the dropdown\n   • Click "Edit" next to your profile picture\n   • Upload a clear, professional photo\n\n2. **Display Name**\n   • Use your real name or preferred name\n   • Keep it professional and recognizable\n\n3. **Status & Bio**\n   • Add a brief bio about your role and interests\n   • Set your status to let others know your availability\n   • Mention your expertise areas (e.g., "Full-stack developer | Fastn enthusiast")\n\n4. **Time Zone**\n   • Set your time zone so others know when you\'re available\n   • This helps with scheduling and collaboration\n\n**Why it matters:**\n• Makes it easier for others to find and connect with you\n• Builds trust and credibility in the community\n• Helps you get the most out of community interactions',
        order_index: 1,
      },
    ],
    resources: [
      {
        id: 1,
        title: 'Slack Profile Setup Guide',
        url: 'https://slack.com/help/articles/204246727-Edit-your-profile',
        description: 'Official Slack guide for setting up your profile',
        order_index: 1,
      },
    ],
    questions: [
      {
        id: 1,
        question: 'What is the first step to complete your Slack profile?',
        options: [
          { id: 'a', text: 'Set your time zone', isCorrect: false },
          { id: 'b', text: 'Upload a profile picture', isCorrect: true },
          { id: 'c', text: 'Write your bio', isCorrect: false },
          { id: 'd', text: 'Set your status', isCorrect: false },
        ],
        explanation: 'The first step is to upload a clear, professional profile picture. This helps other members recognize and connect with you.',
        order_index: 1,
      },
      {
        id: 2,
        question: 'Why is it important to set your time zone in Slack?',
        options: [
          { id: 'a', text: 'It helps others know when you\'re available', isCorrect: true },
          { id: 'b', text: 'It\'s required by Slack', isCorrect: false },
          { id: 'c', text: 'It improves message delivery speed', isCorrect: false },
          { id: 'd', text: 'It enables notifications', isCorrect: false },
        ],
        explanation: 'Setting your time zone helps others know when you\'re available, which is important for scheduling and collaboration.',
        order_index: 2,
      },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    journey_id: 1,
    title: 'How Fastn Works',
    description: 'Learn how Fastn makes it simple to connect your app with tools your users already use',
    task_type: 'link',
    action_url: '/guidelines',
    order_index: 2,
    is_required: true,
    estimated_minutes: 15,
    icon: 'book',
    articles: [
      {
        id: 1,
        title: 'Introduction to Fastn',
        content: 'Fastn makes it simple to connect your app with tools your users already use—like Slack, HubSpot, Shopify, and more. Whether you\'re automating workflows or embedding integrations into your platform, Fastn helps you do it without heavy backend setup.\n\n**What Fastn Does:**\n• Embed integrations instantly\n• Seamlessly connect APIs, legacy systems, and enterprise workflows\n• Accelerate your product with Fastn AI powering everything in between\n\n**Key Benefits:**\n• No need to build integrations from scratch\n• No OAuth complications to manage\n• Pre-built infrastructure, templates, and tools ready to plug in',
        order_index: 1,
      },
      {
        id: 2,
        title: 'Getting Started with Integrations in Fastn',
        content: 'Here\'s a quick look at how Fastn works:\n\n**1. Choose a Connector**\nStart by selecting a third-party app (like HubSpot or Slack) from Fastn\'s Connector Catalog. These connectors are pre-built, so you don\'t have to code from scratch.\n\n**2. Connect Your Account**\nOnce you\'ve selected a connector, sign in to your account (like HubSpot or Slack) to link it with Fastn. You can also use your own app credentials if needed.\n\n**3. Create a Flow**\nNow build a flow to define what should happen. For example, you can:\n• Get contacts from HubSpot\n• Send a message to Slack\n• Sync products to a database\n\nThese flows run automatically and help your tools work together without extra effort.\n\n**4. Embed the Integration**\nWant to let your users connect their accounts? Add a widget or button inside your app using Fastn\'s UI components. You can:\n• Show "Connect" / "Disconnect" buttons\n• Run flows directly from your UI\n• Track integration status in your dashboard\n\n**5. Monitor & Manage**\nUse the Fastn dashboard to have complete visibility into your integrations and workflows:\n• See which users are connected\n• Track flow runs, latency, and errors\n• Filter data by tenant or connector',
        order_index: 2,
      },
    ],
    resources: [
      {
        id: 1,
        title: 'How Fastn Works Documentation',
        url: 'https://docs.fastn.ai/getting-started-with-fastn/introducing-fastn/how-fastn-works',
        description: 'Complete guide to understanding how Fastn works',
        order_index: 1,
      },
      {
        id: 2,
        title: 'Fastn AI YouTube Channel',
        url: 'https://www.youtube.com/@fastn-ai',
        description: 'Watch tutorials and learn more about Fastn',
        order_index: 2,
      },
    ],
    questions: [
      {
        id: 1,
        question: 'What is the first step in getting started with integrations in Fastn?',
        options: [
          { id: 'a', text: 'Connect your account', isCorrect: false },
          { id: 'b', text: 'Choose a connector from the Connector Catalog', isCorrect: true },
          { id: 'c', text: 'Create a flow', isCorrect: false },
          { id: 'd', text: 'Embed the integration', isCorrect: false },
        ],
        explanation: 'The first step is to choose a connector from Fastn\'s Connector Catalog. These connectors are pre-built, so you don\'t have to code from scratch.',
        order_index: 1,
      },
      {
        id: 2,
        question: 'What can you do with Fastn flows?',
        options: [
          { id: 'a', text: 'Only send messages to Slack', isCorrect: false },
          { id: 'b', text: 'Get contacts from HubSpot, send messages to Slack, and sync products to a database', isCorrect: true },
          { id: 'c', text: 'Only connect to HubSpot', isCorrect: false },
          { id: 'd', text: 'Only manage OAuth tokens', isCorrect: false },
        ],
        explanation: 'Fastn flows can perform various actions like getting contacts from HubSpot, sending messages to Slack, syncing products to a database, and more. These flows run automatically.',
        order_index: 2,
      },
      {
        id: 3,
        question: 'What is one of the key benefits of using Fastn?',
        options: [
          { id: 'a', text: 'You need to build integrations from scratch', isCorrect: false },
          { id: 'b', text: 'You need to manage OAuth complications', isCorrect: false },
          { id: 'c', text: 'Pre-built infrastructure, templates, and tools ready to plug in', isCorrect: true },
          { id: 'd', text: 'Complex backend setup is required', isCorrect: false },
        ],
        explanation: 'One of the key benefits of Fastn is that it provides pre-built infrastructure, templates, and tools ready to plug in, so you don\'t need to build integrations from scratch or manage OAuth complications.',
        order_index: 3,
      },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    journey_id: 1,
    title: 'Flow Setup Essentials',
    description: 'Learn how flows power automation by defining how data moves and is processed across your systems',
    task_type: 'link',
    action_url: '/categories',
    order_index: 3,
    is_required: true,
    estimated_minutes: 20,
    icon: 'folder',
    articles: [
      {
        id: 1,
        title: 'What Are Flows?',
        content: 'In Fastn, flows are sequences of steps that perform a complete operation from start to finish. These steps can include actions like API connectors, condition-based switches, loops, and even custom code.\n\n**Key Concepts:**\n• Flows power automation by letting you define how data should move and be processed across your systems\n• Each flow performs a complete operation from start to finish\n• Steps can include API connectors, condition-based switches, loops, and custom code\n\n**Accessing Flows:**\nYou can view and manage all your existing flows by navigating to the **Flows** section from the left-hand menu in your project workspace. Click on **Templates** to access pre-built templates for different connections and actions, or click **Create Flow** to select a starting point for the type of flow you want to create.',
        order_index: 1,
      },
      {
        id: 2,
        title: 'Flow Types',
        content: 'Fastn supports multiple types of flows, based on the event or trigger that starts them:\n\n**1. On API Request**\nKick off a flow whenever an external system makes an API call to Fastn. Perfect for building seamless integrations between Fastn and your internal tools or external services.\n\n**Use Case:** Send Email via Gmail\n• Select "On API Request" as your flow trigger\n• Choose Gmail from fastn Connectors\n• Select sendMail endpoint\n• Configure subject, recipient, and content\n• Save & test run\n\n**2. On App Event**\nLet your flow respond to what\'s happening in your favorite apps like Salesforce, Shopify, or HubSpot. When something changes (like a new lead, order, or form submission), Fastn can jump into action automatically.\n\n**Use Case:** HubSpot Contact Creation\nWhen a prospect fills out a form, HubSpot creates a new contact. Fastn detects this event and can automatically send a welcome email, add the contact to a marketing campaign, or log the event in your database.\n\n**3. On Webhook Event**\nFlows can listen for incoming webhooks and act instantly when data is received. Perfect for real-time responses to external systems.\n\n**Use Case:** Webhook → Google Docs + Slack\nWhen a webhook event is triggered, Fastn creates a new document in Google Docs with the received data and shares the link directly into a Slack channel.\n\n**4. On Schedule**\nRun flows automatically at specific times—every hour, once a day, once a week, or on a custom schedule.\n\n**Use Case:** Google Sheets → appendSheet\nEvery day at midnight, the flow runs on schedule and uses Google Sheets → appendSheet to log a timestamp entry in a report sheet.\n\n**5. On Chat Message**\nTrigger flows based on new messages from your users. Especially useful for chatbot interactions, support flows, or conversational interfaces.\n\n**Use Case:** Intercom → getContacts\nWhen a user types "Get my last 5 contacts from Intercom" into chat, Fastn triggers the flow and calls the Intercom → getContacts endpoint, returning the details directly in the conversation.',
        order_index: 2,
      },
    ],
    resources: [
      {
        id: 1,
        title: 'Flow Setup Essentials Documentation',
        url: 'https://docs.fastn.ai/building-flows/flow-setup-essentials',
        description: 'Complete guide to flow setup and flow types',
        order_index: 1,
      },
      {
        id: 2,
        title: 'Fastn AI YouTube Channel',
        url: 'https://www.youtube.com/@fastn-ai',
        description: 'Watch flow tutorials and examples',
        order_index: 2,
      },
    ],
    questions: [
      {
        id: 1,
        question: 'What are flows in Fastn?',
        options: [
          { id: 'a', text: 'Simple API endpoints', isCorrect: false },
          { id: 'b', text: 'Sequences of steps that perform a complete operation from start to finish', isCorrect: true },
          { id: 'c', text: 'Database connections', isCorrect: false },
          { id: 'd', text: 'User authentication methods', isCorrect: false },
        ],
        explanation: 'Flows are sequences of steps that perform a complete operation from start to finish. These steps can include actions like API connectors, condition-based switches, loops, and even custom code.',
        order_index: 1,
      },
      {
        id: 2,
        question: 'Which flow type is perfect for building seamless integrations between Fastn and your internal tools?',
        options: [
          { id: 'a', text: 'On App Event', isCorrect: false },
          { id: 'b', text: 'On API Request', isCorrect: true },
          { id: 'c', text: 'On Schedule', isCorrect: false },
          { id: 'd', text: 'On Chat Message', isCorrect: false },
        ],
        explanation: 'On API Request flow type kicks off a flow whenever an external system makes an API call to Fastn. This is perfect for building seamless integrations between Fastn and your internal tools or external services.',
        order_index: 2,
      },
      {
        id: 3,
        question: 'What happens when you use "On App Event" flow type with HubSpot?',
        options: [
          { id: 'a', text: 'Nothing happens automatically', isCorrect: false },
          { id: 'b', text: 'Fastn detects new contact creation and can automatically send a welcome email or add to a campaign', isCorrect: true },
          { id: 'c', text: 'You need to manually trigger actions', isCorrect: false },
          { id: 'd', text: 'Only webhooks are sent', isCorrect: false },
        ],
        explanation: 'When using "On App Event" with HubSpot, when a prospect fills out a form and HubSpot creates a new contact, Fastn detects this event and can automatically send a welcome email, add the contact to a marketing campaign, or log the event in your database.',
        order_index: 3,
      },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    journey_id: 1,
    title: 'Getting Started with UCL',
    description: 'Learn how Unified Context Layer enables your SaaS platforms to deliver embedded, secure, and scalable AI integrations',
    task_type: 'link',
    action_url: '/create',
    order_index: 4,
    is_required: true,
    estimated_minutes: 25,
    icon: 'message-square',
    articles: [
      {
        id: 1,
        title: 'Introduction to UCL',
        content: 'Unified Context Layer (UCL) enables your SaaS platforms to deliver embedded, secure, and scalable AI integrations.\n\n**What is UCL?**\nUCL is a powerful platform that helps you:\n• Deliver embedded AI integrations\n• Ensure security and scalability\n• Connect with external systems seamlessly\n• Manage connections and actions efficiently\n\n**Getting Started:**\n\n**1. Setting Up Your Account**\nTo set up your account with Fastn, go to ucl.dev and register by entering your name, email, and password. Alternatively, you can quickly sign up using your existing Gmail or GitHub account for faster onboarding.\n\n**2. Workspace Selection**\nAfter you log in, you can select a workspace or create a new one by clicking on **Create Workspace** button. When you first log in to UCL, a workspace titled "My Workspace" is created by default.\n\n**3. Start Building**\nAfter selecting your workspace, complete the quick onboarding questions. This will lead you to the next page where you can click on **Start Building** to open the apps you selected during onboarding.',
        order_index: 1,
      },
      {
        id: 2,
        title: 'Connecting Apps and Actions',
        content: '**Select Your Apps Then Chat**\n\nYou can see the interface for the first step, where you can see all the apps you have selected. You can connect each app using the **Connect** button or remove an app by clicking on \'x\'. Once an App is connected, you will see the button labelled \'Connected\'. UCL\'s AI Assistant Playground would now be seen on the left side of the screen, where you can give a prompt to perform actions with the selected apps.\n\n**Note:** You need to have at least one app connected to see the AI Assistant.\n\n**Finalize Connection Setup**\nYou will now be moved to the second step, where you can finalize your connection setup. You can choose **Sandbox** to try UCL in the interactive test environment. Or select **Favorite Client** to test UCL with your preferred client app. Click **Complete Setup** (top right) to move to the **Connect** page.\n\n**Choose Apps & Actions**\nOn the **Connect** Page in your Dashboard, you can **Choose the Apps You Need**, along with viewing your selected apps and enabled actions. Actions represent the functions you can perform within each app.\n\n**Connecting Existing Apps**\nFrom the **Connecting Existing Apps** button, browse and connect to any app available in UCL. You can select any app by checking the top-right box on the app and click on **Select Tools** to modify your action selection and then finalize this setup by clicking the **Confirm Action** button.\n\n**Custom Apps**\nYou can also **create a Custom App**, which means:\n• Building your own application with preferred actions, or\n• Adding new actions to existing connectors',
        order_index: 2,
      },
      {
        id: 3,
        title: 'Embedding and Monitoring',
        content: '**Embed AI Clients**\n\nOpen the **Embed** section (top corner) to access detailed instructions for connecting any AI client with UCL. You can navigate and select through the list of **Clients** and have a complete step-by-step guide to connect with any of the listed prebuilt AI clients or your own AI agent.\n\nFrom the sidebar, you can:\n• Browse Platform Documentation\n• Launch Sandbox\n• Join the Discord Community\n\n**Monitor with Insights**\n\nThe **Insights** dashboard provides monitoring metrics, including:\n• Active tenants and connectors\n• Tenant requests and success rate\n• Usage stats (monthly, weekly, today)\n• Connection success rate and vulnerability checks\n\n**Test in Playground**\n\nYou can use the **Playground** (from the three-dot menu, top right) to test all connected apps. Run commands directly with your AI agent against the integrated apps.\n\n**Example Use Cases:**\n• Create a Google Doc and share it to Slack - using UCL\n• Connect UCL for task Assignment in Jira\n• Connect UCL to Cursor and access data from Notion',
        order_index: 3,
      },
    ],
    videos: [
      {
        id: 1,
        title: 'Getting Started with UCL',
        youtube_url: 'https://www.youtube.com/watch?v=H_hHMOIq7Zo',
        order_index: 1,
      },
    ],
    resources: [
      {
        id: 1,
        title: 'Getting Started with UCL Documentation',
        url: 'https://docs.fastn.ai/',
        description: 'Complete guide to getting started with UCL',
        order_index: 1,
      },
      {
        id: 2,
        title: 'UCL Platform',
        url: 'https://ucl.dev',
        description: 'Access the UCL platform to start building',
        order_index: 2,
      },
      {
        id: 3,
        title: 'Fastn AI YouTube Channel',
        url: 'https://www.youtube.com/@fastn-ai',
        description: 'Watch UCL tutorials and guides',
        order_index: 3,
      },
    ],
    questions: [
      {
        id: 1,
        question: 'What does UCL stand for and what does it enable?',
        options: [
          { id: 'a', text: 'Universal Code Library - enables code sharing', isCorrect: false },
          { id: 'b', text: 'Unified Context Layer - enables embedded, secure, and scalable AI integrations', isCorrect: true },
          { id: 'c', text: 'User Connection Link - enables user authentication', isCorrect: false },
          { id: 'd', text: 'Unified Cloud Layer - enables cloud storage', isCorrect: false },
        ],
        explanation: 'UCL stands for Unified Context Layer and enables your SaaS platforms to deliver embedded, secure, and scalable AI integrations.',
        order_index: 1,
      },
      {
        id: 2,
        question: 'What do you need to have at least one of to see the AI Assistant in UCL?',
        options: [
          { id: 'a', text: 'A workspace created', isCorrect: false },
          { id: 'b', text: 'At least one app connected', isCorrect: true },
          { id: 'c', text: 'A custom app built', isCorrect: false },
          { id: 'd', text: 'A flow created', isCorrect: false },
        ],
        explanation: 'You need to have at least one app connected to see the AI Assistant. UCL\'s AI Assistant Playground appears on the left side of the screen where you can give a prompt to perform actions with the selected apps.',
        order_index: 2,
      },
      {
        id: 3,
        question: 'What can you do in the Insights dashboard?',
        options: [
          { id: 'a', text: 'Only view active tenants', isCorrect: false },
          { id: 'b', text: 'View active tenants, track requests, success rates, usage stats, and connection success rates', isCorrect: true },
          { id: 'c', text: 'Only create new flows', isCorrect: false },
          { id: 'd', text: 'Only manage connectors', isCorrect: false },
        ],
        explanation: 'The Insights dashboard provides monitoring metrics including active tenants and connectors, tenant requests and success rate, usage stats (monthly, weekly, today), and connection success rate and vulnerability checks.',
        order_index: 3,
      },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 5,
    journey_id: 1,
    title: 'Reply to a Topic',
    description: 'Join the conversation by replying to an existing topic',
    task_type: 'link',
    action_url: '/questions',
    order_index: 5,
    is_required: false,
    estimated_minutes: 10,
    icon: 'reply',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 6,
    journey_id: 1,
    title: 'Connect with a Buddy',
    description: 'Get paired with an experienced community member for guidance',
    task_type: 'automatic',
    order_index: 6,
    is_required: false,
    estimated_minutes: 0,
    icon: 'users',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Local storage helpers
const STORAGE_KEY_PREFIX = "onboarding_";

function getStorageKey(userId: string, key: string): string {
  return `${STORAGE_KEY_PREFIX}${userId}_${key}`;
}

function getStoredProgress(userId: string): OnboardingProgress[] {
  try {
    const stored = localStorage.getItem(getStorageKey(userId, "progress"));
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveProgress(userId: string, progress: OnboardingProgress[]): void {
  try {
    localStorage.setItem(getStorageKey(userId, "progress"), JSON.stringify(progress));
  } catch (error) {
    console.warn("Failed to save progress to localStorage:", error);
  }
}

// Frontend-only functions (using localStorage)
export async function getOnboardingJourneys(userId?: string): Promise<OnboardingJourney[]> {
  // Frontend only - return mock data
  return Promise.resolve(mockJourneys);
}

export async function getOnboardingTasks(journeyId: number): Promise<OnboardingTask[]> {
  // Frontend only - return mock data filtered by journey
  return Promise.resolve(mockTasks.filter(t => t.journey_id === journeyId));
}

export async function getTaskById(taskId: number): Promise<OnboardingTask | null> {
  // Frontend only - return task by ID
  const task = mockTasks.find(t => t.id === taskId);
  return Promise.resolve(task || null);
}

export async function getOnboardingProgress(userId: string, journeyId?: number): Promise<OnboardingProgress[]> {
  // Frontend only - get from localStorage
  const allProgress = getStoredProgress(userId);
  if (journeyId) {
    return allProgress.filter(p => p.journey_id === journeyId);
  }
  return allProgress;
}

export async function updateTaskProgress(
  userId: string,
  taskId: number,
  status: 'pending' | 'in_progress' | 'completed' | 'skipped',
  notes?: string
): Promise<OnboardingProgress> {
  // Frontend only - save to localStorage
  const allProgress = getStoredProgress(userId);
  const existingIndex = allProgress.findIndex(p => p.task_id === taskId);
  
  const progressItem: OnboardingProgress = {
    id: existingIndex >= 0 ? allProgress[existingIndex].id : Date.now(),
    user_id: userId,
    journey_id: 1, // Default journey
    task_id: taskId,
    status,
    completed_at: status === 'completed' ? new Date().toISOString() : undefined,
    notes,
    created_at: existingIndex >= 0 ? allProgress[existingIndex].created_at : new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    allProgress[existingIndex] = progressItem;
  } else {
    allProgress.push(progressItem);
  }

  saveProgress(userId, allProgress);
  return Promise.resolve(progressItem);
}

export async function getJourneyWithTasks(userId: string, journeyId: number): Promise<JourneyWithTasks> {
  const [journey, tasks, progress] = await Promise.all([
    getOnboardingJourneys().then(journeys => journeys.find(j => j.id === journeyId) || journeys[0]),
    getOnboardingTasks(journeyId),
    getOnboardingProgress(userId, journeyId),
  ]);

  return {
    ...journey,
    tasks: tasks.sort((a, b) => a.order_index - b.order_index),
    progress,
  };
}

export async function getOnboardingBuddy(userId: string): Promise<OnboardingBuddy | null> {
  // Frontend only - return buddy with Slack channel integration
  // In a real implementation, this would fetch from localStorage or API
  return Promise.resolve({
    id: 1,
    new_member_id: userId,
    buddy_id: 'community-buddy',
    journey_id: 1,
    assigned_at: new Date().toISOString(),
    status: 'active',
    slack_channel_url: 'https://join.slack.com/share/enQtOTg5NjU2MDM4MDU2Ni0xY2Y3Y2Y1MjQ2ODFjYmM1MTMzNDI1YjZkYjMxMTdhYzJmNTYwOTlhODFlNjRiYTMwMGRiMmYzODNhOGMxN2Ez',
    notes: 'Welcome to the Fastn community! Join our Slack channel to connect with other members and get help.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
}

// Admin function to get all users' onboarding progress
export function getAllUsersOnboardingProgress(): Record<string, OnboardingProgress[]> {
  const allProgress: Record<string, OnboardingProgress[]> = {};
  
  // Iterate through all localStorage keys
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(STORAGE_KEY_PREFIX) && key.endsWith('_progress')) {
      try {
        const userId = key.replace(STORAGE_KEY_PREFIX, '').replace('_progress', '');
        const stored = localStorage.getItem(key);
        if (stored) {
          allProgress[userId] = JSON.parse(stored);
        }
      } catch (error) {
        console.warn(`Failed to parse progress for key ${key}:`, error);
      }
    }
  }
  
  return allProgress;
}

// Get onboarding statistics for admin
export function getOnboardingStats() {
  const allProgress = getAllUsersOnboardingProgress();
  const stats = {
    totalUsers: Object.keys(allProgress).length,
    usersCompleted: 0,
    usersInProgress: 0,
    usersNotStarted: 0,
    totalTasksCompleted: 0,
    averageCompletionRate: 0,
  };

  Object.values(allProgress).forEach((userProgress) => {
    const completedTasks = userProgress.filter(p => p.status === 'completed').length;
    const inProgressTasks = userProgress.filter(p => p.status === 'in_progress').length;
    
    stats.totalTasksCompleted += completedTasks;
    
    if (completedTasks >= mockTasks.filter(t => t.is_required).length) {
      stats.usersCompleted++;
    } else if (completedTasks > 0 || inProgressTasks > 0) {
      stats.usersInProgress++;
    } else {
      stats.usersNotStarted++;
    }
  });

  const totalPossibleTasks = Object.keys(allProgress).length * mockTasks.length;
  stats.averageCompletionRate = totalPossibleTasks > 0 
    ? Math.round((stats.totalTasksCompleted / totalPossibleTasks) * 100) 
    : 0;

  return stats;
}

