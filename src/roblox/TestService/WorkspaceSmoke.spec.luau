--!strict

local ReplicatedStorage = game:GetService("ReplicatedStorage")

local Shared = ReplicatedStorage:WaitForChild("Shared")
local Gui = ReplicatedStorage:WaitForChild("Gui")
local Assets = ReplicatedStorage:WaitForChild("Assets")

local RemoteIds = require(Shared:WaitForChild("RemoteIds"))
local DesignTokens = require(Gui:WaitForChild("DesignTokens"))
local AssetManifest = require(Assets:WaitForChild("AssetManifest"))

return function(): ()
  assert(RemoteIds.TradeRequest == "TradeRequest", "RemoteIds.TradeRequest should stay stable")
  assert(DesignTokens.Colors.Accent ~= nil, "Design token accent color missing")
  assert(AssetManifest.Icons.CreatorPanel ~= nil, "Asset manifest icon contract missing CreatorPanel")
end
