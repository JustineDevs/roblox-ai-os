--!strict

export type AssetManifest = {
  Icons: {
    CreatorPanel: string,
    PartyQueue: string,
    RewardLoop: string,
  },
  Sounds: {
    Confirm: string,
    Error: string,
  },
}

local Assets: AssetManifest = {
  Icons = {
    CreatorPanel = "rbxassetid://0",
    PartyQueue = "rbxassetid://0",
    RewardLoop = "rbxassetid://0",
  },
  Sounds = {
    Confirm = "rbxassetid://0",
    Error = "rbxassetid://0",
  },
}

return Assets
