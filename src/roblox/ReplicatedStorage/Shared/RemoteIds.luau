--!strict

export type RemoteIdMap = {
  TradeRequest: string,
  PartyQueueJoin: string,
  PartyQueueLeave: string,
  OnboardingAdvance: string,
}

local RemoteIds: RemoteIdMap = {
  TradeRequest = "TradeRequest",
  PartyQueueJoin = "PartyQueueJoin",
  PartyQueueLeave = "PartyQueueLeave",
  OnboardingAdvance = "OnboardingAdvance",
}

return RemoteIds
