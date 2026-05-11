--==Made by LuisPambid==--
--==Hidden Blade [Assasin]==--


local player=game.Players.LocalPlayer
local char=player.Character
repeat wait() until player and char
local torso=char.Torso
local head=char.Head
local human=char.Humanoid
local arm={Left=char["Left Arm"], Right=char["Right Arm"]}
local leg={Left=char["Left Leg"], Right=char["Right Leg"]}
local joints={LeftShoulder=torso["Left Shoulder"], RightShoulder=torso["Right Shoulder"], LeftHip=torso["Left Hip"], RightHip=torso["Right Hip"]}
joints.LeftShoulder.Part0=torso
joints.RightShoulder.Part0=torso
joints.LeftHip.Part0=torso
joints.RightHip.Part0=torso
local c=function(f) coroutine.resume(coroutine.create(f)) end
local p=function(f) pcall(f) end
local add={
	Part=function(par, a, c, col, t, s, cf, ms)
		local p=Instance.new("Part", par) pcall(function() p.TopSurface="Smooth" p.BottomSurface="Smooth" p.formFactor="Custom" p.Anchored=a p.CanCollide=c p.BrickColor=BrickColor.new(col) p.Transparency=t p.Size=s p.CFrame=cf or CFrame.new()  end)
		local m=Instance.new("BlockMesh", p) pcall(function() m.Scale=ms or Vector3.new(1, 1, 1) end)
		return p
	end,
	Wedge=function(par, a, c, col, t, s, cf, ms)
		local p=Instance.new("WedgePart", par) pcall(function() p.TopSurface="Smooth" p.BottomSurface="Smooth" p.formFactor="Custom" p.Anchored=a p.CanCollide=c p.BrickColor=BrickColor.new(col) p.Transparency=t p.Size=s p.CFrame=cf or CFrame.new()  end)
		local m=Instance.new("SpecialMesh", p) pcall(function() m.Scale=ms or Vector3.new(1, 1, 1) m.MeshType="Wedge" end)
		return p
	end,
	Gui=function(ins, par, bc, bg, tc, fs, text, t, s, pos)
		local g=Instance.new(ins, par) pcall(function() g.BorderColor=BrickColor.new(bc) g.BackgroundColor=BrickColor.new(bg) g.TextColor=BrickColor.new(tc) g.FontSize=fs g.Font="ArialBold" g.Text=text g.Transparency=t g.Size=s g.Position=pos  end)
		return g
	end,
	Weld=function(par, p1, cf)
		local w=Instance.new("Weld", par) pcall(function() w.Part0=w.Parent or par w.Part1=p1 w.C1=cf or CFrame.new() end)
		return w
	end,
	Mesh=function(ins, par, s, of, t)
		local m=Instance.new(ins, par) pcall(function() m.Scale=s or Vector3.new() m.Offset=of or Vector3.new() m.MeshType=t end)
		return m
	end,
	Sound=function(parent, id, volume, pitch)
		local s=Instance.new("Sound", parent) pcall(function() s.SoundId=id s.Volume=volume s.Pitch=pitch end)
		return s
	end,
}
local scriptname="Hidden Blade" --Name here
pcall(function() player.Backpack[scriptname]:remove() char[scriptname]:remove() char["Objects"]:remove() end)
local model=Instance.new("Model", char) model.Name="Objects"
local modelB=Instance.new("Model", char) modelB.Name=scriptname
local bin=Instance.new("HopperBin", player.Backpack) bin.Name=scriptname
local gui
local skincolor="Really black"
local hiddenbladecolor="Really black"
local body={}
local animate={}
local obj={}
--Variables--
local trailDeb=false
local keyDeb=false
local onAssasinate=false
local Assasinate=false
local dmg=math.random(10, 20)
local hitDeb=false
local loop=false
local speed=16
local equipleft, equipright=false, false
local Slash=add.Sound(torso, "rbxasset://sounds//swordslash.wav", 1, 1)
local Hit=add.Sound(torso, "http://roblox.com/asset/?id=10209225", 1, 1)
local Equipping=add.Sound(torso, "http://www.roblox.com/asset/?id=13510737", 1, 1)
function createParts()
	gui=Instance.new("ScreenGui", player.PlayerGui) gui.Name=scriptname
	--==PARTS==--
	torso.Transparency=1
	body.Head=add.Part(model, false, false, skincolor, 1, Vector3.new(1, 1, 1), nil)
	body.Torso=add.Part(model, false, false, skincolor, 0, Vector3.new(2, 2, 1), nil)
	body.ArmLeft, body.ArmRight=add.Part(model, false, false, skincolor, 1, Vector3.new(1, 1, 1), nil), add.Part(model, false, false, skincolor, 1, Vector3.new(1, 1, 1), nil)
	body.LegLeft, body.LegRight=add.Part(model, false, false, skincolor, 1, Vector3.new(1, 1, 1), nil), add.Part(model, false, false, skincolor, 1, Vector3.new(1, 1, 1), nil)
	--==WELDS==--
	body.HeadW=add.Weld(body.Head, body.Torso, CFrame.new(0, 1.5, 0))
	body.TorsoW=add.Weld(body.Torso, torso, nil)
	body.ArmLeftW, body.ArmRightW=add.Weld(body.ArmLeft, body.Torso, CFrame.new(-1.5, .5, 0)), add.Weld(body.ArmRight, body.Torso, CFrame.new(1.5, .5, 0))
	body.LegLeftW, body.LegRightW=add.Weld(body.LegLeft, body.Torso, CFrame.new(-.5, -1.5, 0)), add.Weld(body.LegRight, body.Torso, CFrame.new(.5, -1.5, 0))
	--==WELDS==--
	--add.Weld(body.Head, head, nil)
	add.Weld(arm.Left, body.ArmLeft, CFrame.new(0, -.5, 0))
	add.Weld(arm.Right, body.ArmRight, CFrame.new(0, -.5, 0))
	joints.LeftHip.Part0=body.Torso
	joints.RightHip.Part0=body.Torso
	---------------------------------------------------------------------------------------
	animate={
		["Head"]=function(cf)
			body.HeadW.C1=CFrame.new(0, 1.5, 0)*cf
		end;
		["Torso"]=function(cf)
			body.TorsoW.C1=cf
		end;
		["ArmLeft"]=function(cf)
			body.ArmLeftW.C1=CFrame.new(-1.5, .5, 0)*cf
		end;
		["ArmRight"]=function(cf)
			body.ArmRightW.C1=CFrame.new(1.5, .5, 0)*cf
		end;
		["LegLeft"]=function(cf)
			legLeftW=add.Weld(leg.Left, body.LegLeft, CFrame.new(0, -.5, 0))
			body.LegLeftW.C1=CFrame.new(-.5, -1.5, 0)*cf
			c(function()
				wait()
				legLeftW:remove()
			end)
		end;
		["LegRight"]=function(cf)
			legRightW=add.Weld(leg.Right, body.LegRight, CFrame.new(0, -.5, 0))
			body.LegRightW.C1=CFrame.new(.5, -1.5, 0)*cf
			c(function()
				wait()
				legRightW:remove()
			end)
		end;
	}
	--==Objects==--	
	obj.attackLabel=add.Gui("TextLabel", gui, "Really black", "Really black", "White", "Size18", "Assasinate(Q)", 0, UDim2.new(0, 150, 0, 50), UDim2.new(0, 0, 0, 150))
	obj.attackLabel2=add.Gui("TextLabel", obj.attackLabel, "Really black", "Really black", "White", "Size18", "StayLive(E)", 0, UDim2.new(1, 0, 1, 0), UDim2.new(0, 0, 1, 0))
	obj.attackLabel3=add.Gui("TextLabel", obj.attackLabel2, "Really black", "Really black", "White", "Size18", "Rappid(F)", 0, UDim2.new(1, 0, 1, 0), UDim2.new(0, 0, 1, 0))
	for i, v in pairs(modelB:children()) do
		if i==0 then return end
	end
	obj.Wrist=add.Part(modelB, false, false, hiddenbladecolor, 0, Vector3.new(1.1, 1, 1.1), nil)
	obj.WristW=add.Weld(obj.Wrist, arm.Left, CFrame.new(0, -.4, 0))
	obj.Keep=add.Part(modelB, false, false, hiddenbladecolor, 0, Vector3.new(.2, 1, .5), nil)
	obj.KeepW=add.Weld(obj.Keep, obj.Wrist, CFrame.new(.6, 0, 0))
	obj.Wedge=add.Wedge(modelB, false, false, hiddenbladecolor, 0, Vector3.new(1, .2, .3), nil)
	obj.WedgeW=add.Weld(obj.Wedge, obj.Keep, CFrame.new(0, 0, -.4)*CFrame.Angles(0, 0, -math.pi/2))
	obj.Wedge=add.Wedge(modelB, false, false, hiddenbladecolor, 0, Vector3.new(1, .2, .3), nil)
	obj.WedgeW=add.Weld(obj.Wedge, obj.Keep, CFrame.new(0, 0, .4)*CFrame.Angles(0, math.pi, math.pi/2))
	obj.Blade=add.Part(modelB, false, false, "Medium stone-grey", 0, Vector3.new(.2, .5, .2), nil, Vector3.new(.5, 1, 1))
	obj.BladeW=add.Weld(obj.Blade, obj.Keep, CFrame.new(0, .25, 0))
	obj.Point=add.Wedge(modelB, false, false, "Medium stone-grey", 0, Vector3.new(.2, .5, .2), nil, Vector3.new(.5, 1, .5))
	obj.PointW=add.Weld(obj.Point, obj.Blade, CFrame.new(0, -.5, -.05)*CFrame.Angles(0, 0, math.pi))
	obj.Point=add.Wedge(modelB, false, false, "Medium stone-grey", 0, Vector3.new(.2, .5, .2), nil, Vector3.new(.5, 1, .5))
	obj.PointW=add.Weld(obj.Point, obj.Blade, CFrame.new(0, -.5, .05)*CFrame.Angles(0, math.pi, math.pi))
	obj.Part=add.Part(modelB, false, false, hiddenbladecolor, 0, Vector3.new(.2, .2, .25), nil, Vector3.new(.7, 1, 1))
	obj.PartW=add.Weld(obj.Part, obj.Blade, CFrame.new(0, .2, 0))

	obj.Wrist2=add.Part(modelB, false, false, hiddenbladecolor, 0, Vector3.new(1.1, 1, 1.1), nil)
	obj.Wrist2W=add.Weld(obj.Wrist2, arm.Right, CFrame.new(0, -.4, 0)*CFrame.Angles(0, math.pi, 0))
	obj.Keep=add.Part(modelB, false, false, hiddenbladecolor, 0, Vector3.new(.2, 1, .5), nil)
	obj.KeepW=add.Weld(obj.Keep, obj.Wrist2, CFrame.new(.6, 0, 0))
	obj.Wedge=add.Wedge(modelB, false, false, hiddenbladecolor, 0, Vector3.new(1, .2, .3), nil)
	obj.WedgeW=add.Weld(obj.Wedge, obj.Keep, CFrame.new(0, 0, -.4)*CFrame.Angles(0, 0, -math.pi/2))
	obj.Wedge=add.Wedge(modelB, false, false, hiddenbladecolor, 0, Vector3.new(1, .2, .3), nil)
	obj.WedgeW=add.Weld(obj.Wedge, obj.Keep, CFrame.new(0, 0, .4)*CFrame.Angles(0, math.pi, math.pi/2))
	obj.Blade2=add.Part(modelB, false, false, "Medium stone-grey", 0, Vector3.new(.2, .5, .2), nil, Vector3.new(.5, 1, 1))
	obj.Blade2W=add.Weld(obj.Blade2, obj.Keep, CFrame.new(0, .25, 0))
	obj.Point=add.Wedge(modelB, false, false, "Medium stone-grey", 0, Vector3.new(.2, .5, .2), nil, Vector3.new(.5, 1, .5))
	obj.PointW=add.Weld(obj.Point, obj.Blade2, CFrame.new(0, -.5, -.05)*CFrame.Angles(0, 0, math.pi))
	obj.Point=add.Wedge(modelB, false, false, "Medium stone-grey", 0, Vector3.new(.2, .5, .2), nil, Vector3.new(.5, 1, .5))
	obj.PointW=add.Weld(obj.Point, obj.Blade2, CFrame.new(0, -.5, .05)*CFrame.Angles(0, math.pi, math.pi))
	obj.Part=add.Part(modelB, false, false, hiddenbladecolor, 0, Vector3.new(.2, .2, .25), nil, Vector3.new(.7, 1, 1))
	obj.PartW=add.Weld(obj.Part, obj.Blade2, CFrame.new(0, .2, 0))
