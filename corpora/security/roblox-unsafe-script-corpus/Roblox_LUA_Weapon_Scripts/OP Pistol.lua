--==Made by LuisPambid==--
--==OP Pistol==--
--Press (Q) for Equip


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
local c=function(f) Spawn(f) end
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
	Mesh=function(ins, par, s, of, t, id)
		local m=Instance.new(ins, par) pcall(function() m.Scale=s or Vector3.new() m.Offset=of or Vector3.new() m.MeshId=id or "" m.MeshType=t end)
		return m
	end,
	Sound=function(parent, id, volume, pitch)
		local s=Instance.new("Sound", parent) pcall(function() s.SoundId=id s.Volume=volume s.Pitch=pitch end)
		return s
	end,
}
local scriptname="Pistol" --Name here
pcall(function() char[scriptname]:remove() char["Objects"]:remove() end)
local model=Instance.new("Model", char) model.Name="Objects"
local modelB=Instance.new("Model", char) modelB.Name=scriptname
local skincolor="Really black"
local color="Dark stone grey"
local color2="Black"
local gui
local body={}
local animate={}
local obj={}
--Variables--
local trailDeb=false
local keyDeb=false
local equip=false
local hitDeb=false
local loop=false
local speed=16
local clip=6
local ammo=200
local Gun=add.Sound(torso, "http://www.roblox.com/asset/?id=2691586", .5, 1)
local Reload=add.Sound(torso, "http://www.roblox.com/asset/?id=2760984", .5, 1)
local HeadShot=add.Sound(torso, "http://www.roblox.com/asset/?id=1876552", 1, 1)
local mouse=player:GetMouse()
	body.Torso=add.Part(modelB, false, false, skincolor, 1, Vector3.new(2, 2, 1), nil)
	body.TorsoW=add.Weld(body.Torso, torso, nil)
	--==Pocket==--
	obj.Pocket=add.Part(modelB, false, false, color, 0, Vector3.new(.5, .5, 1))
	obj.PocketW=add.Weld(obj.Pocket, body.Torso, CFrame.new(1.2, -1.7, 0))
	obj.Wedge=add.Wedge(modelB, false, false, color, 0, Vector3.new(.5, .5, 1))
	obj.WedgeW=add.Weld(obj.Wedge, obj.Pocket, CFrame.new(0, .5, 0)*CFrame.Angles(0, math.pi, 0))
	--==GUN==--
	obj.Handle=add.Part(modelB, false,false, color, 0, Vector3.new(.2, .5, .2))
	obj.HandleW=add.Weld(obj.Handle, obj.Pocket, CFrame.new(0, .75, 0)*CFrame.Angles(-math.rad(105), 0, 0))
	obj.Base=add.Part(modelB, false, false, color, 0, Vector3.new(.2, .2, 1), nil, Vector3.new(1, .5, 1))
	obj.BaseW=add.Weld(obj.Base, obj.Handle, CFrame.new(0, .2, -.1)*CFrame.Angles(math.rad(15), 0, 0))
	obj.B2=add.Part(modelB, false, false, color, 0, Vector3.new(.2, .2, 1), nil, Vector3.new(.8, .35, 1))
	obj.B2W=add.Weld(obj.B2, obj.Base, CFrame.new(0, .015, -.2))
	obj.W2=add.Wedge(modelB, false, false, color, 0, Vector3.new(.2, .2, .2))
	obj.W2W=add.Weld(obj.W2, obj.Base, CFrame.new(0, -.15, .3)*CFrame.Angles(math.pi, 0, 0))
	obj.W3=add.Wedge(modelB, false, false, color, 0, Vector3.new(.2, .2, .2), nil, Vector3.new(1, .2, .95))
	obj.W3W=add.Weld(obj.W3, obj.Base, CFrame.new(0, -.05, .4)*CFrame.Angles(math.pi, math.pi, 0))
	obj.P=add.Part(modelB, false, false, color, 0, Vector3.new(.2, .5, .2))
	obj.PM=add.Mesh("CylinderMesh", obj.P, Vector3.new(1, 1, 1))
	obj.PW=add.Weld(obj.P, obj.Handle, CFrame.new(0, 0, .1))
	obj.P=add.Part(modelB, false, false, color, 0, Vector3.new(.2, .5, .2))
	obj.PM=add.Mesh("CylinderMesh", obj.P, Vector3.new(1, 1, 1))
	obj.PW=add.Weld(obj.P, obj.Handle, CFrame.new(0, 0, -.1))
	obj.B3=add.Part(modelB, false, false, color, 0, Vector3.new(.2, 1.2, .2))
	obj.B3M=add.Mesh("CylinderMesh", obj.B3, Vector3.new(.3, 1, .3))
	obj.B3W=add.Weld(obj.B3, obj.B2, CFrame.new(0, 0.02, 0)*CFrame.Angles(math.pi/2, 0, 0))
	obj.P=add.Part(modelB, false, false, color, 0, Vector3.new(.2, .2, .2))
	obj.PM=add.Mesh("SpecialMesh", obj.P, Vector3.new(.3, .3, .3), nil, "Sphere")
	obj.PW=add.Weld(obj.P, obj.B3, CFrame.new(0, -.6, 0))
	obj.Barrel=add.Part(modelB, false, false, color, 0, Vector3.new(.2, 1.2, .2))
	obj.BarrelM=add.Mesh("CylinderMesh", obj.Barrel, Vector3.new(.5, 1, .5))
	obj.BarrelW=add.Weld(obj.Barrel, obj.B2, CFrame.new(0, 0.1, 0)*CFrame.Angles(math.pi/2, 0, 0))
	obj.Point=add.Part(modelB, false, false, color2, 0, Vector3.new(.2, .2, .2))
	obj.PointM=add.Mesh("CylinderMesh", obj.Point, Vector3.new(.5, .2, .5))
	obj.PointW=add.Weld(obj.Point, obj.Barrel, CFrame.new(0, -0.6, 0))

	obj.Reload=add.Part(modelB, false, false, color, 0, Vector3.new(.2, .2, 1.3), nil, Vector3.new(1, .8, 1))
	obj.ReloadW=add.Weld(obj.Reload, obj.Base, CFrame.new(0, .1, -.15))
	obj.P=add.Part(modelB, false, false, color, 0, Vector3.new(.2, 1.3, .2))
	obj.PM=add.Mesh("CylinderMesh", obj.P, Vector3.new(.5, 1, .5))
	obj.PW=add.Weld(obj.P, obj.Reload, CFrame.new(0, -.07, 0)*CFrame.Angles(math.pi/2, 0, 0))

	obj.P=add.Part(modelB, false, false, color, 0, Vector3.new(.2, .2, .4), nil, Vector3.new(.2, .2, .2))
	obj.PW=add.Weld(obj.P, obj.Reload, CFrame.new(0, .1, -.52))
	obj.W=add.Wedge(modelB, false, false, color, 0, Vector3.new(.2, .2, .4), nil, Vector3.new(.2, .2, .2))
	obj.WW=add.Weld(obj.W, obj.Reload, CFrame.new(0, .1, -.6))
	obj.P=add.Part(modelB, false, false, color, 0, Vector3.new(.2, .2, .4), nil, Vector3.new(.2, .2, .2))
	obj.PW=add.Weld(obj.P, obj.Reload, CFrame.new(-.05, .1, .5))
	obj.W=add.Wedge(modelB, false, false, color, 0, Vector3.new(.2, .2, .4), nil, Vector3.new(.2, .2, .2))
	obj.WW=add.Weld(obj.W, obj.P, CFrame.new(0, 0, -.08))
	obj.W=add.Wedge(modelB, false, false, color, 0, Vector3.new(.2, .2, .4), nil, Vector3.new(.2, .2, .2))
	obj.WW=add.Weld(obj.W, obj.P, CFrame.new(0, 0, .08)*CFrame.Angles(0, math.pi, 0))

	obj.P=add.Part(modelB, false, false, color, 0, Vector3.new(.2, .2, .4), nil, Vector3.new(.2, .2, .2))
	obj.PW=add.Weld(obj.P, obj.Reload, CFrame.new(.05, .1, .5))
	obj.W=add.Wedge(modelB, false, false, color, 0, Vector3.new(.2, .2, .4), nil, Vector3.new(.2, .2, .2))
	obj.WW=add.Weld(obj.W, obj.P, CFrame.new(0, 0, -.08))
	obj.W=add.Wedge(modelB, false, false, color, 0, Vector3.new(.2, .2, .4), nil, Vector3.new(.2, .2, .2))
	obj.WW=add.Weld(obj.W, obj.P, CFrame.new(0, 0, .08)*CFrame.Angles(0, math.pi, 0))

	obj.C=add.Part(modelB, false, false, color, 0, Vector3.new(.2, .4, .2))
	obj.CM=add.Mesh("CylinderMesh", obj.C, Vector3.new(.4, 1, .4))
	obj.CW=add.Weld(obj.C, obj.Handle, CFrame.new(0, 0, -.2)*CFrame.Angles(math.rad(105), 0, 0))
	obj.C2=add.Part(modelB, false, false, color, 0, Vector3.new(.2, .2, .2))
	obj.C2M=add.Mesh("CylinderMesh", obj.C2, Vector3.new(.4, 1, .4))
	obj.C2W=add.Weld(obj.C2, obj.C, CFrame.new(0, -.2, -.09)*CFrame.Angles(-math.rad(105), 0, 0))

	obj.Trigger=add.Part(modelB, false, false, color, 0, Vector3.new(.2, .2, .2), nil, Vector3.new(.2, .5, .2))
	obj.TriggerW=add.Weld(obj.Trigger, obj.B2, CFrame.new(0, -.1, 0.1)*CFrame.Angles(math.rad(15), 0, 0))
	obj.Trigger2=add.Part(modelB, false, false, color, 0, Vector3.new(.2, .2, .2), nil, Vector3.new(.2, .2, .4))
	obj.Trigger2W=add.Weld(obj.Trigger2, obj.Trigger, CFrame.new(0, -.05, -.02)*CFrame.Angles(-math.rad(15), 0, 0))

	obj.C=add.Part(modelB, false, false, color2, 0, Vector3.new(.2, .2, .2))
	obj.CM=add.Mesh("CylinderMesh", obj.C, Vector3.new(.4, 1.1, .4))
	obj.CW=add.Weld(obj.C, obj.Handle, CFrame.new(0, .1, -.1)*CFrame.Angles(0, 0, math.pi/2))

	obj.P=add.Part(modelB, false, false, color, 0, Vector3.new(.2, .2, 1.2), nil, Vector3.new(.5, .5, 1))
	obj.PW=add.Weld(obj.P, obj.Reload, CFrame.new(-.06, 0, 0))

	obj.P=add.Part(modelB, false, false, color, 0, Vector3.new(.2, .2, 1.2), nil, Vector3.new(.5, .5, 1))
	obj.PW=add.Weld(obj.P, obj.Reload, CFrame.new(.06, 0, 0))

	obj.W=add.Wedge(modelB, false, false, color, 0, Vector3.new(.2, .2, .2), nil, Vector3.new(.5, .35, .4))
	obj.WW=add.Weld(obj.W, obj.Reload, CFrame.new(0, .035, .68)*CFrame.Angles(0, math.pi, 0))
	obj.W=add.Wedge(modelB, false, false, color, 0, Vector3.new(.2, .2, .2), nil, Vector3.new(.5, .35, .4))
	obj.WW=add.Weld(obj.W, obj.Reload, CFrame.new(0, -.035, .68)*CFrame.Angles(math.pi, 0, 0))
