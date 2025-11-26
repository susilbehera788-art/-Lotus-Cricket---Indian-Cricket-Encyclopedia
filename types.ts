export interface NavItem {
  label: string;
  path: string;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface PlayerSummary {
  id: string;
  name: string;
  role: string;
  era: string;
}

export interface MatchUpdate {
  title: string;
  score: string;
  status: string;
}

export interface Association {
  name: string;
  state: string;
  est: string;
}