end
function removeParts()
	p(function()
		if torso then
			joints.LeftShoulder.Part0=torso
			joints.RightShoulder.Part0=torso
			joints.LeftHip.Part0=torso
			joints.RightHip.Part0=torso
		end
		player.PlayerGui[scriptname]:remove()
		for i, v in pairs(model:children()) do v:remove() end
		for i, v in pairs(char:children()) do v.Transparency=0 end
	end)
end
function lightningGen(startPos, endPos)
	local magnitude=(startPos-endPos).magnitude
	local distance=(startPos+endPos)/2
	local pattern=add.Part(workspace, true, false, "White", 1, Vector3.new(.2, .2, magnitude), CFrame.new(distance, startPos))
	local startPosProx=startPos
	for i=1, 9 do
		local startPosProx2=startPosProx
		local random=Vector3.new(math.random(-1, 1), math.random(-1, 1), math.random(-1, 1))
		local findSize=pattern.Size.z/10
		local findOffSet=pattern.CFrame.lookVector*-1
		local compute=i*findSize*findOffSet
		local newStartPos=startPos
		local newEndPos=CFrame.new(random+compute+newStartPos).p
		local magnitude=(startPosProx2-newEndPos).magnitude
		local distance=(startPosProx2+newEndPos)/2
		local lightning=add.Part(workspace, true, false, "Bright yellow", 0, Vector3.new(.2, .2, magnitude), CFrame.new(distance, startPosProx2))
		c(function()
			for i=0, 1, .1 do wait()
				lightning.Transparency=i
			end
			lightning:remove()
		end)
		startPosProx=newEndPos
	end
	pattern:remove()
