--!strict

local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local player = Players.LocalPlayer
local Gui = ReplicatedStorage:WaitForChild("Gui")
local DesignTokens = require(Gui:WaitForChild("DesignTokens"))

local function start(): ()
  assert(player ~= nil, "LocalPlayer must exist before client bootstrap runs")
  assert(DesignTokens.Colors.Accent ~= nil, "Design token contract must be available to client bootstrap")
end

start()
