import { Mode } from "fs";
import { FineInput } from "./formValidation";
//import { FineListItem } from "./database/fines";

export type SummaryStats = {
  myFines: number;
  totalCollectedFines: number;
  topFineGiver: {
    name: string;
    amount: number;
  } | null;
  totalPartyFund: number;
};

export type LeaderboardEntry = {
  id: number;
  name: string;
  avatar: string | null;
  totalFine: number;
  rank: number;
};

export type RecentActivityEntry = {
  id: number;
  userId: number;
  userName: string;
  amount: number;
  reason: string;
  createdAt: string;
};

export type PartySummaryStats = {
  totalCollected: number;
  totalSpent: number;
  netBalance: number;
};

export type PartyExpenseItem = {
  id: number;
  description: string;
  amount: number;
  spentAt: string;
};

export type Notification = {
  id: number;
  title: string;
  description: string;
  isRead: boolean;
  createdAt: string;
  type: "fine" | "expense" | "system";
  relatedId?: number;
};

export type StoredUser = {
  id: number;
  name: string;
  email: string;
  avatar?: string | null;
};

export type ProfileAvatarUploaderProps = {
  userId: number;
  name: string;
  initials: string;
  image: string | null;
};

export type AvatarRow = {
  id: number;
  image_url: string | null;
};

export type AvatarUpdatePayload = {
  avatarUrl?: string;
};

export type SumRow = {
  total: string | null;
};

export type TopFineGiverRow = {
  name: string;
  total_fine: string;
};

export type LeaderboardRow = {
  id: number | string;
  name: string;
  image_url: string | null;
  total_fine: string;
};

export type RecentActivityRow = {
  id: number | string;
  user_id: number;
  user_name: string;
  amount: string;
  reason: string;
  created_at: string;
};

export type PartyExpenseRow = {
  id: number | string;
  amount: string;
  note: string | null;
  spent_at: string;
};

export type UserRow = {
  //matches the users table structure
  id: number;
  name: string;
  email: string;
  image_url: string | null;
  password_hash: string;
  role: "admin" | "user";
};

export interface Fine {
  id: number;
  reason: string;
  date: string;
  amount: number;
  user: {
    id: number;
    name: string;
    image: string | null;
    initials: string;
  };
}
export interface CalendarEvent {
  title: string;
  date: string;
}

export type DashboardErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export type FinesErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export type FinesPageProps = {
  searchParams: Promise<{
    toast?: string;
    type?: "success" | "error";
    search?: string;
  }>;
};

export type AuthResponse = {
  success: boolean;
  message: string;
  emailSent?: boolean;
  emailError?: string;
  user?: {
    id: number;
    name: string;
    email: string;
    avatar?: string | null;
  };
};

export type FormFieldProps = {
  id: string;
  label: string;
  type?: "text" | "email" | "password";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
};

export type LeaderboardCardProps = {
  data: LeaderboardEntry[];
  hasError?: boolean;
};

export type RecentActivityCardProps = {
  data: RecentActivityEntry[];
  hasError?: boolean;
};

export type MemberOption = {
  id: number;
  name: string;
};

export type FineFormProps = {
  mode: "add" | "edit";
  members: MemberOption[];
  fineId?: number;
  initialValues?: FineInput;
};

export type FineRowActionsProps = {
  fineId: number;
};

export type FinesTableProps = {
  fines: FineListItem[];
  canManageFines: boolean;
};

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  avatar?: string | null;
};

export type NotificationItem = {
  isRead: boolean;
};

export type SideMenuProps = {
  children: React.ReactNode;
  initialUser?: { id: number; name: string; email: string; role: string } | null;
};

export type SummaryCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  state?: "default" | "empty" | "error";
};

export type FineMember = {
  id: number;
  name: string;
  image: string | null;
};

export type FineListItem = {
  id: number;
  amount: number;
  reason: string;
  date: string;
  user: FineMember & { initials: string };
};

export type FineRow = {
  id: number | string;
  amount: string | number;
  reason: string;
  fine_date: string;
  user_id: number;
  user_name: string;
  user_image: string | null;
};

export type MemberRow = {
  id: number;
  name: string;
  image_url: string | null;
};

export type NotificationRow = {
  id: number;
  title: string;
  description: string;
  is_read: boolean;
  created_at: string;
  type: "fine" | "expense" | "system";
  related_id: number | null;
};