end
function computePos(pos, pos2)
	local pos3=Vector3.new(pos2.x, pos.y, pos2.z)
	torso.CFrame=CFrame.new(pos, pos3)
	return pos3
end
function nearTorso(pos, dis)
	local temp
	local distance=dis
	for i, v in pairs(workspace:children()) do
		if v:isA("Model") then
			temp=v:findFirstChild("Torso")
			local humanoid=v:findFirstChild("Humanoid")
			if temp and humanoid and v~=char and (temp.CFrame.p-pos).magnitude<distance then
				distance=(temp.CFrame.p-pos).magnitude
				return temp
			end
		end
	end
end
function trail(pos, cf)
	c(function()
		local old=(pos.CFrame*cf).p
		while trailDeb==true do
			wait()
			local new=(pos.CFrame*cf).p
			local mag=(old-new).magnitude
			local dis=(old+new)/2
			local trail=add.Part(workspace, true, false, "White", 0, Vector3.new(.5, mag, .5), CFrame.new(dis, new)*CFrame.Angles(math.pi/2, 0, 0)) trail.Name="Trail"
			local tMesh=add.Mesh("CylinderMesh", trail, Vector3.new(.5, 1, .5), nil, nil)
			old=new
			c(function()
				for i=1, 0, -.1 do
					wait()
					tMesh.Scale=tMesh.Scale*Vector3.new(i, 1, i)
				end
				trail:remove()
			end)
			c(function()
				for i=0, 1, .1 do
					wait()
					trail.Transparency=i
				end
			end)
		end
	end)
