--!strict

local Commands = {}

function Commands.bind(toolbar: PluginToolbar, widget: DockWidgetPluginGui): ()
  local openButton = toolbar:CreateButton(
    "OpenRCS",
    "Open the RCS Studio widget",
    "rbxassetid://0"
  )

  openButton.Click:Connect(function()
    widget.Enabled = not widget.Enabled
  end)
end

return Commands
