--!strict

local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local player = Players.LocalPlayer
local playerGui = player:WaitForChild("PlayerGui")

local Gui = ReplicatedStorage:WaitForChild("Gui")
local DesignTokens = require(Gui:WaitForChild("DesignTokens"))

local function mountHud(): ScreenGui
  local root = Instance.new("ScreenGui")
  root.Name = "RcsHudRoot"
  root.ResetOnSpawn = false
  root.ZIndexBehavior = Enum.ZIndexBehavior.Sibling

  local frame = Instance.new("Frame")
  frame.Name = "Panel"
  frame.Size = UDim2.fromOffset(320, 88)
  frame.Position = UDim2.fromOffset(24, 24)
  frame.BackgroundColor3 = DesignTokens.Colors.Surface
  frame.Parent = root

  local title = Instance.new("TextLabel")
  title.Name = "Title"
  title.BackgroundTransparency = 1
  title.Position = UDim2.fromOffset(DesignTokens.Spacing.Lg, DesignTokens.Spacing.Md)
  title.Size = UDim2.fromOffset(220, 24)
  title.Text = "RCS HUD Root"
  title.Font = Enum.Font.GothamBold
  title.TextSize = 20
  title.TextColor3 = DesignTokens.Colors.TextPrimary
  title.TextXAlignment = Enum.TextXAlignment.Left
  title.Parent = frame

  root.Parent = playerGui
  return root
end

mountHud()
