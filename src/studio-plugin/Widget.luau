--!strict

local Widget = {}

function Widget.create(plugin: Plugin): DockWidgetPluginGui
  local widgetInfo = DockWidgetPluginGuiInfo.new(
    Enum.InitialDockState.Right,
    true,
    false,
    360,
    480,
    280,
    320
  )

  return plugin:CreateDockWidgetPluginGui("RcsWidget", widgetInfo)
end

return Widget
