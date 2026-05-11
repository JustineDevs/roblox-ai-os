local Players = game:GetService("Players")

local player = Players.LocalPlayer
local playerGui = player:WaitForChild("PlayerGui")
local onboardingGui = playerGui:WaitForChild("OnboardingGui")

local function showNextObjective(text: string)
	onboardingGui.Frame.ObjectiveLabel.Text = text
end

return {
	showNextObjective = showNextObjective,
}