function createParts()
	torso.Transparency=1
	body.Torso.Transparency=0
	gui=Instance.new("ScreenGui", player.PlayerGui) gui.Name=scriptname
	--==PARTS==--
	body.Head=add.Part(model, false, false, skincolor, 1, Vector3.new(1, 1, 1), nil)
	body.ArmLeft, body.ArmRight=add.Part(model, false, false, skincolor, 1, Vector3.new(1, 1, 1), nil), add.Part(model, false, false, skincolor, 1, Vector3.new(1, 1, 1), nil)
	body.LegLeft, body.LegRight=add.Part(model, false, false, skincolor, 1, Vector3.new(1, 1, 1), nil), add.Part(model, false, false, skincolor, 1, Vector3.new(1, 1, 1), nil)
	--==WELDS==--
	body.HeadW=add.Weld(body.Head, body.Torso, CFrame.new(0, 1.5, 0))
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
	obj.Clip=add.Gui("TextLabel", gui, "Really black", "Really black", "White", "Size18", clip.."/6", 0, UDim2.new(0, 150, 0, 50), UDim2.new(0, 0, 0, 150))
	obj.Ammo=add.Gui("TextLabel", obj.Clip, "Really black", "Really black", "White", "Size18", ammo.."/200", 0, UDim2.new(1, 0, 1, 0), UDim2.new(0, 0, 1, 0))
