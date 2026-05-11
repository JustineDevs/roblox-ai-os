--==Made by LuisPambid==--
--==Storm Spirit[Dota 2]==--


--Player Settings
local modelName="Storm Spirit" --Name here
repeat wait() until game.Players.LocalPlayer and game.Players.LocalPlayer.Character
local player=game.Players.LocalPlayer
local char=player.Character

--CharacterParts
local humanoid=char.Humanoid
local head=char.Head
local torso=char.Torso
local LA=char:findFirstChild("Left Arm")
local RA=char:findFirstChild("Right Arm")
local LL=char:findFirstChild("Left Leg")
local RL=char:findFirstChild("Right Leg")

--Joints
local LS=torso:findFirstChild("Left Shoulder")
local RS=torso:findFirstChild("Right Shoulder")
local LH=torso:findFirstChild("Left Hip")
local RH=torso:findFirstChild("Right Hip")
LS.Part0=torso RS.Part0=torso LH.Part0=torso RH.Part0=torso

--Local Functions
local s=function(f) Spawn(f) end
local c=function(f) coroutine.resume(coroutine.create(f)) end
pcall(function() player.Backpack[modelName]:remove() end) 
pcall(function() char["CharacterParts"]:remove() end)
pcall(function() char[modelName]:remove() end)
pcall(function() player.PlayerGui[modelName]:remove() end)
pcall(function() for i, v in pairs(char:children()) do if v:isA("BasePart") then v.Transparency=0 end end end)
--Settings
local model=Instance.new("Model", char) model.Name="CharacterParts"
local model2=Instance.new("Model", char) model2.Name=modelName
local bin=Instance.new("HopperBin", player.Backpack) bin.Name=modelName
local gui=Instance.new("ScreenGui") gui.Name=modelName
local skincolor="Really black"
local body={}
local animate={}
local obj={}
local onTrail=false
local onKey=false
local onHit=false
local onBlock=false
local onHold=false
local onClick=false
local onClick2=false
local onAttack=false
local onCast=false
local cast=0
local colorSet={
	Handle="Dark orange";
	Blade="Mid gray";
	Extra="Bright blue";
}
local combo=0
local dmg=math.random(5, 10)
local m

local add={
	Part=function(par, a, c, col, t, s, cf, ms)
		local p=Instance.new("Part", par) pcall(function() p.TopSurface="Smooth" p.BottomSurface="Smooth" p.formFactor="Custom" p.Anchored=a p.CanCollide=c p.BrickColor=BrickColor.new(col) p.Transparency=t p.Size=s p.CFrame=cf or CFrame.new()  end)
		local m=Instance.new("BlockMesh", p) pcall(function() m.Scale=ms or Vector3.new(1, 1, 1) end)
		return p
	end;
	Wedge=function(par, a, c, col, t, s, cf, ms)
		local p=Instance.new("WedgePart", par) pcall(function() p.TopSurface="Smooth" p.BottomSurface="Smooth" p.formFactor="Custom" p.Anchored=a p.CanCollide=c p.BrickColor=BrickColor.new(col) p.Transparency=t p.Size=s p.CFrame=cf or CFrame.new()  end)
		local m=Instance.new("SpecialMesh", p) pcall(function() m.Scale=ms or Vector3.new(1, 1, 1) m.MeshType="Wedge" end)
		return p
	end;
	Gui=function(ins, par, bc, bg, tc, fs, text, t, s, pos)
		local g=Instance.new(ins, par) pcall(function() g.BorderColor=BrickColor.new(bc) g.BackgroundColor=BrickColor.new(bg) g.TextColor=BrickColor.new(tc) g.FontSize=fs g.Font="ArialBold" g.Text=text g.BackgroundTransparency=t g.Size=s g.Position=pos  end)
		return g
	end;
	Weld=function(par, p1, cf)
		local w=Instance.new("Weld", par) pcall(function() w.Part0=w.Parent or par w.Part1=p1 w.C1=cf or CFrame.new() end)
		return w
	end;
	Mesh=function(ins, par, s, of, t, id, tid)
		local m=Instance.new(ins, par) pcall(function() m.Scale=s or Vector3.new(1, 1, 1) m.Offset=of or Vector3.new() m.MeshId=id or "" m.TextureId=tid or "" m.MeshType=t end)
		return m
	end;
	Sound=function(parent, id, pitch, volume)
		local s=Instance.new("Sound", parent) pcall(function() s.SoundId=id s.Volume=volume s.Pitch=pitch end)
		return s
	end;
}

