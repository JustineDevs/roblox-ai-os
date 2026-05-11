--!strict

local ReplicatedStorage = game:GetService("ReplicatedStorage")

local Shared = ReplicatedStorage:WaitForChild("Shared")
local RemoteIds = require(Shared:WaitForChild("RemoteIds"))

local function ensureRemote(name: string): RemoteEvent
  local existing = ReplicatedStorage:FindFirstChild(name)
  if existing and existing:IsA("RemoteEvent") then
    return existing
  end

  local remote = Instance.new("RemoteEvent")
  remote.Name = name
  remote.Parent = ReplicatedStorage
  return remote
end

local function bootstrapRemotes(): ()
  ensureRemote(RemoteIds.TradeRequest)
  ensureRemote(RemoteIds.PartyQueueJoin)
  ensureRemote(RemoteIds.PartyQueueLeave)
  ensureRemote(RemoteIds.OnboardingAdvance)
end

bootstrapRemotes()
