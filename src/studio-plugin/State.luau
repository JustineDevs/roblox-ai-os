--!strict

export type PluginState = {
  WidgetEnabled: boolean,
  LastCommand: string?,
}

local State = {
  WidgetEnabled = false,
  LastCommand = nil,
} :: PluginState

return State
