--!strict

local Toolbar = require(script.Parent:WaitForChild("Toolbar"))
local Widget = require(script.Parent:WaitForChild("Widget"))
local Commands = require(script.Parent:WaitForChild("Commands"))

local function activate(plugin: Plugin): ()
  local toolbar = Toolbar.create(plugin)
  local widget = Widget.create(plugin)
  Commands.bind(toolbar, widget)
end

return {
  activate = activate,
}
