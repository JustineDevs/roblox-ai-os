export type ProfileData = {
	Coins: number,
	Inventory: {string},
	LastLoginUnix: number,
	TutorialComplete: boolean,
}

local ProfileTemplate: ProfileData = {
	Coins = 0,
	Inventory = {},
	LastLoginUnix = 0,
	TutorialComplete = false,
}

return ProfileTemplate