--Sounds
local Sounds={
	Slash="rbxasset://sounds//swordslash.wav";
	Hit="http://www.roblox.com/asset/?id=11113679 ";
	Equip="rbxasset://sounds/unsheath.wav";
	Charge="http://www.roblox.com/asset/?id=2101137";
	ElectricShortage="http://roblox.com/asset/?id=10209481";
	Elec="http://www.roblox.com/asset/?id=2800815";
	ElectricSound="http://www.roblox.com/asset/?id=10756118";
	Abscond="http://www.roblox.com/asset/?id=2767090";
}

--Decals
local Decals={
	SlashDecal="http://www.roblox.com/asset/?id=25539335";
}

--MeshIds
local Meshes={
	Charge="http://www.roblox.com/asset/?id=20329976";
	Noob="http://www.roblox.com/asset/?id=29515710";
	Ring="http://www.roblox.com/asset/?id=3270017";
	Crown="http://www.roblox.com/asset/?id=1323306";
}

------------------------CreateParts------------------------
body.Torso=add.Part(model2, false, false, skincolor, 1, Vector3.new(2, 2, 1), nil)
body.TorsoW=add.Weld(body.Torso, torso, nil)
function createParts()
	for i, v in pairs(char:children()) do if v:isA("CharacterMesh") then v:remove() end end
	torso.Transparency=1 body.Torso.Transparency=0
	--Parts--
	gui.Parent=player.PlayerGui
	body.Head=add.Part(model, false, false, skincolor, 1, Vector3.new(1, 1, 1), nil)
	body.LA, body.RA=add.Part(model, false, false, skincolor, 1, Vector3.new(1, 1, 1), nil), add.Part(model, false, false, skincolor, 1, Vector3.new(1, 1, 1), nil)
	body.LL, body.RL=add.Part(model, false, false, skincolor, 1, Vector3.new(1, 1, 1), nil), add.Part(model, false, false, skincolor, 1, Vector3.new(1, 1, 1), nil)
	
	--Welds--
	body.HeadW=add.Weld(body.Head, body.Torso, CFrame.new(0, 1.5, 0))
	body.LAW, body.RAW=add.Weld(body.LA, body.Torso, CFrame.new(-1.5, .5, 0)), add.Weld(body.RA, body.Torso, CFrame.new(1.5, .5, 0))
	body.LLW, body.RLW=add.Weld(body.LL, body.Torso, CFrame.new(-.5, -1.5, 0)), add.Weld(body.RL, body.Torso, CFrame.new(.5, -1.5, 0))
	
	--Welds2--
	add.Weld(body.Head, head, nil)
	add.Weld(LA, body.LA, CFrame.new(0, -.5, 0))
	add.Weld(RA, body.RA, CFrame.new(0, -.5, 0))
	LH.Part0=body.Torso
	RH.Part0=body.Torso
	
	--Sign--
	body.Part=add.Part(model, false, false, "White", 0, Vector3.new(.2, 1, .2))
	add.Weld(body.Part, body.Torso, CFrame.new(.25, 0, -.45))
	body.Part=add.Part(model, false, false, "White", 0, Vector3.new(.7, .2, .2))
	add.Weld(body.Part, body.Torso, CFrame.new(0, -.5, -.45))
	
	--Animation--
	animate={
		["Head"]=function(cf)
			body.HeadW.C1=CFrame.new(0, 1.5, 0)*cf
		end;
		["Torso"]=function(cf)
			body.TorsoW.C1=(cf or CFrame.new()*CFrame.Angles(0, 0, 0))
		end;
		["LA"]=function(cf)
			body.LAW.C1=CFrame.new(-1.5, .5, 0)*(cf or CFrame.new()*CFrame.Angles(0, 0, 0))
		end;
		["RA"]=function(cf)
			body.RAW.C1=CFrame.new(1.5, .5, 0)*(cf or CFrame.new()*CFrame.Angles(0, 0, 0))
		end;
		["LL"]=function(cf)
			LLW=add.Weld(LL, body.LL, CFrame.new(0, -1, 0))
			body.LLW.C1=CFrame.new(-.5, -1, 0)*(cf or CFrame.new()*CFrame.Angles(0, 0, 0))
			c(function()
				wait()
				LLW:remove()
			end)
		end;
		["RL"]=function(cf)
			RLW=add.Weld(RL, body.RL, CFrame.new(0, -1, 0))
			body.RLW.C1=CFrame.new(.5, -1, 0)*(cf or CFrame.new()*CFrame.Angles(0, 0, 0))
			c(function()
				wait()
				RLW:remove()
			end)
		end;
	}
	--GuiLabels--
	obj.AL=add.Gui("TextLabel", gui, "Really black", "Really black", "White", "Size18", "Attack(ClickPLAYER)", 0, UDim2.new(0, 150, 0, 50), UDim2.new(0, 0, 0, 150))
	obj.AL2=add.Gui("TextLabel", obj.AL, "Really black", "Really black", "White", "Size18", "StaticRemnant(Z)", 0, UDim2.new(1, 0, 1, 0), UDim2.new(0, 0, 1, 0))
	obj.AL3=add.Gui("TextLabel", obj.AL2, "Really black", "Really black", "White", "Size18", "ElectricVortex(X)", 0, UDim2.new(1, 0, 1, 0), UDim2.new(0, 0, 1, 0))
	obj.AL4=add.Gui("TextLabel", obj.AL3, "Really black", "Really black", "White", "Size18", "BallLightning(C)", 0, UDim2.new(1, 0, 1, 0), UDim2.new(0, 0, 1, 0))
	--WeaponDesgin--
	for i, v in pairs(model2:children()) do
		if i~=1 then return end
	end
