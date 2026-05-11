--!strict

local Toolbar = {}

function Toolbar.create(plugin: Plugin): PluginToolbar
  return plugin:CreateToolbar("RCS")
end

return Toolbar
