# AI Booking Assistant - Project Context

## Project Overview
This Next.js application serves as an AI-powered booking assistant platform, designed to streamline and automate the booking process for various services. The system leverages modern web technologies and AI capabilities to provide an intuitive booking experience.

"Smart Scheduler" - Detailed Expansion
1. Pain Point (Elaborated):
Constant Interruptions: Phone calls and email checks disrupt focused work, especially for solo practitioners or small teams. A hairdresser can't easily answer the phone mid-cut. A plumber can't book while under a sink.
Lost Business After Hours: Many customers try to book outside of business hours. If no one answers or replies quickly, they might go to a competitor.
Phone/Email Tag: Back-and-forth communication to find a mutually agreeable time is inefficient and frustrating for both parties.
Manual Reminder Hassle: Remembering to send reminders for every appointment is tedious and easy to forget, leading to costly no-shows.
Risk of Double Bookings/Errors: Manual systems are prone to human error, like booking two clients for the same slot or writing down the wrong service/time.
Inconsistent Customer Experience: Different staff members might handle bookings differently, leading to confusion.
No Centralized View: If multiple people handle bookings, it's hard to get an overview of the schedule without a shared, always-updated system.
Client Preference for Digital: Many clients, especially younger demographics, prefer the convenience of online/automated booking over phone calls.
2. Solution (Detailed Flow & Features):
The AI agent acts as an intelligent virtual receptionist for bookings.
Core Functionality:
Natural Language Understanding (NLU):
Intent Recognition: Deciphers if the user wants to:
Book a new appointment.
Reschedule an existing appointment.
Cancel an appointment.
Inquire about availability/services.
Entity Extraction: Pulls out key information like:
Desired service(s) (e.g., "men's cut," "boiler service," "consultation").
Preferred date(s) and time(s) (e.g., "next Tuesday afternoon," "anytime Friday," "around 2 pm on the 15th").
Duration (can be inferred from service type or explicitly stated).
Client name, contact info (if not already known).
Specific staff member preference (if applicable).
Calendar Integration & Availability Check:
Securely connects to the business's Google Calendar(s) or Outlook Calendar(s) via API.
Checks for free slots based on:
Business operating hours (configurable).
Staff working hours/availability (if multiple staff).
Existing appointments.
Buffer times between appointments (configurable, e.g., 15 mins cleaning time).
Service duration (pre-defined for each service).
Intelligent Slot Offering:
If the exact requested time is unavailable, it suggests the closest available alternatives.
Can handle requests like "earliest available on Saturday."
Confirmation:
Once a slot is agreed upon, the agent books it directly into the calendar.
Sends an automated confirmation (email, SMS, or WhatsApp reply) with details: service, date, time, location, staff member (if any), price (optional), cancellation policy.
Automated Reminders:
Sends reminders at configurable intervals (e.g., 24 hours before, 1 hour before) via preferred channel.
Can include a link/option to easily reschedule or cancel (with configurable notice periods).
Cancellation/Rescheduling Handling:
Understands requests to cancel or change appointments.
Frees up the slot in the calendar upon cancellation.
Guides through the rescheduling process (finds new slot, confirms).
Potential Advanced Features (V2 or higher tiers):
Waiting List: If fully booked, offer to add clients to a waiting list and notify them if a slot opens.
Multi-Service Bookings: Handle requests for multiple services in one visit (e.g., "cut and color").
Recurring Appointments: Allow booking regular slots (e.g., "every 4 weeks on a Tuesday").
Pre-payment/Deposits: Integrate with Stripe/PayPal to take deposits for appointments (reduces no-shows further).
Gathering Pre-Appointment Information: Ask custom questions based on service type (e.g., for a new hair client: "Have you had color with us before? Any allergies?").
Basic Reporting: Show booking trends, popular services, peak times.
3. Tech Stack (More Granular):
Interface Options:
Email Parsing:
Python imaplib to fetch emails from a dedicated booking address (e.g., bookings@hullplumbers.co.uk).
Python email module to parse email content.
LLM processes the email body.
Simple Web Form/Widget:
Frontend: V0.dev for rapid UI, or build with HTML/CSS/JavaScript. Could be embedded on the client's website.
Backend: Python (Flask/FastAPI) to handle form submissions.
WhatsApp/SMS Bot:
Twilio API (for WhatsApp Business API access or SMS).
Python backend (Flask/FastAPI) to receive webhook events from Twilio and send replies.
Unified Dashboard (for the business owner):
Streamlit or a V0.dev generated interface for the business to:
Configure settings (business hours, services, staff, reminder preferences).
View upcoming appointments.
Manually override or add bookings.
View message logs.
Core Logic (Python Backend):
Web Framework: Flask or FastAPI for creating API endpoints.
LLM Integration:
OpenAI API (GPT-3.5-turbo, GPT-4), Anthropic Claude API, or other LLM providers.
Langchain: To manage prompts, chain LLM calls, and interact with tools (like calendar APIs).
Calendar API Clients:
Google Calendar: google-api-python-client. Requires OAuth2 setup for user authorization.
Outlook Calendar (Microsoft Graph API): msal (Microsoft Authentication Library for Python) for auth, requests for API calls.
Business Rules Engine: Python functions to codify:
Operating hours logic.
Buffer time calculations.
Staff availability routing.
Service duration lookups.
Database (Recommended):
SQLite for very simple single-user setups, or a small PostgreSQL/MySQL instance for more robust needs.
Store: Client business settings, API keys (encrypted), appointment data (for logging/audit, not primary source if calendar is truth), message logs, user preferences.
Notification Service:
smtplib for sending email confirmations/reminders.
Twilio SDK for SMS/WhatsApp messages.
Task Queue (for reliability/scalability, especially for reminders):
Celery with Redis or RabbitMQ as a message broker. This allows reminders to be scheduled and sent reliably even if the main application has a temporary blip. (Could be overkill for V1, but good to keep in mind).
Integrations (Zapier/Make.com - for specific edge cases):
Could be used if a business insists on using a very niche calendar tool that only integrates via Zapier/Make, but direct API is always preferable.
For connecting to other systems if needed (e.g., add new customer to a basic CRM via Zapier).
Deployment:
Cloud platforms like PythonAnywhere (easy for Flask/Django), Heroku, Render, DigitalOcean App Platform, AWS Lightsail, Google Cloud Run.
Secure management of API keys (e.g., environment variables, secret management services

## Technical Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Package Manager**: Yarn
- **Code Quality**: ESLint
- **Directory Structure**: src-based architecture

## Project Structure
```
src/
├── app/             # App Router pages and layouts
├── components/      # Reusable UI components
├── lib/            # Utility functions and shared logic
├── types/          # TypeScript type definitions
├── styles/         # Global styles and Tailwind configurations
└── context/        # React Context providers
```

## Key Features (Planned)
1. **Smart Booking Interface**
   - AI-powered form completion
   - Intelligent scheduling suggestions
   - Real-time availability checking

2. **User Management**
   - Authentication system
   - User profiles
   - Booking history

3. **Service Provider Integration**
   - Service provider dashboard
   - Calendar management
   - Availability settings

4. **AI Features**
   - Natural language processing for booking requests
   - Smart scheduling recommendations
   - Automated confirmation and reminder system

## Development Guidelines
1. **Code Organization**
   - Follow feature-based organization within the app directory
   - Keep components modular and reusable
   - Maintain clear separation of concerns

2. **Styling Approach**
   - Use Tailwind CSS utility classes
   - Create reusable component classes when needed
   - Maintain consistent design tokens

3. **State Management**
   - Use React Context for global state
   - Implement server components where possible
   - Utilize Next.js server actions for data mutations

4. **Performance Considerations**
   - Implement proper code splitting
   - Optimize images and assets
   - Use caching strategies effectively

## API Integration
- Implement RESTful API endpoints
- Use server actions for form submissions
- Integrate with AI services for intelligent features

## Security Considerations
- Implement proper authentication
- Secure API endpoints
- Handle sensitive data appropriately
- Follow GDPR and data protection guidelines

## Testing Strategy
- Unit tests for components and utilities
- Integration tests for key features
- E2E tests for critical user journeys

## Deployment
- Configure CI/CD pipeline
- Set up staging and production environments
- Implement monitoring and error tracking

## Future Enhancements
- Mobile application development
- Advanced AI features
- Integration with more service providers
- Analytics dashboard
- Multi-language support

## Contributing Guidelines
1. Follow the established code style
2. Write meaningful commit messages
3. Document new features and changes
4. Create comprehensive tests
5. Review and update relevant documentation

This context document should be updated as the project evolves and new decisions are made. 