end

------------------------Functions------------------------
function removeParts()
	pcall(function()
		if torso then
			LS.Part0=torso
			RS.Part0=torso LH.Part0=torso
			RH.Part0=torso
			torso.Transparency=0
			body.Torso.Transparency=1
		end
		player.PlayerGui[modelName]:remove()
		for i, v in pairs(model:children()) do
			v:remove()
		end
	end)
end
function play(soundid, pitch, vol)
	local sound=add.Sound(workspace, soundid, pitch or 1, volume or 1)
	sound:play()
	s(function() wait(5) sound:remove() end)
end
function fade(part, incr)
	if part:isA("BasePart") then
		for i=part.Transparency, 1, incr do wait() part.Transparency=i end
	elseif part:isA("Model") then
		for i, v in pairs(part:children() or part) do
			if v:isA("BasePart") then
				for i=part.Transparency, 1, incr do wait() v.Transparency=i end
			end
		end
	end
end
function appear(part, incr)
	if part:isA("BasePart") then
		for i=part.Transparency, 0, -incr do wait() part.Transparency=i end
	elseif part:isA("Model") then
		for i, v in pairs(part:children() or part) do
			if v:isA("BasePart") then
				for i=part.Transparency, 0, -incr do wait() v.Transparency=i end
			end
		end
	end
end
function computePos(pos, pos2)
	local pos3=Vector3.new(pos2.x, pos.y, pos2.z) 
	return CFrame.new(pos, pos3)
end
function rayCast(pos, dir, max, ingore)
	return workspace:findPartOnRay(Ray.new(pos, dir.unit*(max or 9999)), ignore)
end
function nearPos(pos, dis)
	local temp
	local distance=dis
	for i, v in pairs(workspace:children()) do
		if v:isA("Model") then
			temp=v:findFirstChild("Torso")
			local humanoid=v:findFirstChild("Humanoid")
			if temp and humanoid and v~=char and (temp.CFrame.p-pos).magnitude<distance then
				distance=(temp.CFrame.p-pos).magnitude
				return temp.Parent 
			end
		end
	end
