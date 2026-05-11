local DataStoreService = game:GetService("DataStoreService")

local ProfileStore = DataStoreService:GetDataStore("PlayerProfiles")

local function profileKeyForUserId(userId: number): string
	return ("profile:%d"):format(userId)
end

return {
	profileKeyForUserId = profileKeyForUserId,
	store = ProfileStore,
}
