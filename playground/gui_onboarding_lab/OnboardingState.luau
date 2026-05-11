export type OnboardingState = {
	CurrentStep: string,
	HasClaimedStarterReward: boolean,
}

local defaultState: OnboardingState = {
	CurrentStep = "Spawn",
	HasClaimedStarterReward = false,
}

return defaultState
