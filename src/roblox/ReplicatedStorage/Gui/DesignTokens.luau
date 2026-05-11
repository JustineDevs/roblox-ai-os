--!strict

export type ColorTokenMap = {
  Surface: Color3,
  Accent: Color3,
  Positive: Color3,
  Danger: Color3,
  TextPrimary: Color3,
  TextMuted: Color3,
}

export type SpacingTokenMap = {
  Xs: number,
  Sm: number,
  Md: number,
  Lg: number,
  Xl: number,
}

local Tokens = {
  Colors = {
    Surface = Color3.fromRGB(22, 26, 33),
    Accent = Color3.fromRGB(0, 162, 255),
    Positive = Color3.fromRGB(92, 184, 92),
    Danger = Color3.fromRGB(217, 83, 79),
    TextPrimary = Color3.fromRGB(255, 255, 255),
    TextMuted = Color3.fromRGB(188, 194, 204),
  } :: ColorTokenMap,
  Spacing = {
    Xs = 4,
    Sm = 8,
    Md = 12,
    Lg = 20,
    Xl = 28,
  } :: SpacingTokenMap,
}

return Tokens