end
function lightningGen(startPos, endPos, col)
	local magnitude=(startPos-endPos).magnitude
	local distance=(startPos+endPos)/2
	local pattern=add.Part(workspace, true, false, "White", 1, Vector3.new(.2, .2, magnitude), CFrame.new(distance, startPos))
	local startPosProx=startPos
	for i=1, 9 do
		local startPosProx2=startPosProx local random=Vector3.new(math.random(-1, 1), math.random(-1, 1), math.random(-1, 1))
		local findSize=pattern.Size.z/10 local findOffSet=pattern.CFrame.lookVector*-1
		local compute=i*findSize*findOffSet local newStartPos=startPos
		local newEndPos=CFrame.new(random+compute+newStartPos).p
		local magnitude=(startPosProx2-newEndPos).magnitude
		local distance=(startPosProx2+newEndPos)/2
		local lightning=add.Part(workspace, true, false, col or "Bright yellow", 0, Vector3.new(.2, .2, magnitude), CFrame.new(distance, startPosProx2))
		s(function()
			fade(lightning, .1) lightning:remove()
		end)
		startPosProx=newEndPos
	end 
	pattern:remove()
end
function trail(pos, cf, col, thick)
	onTrail=true
	s(function()
		local old=(pos.CFrame*(cf or CFrame.new())).p 
		while onTrail do wait()
			local new=(pos.CFrame*(cf or CFrame.new())).p
			local mag=(old-new).magnitude
			local dis=(old+new)/2 local trail=add.Part(char, true, false, col or "White", 0, Vector3.new(1, mag, 1), CFrame.new(dis, new)*CFrame.Angles(math.pi/2, 0, 0))
			trail.Name="Effect" local tMesh=add.Mesh("CylinderMesh", trail, Vector3.new(thick or 1, 1, thick or 1), nil, nil)
			old=new
			s(function()
				for i=1, 0, -.1 do wait() tMesh.Scale=tMesh.Scale*Vector3.new(i, 1, i) end trail:remove()
			end)
			s(function()
				fade(trail, .1)
			end)
		end
	end)
end
function stickHit(from, to)
	local stickW=add.Weld(from, to, to.CFrame:inverse()*from.CFrame)
	stickW.C0=from.CFrame:inverse()*from.CFrame
	return stickW
end
function glowMesh(prt, size, speed)
	local glow=prt:clone() add.Weld(prt, glow)
	glow.Parent=workspace
	glow.Anchored=false
	glow.CanCollide=false
	for i, v in pairs(glow:children()) do
		if v:isA("SpecialMesh") or v:isA("BlockMesh") or v:isA("CylinderMesh") then
			s(function()
				for i=0, size, speed do wait() v.Scale=v.Scale+Vector3.new(i, i, i) end
			end)
			s(function()
				fade(glow, .1) glow:remove()
			end)
		end
	end
end
function charge(prt, cf, col, start, endval, incr)
	local aura=add.Part(workspace, false, false, col or "Bright yellow", 0, Vector3.new(1, 1, 1), cf or torso.CFrame)
	local auraM=add.Mesh("SpecialMesh", aura, Vector3.new(start, .5, start), nil, "File") auraM.MeshId=Meshes.Charge
	add.Weld(aura, prt or torso, cf*CFrame.Angles(0, math.rad(math.random(-45, 45)), 0))
	s(function()
		for i=start, endval, incr do wait()
			auraM.Scale=Vector3.new(i, auraM.Scale.y, i)
		end
		aura:remove()
	end)
	s(function()
		fade(aura, .1)
	end)
end
function makeCircle(prt, prts, dis, incr)
	local radius=dis+(prts+incr)
	for i=1, prts do
		local prt2=prt:clone()
		prt2.Parent=model
		local x = math.sin((360/prts + 360/prts*i)/(180/math.pi))*radius
		local y = 0
		local z = math.cos((360/prts + 360/prts*i)/(180/math.pi))*radius
		prt2.CFrame=prt.CFrame:toWorldSpace(CFrame.new(x,y,z))
		prt:remove()
		return prt2
	end
end
function antiExplosion(model)
	local ffs={}
	for i, v in pairs(model:children()) do
		pcall(function()
			local ff2=Instance.new("ForceField", v.Handle)
			table.insert(ffs, ff2) end)
			if v:isA("BasePart") then
				local ff=Instance.new("ForceField", v)
				table.insert(ffs, ff)
			end
		end
	return ffs