end
function removeParts()
	p(function()
		body.Torso.Transparency=1
		if torso then
			joints.LeftShoulder.Part0=torso
			joints.RightShoulder.Part0=torso
			joints.LeftHip.Part0=torso
			joints.RightHip.Part0=torso
		end
		player.PlayerGui[scriptname]:remove()
		for i, v in pairs(model:children()) do v:remove() end
		for i, v in pairs(char:children()) do v.Transparency=0 end
		torso.Transparency=0
	end)
end
function hit(h)
	if h.Parent:findFirstChild("Humanoid") and hitDeb==false and h.Parent~=char then
		hitDeb=true
		local hHuman=h.Parent:findFirstChild("Humanoid")
		local hTorso=h.Parent:findFirstChild("Torso")
		local dmg=math.random(5, 10)
		if h.Name=="Head" then local headshot=HeadShot:clone() headshot.Parent=h headshot:play()
			h.Parent:BreakJoints()
			local fakeM=Instance.new("Model", workspace) fakeM.Name="HeadShot!"
			local fakeH=Instance.new("Humanoid", fakeM) fakeH.MaxHealth=0 fakeH.Health=0
			local effect=add.Part(fakeM, true, false, "Bright red", 0, Vector3.new(1, 1, 1), h.CFrame*CFrame.new(0, 4, 0)) effect.Name="Head"
			local fakeMesh=add.Mesh("CylinderMesh", effect, Vector3.new(1, .5, 1), nil, nil)
			game.Debris:addItem(fakeM, 2)
		else
			hHuman.Health=hHuman.Health-dmg
			local fakeM=Instance.new("Model", workspace) fakeM.Name=-dmg
			local fakeH=Instance.new("Humanoid", fakeM) fakeH.MaxHealth=0 fakeH.Health=0
			local effect=add.Part(fakeM, true, false, "Bright red", 0, Vector3.new(1, 1, 1), h.CFrame*CFrame.new(0, 4, 0)) effect.Name="Head"
			local fakeMesh=add.Mesh("CylinderMesh", effect, Vector3.new(1, .5, 1), nil, nil)
			hTorso.RotVelocity=Vector3.new(math.random(-100, 100), math.random(-100, 100), math.random(-100, 100))
			game.Debris:addItem(fakeM, 2)
			local effect=add.Part(workspace, true, false, "White", .5, Vector3.new(1, 1, 1), CFrame.new(h.CFrame.p, torso.CFrame.p)*CFrame.Angles(-math.pi/2, 0, 0))
			local effectM=add.Mesh("SpecialMesh", effect, Vector3.new(1, 1, 1), nil, nil, "http://www.roblox.com/asset/?id=20329976")
			c(function()
				for i=1, 2, .2 do wait()
					effectM.Scale=Vector3.new(i, i/2, i)
				end
				effect:remove()
			end)
		end
		wait(.1)
		hitDeb=false
	end
