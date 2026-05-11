local ReplicatedStorage = game:GetService("ReplicatedStorage")

local TradeRequest = ReplicatedStorage:WaitForChild("Remotes"):WaitForChild("TradeRequest")

local function isTradePayloadValid(payload)
	return typeof(payload) == "table"
		and typeof(payload.targetUserId) == "number"
		and typeof(payload.offeredItemIds) == "table"
end

TradeRequest.OnServerEvent:Connect(function(player, payload)
	if not isTradePayloadValid(payload) then
		warn("Rejected malformed trade payload from", player.UserId)
		return
	end

	-- Server remains the source of truth for inventory ownership and trade state.
end)