end
function dmgHit(prt)
	prt.Touched:connect(function(h)
		if onKey==true and h.Parent:findFirstChild("Humanoid") and onHit==false and h.Parent~=char then
			onHit=true print("dmg")
			local fakeM=Instance.new("Model", workspace) 
			fakeM.Name=-dmg
			local hHuman=h.Parent:findFirstChild("Humanoid")
			hHuman.Health=hHuman.Health-dmg
			local hTorso=h.Parent:findFirstChild("Torso")
			local fakeH=Instance.new("Humanoid", fakeM) fakeH.MaxHealth=0 fakeH.Health=0
			local label=add.Part(fakeM, true, false, "Bright red", 0, Vector3.new(.5, .5, .5), h.CFrame*CFrame.new(math.random(-4, 4), 4, math.random(-4, 4))) label.Name="Head"
			game.Debris:addItem(fakeM, 1)
			wait(.1)
			onHit=false
		end
	end)
end
function blockHit(prt)
	prt.Touched:connect(function(h)
		if onBlock==true and onKey==true and not h.Parent:findFirstChild("Humanoid") and onHit==false and h.Parent~=char then
			onHit=true
			play(Sounds.Hit, 1, 1)
			print'Blocked'
			local bp=Instance.new("BodyPosition", h) bp.maxForce=Vector3.new(math.huge, math.huge, math.huge) bp.position=(CFrame.new(torso.CFrame.p, h.CFrame.p)*CFrame.new(0, 0, -math.random(100, 200))).p
			local bg=Instance.new("BodyGyro", h) bg.maxTorque=Vector3.new(math.huge, math.huge, math.huge) bg.cframe=CFrame.new(h.CFrame.p, torso.CFrame.p)
			game.Debris:addItem(bp, .2) game.Debris:addItem(bg, .2)
			wait(.1)
			onHit=false
		end
	end)
end
function idle()
	animate.LA(CFrame.Angles(0, 0, -math.rad(15)))
	animate.RA(CFrame.Angles(0, 0, math.rad(15)))
end
function StaticRemnant()
	casted()
	play(Sounds.ElectricShortage, 1, 1)
	play(Sounds.Abscond, 1, 1)
	local trans=.5
	local color="Bright blue"
	local rem=add.Part(workspace, true, false, color, .25, Vector3.new(4, 4, 4), torso.CFrame*CFrame.new(0, -.2, 0))
	local remM=add.Mesh("SpecialMesh", rem, Vector3.new(7, 7, 7), nil, nil, Meshes.Noob)
	s(function()
		while wait() do
			for i=.25, .5, .01 do wait()
				rem.Transparency=i
				remM.Scale=remM.Scale+Vector3.new(i*.05, i*.05, i*.05)
			end
			for i=.5, .25, -.01 do wait()
				rem.Transparency=i
				remM.Scale=remM.Scale-Vector3.new(i*.05, i*.05, i*.05)
			end
		end
	end)
	rem.Touched:connect(function(h)
		if h.Parent:findFirstChild("Humanoid") and onHit==false and h.Parent~=char then
			onHit=true
			play(Sounds.ElectricSound, 1, 1)
			local blast=add.Part(workspace, true, false, color, .25, Vector3.new(4, 4, 1), rem.CFrame*CFrame.new(0, -3, 0)*CFrame.Angles(math.rad(90), 0, 0))
			local blastM=add.Mesh("SpecialMesh", blast, blast.Size, nil, nil, Meshes.Ring)
			local blast2=add.Part(workspace, true, false, color, .25, Vector3.new(4, 1, 4), rem.CFrame*CFrame.new(0, -3, 0))
			local blast2M=add.Mesh("SpecialMesh", blast2, blast.Size, nil, nil, Meshes.Charge)
			s(function()
			for i=blast.Size.x, 12, 1 do wait()
				blastM.Scale=Vector3.new(i, i, i)
				blast2M.Scale=Vector3.new(i, i*.2, i)
			end
			blast:remove()
			blast2:remove()
			end)
			rem:remove()
			local fakeM=Instance.new("Model", workspace) 
			fakeM.Name=-20
			local hHuman=h.Parent:findFirstChild("Humanoid")
			hHuman.Health=hHuman.Health-20
			local hTorso=h.Parent:findFirstChild("Torso")
			local fakeH=Instance.new("Humanoid", fakeM) fakeH.MaxHealth=0 fakeH.Health=0
			local label=add.Part(fakeM, true, false, "Bright red", 0, Vector3.new(.5, .5, .5), h.CFrame*CFrame.new(math.random(-4, 4), 4, math.random(-4, 4))) label.Name="Head"
			game.Debris:addItem(fakeM, 1)
			wait(.1)
			onHit=false
		end
	end)
	game.Debris:addItem(rem, 12)
	wait(2)