end
function Equip(form)
	c(function()
		if form=="Left" then
			if equipleft==false then
				equipleft=true Equipping:play()
				for i=0, 1, .1 do wait()
					obj.BladeW.C1=CFrame.new(0, .25-1*i, 0)
				end
				equipleft=false
			end
		end
	end)
	c(function()
		if form=="Right" then
			if equipright==false then
				equipright=true Equipping:play()
				for i=0, 1, .1 do wait()
					obj.Blade2W.C1=CFrame.new(0, .25-1*i, 0)
				end
				equipright=false
			end
		end
	end)
end
function Unequip()
	if obj.BladeW.C1.y<.25 then
		c(function() Equipping:play()
			for i=1, 0, -.1 do wait()
				obj.BladeW.C1=CFrame.new(0, .25-1*i, 0)
			end
		end)
	else
		obj.BladeW.C1=CFrame.new(0, .25, 0)	
	end
	if obj.Blade2W.C1.y<.25 then
		c(function() Equipping:play()
			for i=1, 0, -.1 do wait()
				obj.Blade2W.C1=CFrame.new(0, .25-1*i, 0)
			end
		end)
	else
		obj.Blade2W.C1=CFrame.new(0, .25, 0)	
	end
end
function hit(h)
	if keyDeb==true then
		if onAssasinate==false and h.Parent:findFirstChild("Humanoid") and h.Parent~=char and hitDeb==false then hitDeb=true Hit:play()
			local hHuman=h.Parent:findFirstChild("Humanoid")
			hHuman.Health=hHuman.Health-dmg
			local fakeM=Instance.new("Model", workspace) fakeM.Name=-dmg
			local fakeH=Instance.new("Humanoid", fakeM) fakeH.MaxHealth=0 fakeH.Health=0
			local effect=add.Part(fakeM, false, false, "Bright red", 0, Vector3.new(1, 1, 1), h.CFrame) effect.Name="Head"
			local fakeMesh=add.Mesh("CylinderMesh", effect, Vector3.new(1, .5, 1), nil, nil)
			local bp=Instance.new("BodyPosition", effect) bp.maxForce=Vector3.new(math.huge, math.huge, math.huge) bp.position=h.Position+Vector3.new(0, 4, 0)
			game.Debris:addItem(fakeM, 2)	
			wait(.5)
			hitDeb=false
		end
		if onAssasinate==true and h.Parent~=char and h.Parent:findFirstChild("Humanoid") and hitDeb==false then hitDeb=true Hit:play()
			h.Parent:breakJoints()
			local fakeM=Instance.new("Model", workspace) fakeM.Name="ASSASINATED"
			local fakeH=Instance.new("Humanoid", fakeM) fakeH.MaxHealth=0 fakeH.Health=0
			local effect=add.Part(fakeM, false, false, "Bright red", 0, Vector3.new(1, 1, 1), h.CFrame) effect.Name="Head"
			local fakeMesh=add.Mesh("CylinderMesh", effect, Vector3.new(1, .5, 1), nil, nil)
			local bp=Instance.new("BodyPosition", effect) bp.maxForce=Vector3.new(math.huge, math.huge, math.huge) bp.position=h.Position+Vector3.new(0, 4, 0)
			game.Debris:addItem(fakeM, 2)	
			wait(1)
			hitDeb=false
		end
	end
