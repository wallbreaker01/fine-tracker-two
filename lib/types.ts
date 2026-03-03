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
  type: 'fine' | 'expense' | 'system';
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