end
function ElectricVortex(target)
	casted()
	onClick=false
	humanoid.WalkSpeed=8
	for i=0, 1, .2 do wait()
		animate.Torso(CFrame.Angles(0, -math.rad(45)*i, 0))
		animate.RA(CFrame.Angles(0, 0, math.rad(135)*i))
	end
	for i=0, 1, .2 do wait()
		animate.Torso(CFrame.Angles(0, -math.rad(45-90*i), 0))
		animate.RA(CFrame.Angles(-math.rad(45)*i, 0, math.rad(135)))
	end
	for i=1, 0, -.2 do wait()
		animate.Torso(CFrame.Angles(0, math.rad(45)*i, 0))
		animate.RA(CFrame.Angles(-math.rad(45)*i, 0, math.rad(135)*i))
	end
	idle()
	local start=add.Part(model, true, false, "Bright blue", .2, Vector3.new(1.5, 1.5, 1.5), torso.CFrame)
	local startM=add.Mesh("SpecialMesh", start, nil, nil, "Sphere")
	local bg=Instance.new("BodyGyro", target) bg.maxTorque=Vector3.new(math.huge, math.huge, math.huge) bg.D=100
	local bv=Instance.new("BodyVelocity", target) bv.maxForce=Vector3.new(math.huge, math.huge, math.huge)
	for i=0, 1, .01 do wait()
		bv.velocity=target.CFrame.lookVector*10
		bg.cframe=CFrame.new(target.CFrame.p, start.CFrame.p)
		local mag=(start.CFrame.p-target.CFrame.p).magnitude
		local dis=(start.CFrame.p+target.CFrame.p)/2
		local con=add.Part(workspace, true, false, "Bright blue", .2, Vector3.new(1, mag, 1), CFrame.new(dis, start.CFrame.p)*CFrame.Angles(math.rad(90), 0, 0))
		local conM=add.Mesh("CylinderMesh", con)
		s(function()
			for i=.2, 1, .1 do wait() con.Transparency=i end con:remove()
		end)
		play(Sounds.Electric, 1, 1)
		play(Sounds.ElectricSound, 1, 1)
	end
	loop=false
	bg:remove()
	bv:remove()
	start:remove()
	humanoid.WalkSpeed=16
end
function BallLightning()
	casted()
	humanoid.WalkSpeed=0
	onKey=true
	play(Sounds.Electric, 1, 1)
	play(Sounds.ElectricSound, 1, 1)
	for i=0, 1, .2 do wait()
		animate.Torso(CFrame.Angles(-math.rad(90)*i, 0, 0))
	end
	torso.CFrame=computePos(torso.CFrame.p, m.Hit.p)
	local ball=add.Part(workspace, false, false, "Cyan", 0, Vector3.new(7, 7, 7), torso.CFrame)
	for i, v in pairs(char:children()) do if v.ClassName=="Part" then dmgHit(v) end end
	dmgHit(ball)
	local ballM=add.Mesh("SpecialMesh", ball, nil, nil, "Sphere")
	local ballW=add.Weld(ball, torso)
	local bp=Instance.new("BodyPosition", torso) bp.maxForce=bp.maxForce*math.huge bp.D=bp.D*1.5
	trail(ball, CFrame.new(), "Cyan", ball.Size.x)
	local pos=m.Hit.p
	dmg=(torso.CFrame.p-m.Hit.p).magnitude/2
	bp.position=Vector3.new(pos.x, pos.y, pos.z)
	wait(.4)
	for i=1, 0, -.2 do wait()
		animate.Torso(CFrame.Angles(-math.rad(90)*i, 0, 0))
	end
	bp:remove()
	ball:remove()
	onKey=false
	onTrail=false
	dmg=math.random(5, 10)
	humanoid.WalkSpeed=16
	idle()
