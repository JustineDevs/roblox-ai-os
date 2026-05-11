--!strict

local ReplicatedStorage = game:GetService("ReplicatedStorage")

local Shared = ReplicatedStorage:WaitForChild("Shared")
local RemoteIds = require(Shared:WaitForChild("RemoteIds"))

local function start(): ()
  -- Early bootstrap is intentionally light. It only proves shared contracts are reachable
  -- before the rest of the client runtime starts.
  assert(RemoteIds.TradeRequest ~= nil, "RemoteIds contract missing TradeRequest")
end

start()
