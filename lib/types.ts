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