end
function findClick()
	if onClick then
		local dis=nearPos(torso.CFrame.p, 25)
		local tgt=m.Target
		if tgt and dis then
			if tgt.Parent:findFirstChild("Humanoid") then
				m.Icon=""
				ElectricVortex(tgt.Parent:findFirstChild("Torso"))
			end
		end
	end
	if onClick2 then
		onClick2=false
		m.Icon=""
		BallLightning()
	end
end
function Attack()
	if not onAttack then
		onAttack=true
		play(Sounds.Electric, 1, 1)
		play(Sounds.ElectricSound, 1, 1)
		for i=0, 1, .2 do wait()
			animate.Torso(CFrame.Angles(0, -math.rad(45)*i, 0))
			animate.RA(CFrame.Angles(0, 0, math.rad(135)*i))
		end
		for i=0, 1, .2 do wait()
			animate.Torso(CFrame.Angles(0, -math.rad(45-90*i), 0))
			animate.RA(CFrame.Angles(-math.rad(45)*i, 0, math.rad(135)))
		end
		for i=1, 0, -.2 do wait()
			animate.Torso(CFrame.Angles(0, math.rad(45)*i, 0))
			animate.RA(CFrame.Angles(-math.rad(45)*i, 0, math.rad(135)*i))
			end
		local bolt=add.Part(workspace, false, false, "Cyan", 0, Vector3.new(.2, .2, 1.5), CFrame.new(body.RA.CFrame.p, m.Hit.p))
		local bf=Instance.new("BodyForce", bolt) bf.force=Vector3.new(0, bolt:getMass()*196.25, 0)
		local bv=Instance.new("BodyVelocity", bolt) bv.maxForce=bv.maxForce*math.huge bv.velocity=bolt.CFrame.lookVector*100
		idle()
		game.Debris:addItem(bolt, 5)
		bolt.Touched:connect(function(h)
			if not onCast and h.Parent:findFirstChild("Humanoid") and onHit==false and h.Parent~=char then
				onHit=true print("dmg")
				dmg=math.random(5, 10)
				local blast=add.Part(workspace, true, false, "Bright blue", .25, Vector3.new(2, .5, 2), CFrame.new(h.CFrame.p, torso.CFrame.p)*CFrame.Angles(-math.rad(90), 0, 0))
				local blastM=add.Mesh("SpecialMesh", blast, blast.Size, nil, nil, Meshes.Charge)
				game.Debris:addItem(blast, 1)
				bolt:remove()
				local effect
				local fakeM=Instance.new("Model", workspace) 
				fakeM.Name=-dmg
				local hHuman=h.Parent:findFirstChild("Humanoid")
				hHuman.Health=hHuman.Health-dmg
				local hTorso=h.Parent:findFirstChild("Torso")
				local fakeH=Instance.new("Humanoid", fakeM) fakeH.MaxHealth=0 fakeH.Health=0
				local label=add.Part(fakeM, true, false, "Bright red", 0, Vector3.new(.5, .5, .5), h.CFrame*CFrame.new(math.random(-4, 4), 4, math.random(-4, 4))) label.Name="Head"
				game.Debris:addItem(fakeM, 1)
				wait(.1)
				onHit=false
			elseif onCast and h.Parent:findFirstChild("Humanoid") and onHit==false and h.Parent~=char then
				onTrail=false
				onHit=true
				print("dmg")
				onCast=false
				cast=0
				dmg=math.random(20, 25)
				local blast=add.Part(workspace, true, false, "Bright blue", .25, Vector3.new(2, .5, 2), CFrame.new(h.CFrame.p, torso.CFrame.p)*CFrame.Angles(-math.rad(90), 0, 0))
				local blastM=add.Mesh("SpecialMesh", blast, blast.Size, nil, nil, Meshes.Charge)
				game.Debris:addItem(blast, 1)
				bolt:remove()
				local effect
				local fakeM=Instance.new("Model", workspace) 
				fakeM.Name=-dmg.." Slowed!"
				local hHuman=h.Parent:findFirstChild("Humanoid")
				hHuman.Health=hHuman.Health-dmg
				local hTorso=h.Parent:findFirstChild("Torso")
				local fakeH=Instance.new("Humanoid", fakeM) fakeH.MaxHealth=0 fakeH.Health=0
				local label=add.Part(fakeM, true, false, "Bright red", 0, Vector3.new(.5, .5, .5), h.CFrame*CFrame.new(math.random(-4, 4), 4, math.random(-4, 4))) label.Name="Head"
				game.Debris:addItem(fakeM, 1)
				s(function()
					s(function() hHuman.WalkSpeed=2 wait(.6) hHuman.WalkSpeed=16 end)
					local blast=add.Part(workspace, true, false, "Bright blue", .25, Vector3.new(4, 1, 4), hTorso.CFrame*CFrame.new(0, -3, 0))
					local blastM=add.Mesh("SpecialMesh", blast, blast.Size, nil, nil, Meshes.Charge)
					s(function()
					for i=blast.Size.x, 12, 1 do wait()
						blastM.Scale=Vector3.new(i, i*.2, i)
					end
					blast:remove()
					end)
				end)
				wait(.1)
				onHit=false
			end
		end)
		onAttack=false
	end
