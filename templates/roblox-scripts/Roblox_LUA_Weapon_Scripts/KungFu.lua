--==Made by LuisPambid==--
--==KungFu==--


repeat wait() until game.Players.LocalPlayer and game.Players.LocalPlayer.Character
local player=game.Players.LocalPlayer
local char=player.Character
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
local c=function(f) Spawn(f) end
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
	Mesh=function(ins, par, s, of, t, id)
		local m=Instance.new(ins, par) pcall(function() m.Scale=s or Vector3.new() m.Offset=of or Vector3.new() m.MeshId=id or "" m.MeshType=t end)
		return m
	end,
	Sound=function(parent, id, volume, pitch)
		local s=Instance.new("Sound", parent) pcall(function() s.SoundId=id s.Volume=volume s.Pitch=pitch end)
		return s
	end,
}
local modelName="Kung Fu" --Name here
pcall(function() player.Backpack[modelName]:remove() char[modelName]:remove() char["CharacterParts"]:remove() end)
local model=Instance.new("Model", char) model.Name="CharacterParts"
local modelB=Instance.new("Model", char) modelB.Name=modelName
local bin=Instance.new("HopperBin", player.Backpack) bin.Name=modelName
local skincolor="Really black"
local gui=Instance.new("ScreenGui")
local body={}
local animate={}
local obj={}
--Variables--
local trailDeb=false
local keyDeb=false
local hitDeb=false
local loop=false
local speed=16
local combo=0
local Slash=add.Sound(torso, "rbxasset://sounds//swordslash.wav", 1, 1.2)
local Hit=add.Sound(torso, "http://roblox.com/asset/?id=10209225", 1, 1)
function createParts()
	--==PARTS==--
	torso.Transparency=1
	for i, v in pairs(char:children()) do if v:isA("CharacterMesh") then v:remove() end end
	gui.Parent=player.PlayerGui gui.Name=modelName
	body.Head=add.Part(model, false, false, skincolor, 1, Vector3.new(1, 1, 1), nil)
	body.Torso=add.Part(model, false, false, skincolor, 0, Vector3.new(2, 2, 1), nil)
	body.ArmLeft, body.ArmRight=add.Part(model, false, false, skincolor, 1, Vector3.new(1, 1, 1), nil), add.Part(model, false, false, skincolor, 1, Vector3.new(1, 1, 1), nil)
	body.LegLeft, body.LegRight=add.Part(model, false, false, skincolor, 1, Vector3.new(1, 1, 1), nil), add.Part(model, false, false, skincolor, 1, Vector3.new(1, 1, 1), nil)
	--==WELDS==--
	body.HeadW=add.Weld(body.Head, body.Torso, CFrame.new(0, 1.5, 0))
	body.TorsoW=add.Weld(body.Torso, torso, nil)
	body.ArmLeftW, body.ArmRightW=add.Weld(body.ArmLeft, body.Torso, CFrame.new(-1.5, .5, 0)), add.Weld(body.ArmRight, body.Torso, CFrame.new(1.5, .5, 0))
	body.LegLeftW, body.LegRightW=add.Weld(body.LegLeft, body.Torso, CFrame.new(-.5, -1, 0)), add.Weld(body.LegRight, body.Torso, CFrame.new(.5, -1, 0))
	--==WELDS2==--
	add.Weld(body.Head, head, nil)
	add.Weld(arm.Left, body.ArmLeft, CFrame.new(0, -.5, 0))
	add.Weld(arm.Right, body.ArmRight, CFrame.new(0, -.5, 0))
	joints.LeftHip.Part0=body.Torso
	joints.RightHip.Part0=body.Torso
	--==Sign==--
	body.Part=add.Part(model, false, false, "White", 0, Vector3.new(.2, 1, .2))
	add.Weld(body.Part, body.Torso, CFrame.new(-.25, 0, .5))
	body.Part=add.Part(model, false, false, "White", 0, Vector3.new(.7, .2, .2))
	add.Weld(body.Part, body.Torso, CFrame.new(0, -.5, .5))
	body.Part=add.Part(model, false, false, "White", 0, Vector3.new(.2, 1, .2))
	add.Weld(body.Part, body.Torso, CFrame.new(.25, 0, -.5))
	body.Part=add.Part(model, false, false, "White", 0, Vector3.new(.7, .2, .2))
	add.Weld(body.Part, body.Torso, CFrame.new(0, -.5, -.5))
	---------------------------------------------------------------------------------------
	animate={
		["Head"]=function(cf)
			body.HeadW.C1=CFrame.new(0, 1.5, 0)*cf
		end;
		["Torso"]=function(cf)
			body.TorsoW.C1=(cf or CFrame.new()*CFrame.Angles(0, 0, 0))
		end;
		["ArmLeft"]=function(cf)
			body.ArmLeftW.C1=CFrame.new(-1.5, .5, 0)*(cf or CFrame.new()*CFrame.Angles(0, 0, 0))
		end;
		["ArmRight"]=function(cf)
			body.ArmRightW.C1=CFrame.new(1.5, .5, 0)*(cf or CFrame.new()*CFrame.Angles(0, 0, 0))
		end;
		["LegLeft"]=function(cf)
			legLeftW=add.Weld(leg.Left, body.LegLeft, CFrame.new(0, -1, 0))
			body.LegLeftW.C1=CFrame.new(-.5, -1, 0)*(cf or CFrame.new()*CFrame.Angles(0, 0, 0))
			coroutine.resume(coroutine.create(function()
				wait()
				legLeftW:remove()
			end))
		end;
		["LegRight"]=function(cf)
			legRightW=add.Weld(leg.Right, body.LegRight, CFrame.new(0, -1, 0))
			body.LegRightW.C1=CFrame.new(.5, -1, 0)*(cf or CFrame.new()*CFrame.Angles(0, 0, 0))
			coroutine.resume(coroutine.create(function()
				wait()
				legRightW:remove()
			end))
		end;
	}
	--==Objects==--	
	obj.attackLabel=add.Gui("TextLabel", gui, "Really black", "Really black", "White", "Size18", "(5) Combos", 0, UDim2.new(0, 150, 0, 50), UDim2.new(0, 0, 0, 150))
	obj.attackLabel2=add.Gui("TextLabel", obj.attackLabel, "Really black", "Really black", "White", "Size18", "Punch[Right]", 0, UDim2.new(1, 0, 1, 0), UDim2.new(0, 0, 1, 0))
	obj.attackLabel3=add.Gui("TextLabel", obj.attackLabel2, "Really black", "Really black", "White", "Size18", "Punch[Left]", 0, UDim2.new(1, 0, 1, 0), UDim2.new(0, 0, 1, 0))
	obj.attackLabel4=add.Gui("TextLabel", obj.attackLabel3, "Really black", "Really black", "White", "Size18", "Kick[Right]", 0, UDim2.new(1, 0, 1, 0), UDim2.new(0, 0, 1, 0))
	obj.attackLabel5=add.Gui("TextLabel", obj.attackLabel4, "Really black", "Really black", "White", "Size18", "Kick[Left]", 0, UDim2.new(1, 0, 1, 0), UDim2.new(0, 0, 1, 0))
	obj.attackLabel6=add.Gui("TextLabel", obj.attackLabel5, "Really black", "Really black", "White", "Size18", "RappidKick", 0, UDim2.new(1, 0, 1, 0), UDim2.new(0, 0, 1, 0))
	for i, v in pairs(modelB:children()) do
		if i==0 then return end
	end
	--==Weapon==--