end
function computePos(pos, pos2)
	local pos3=Vector3.new(pos2.x, pos.y, pos2.z)
	return CFrame.new(pos, pos3)
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
				for i=1, 0, -.25 do
					wait()
					tMesh.Scale=tMesh.Scale*Vector3.new(i, 1, i)
				end
				trail:remove()
			end)
			c(function()
				for i=0, 1, .25 do
					wait()
					trail.Transparency=i
				end
			end)
		end
	end)
end
function reload()
	Reload:play()
	for i=0, 1, .1 do wait()
		animate.Torso(CFrame.Angles(0, math.rad(90-90*i), 0))
		animate.ArmLeft(CFrame.new(.5*i, 0, -.5*i)*CFrame.Angles(math.rad(90)*i, 0, math.rad(25)*i))
		animate.ArmRight(CFrame.new(-.5*i, 0, -.5*i)*CFrame.Angles(math.rad(90), 0, math.rad(90-135*i)))
	end
	for i=0, 1, .1 do wait()
		obj.ReloadW.C1=CFrame.new(0, .1, -.15+.4*i)
		animate.ArmLeft(CFrame.new(.5, 0, -.5)*CFrame.Angles(math.rad(90), 0, math.rad(25+20*i)))
	end
	c(function()
		for i=1, 10 do wait()
			local clips=add.Part(workspace, false, true, "Bright yellow", 0,Vector3.new(.2, .2, .4), obj.Handle.CFrame*CFrame.new(0, -.2, 0), Vector3.new(.5, .5, 1))
			c(function()
				wait(2)
				for i=0, 1, .1 do wait()
					clips.Transparency=i
				end
				clips:remove()
			end)
		end
	end)
	for i=1, 0, -.1 do wait()
		obj.ReloadW.C1=CFrame.new(0, .1, -.15+.4*i)
		animate.ArmLeft(CFrame.new(.5, 0, -.5)*CFrame.Angles(math.rad(90), 0, math.rad(25+20*i)))
	end
	for i=1, 0, -.1 do wait()
		animate.Torso(CFrame.Angles(0, math.rad(90-90*i), 0))
		animate.ArmLeft(CFrame.new(.5*i, 0, -.5*i)*CFrame.Angles(math.rad(90)*i, 0, math.rad(25)*i))
		animate.ArmRight(CFrame.new(-.5*i, 0, -.5*i)*CFrame.Angles(math.rad(90), 0, math.rad(90-135*i)))
	end
	animate.ArmLeft(CFrame.Angles(-math.rad(15), 0, -math.rad(15)))
	if ammo>0 then
		local take=6-clip
		ammo=ammo-take
		clip=clip+take
	end