end
function running()
	animate.Torso(CFrame.new(0, 0, 0))
	animate.ArmLeft(CFrame.Angles(0, 0, -math.rad(15)))
	animate.ArmRight(CFrame.Angles(0, 0, math.rad(15)))
end
local Moves={
	["Assasinate"]=function(mouse)
		local target=mouse.Target
		for i, v in pairs(modelB:children()) do
			v.Touched:connect(hit)
		end
		if target then
			if target.Parent then
				local tChar=target.Parent
				if tChar:findFirstChild'Torso' then
					local tTorso=tChar["Torso"]
					human.WalkSpeed=0
					local bp=Instance.new("BodyPosition", torso)
					bp.maxForce=Vector3.new(math.huge, math.huge, math.huge)
					bp.position=torso.Position+Vector3.new(0, 10, 0)
					local bg=Instance.new("BodyGyro", torso)
					bg.maxTorque=Vector3.new(math.huge, math.huge, math.huge)
					for i=0, 1, .1 do wait()
						bg.cframe=CFrame.new(torso.CFrame.p, tTorso.CFrame.p)
						animate.ArmLeft(CFrame.Angles(-math.rad(45)*i, 0, -math.rad(45)*i))
						animate.ArmRight(CFrame.Angles(-math.rad(45)*i, 0, math.rad(45)*i))
					end
					wait(1)
					trailDeb=true trail(obj.Blade2, CFrame.new(0, -1, 0))
					Slash:play()
					for i=0, 1, .1 do wait()
						animate.Torso(CFrame.Angles(0, math.rad(90)*i, 0))
						animate.ArmRight(CFrame.Angles(-math.rad(45)+math.rad(45)*i, 0, math.rad(45)+math.rad(45)*i))
						bg.cframe=CFrame.new(torso.CFrame.p, tTorso.CFrame.p)
						bp.position=Vector3.new(0, 10-10*i, 0)+tTorso.Position*i
					end
					wait(.5)
					for i=1, 0, -.1 do wait()
						animate.Torso(CFrame.Angles(0, math.rad(90)*i, 0))
						animate.ArmRight(CFrame.Angles(0, 0, math.rad(90)*i))
					end
					bp:remove() bg:remove() trailDeb=false
				end
			end
		end
		running()
		human.WalkSpeed=speed
	end,
	["StayLive"]=function()
		local nTorso=nearTorso(torso.CFrame.p, 20)
		if nTorso then
			human.WalkSpeed=0
			local nTorsoW=add.Weld(nTorso, torso, CFrame.new(0, 0, -3.7))
			for i=0, 1, .1 do wait()
				animate.Torso(CFrame.Angles(0, -math.rad(90)*i, 0))
				animate.ArmLeft(CFrame.Angles(0, 0, -math.rad(90)*i))
			end
			wait(1)
			for i, v in pairs(modelB:children()) do
				v.Touched:connect(hit)
			end
			trailDeb=true trail(obj.Blade2, CFrame.new(0, -1, 0))
			Slash:play()
			for i=0, 1, .1 do wait()
				animate.ArmRight(CFrame.Angles(0, 0, math.rad(90)*i))
				animate.ArmLeft(CFrame.Angles(0, 0, -math.rad(90)+math.rad(75)*i))
				animate.Torso(CFrame.Angles(0, -math.rad(90)+math.rad(180)*i, 0))
			end
			trailDeb=false
			nTorsoW:remove()
			wait(.5)
			running()
			human.WalkSpeed=speed
		end
	end,
	["Rappid"]=function(mouse)
		human.WalkSpeed=0
		loop=true
		for i=0, 1, .1 do wait()
			animate.ArmLeft(CFrame.Angles(math.rad(90)*i, 0, 0))
			animate.ArmRight(CFrame.Angles(math.rad(90)*i, 0, 0))
		end
		for i, v in pairs(modelB:children()) do
			v.Touched:connect(hit)
		end
		trailDeb=true trail(obj.Blade, CFrame.new(0, -1, 0)) trail(obj.Blade2, CFrame.new(0, -1, 0))
		while loop do wait() Slash:play()
			computePos(torso.CFrame.p, mouse.Hit.p)
			torso.CFrame=torso.CFrame+torso.CFrame.lookVector*.2
			animate.ArmLeft(CFrame.new(0, 0, -math.random(0, 1.5))*CFrame.Angles(math.rad(90), 0, 0))
			animate.ArmRight(CFrame.new(0, 0, -math.random(0, 1.5))*CFrame.Angles(math.rad(90), 0, 0))
		end
		trailDeb=false
		for i=1, 0, -.1 do wait()
			animate.ArmLeft(CFrame.Angles(math.rad(90)*i, 0, 0))
			animate.ArmRight(CFrame.Angles(math.rad(90)*i, 0, 0))
		end
		human.WalkSpeed=speed
		running()
	end
}
bin.Selected:connect(function(mouse) createParts()
	for i=0, 1, .1 do wait()
		animate.ArmLeft(CFrame.Angles(0, 0, -math.rad(15)*i))
		animate.ArmRight(CFrame.Angles(0, 0, math.rad(15)*i))
	end
	Equip("Right")	Equip("Left")
	running()
	mouse.KeyDown:connect(function(key)
		local key=key:lower()
		if key=="q" and keyDeb==false then
			keyDeb=true onAssasinate=true
			Moves.Assasinate(mouse)
			keyDeb=false onAssasinate=false
		end
		if key=="e" and keyDeb==false then
			keyDeb=true onAssasinate=true
			Moves.StayLive(mouse)
			keyDeb=false onAssasinate=false
		end
		if key=="f" and keyDeb==false then
			keyDeb=true
			Moves.Rappid(mouse)
			keyDeb=false
		end
	end)
	mouse.KeyUp:connect(function(key)
		local key=key:lower()
		if key=="f" and keyDeb==true then loop=false end
	end)
	while onAssasinate==false and keyDeb==false do wait()
		local target=mouse.Target
		local nTorso=nearTorso(torso.CFrame.p, 100)
		if target then
			if target.Parent and nTorso then
				if target.Parent:findFirstChild("Humanoid") then
					Assasinate=true
					obj.attackLabel.TextColor=BrickColor.new("Bright red")
				else
					Assasinate=false
					obj.attackLabel.TextColor=BrickColor.new("White")
				end
			end
		end
	end
end)
bin.Deselected:connect(function()
	onAssasinate=false
	keyDeb=false
	obj.attackLabel.TextColor=BrickColor.new("White")
	obj.attackLabel2.TextColor=BrickColor.new("White")
	if keyDeb==false then
		Unequip()
		for i=1, 0, -.1 do wait()
			animate.ArmLeft(CFrame.Angles(0, 0, -math.rad(15)*i))
			animate.ArmRight(CFrame.Angles(0, 0, math.rad(15)*i))
		end
		wait(.5)
		torso.Transparency=0
		removeParts()
	end
end)--mediafire