end
function removeParts()
	pcall(function()
		if torso then
			joints.LeftShoulder.Part0=torso
			joints.RightShoulder.Part0=torso
			joints.LeftHip.Part0=torso
			joints.RightHip.Part0=torso
			torso.Transparency=0
		end
		player.PlayerGui[modelName]:remove()
		for i, v in pairs(model:children()) do v:remove() end
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
	return CFrame.new(pos, pos3)
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
function trail(pos, cf, col, size)
	c(function()
		local old=(pos.CFrame*cf).p
		while trailDeb==true do
			wait()
			local new=(pos.CFrame*cf).p
			local mag=(old-new).magnitude
			local dis=(old+new)/2
			local trail=add.Part(workspace, true, false, col or "White", 0, Vector3.new(size or .2, mag, size or .2), CFrame.new(dis, new)*CFrame.Angles(math.pi/2, 0, 0)) trail.Name="Effect"
			local tMesh=add.Mesh("CylinderMesh", trail, Vector3.new(1, 1, 1), nil, nil)
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
function rayCast(pos, dir, col)
	local magnitude=(pos-dir).magnitude
	local distance=(pos+dir)/2
	local ray=add.Part(workspace, true, false, col, 0, Vector3.new(.2, magnitude, .2), CFrame.new(distance, pos))
	return ray
end
function dmgHit(h)
	local dmg=math.random(5, 10)
	if keyDeb==true and h.Parent:findFirstChild("Humanoid") and hitDeb==false and h.Parent~=char then
		hitDeb=true
		local hHuman=h.Parent:findFirstChild("Humanoid")
		local hTorso=h.Parent:findFirstChild("Torso")
		hHuman.Health=hHuman.Health-dmg
		local fakeM=Instance.new("Model", workspace) fakeM.Name=-dmg
		local fakeH=Instance.new("Humanoid", fakeM) fakeH.MaxHealth=0 fakeH.Health=0
		local effect=add.Part(fakeM, true, false, "Bright red", 0, Vector3.new(1, 1, 1), hTorso.CFrame*CFrame.new(0, 4, 0)) effect.Name="Head"
		local fakeMesh=add.Mesh("CylinderMesh", effect, Vector3.new(1, .5, 1), nil, nil)
		local effect=add.Part(workspace, true, false, "White", .5, Vector3.new(1, 1, 1), CFrame.new(h.CFrame.p, torso.CFrame.p)*CFrame.Angles(-math.pi/2, 0, 0))
		local effectM=add.Mesh("SpecialMesh", effect, Vector3.new(1, 1, 1), nil, nil, "http://www.roblox.com/asset/?id=20329976")
		c(function()
			for i=1, 2, .1 do wait()
				effectM.Scale=Vector3.new(i, i/2, i)
			end
			effect:remove()
		end)
		game.Debris:addItem(fakeM, 1)
		wait(.1)
		hitDeb=false
	end
end
function idled()
	animate.ArmLeft(CFrame.new(.5, 0, 0)*CFrame.Angles(math.rad(135), 0, math.rad(5)))
	animate.ArmRight(CFrame.new(-.5, 0, 0)*CFrame.Angles(math.rad(135), 0, -math.rad(5)))
end
function doAttacks()
	combo=combo+1
	if keyDeb==false then
		keyDeb=true
		if combo>0 then Slash:play()
			trailDeb=true
			trail(body.ArmRight, CFrame.new(0, -2.5, 0))
			for i=0, 1, .2 do wait()
				animate.Torso(CFrame.Angles(0, math.rad(90)*i, 0))
				animate.ArmRight(CFrame.Angles(math.rad(90), 0, math.rad(90)*i))
			end
			trailDeb=false
			for i=1, 0, -.2 do wait()
				animate.Torso(CFrame.Angles(0, math.rad(90)*i, 0))
				animate.ArmRight(CFrame.Angles(math.rad(90), 0, math.rad(90)*i))
			end
		end
		if combo>2 then Slash:play()
			trailDeb=true
			trail(body.ArmLeft, CFrame.new(0, -2.5, 0))
			for i=0, 1, .2 do wait()
				animate.Torso(CFrame.Angles(0, -math.rad(90)*i, 0))
				animate.ArmLeft(CFrame.Angles(math.rad(90), 0, -math.rad(90)*i))
			end
			trailDeb=false
			for i=1, 0, -.2 do wait()
				animate.Torso(CFrame.Angles(0, -math.rad(90)*i, 0))
				animate.ArmLeft(CFrame.Angles(math.rad(90), 0, -math.rad(90)*i))
			end
		end
		if combo>3 then Slash:play()
			idled()
			trailDeb=true
			trail(body.LegRight, CFrame.new(0, -2.5, 0))
			for i=0, 1, .2 do wait()
				animate.Torso(CFrame.new(0, -1*i, 0)*CFrame.Angles(math.rad(135)*i, math.rad(90)*i, 0))
				animate.LegLeft(CFrame.new(-.5*i, 0, 0)*CFrame.Angles(0, 0, -math.rad(135)*i))
			end
			trailDeb=false
			for i=1, 0, -.2 do wait()
				animate.Torso(CFrame.new(0, -1*i, 0)*CFrame.Angles(math.rad(135)*i, math.rad(90)*i, 0))
				animate.LegLeft(CFrame.new(-.5*i, 0, 0)*CFrame.Angles(0, 0, -math.rad(135)*i))
			end
		end
		if combo>4 then Slash:play()
			idled()
			trailDeb=true
			trail(body.LegLeft, CFrame.new(0, -2.5, 0))
			for i=0, 1, .2 do wait()
				animate.Torso(CFrame.new(0, -1*i, 0)*CFrame.Angles(math.rad(135)*i, -math.rad(90)*i, 0))
				animate.LegRight(CFrame.new(.5*i, 0, 0)*CFrame.Angles(0, 0, math.rad(135)*i))
			end
			trailDeb=false
			for i=1, 0, -.2 do wait()
				animate.Torso(CFrame.new(0, -1*i, 0)*CFrame.Angles(math.rad(135)*i, -math.rad(90)*i, 0))
				animate.LegRight(CFrame.new(.5*i, 0, 0)*CFrame.Angles(0, 0, math.rad(135)*i))
			end
		end
		if combo>5 then
			idled()
			for i=0, 1, .2 do wait()
				animate.Torso(CFrame.new(0, -.8*i, 0)*CFrame.Angles(math.rad(80)*i, -math.rad(90)*i, 0))
			end
			for i=1, 20 do wait() Slash:play()
				torso.CFrame=torso.CFrame+torso.CFrame.lookVector*.2
				animate.LegLeft(CFrame.Angles(math.rad(math.random(-45, 45)), math.rad(math.random(-45, 45)), math.rad(math.random(-45, 45))))
				animate.LegRight(CFrame.Angles(math.rad(math.random(-45, 45)), math.rad(math.random(-45, 45)), math.rad(math.random(-45, 45))))
			end
			for i=1, 0, -.2 do wait()
				animate.Torso(CFrame.new(0, -.8*i, 0)*CFrame.Angles(math.rad(80)*i, -math.rad(90)*i, 0))
			end
		end
		trailDeb=false
		keyDeb=false
		combo=0
		idled()
	end
end
bin.Selected:connect(function(mouse) createParts()
	for i, v in pairs(char:children()) do if v:isA("BasePart") then v.Touched:connect(dmgHit) end end
	for i=0, 1, .1 do wait()
		animate.ArmLeft(CFrame.new(.5*i, 0, 0)*CFrame.Angles(math.rad(135)*i, 0, math.rad(5)*i))
		animate.ArmRight(CFrame.new(-.5*i, 0, 0)*CFrame.Angles(math.rad(135)*i, 0, -math.rad(5)*i))
	end
	mouse.Button1Down:connect(doAttacks)
end)
bin.Deselected:connect(function()
	for i=1, 0, -.1 do wait()
		animate.ArmLeft(CFrame.new(.5*i, 0, 0)*CFrame.Angles(math.rad(135)*i, 0, math.rad(5)*i))
		animate.ArmRight(CFrame.new(-.5*i, 0, 0)*CFrame.Angles(math.rad(135)*i, 0, -math.rad(5)*i))
	end
	removeParts()
end)--mediafire