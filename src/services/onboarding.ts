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
  final_task_requirement?: string;
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
    title: 'Build a Flow with Loop and Switch',
    description: 'Build a flow that accepts an array of user data and classifies it based on age (greater than 20, less than 20) applying concepts of models and secrets',
    task_type: 'link',
    action_url: '/categories',
    order_index: 5,
    is_required: true,
    estimated_minutes: 30,
    icon: 'folder',
    articles: [
      {
        id: 1,
        title: 'Understanding Loops in Flows',
        content: 'The **Loop** flow component allows you to repeat actions in a controlled way. You can select the Loop Type and the Data you want to loop over, mapping it from previous flow steps.\n\n**Loop Types:**\n• **Loop N times**: Run a block a fixed number of times\n• **Loop over data**: Iterate through each item in a list\n• **While loop**: Keep looping as long as a condition is true\n\n**Example:**\nIn a flow, you can loop over an array of user data:\n```\n{{steps.sendMessage.output.message.blocks}}\n```\n\nThis means the loop will go through each `block` inside the `message` output from the `sendMessage` step, allowing you to process every block one by one.\n\nUse **End Loop** to mark where the loop finishes.',
        order_index: 1,
      },
      {
        id: 2,
        title: 'Using Switch for Conditional Logic',
        content: 'The **Switch** component creates conditional logic to control the flow of actions based on specific criteria. Switches enable your automation to choose different paths based on specific conditions.\n\n**How it works:**\nFor example, "if your input equals a certain value, do action X; otherwise, do action Y." This makes your flows flexible and able to handle different situations automatically.\n\n**Use Case: Classify Users by Age**\n```\nCase1: age > 20 → Action = ClassifyAsAdult\nCase2: age <= 20 → Action = ClassifyAsMinor\n```\n\n**Benefits:**\n• Introduce branching logic to handle multiple scenarios\n• Automatically trigger different actions based on conditions\n• Simplify complex decision-making within a single flow\n\nYou can add a number of cases and conditions as per your choice for the switch statement.',
        order_index: 2,
      },
      {
        id: 3,
        title: 'Building the Age Classification Flow',
        content: '**Task: Build a flow that accepts an array of user data and classifies it based on age (greater than 20, less than 20) applying concepts of models and secrets**\n\n**Steps:**\n\n1. **Set up the Flow**\n   • Create a new flow with "On API Request" trigger\n   • Accept an array of user data as input\n\n2. **Add a Loop Component**\n   • Select "Loop over data" as the Loop Type\n   • Map the user data array to the Loop Data field\n   • This will iterate through each user in the array\n\n3. **Add a Switch Component Inside the Loop**\n   • Create two cases:\n     - Case 1: `age > 20` → Classify as "Adult"\n     - Case 2: `age <= 20` → Classify as "Minor"\n   • Map the age field from the current loop item\n\n4. **Add Actions for Each Case**\n   • For adults: Store or process adult users\n   • For minors: Store or process minor users\n\n5. **End the Loop**\n   • Use End Loop to mark where the loop finishes\n\n6. **Apply Models and Secrets**\n   • **Using Models**: If you need AI-based classification or advanced processing, integrate Fastn\'s model components:\n     - Add a Model step to your flow\n     - Configure the model to analyze user data\n     - Use model output for enhanced classification logic\n   • **Using Secrets**: Store sensitive data securely using Fastn\'s secrets management:\n     - Store API keys, authentication tokens, or sensitive user information\n     - Access secrets in your flow using `{{secrets.secretName}}`\n     - Keep sensitive data out of your flow configuration\n\n**Result:**\nYour flow will process each user in the array, classify them based on their age using loop and switch logic, and securely handle sensitive data using models and secrets management.',
        order_index: 3,
      },
    ],
    resources: [
      {
        id: 1,
        title: 'Loop Documentation',
        url: 'https://docs.fastn.ai/building-flows/flow-setup-essentials/designing-a-flow/loop',
        description: 'Learn how to use loops in Fastn flows',
        order_index: 1,
      },
      {
        id: 2,
        title: 'Switch Documentation',
        url: 'https://docs.fastn.ai/building-flows/flow-setup-essentials/designing-a-flow/switch',
        description: 'Learn how to use switch statements for conditional logic',
        order_index: 2,
      },
    ],
    questions: [
      {
        id: 1,
        question: 'What are the three types of loops available in Fastn?',
        options: [
          { id: 'a', text: 'For loop, While loop, Do-while loop', isCorrect: false },
          { id: 'b', text: 'Loop N times, Loop over data, While loop', isCorrect: true },
          { id: 'c', text: 'For each, Map, Filter', isCorrect: false },
          { id: 'd', text: 'Repeat, Iterate, Cycle', isCorrect: false },
        ],
        explanation: 'Fastn supports three loop types: Loop N times (run a block a fixed number of times), Loop over data (iterate through each item in a list), and While loop (keep looping as long as a condition is true).',
        order_index: 1,
      },
      {
        id: 2,
        question: 'What is the purpose of a Switch component in Fastn flows?',
        options: [
          { id: 'a', text: 'To connect to external APIs', isCorrect: false },
          { id: 'b', text: 'To create conditional logic and route execution through different paths based on criteria', isCorrect: true },
          { id: 'c', text: 'To store data in a database', isCorrect: false },
          { id: 'd', text: 'To send notifications', isCorrect: false },
        ],
        explanation: 'The Switch component creates conditional logic to control the flow of actions based on specific criteria. It enables your automation to choose different paths based on conditions, like "if age > 20, do action X; otherwise, do action Y."',
        order_index: 2,
      },
    ],
    final_task_requirement: 'Build a flow that accepts an array of user data and classifies it based on age (greater than 20, less than 20) applying concepts of models and secrets. Complete this task on qa.fastn.ai under the project "onboarding_userName" (replace userName with your actual username).',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 6,
    journey_id: 1,
    title: 'ServiceNow Integration with Database',
    description: 'Set up an integration that connects to ServiceNow, retrieves all incident data within Fastn, and stores it in the database',
    task_type: 'link',
    action_url: '/categories',
    order_index: 6,
    is_required: true,
    estimated_minutes: 35,
    icon: 'folder',
    articles: [
      {
        id: 1,
        title: 'Understanding Connectors',
        content: 'Connectors link your flow to external services and APIs, like Slack, HubSpot, Google Sheets, or ServiceNow, enabling seamless data exchange.\n\n**When you add a connector step, you\'ll go through:**\n\n1. **Select:** Choose the **group type** (Fastn Connector or Custom Connector) → then select the **app** (e.g., ServiceNow)\n\n2. **Endpoint:** Pick the task you want to automate (e.g., `getIncidents`, `createTicket`)\n\n3. **Connect:** Authenticate by connecting your account\n\n4. **Configure:** Fill in the required fields or map from previous steps\n\n**Example Configuration:**\nFor ServiceNow - Get Incidents:\n```\nparam.table = incident\nparam.query = active=true\n```\n\nThe configuration parameters can be static values or mapped from previous steps.',
        order_index: 1,
      },
      {
        id: 2,
        title: 'Setting Up ServiceNow Integration',
        content: '**Task: Set up an integration that connects to ServiceNow, retrieves all incident data within Fastn, and stores it in the database**\n\n**Steps:**\n\n1. **Create a New Flow**\n   • Select "On Schedule" or "On API Request" as your flow trigger\n   • Choose a schedule (e.g., every hour) if you want to sync data periodically\n\n2. **Add ServiceNow Connector**\n   • Select "Fastn Connector" group type\n   • Choose "ServiceNow" from the app list\n   • Select endpoint: `getIncidents` or `getRecords`\n   • Connect your ServiceNow account\n\n3. **Configure the Connector**\n   • Set parameters to retrieve all incidents:\n     - `table`: "incident"\n     - `query`: "active=true" (or your custom query)\n   • Map any required fields\n\n4. **Add Database Component**\n   • Add a Database step after the ServiceNow connector\n   • Configure to insert or update records\n   • Map the incident data from ServiceNow output to database fields\n\n5. **Map Data Fields**\n   • Map ServiceNow incident fields to your database schema:\n     - `incident_number` → `ticket_id`\n     - `short_description` → `description`\n     - `state` → `status`\n     - `sys_created_on` → `created_at`\n     - etc.\n\n6. **Handle Errors**\n   • Add error handling for failed API calls\n   • Log errors for debugging\n\n7. **Test and Deploy**\n   • Test the flow with sample data\n   • Deploy to your environment\n\n**Result:**\nYour flow will automatically retrieve all ServiceNow incidents and store them in your Fastn database, keeping your data synchronized.',
        order_index: 2,
      },
    ],
    resources: [
      {
        id: 1,
        title: 'Connectors Documentation',
        url: 'https://docs.fastn.ai/building-flows/flow-setup-essentials/designing-a-flow/connectors',
        description: 'Learn how to use connectors in Fastn flows',
        order_index: 1,
      },
    ],
    questions: [
      {
        id: 1,
        question: 'What are the steps involved when adding a connector to a flow?',
        options: [
          { id: 'a', text: 'Select, Endpoint, Connect, Configure', isCorrect: true },
          { id: 'b', text: 'Connect, Select, Configure, Deploy', isCorrect: false },
          { id: 'c', text: 'Authenticate, Select, Map, Test', isCorrect: false },
          { id: 'd', text: 'Choose, Connect, Test, Deploy', isCorrect: false },
        ],
        explanation: 'When you add a connector step, you\'ll go through: Select (choose group type and app), Endpoint (pick the task to automate), Connect (authenticate your account), and Configure (fill in required fields or map from previous steps).',
        order_index: 1,
      },
      {
        id: 2,
        question: 'What endpoint would you use to retrieve incident data from ServiceNow?',
        options: [
          { id: 'a', text: 'createIncident', isCorrect: false },
          { id: 'b', text: 'getIncidents or getRecords', isCorrect: true },
          { id: 'c', text: 'updateIncident', isCorrect: false },
          { id: 'd', text: 'deleteIncident', isCorrect: false },
        ],
        explanation: 'To retrieve incident data from ServiceNow, you would use the `getIncidents` or `getRecords` endpoint. You can configure it with parameters like `table: "incident"` and `query: "active=true"` to filter the results.',
        order_index: 2,
      },
    ],
    final_task_requirement: 'Set up an integration that connects to ServiceNow, retrieves all incident data within Fastn, and stores it in the database. Complete this task on qa.fastn.ai under the project "onboarding_userName" (replace userName with your actual username).',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 7,
    journey_id: 1,
    title: 'Create a Slack Widget',
    description: 'Create a widget that allows tenants to connect to Slack and sends a message asking for status updates to a channel at the beginning of every day',
    task_type: 'link',
    action_url: '/create',
    order_index: 7,
    is_required: true,
    estimated_minutes: 40,
    icon: 'message-square',
    articles: [
      {
        id: 1,
        title: 'Introduction to Widgets',
        content: 'Widgets in Fastn allow you to build and configure interactive components that connect apps, control actions, and deploy them seamlessly for end-users.\n\n**What are Widgets?**\nWidgets are user-facing components that:\n• Enable tenants to connect to external services (like Slack)\n• Provide UI controls for flow actions\n• Can be embedded in your application\n• Support activation, deactivation, and configuration flows\n\n**Widget Types:**\n• Widgets with connectors: Require a connector to function\n• Widgets without connectors: Standalone functionality\n\n**Key Features:**\n• Tenant visibility controls\n• Dependency connectors\n• Action-based flows\n• Live deployment',
        order_index: 1,
      },
      {
        id: 2,
        title: 'Building and Configuring Widgets',
        content: '**Steps to Build a Widget:**\n\n**1. Add a New Widget**\n• Click on the **Add Widget** button\n• Choose whether to publish **with or without a connector**\n• **Search and select** a connector (e.g., Slack)\n\n**2. Configure Widget Settings**\n\n**a. Tenant Visibility**\n• Toggle **"Enable for specific tenants"** if the widget should only appear for selected tenants\n• Click **Add tenants** to specify which tenants can access it\n\n**b. Widget Availability**\n• Use the **Disable** toggle if you want to temporarily hide the widget from users\n• Select your preferred **Data flow Label**\n\n**3. Set Dependency Connectors**\n• Add required connectors (e.g., Slack)\n• Mark **Primary** connectors if needed\n• Provide connector details:\n  - **Name**: Slack\n  - **Image URL**\n  - **Description**: Enables real-time communication and automation\n• Configure **Auth Attributes** for authentication (OAuth, Custom Input, API Key, Bearer Token, Basic Auth)\n\n**4. Add Actions to the Widget**\nWidgets allow you to define flow-based actions that can be triggered through UI interactions.\n\nClick **"Add"** under **Actions** and configure:\n• **Name**: Action name (e.g., `Activate`, `Deactivate`, `Configure`)\n• **Flow**: Select the associated Fastn Flow\n• **Visibility**: Set visibility conditions\n• **Action**: Define the action type (Activation, Deactivation, or Configuration)',
        order_index: 2,
      },
      {
        id: 3,
        title: 'Creating the Slack Status Update Widget',
        content: '**Task: Create a widget that allows tenants to connect to Slack and sends a message asking for status updates to a channel at the beginning of every day**\n\n**Implementation Steps:**\n\n**1. Create the Widget**\n• Click **Add Widget**\n• Select **"With connector"**\n• Search and select **Slack** connector\n\n**2. Configure Widget Settings**\n• Set **Tenant Visibility**: Enable for all tenants or specific ones\n• Set **Widget Availability**: Enable the widget\n• Configure **Dependency Connectors**:\n  - Add Slack as a dependency\n  - Mark as Primary connector\n  - Add description: "Enables sending status update messages to Slack channels"\n  - Set up OAuth authentication\n\n**3. Create the Scheduled Flow**\n• Create a new flow with **"On Schedule"** trigger\n• Set schedule to run **daily at the beginning of the day** (e.g., 9:00 AM)\n• Add **Slack Connector** step:\n  - Endpoint: `sendMessage`\n  - Configure channel: Map from widget settings or use a variable\n  - Message: "Good morning! Please provide your status update for today."\n\n**4. Add Actions to Widget**\n• **Activate Flow**: Flow that enables the scheduled message\n• **Deactivate Flow**: Flow that disables the scheduled message\n• **Configure Flow**: Flow that allows tenants to:\n  - Select the Slack channel\n  - Set the message time\n  - Customize the message content\n\n**5. Deploy to Live**\n• Click **"Deploy to LIVE"** button\n• This deploys all connected flows to your live environment\n• Preview the widget from the **Integrate** section\n\n**Result:**\nTenants can now connect their Slack accounts through the widget, and the system will automatically send status update requests to their specified channel every morning.',
        order_index: 3,
      },
    ],
    resources: [
      {
        id: 1,
        title: 'Building and Configuring Widgets',
        url: 'https://docs.fastn.ai/customer-facing-integrations/introduction-to-embedded-integrations/building-and-configuring-widgets-in-fastn#b.-widget-availability',
        description: 'Complete guide to building and configuring widgets in Fastn',
        order_index: 1,
      },
    ],
    questions: [
      {
        id: 1,
        question: 'What are the main steps to build a widget in Fastn?',
        options: [
          { id: 'a', text: 'Add Widget, Configure Settings, Add Actions, Deploy to Live', isCorrect: true },
          { id: 'b', text: 'Create Flow, Add Connector, Test, Deploy', isCorrect: false },
          { id: 'c', text: 'Select App, Authenticate, Configure, Save', isCorrect: false },
          { id: 'd', text: 'Design UI, Add Logic, Test, Publish', isCorrect: false },
        ],
        explanation: 'The main steps to build a widget are: 1) Add a New Widget, 2) Configure Widget Settings (tenant visibility, availability, dependency connectors), 3) Add Actions to the Widget (activate, deactivate, configure flows), and 4) Deploy to Live.',
        order_index: 1,
      },
      {
        id: 2,
        question: 'What flow trigger type would you use to send a message at the beginning of every day?',
        options: [
          { id: 'a', text: 'On API Request', isCorrect: false },
          { id: 'b', text: 'On Schedule', isCorrect: true },
          { id: 'c', text: 'On App Event', isCorrect: false },
          { id: 'd', text: 'On Webhook Event', isCorrect: false },
        ],
        explanation: 'To send a message at the beginning of every day, you would use "On Schedule" as the flow trigger type. This allows you to set a schedule (e.g., daily at 9:00 AM) to automatically trigger the flow.',
        order_index: 2,
      },
      {
        id: 3,
        question: 'What are the three built-in action types you can add to a widget?',
        options: [
          { id: 'a', text: 'Create, Read, Update', isCorrect: false },
          { id: 'b', text: 'Activate, Deactivate, Configure', isCorrect: true },
          { id: 'c', text: 'Start, Stop, Pause', isCorrect: false },
          { id: 'd', text: 'Connect, Disconnect, Reset', isCorrect: false },
        ],
        explanation: 'The three built-in action types you can add to a widget are: Activate (activates the connected app), Deactivate (deactivates the app), and Configure (allows users to configure settings for the connected app).',
        order_index: 3,
      },
    ],
    final_task_requirement: 'Create a widget that allows tenants to connect to Slack and sends a message asking for status updates to a channel at the beginning of every day. Complete this task on qa.fastn.ai under the project "onboarding_userName" (replace userName with your actual username).',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 8,
    journey_id: 1,
    title: 'Connect with a Buddy',
    description: 'Get paired with an experienced community member for guidance',
    task_type: 'automatic',
    order_index: 8,
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