end
function keyDown(key)
	local key=key:lower()
	if key=="z" and not onKey then
		onCast=true
		onKey=true
		StaticRemnant()
		onKey=false
	end
	if key=="x" and not onClick then
		onClick=true
		m.Icon="http://www.roblox.com/asset/?id=81886817"
		s(function()
			while onClick do wait()
				local tgt=m.Target
				local dis=nearPos(torso.CFrame.p, 25)
				if tgt and dis then
					if tgt.Parent:findFirstChild("Humanoid") then
						print(tgt)
						m.Button1Down:connect(findClick)
					end
				end
			end
		end)
	elseif key=="x" and onClick then
		onClick=false
		m.Icon=""
	end
	if key=="c" and not onClick then
		onClick2=true
		m.Icon="http://www.roblox.com/asset/?id=81886817"
		m.Button1Down:connect(findClick)
	elseif key=="c" and onClick then
		onClick2=false
		m.Icon=""
	end
end
function casted()
	onCast=true
	cast=cast+1
	if cast>1 then return end
	s(function()
	trail(body.RA, CFrame.new(0, -1.5, 0), "Cyan", .8)
	while onCast do wait()
		local effect=add.Part(workspace, false, false, "Cyan", .5, Vector3.new(1, 1, 1), body.RA.CFrame*CFrame.new(0, -1.5, 0))
		local effectW=add.Weld(effect, body.RA, CFrame.new(0, -1.5, 0)*CFrame.Angles(math.rad(math.random(-45, 45)),math.rad(math.random(-45, 45)),math.rad(math.random(-45, 45))))
		s(function()
			for i=.5, 1, .1 do wait()
				effect.Transparency=i
			end
			effect:remove()
		end)
	end
	end)
end
bin.Selected:connect(function(mouse)
	onKey=false
	m=mouse
	createParts()
	for i=0, 1, .1 do wait()
		animate.LA(CFrame.Angles(0, 0, -math.rad(15)*i))
		animate.RA(CFrame.Angles(0, 0, math.rad(15)*i))
	end
	mouse.KeyDown:connect(keyDown)
	mouse.Button1Down:connect(Attack)
	charge(torso, CFrame.new(0, -2.5, 0), "Bright blue", 5, 10, .2)
	idle()
end)
bin.Deselected:connect(function()
	removeParts()
	onKey=true
	for i=1, 0, -.1 do wait()
		animate.LA(CFrame.Angles(0, 0, -math.rad(15)*i))
		animate.RA(CFrame.Angles(0, 0, math.rad(15)*i))
	end
end)
--mediafire