end
mouse.KeyDown:connect(function(key) local key=key:lower()
	local bg=Instance.new("BodyGyro") bg.maxTorque=Vector3.new(math.huge, math.huge, math.huge) bg.D=500
	if key=="q" and keyDeb==false and equip==false then
		keyDeb=true equip=true
		mouse.Icon="http://www.roblox.com/asset/?id=35649261"
		createParts()
		obj.HandleW.Part1=arm.Right
		obj.HandleW.C1=CFrame.new(0, -1.2, 0)*CFrame.Angles(-math.rad(105), 0, 0)
		for i=0, 1, .1 do wait()
			animate.ArmRight(CFrame.new(0, .5*i, 0)*CFrame.Angles(0, 0, -math.rad(10)*i))
		end
		for i=0, 1, .1 do wait()
			animate.Torso(CFrame.Angles(0, math.rad(90)*i, 0))
			animate.ArmLeft(CFrame.Angles(-math.rad(15)*i, 0, -math.rad(15)*i))
			animate.ArmRight(CFrame.new(0, .5-.5*i, 0)*CFrame.Angles(math.rad(90)*i, 0, math.rad(90)*i))
		end
		bg.Parent=torso
		keyDeb=false
	elseif key=="q" and keyDeb==false and equip==true then
		keyDeb=true equip=false
		mouse.Icon=""
		for i=1, 0, -.1 do wait()
			animate.ArmRight(CFrame.new(0, .5-.5*i, 0)*CFrame.Angles(math.rad(90)*i, 0, math.rad(90)*i))
		end
		for i=1, 0, -.1 do wait()
			animate.Torso(CFrame.Angles(0, math.rad(90)*i, 0))
			animate.ArmLeft(CFrame.Angles(-math.rad(15)*i, 0, -math.rad(15)*i))
			animate.ArmRight(CFrame.new(0, .5*i, 0)*CFrame.Angles(0, 0, -math.rad(10)*i))
		end
		removeParts() for i, v in pairs(torso:children()) do if v:isA("BodyGyro") then v:remove() end end
		obj.HandleW.Part1=obj.Pocket
		obj.HandleW.C1=CFrame.new(0, .75, 0)*CFrame.Angles(-math.rad(105), 0, 0)
		keyDeb=false
	end
	if key=="r" and keyDeb==false and equip==true then
		keyDeb=true
		reload()
		keyDeb=false
	end
	while equip==true do wait()
		body.HeadW.C1=CFrame.new(Vector3.new(0, 1.5, 0), mouse.Hit.p)
		bg.cframe=computePos(torso.CFrame.p, mouse.Hit.p)
		obj.Clip.Text=clip.."/6"
		obj.Ammo.Text=ammo.."/200"
	end
end)
mouse.Button1Down:connect(function()
	local speed=500
	if equip==true and keyDeb==false and clip>=1 then Gun:play() keyDeb=true
		clip=clip-1
		animate.ArmRight(CFrame.new(0, 0, 0)*CFrame.Angles(math.rad(90), math.rad(15), math.rad(90)))
		local bullet=add.Part(workspace, false, false, "Bright yellow", 0, Vector3.new(.2, 1, .2), CFrame.new(obj.Point.CFrame.p, mouse.Hit.p)*CFrame.Angles(math.pi/2, 0, 0))
		local bulletM=add.Mesh("SpecialMesh", bullet, Vector3.new(.04, .05, .04), nil, nil, "http://www.roblox.com/Asset/?id=10207677")
		local bf=Instance.new("BodyForce", bullet) bf.force=Vector3.new(0, bullet:GetMass()*196.2, 0)
		local effect=add.Part(workspace, true, false, "Bright yellow", .5, Vector3.new(.5, .5, .5), obj.Point.CFrame*CFrame.Angles(math.rad(-45, 45), math.rad(-45, 45), math.rad(-45, 45)))
		c(function()
			for i=0, 1, .1 do wait()
				effect.Transparency=effect.Transparency+(i/2)
				effect.Mesh.Scale=effect.Mesh.Scale+Vector3.new(i, i, i)
			end
			effect:remove()
		end)
		trailDeb=true
		trail(bullet, CFrame.new())
		bullet.Touched:connect(hit)
		bullet.Velocity=CFrame.new((obj.Point.CFrame*CFrame.Angles(math.pi/2, 0, 0)).p, mouse.Hit.p).lookVector*speed
		c(function() wait(1.5) bullet:destroy() trailDeb=false end)
		wait(.5)
		animate.ArmRight(CFrame.new(0, 0, 0)*CFrame.Angles(math.rad(90), 0, math.rad(90)))
		keyDeb=false
	elseif equip==true and keyDeb==false then
		keyDeb=true
		reload()
		keyDeb=false
	end
end)--mediafire