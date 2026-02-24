# 📊 Fine Tracker — Project Documentation

Internal Office Fun Fine Management System

## 1. 📌 Project Overview
Fine Tracker is a lightweight internal web application designed to track office fines in a transparent, fun, and organized way. Instead of informal fine collection, this system provides:

- Centralized fine tracking
- Accountability among team members
- Automatic calculations for party funds
- Calendar visualization of fines
- Notifications and reminders
- Optional AI insights for fun summaries

This project focuses on simplicity, transparency, and team engagement rather than heavy enterprise-level accounting.

## 2. 🎯 Core Objectives

### Primary Goals
- Track fines per employee
- Show total collected fines
- Maintain a clear history
- Enable self-management of fines
- Provide visibility across the team

### Secondary Goals
- Encourage friendly accountability
- Support social events funded by fines
- Provide useful insights into trends

## 3. 🏗 Technology Stack

**Frontend**
- Next.js 16 (App Router)
- shadcn/ui components
- Tailwind CSS
- Calendar UI integration
- React Hook Form + Zod validation

**Backend**
- Next.js API routes
- MongoDB database
- Auth.js authentication
- Inngest background workflows

**Optional AI Integration**
- Gemini API for summaries, insights, and fun features

## 4. 🔐 Authentication System

**Features**
- Secure login/signup
- Session management
- Protected dashboard routes
- Profile management

Auth.js handles:
- Session creation
- OAuth or credentials login
- Middleware route protection

## 5. 💰 Fine Management System

Core functionality of the app.

**Features**
- Add Fine
  - Amount entry
  - Reason selection
  - Automatic date saving
- Edit Fine
  - Correction of mistakes
  - Amount/reason update
- Delete Fine
  - Remove incorrect entries
- Fine History
  - Displays: user fines, dates, total accumulated fines

## 6. 📊 Dashboard System

Central overview page.

Includes:
- Total fine collected
- Personal fine totals
- Leaderboard ranking
- Recent fine activity
- Party fund indicator

## 7. 📅 Calendar Feature

Provides visual tracking of fines.

**Key Functions**
- Monthly calendar overview
- Daily fine totals
- Click-to-view detailed fines
- Color-coded fine intensity

**Purpose**:
- Transparency
- Trend identification
- Easy browsing

## 8. 🔔 Notification System

Powered by Inngest background jobs.

**Notification Types**
- Fine added alerts
- Fine edit confirmations
- Monthly summaries
- Party reminders

Notifications can be:
- In-app
- Email (optional future)

## 9. 🎉 Party Management Module

Tracks how fine money is used.

**Features**
- Fund total calculation
- Expense tracking
- Event planning notes

Encourages transparency.

## 10. 🤖 AI Insights (Optional)

Gemini API may provide:
- Monthly summaries
- Behavioral insights
- Fun commentary
- Pattern detection

This is optional and non-critical.

## 11. 🗄 Database Models

**User**
- Name
- Email
- Password hash
- Role
- Timestamp

**Fine**
- User reference
- Amount
- Reason
- Date
- Timestamp

**Notification**
- User reference
- Message
- Read status
- Timestamp

**Party**
- Budget
- Date
- Notes

## 12. Background Jobs (Inngest)

Used for:
- Notifications
- Monthly summaries
- Reminder scheduling
- AI-generated reports

Improves performance by offloading heavy tasks.

## 13. Security Considerations

Recommended practices:
- Hashed passwords
- Input validation with Zod
- Protected routes
- Secure environment variables

## 14. Performance Practices

- Query optimization
- Lazy loading UI components
- Efficient API responses
- Data caching where appropriate

## 15. Testing Strategy

Suggested:
- Authentication testing
- Fine CRUD testing
- Notification testing
- Basic UI testing

Ensures reliability.

## 16. Deployment Overview

Typical deployment:
- Vercel hosting
- MongoDB Atlas database
- Environment variable configuration

## 17. Environment Variables

Examples:
- Database URI
- Auth secret keys
- Gemini API key
- Inngest credentials

Keep them secure.

## 18. Future Enhancements

Possible additions:
- Mobile PWA version
- Meme tagging for fines
- Voting system for party plans
- Advanced analytics
- Real-time notifications

## 19. Conclusion

Fine Tracker is a modern internal tool combining:

- Practical fine tracking
- Social engagement
- Clean architecture
- Fun usability

It balances functionality with simplicity, making it ideal for internal office use while remaining scalable for future improvements.

---

Created on: Generated project documentation for Fine Tracker
