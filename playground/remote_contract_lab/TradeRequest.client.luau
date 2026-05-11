local ReplicatedStorage = game:GetService("ReplicatedStorage")

local TradeRequest = ReplicatedStorage:WaitForChild("Remotes"):WaitForChild("TradeRequest")

local function requestTrade(targetUserId: number, offeredItemIds: {string})
	TradeRequest:FireServer({
		targetUserId = targetUserId,
		offeredItemIds = offeredItemIds,
	})
end

return {
	requestTrade = requestTrade,
}
