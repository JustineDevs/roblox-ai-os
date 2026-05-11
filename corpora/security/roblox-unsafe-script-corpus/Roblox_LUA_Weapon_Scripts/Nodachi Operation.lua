--==Made by LuisPambid==--
--==NODACHI OPERATION==--


local player=game.Players.LocalPlayer
local char=player.Character
repeat wait() until player and char
local torso=char.Torso
local head=char.Head
local human=char.Humanoid
local hat
for i, v in pairs(char:children()) do if v:isA("Hat") then hat=v end end
local arm={Left=char["Left Arm"], Right=char["Right Arm"]}
local leg={Left=char["Left Leg"], Right=char["Right Leg"]}
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
		local g=Instance.new(ins, par) pcall(function() g.BorderColor=BrickColor.new(bc) g.BackgroundColor=BrickColor.new(bg) g.TextColor=BrickColor.new(tc) g.TextStrokeColor=BrickColor.new("Really black") g.FontSize=fs g.TextFont="ArialBold" g.Text=text g.Transparency=t g.Size=s g.Position=pos  end)
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
local scriptname="Operation"
pcall(function() player.Backpack[scriptname]:remove() char[scriptname]:remove() char[scriptname.."B"]:remove() player.PlayerGui[scriptname]:remove() end)
local model=Instance.new("Model", char) model.Name=scriptname
local modelB=Instance.new("Model", char) modelB.Name=scriptname.."B"
local sound=Instance.new("Sound", model)
local bin=Instance.new("HopperBin", player.Backpack) bin.Name=model.Name
local skincolor="New Yeller"
local body={}
local obj={}
function createParts()
	--==PARTS==--
	body.Head=head:clone() body.Head.Parent=model body.Head.BrickColor=BrickColor.new(skincolor) body.Head.Transparency=0
	body.Torso=add.Part(model, false, false, skincolor, 0, Vector3.new(2, 2, 1), nil)
	body.ArmLeft, body.ArmRight=add.Part(model, false, false, skincolor, 0, Vector3.new(1, 1, 1), nil), add.Part(model, false, false, skincolor, 0, Vector3.new(1, 1, 1), nil)
	body.LegLeft, body.LegRight=add.Part(model, false, false, skincolor, 0, Vector3.new(1, 1, 1), nil), add.Part(model, false, false, skincolor, 0, Vector3.new(1, 1, 1), nil)
	p(function() for i, v in pairs(char:children()) do v.Transparency=1 end end)
	p(function() for i, v in pairs(char:children()) do v["face"]:clone().Parent=body.Head v["face"]:remove() end end)
	p(function() for i, v in pairs(char:children()) do if v.ClassName=="Hat" then v:remove() end end end)
	--==WELDS==--
	body.HeadW=add.Weld(body.Head, body.Torso, CFrame.new(0, 1.5, 0))
	body.TorsoW=add.Weld(torso, body.Torso, nil)
	body.ArmLeftW, body.ArmRightW=add.Weld(body.ArmLeft, body.Torso, CFrame.new(-1.5, .5, 0)), add.Weld(body.ArmRight, body.Torso, CFrame.new(1.5, .5, 0))
	body.LegLeftW, body.LegRightW=add.Weld(body.LegLeft, body.Torso, CFrame.new(-.5, -1.5, 0)), add.Weld(body.LegRight, body.Torso, CFrame.new(.5, -1.5, 0))
	--==MESHES==--
	add.Mesh("BlockMesh", body.ArmLeft, Vector3.new(1, 2, 1), Vector3.new(0, -.5, 0), nil)
	add.Mesh("BlockMesh", body.ArmRight, Vector3.new(1, 2, 1), Vector3.new(0, -.5, 0), nil)
	add.Mesh("BlockMesh", body.LegLeft, Vector3.new(1, 2, 1), Vector3.new(0, -.5, 0), nil)
	add.Mesh("BlockMesh", body.LegRight, Vector3.new(1, 2, 1), Vector3.new(0, -.5, 0), nil)
	---------------------------------------------------------------------------------------
	--==Objects==--
	obj.LH=add.Part(model, false, false, "Really black", 0, Vector3.new(.5, 1, .2), nil)
	obj.LHW=add.Weld(obj.LH, body.ArmLeft, CFrame.new(-.3, -.5, -.2))
	obj.LH=add.Part(model, false, false, "Really black", 0, Vector3.new(.5, .2, .5), nil)
	obj.LHW=add.Weld(obj.LH, body.ArmLeft, CFrame.new(-.3, -.9, 0))
	
	obj.Handle=add.Part(modelB, false, false, "Really black", 0, Vector3.new(.25, 2, .25), nil)
	obj.HandleW=add.Weld(obj.Handle, body.ArmRight, CFrame.new(0, -1.5, 0)*CFrame.Angles(-math.rad(90), 0, 0))
	for i=1, 5 do
		obj.Design=add.Part(modelB, false, false, "New Yeller", 0, Vector3.new(.3, .1, .1), nil)
		obj.DesignW=add.Weld(obj.Design, obj.Handle, CFrame.new(0, -1+i/3, 0)*CFrame.Angles(math.rad(45), 0, 0))
	end
	obj.Guard=add.Part(modelB, false, false, "Really black", 0, Vector3.new(.5, .2, .5), nil)
	obj.GuardW=add.Weld(obj.Guard, obj.Handle, CFrame.new(0, 1.1, 0))
	obj.GuardB=add.Part(modelB, false, false, "New Yeller", 0, Vector3.new(.25, .2, .3), nil)
	obj.GuardBM=add.Mesh("BlockMesh", obj.GuardB, Vector3.new(.5, 1, 1), nil, nil)
	obj.GuardBW=add.Weld(obj.GuardB, obj.Handle, CFrame.new(0, 1.25, 0))
	obj.Blade=add.Part(modelB, false, false, "Mid gray", 0, Vector3.new(.2, 4, .25), nil) obj.Blade.Reflectance=.5
	obj.BladeM=add.Mesh("BlockMesh", obj.Blade, Vector3.new(.5, 1, 1), nil, nil)
	obj.BladeW=add.Weld(obj.Blade, obj.Handle, CFrame.new(0, 3, 0))
	obj.Point=add.Wedge(modelB, false, false, "Mid gray", 0, Vector3.new(.2, 1, .25), nil) obj.Point.Reflectance=.5
	obj.PointM=add.Mesh("SpecialMesh", obj.Point, Vector3.new(.5, 1, 1), nil, "Wedge")
	obj.PointW=add.Weld(obj.Point, obj.Blade, CFrame.new(0, 2.5, 0)*CFrame.Angles(math.rad(0), 0, 0))
	obj.Ope=add.Part(model, false, false, "White", 1, Vector3.new(1, 1, 1), nil)
	obj.OpeM=add.Mesh("SpecialMesh", obj.Ope, Vector3.new(2, 2, 2), nil, "File") obj.OpeM.MeshId="http://www.roblox.com/asset/?id=3270017"
	obj.OpeW=add.Weld(obj.Ope, body.ArmLeft, CFrame.new(0, -1.5, 0))
	c(function() for i=1, math.huge do wait() obj.OpeM.Scale=Vector3.new(math.random(2, 4), math.random(2, 4), 2) obj.OpeW.C1=CFrame.new(0, -1.8, 0)*CFrame.Angles(math.rad(90), 0, math.rad(i*10)) end end)
end
function removeParts()
	p(function()
		for i, v in pairs(model:children()) do v:remove() end
		for i, v in pairs(modelB:children()) do v:remove() end
		for i, v in pairs(char:children()) do v.Transparency=0 end
	end)
end
function play(id, pitch)
	c(function()
		local sound=Instance.new("Sound", workspace)
		sound.Pitch=pitch
		sound.SoundId=id
		sound:play()
		wait(.5)
		sound:remove()
	end)
end
local whileDeb=false
local keyDeb=false
local tDeb=false
local hDeb=false
local loopDeb=false
local loopDeb2=false
local loopDeb3=false
local speed=32
local mana=100

local gui=Instance.new("ScreenGui", player.PlayerGui) gui.Name=scriptname
local label=Instance.new("TextLabel", gui)
label.Position=UDim2.new(0, 0, 0, 200)
label.Size=UDim2.new(0, 150, 0, 50)
label.BorderColor=BrickColor.Black() label.BackgroundColor=BrickColor.Black()
label.TextColor=BrickColor.White()
label.Font="ArialBold"
label.FontSize="Size18"
label.Text="Room(Q)"
local labelb=Instance.new("TextLabel", label)
labelb.Position=UDim2.new(0, 0, 1, 0)
labelb.Size=UDim2.new(1, 0, 1, 0)
labelb.BorderColor=BrickColor.Black() labelb.BackgroundColor=BrickColor.Black()
labelb.TextColor=BrickColor.White()
labelb.Font="ArialBold"
labelb.FontSize="Size18"
labelb.Text="Shambles(E)"
local labelc=Instance.new("TextLabel", labelb)
labelc.Position=UDim2.new(0, 0, 1, 0)
labelc.Size=UDim2.new(1, 0, 1, 0)
labelc.BorderColor=BrickColor.Black() labelc.BackgroundColor=BrickColor.Black()
labelc.TextColor=BrickColor.White()
labelc.Font="ArialBold"
labelc.FontSize="Size18"
labelc.Text="Mes(R)"
local labeld=Instance.new("TextLabel", labelc)
labeld.Position=UDim2.new(0, 0, 1, 0)
labeld.Size=UDim2.new(1, 0, 1, 0)
labeld.BorderColor=BrickColor.Black() labeld.BackgroundColor=BrickColor.Black()
labeld.TextColor=BrickColor.White()
labeld.Font="ArialBold"
labeld.FontSize="Size18"
labeld.Text="Shield(F)"
local labele=Instance.new("TextLabel", labeld)
labele.Position=UDim2.new(0, 0, 1, 0)
labele.Size=UDim2.new(1, 0, 1, 0)
labele.BorderColor=BrickColor.Black() labele.BackgroundColor=BrickColor.Black()
labele.TextColor=BrickColor.White()
labele.Font="ArialBold"
labele.FontSize="Size18"
labele.Text="Charge(Z)"
local labelf=Instance.new("TextLabel", labele)
labelf.Position=UDim2.new(0, 0, 1, 0)
labelf.Size=UDim2.new(1, 0, 1, 0)
labelf.BorderColor=BrickColor.Black() labelf.BackgroundColor=BrickColor.Black()
labelf.TextColor=BrickColor.White()
labelf.Font="ArialBold"
labelf.FontSize="Size18"
labelf.Text="Rappid(X)"
local labelg=Instance.new("TextLabel", labelf)
labelg.Position=UDim2.new(0, 0, 1, 0)
labelg.Size=UDim2.new(1, 0, 1, 0)
labelg.BorderColor=BrickColor.Black() labelg.BackgroundColor=BrickColor.Black()
labelg.TextColor=BrickColor.White()
labelg.Font="ArialBold"
labelg.FontSize="Size18"
labelg.Text="Catastrophe(C)"

--==MANA==--
local frame=Instance.new("Frame", gui)
frame.Position=UDim2.new(0, 0, 0, 150)
frame.Size=UDim2.new(0, 200, 0, 20)
frame.BorderColor=BrickColor.Black() frame.BackgroundColor=BrickColor.White()
local clabel=Instance.new("TextLabel", frame)
clabel.Position=UDim2.new(0, 0, 0, 0)
clabel.Size=UDim2.new(1, 0, 1, 0)
clabel.BorderColor=BrickColor.Black() clabel.BackgroundColor=BrickColor.White()
clabel.TextColor=BrickColor.Black()
clabel.Font="ArialBold"
clabel.FontSize="Size18"
clabel.Text="--==100%==--"
local charge=Instance.new("TextLabel", frame) charge.Transparency=.5
charge.Position=UDim2.new(0, 0, 0, 0)
charge.Size=UDim2.new(1, 0, 1, 0)
charge.BorderColor=BrickColor.Black() charge.BackgroundColor=BrickColor.Blue()
charge.Text=""

function trail(pos, cf, col)
	c(function()
		local old=(pos.CFrame*cf).p
		while tDeb==true do
			wait()
			local new=(pos.CFrame*cf).p
			local mag=(old-new).magnitude
			local dis=(old+new)/2
			local trail=add.Part(model, true, false, col, 0, Vector3.new(.2, mag, .2), CFrame.new(dis, new)*CFrame.Angles(math.pi/2, 0, 0))
			local tMesh=add.Mesh("CylinderMesh", trail, Vector3.new(1, 1, 1), nil, nil)
			old=new
			c(function()
				for i=1, 0, -.1 do
					wait()
					trail.Mesh.Scale=trail.Mesh.Scale*Vector3.new(i, 1, i)
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

local dmg=math.random(10, 25)
function hit(h)
	local humanoid=h.Parent:findFirstChild("Humanoid")
	if humanoid and h.Parent~=char and hDeb==false then
		hDeb=true
		--c(function()
			local fakeP=add.Part(workspace, true, false, "Bright yellow", 0, Vector3.new(1, 1, 1), CFrame.new(h.CFrame.p, torso.CFrame.p))
			local mesh=add.Mesh("SpecialMesh", fakeP, Vector3.new(1, 1, 1), nil, "File") mesh.MeshId="http://www.roblox.com/asset/?id=3270017"
			c(function()
				for i=0, 1, .05 do
					wait()
					fakeP.Mesh.Scale=fakeP.Mesh.Scale+Vector3.new(i, i, 0)
				end
				fakeP:remove()
			end)
			c(function()
				for i=0, 1, .05 do
					wait()
					fakeP.Transparency=i
				end
			end)
			humanoid.Health=humanoid.Health-dmg
			local fakeM=Instance.new("Model", workspace) fakeM.Name=dmg
			local fakeH=Instance.new("Humanoid", fakeM) fakeH.MaxHealth=0 fakeH.Health=0
			local fakeP=add.Part(fakeM, false, false, "Bright red", 0, Vector3.new(1, 1, 1), h.CFrame) fakeP.Name="Head"
			local fakeMesh=add.Mesh("CylinderMesh", fakeP, Vector3.new(1, .2, 1), nil, nil)
			local bp=Instance.new("BodyPosition", fakeP) bp.maxForce=Vector3.new(math.huge, math.huge, math.huge) bp.position=h.Position+Vector3.new(0, 4, 0)
			game.Debris:addItem(fakeM, 2)
			pcall(function()h.Parent:findFirstChild("Torso").RotVelocity=Vector3.new(math.random(-50, 50), math.random(-50, 50), math.random(-50, 50))end)
			pcall(function()h.Parent:findFirstChild("Torso").Velocity=Vector3.new(math.random(-100, 100), math.random(-100, 100), math.random(-100, 100))end)
		wait(.1)
		hDeb=false
		--end)
	end
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

local Attacks={
	["Room"]=function(mouse) human.WalkSpeed=0
		computePos(torso.CFrame.p, mouse.Hit.p)
		for i=0, 1, .1 do wait()
			body.TorsoW.C1=CFrame.Angles(0, math.rad(45), 0)
			body.ArmLeftW.C1=CFrame.new(-1.5, .5, 0)*CFrame.Angles(math.rad(135)*i, 0, -math.rad(45)*i)
			body.ArmRightW.C1=CFrame.new(1.5, .5, 0)*CFrame.Angles(-math.rad(45)*i, 0, math.rad(45)*i)
		end
		local room=add.Part(model, true, false, "White", .5, Vector3.new(1, 1, 1), torso.CFrame+torso.CFrame.lookVector*25)
		local dust=add.Part(model, true, false, "White", .5, Vector3.new(1, 1, 1), room.CFrame*CFrame.Angles(math.rad(90), 0, 0))
		local dustM=add.Mesh("SpecialMesh", dust, Vector3.new(1, 1, 1), nil, "File") dustM.MeshId="http://www.roblox.com/asset/?id=3270017"
		local doomed={}
		room.Touched:connect(function(h)
			p(function()
				if h.Parent:findFirstChild("Humanoid") and h.Parent:findFirstChild("Humanoid")~=human then
					h.Parent["Humanoid"].WalkSpeed=0 print(h.Parent.Name.." is on the ROOM")
					table.insert(doomed, h.Parent)
				end
			end)
		end)
		dust.Touched:connect(function(h)
			p(function()
				if h.Parent:findFirstChild("Humanoid") and h.Parent:findFirstChild("Humanoid")~=human then
					h.Parent["Humanoid"].WalkSpeed=0
					table.insert(doomed, h.Parent)
				end
			end)
		end)
		local roomM=add.Mesh("SpecialMesh", room, Vector3.new(1, 1, 1), nil, "Sphere")
		for i=1, 0, -.1 do wait() obj.Ope.Transparency=i end
		for i=0, 120, 10 do wait() room.Size=Vector3.new(i, i, i) room.CFrame=torso.CFrame+torso.CFrame.lookVector*25 dustM.Scale=Vector3.new(i, i, i) dust.CFrame=room.CFrame*CFrame.Angles(math.rad(90), 0, 0) end
		for i=0, 1, .1 do wait() obj.Ope.Transparency=i end
		tDeb=true
		trail(obj.Point, CFrame.new(), "White")
		for i=0, 1, .1 do wait()
			body.ArmLeftW.C1=CFrame.new(-1.5, .5, 0)*CFrame.Angles(-math.rad(45)*i, 0, -math.rad(45)*i)
			body.ArmRightW.C1=CFrame.new(1.5, .5, 0)*CFrame.Angles(0, 0, math.rad(90)*i)
			obj.HandleW.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(-math.rad(90)+(-math.rad(90)*i), 0, 0)
		end
		play("rbxasset://sounds/swordslash.wav", 1)
		for i=0, 1, .1 do wait()
			body.TorsoW.C1=CFrame.Angles(0, -math.rad(180)*i, 0)
		end
		for i, v in pairs(doomed) do
			p(function()
				local tor=v["Torso"]
				local pYPos=tor.Position.y-(tor.Size.y/2)
				local sYPos=obj.Point.Position.y
				local p=tor:clone()
				local p2=tor:clone() tor:remove()
				p.formFactor="Custom" p2.formFactor="Custom" p.Anchored=false p.CanCollide=true
				p.Size=Vector3.new(tor.Size.x, sYPos-pYPos, tor.Size.z) p2.Anchored=false p2.CanCollide=true
				p2.Size=Vector3.new(tor.Size.x, p2.Size.y-(sYPos-pYPos), tor.Size.z)
				p.CFrame=tor.CFrame*CFrame.new(0, -p2.Size.y/2, 0)
				p2.CFrame=tor.CFrame*CFrame.new(0, p.Size.y/2, 0)
				p.Parent=workspace
				p2.Parent=workspace
				c(function() wait(2)
					--[[for i=0, 1, .05 do
						wait()
						p.Transparency=i p2.Transparency=i
					end]]
					p:remove() p2:remove()
				end)
			end)
		end
		tDeb=false
		for i=1, 0, -.1 do wait()
			body.TorsoW.C1=CFrame.Angles(0, -math.rad(180)*i, 0)
			body.ArmLeftW.C1=CFrame.new(-1.5, .5, 0)*CFrame.Angles(-math.rad(45)*i, 0, -math.rad(45)*i)
			body.ArmRightW.C1=CFrame.new(1.5, .5, 0)*CFrame.Angles(0, 0, math.rad(90)*i)
			obj.HandleW.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(-math.rad(90)+(-math.rad(90)*i), 0, 0)
		end
		for i=1, 0, -.05 do wait() dustM.Scale=dustM.Scale*Vector3.new(i, i, i) roomM.Scale=roomM.Scale*Vector3.new(i, i, i) end
		room:remove() dust:remove()
		human.WalkSpeed=speed
		whileDeb=false
		wait(1)
	end;
	["Shambles"]=function(mouse) human.WalkSpeed=0
		computePos(torso.CFrame.p, mouse.Hit.p)
		for i=0, 1, .1 do wait()
			body.TorsoW.C1=CFrame.Angles(0, math.rad(45), 0)
			body.ArmLeftW.C1=CFrame.new(-1.5, .5, 0)*CFrame.Angles(math.rad(135)*i, 0, -math.rad(45)*i)
			body.ArmRightW.C1=CFrame.new(1.5, .5, 0)*CFrame.Angles(-math.rad(45)*i, 0, math.rad(45)*i)
		end
		local room=add.Part(model, true, false, "White", .5, Vector3.new(1, 1, 1), torso.CFrame+torso.CFrame.lookVector*25)
		local dust=add.Part(model, true, false, "White", .5, Vector3.new(1, 1, 1), room.CFrame*CFrame.Angles(math.rad(90), 0, 0))
		local dustM=add.Mesh("SpecialMesh", dust, Vector3.new(1, 1, 1), nil, "File") dustM.MeshId="http://www.roblox.com/asset/?id=3270017"
		local doomed={}
		room.Touched:connect(function(h)
			p(function()
				if h.Parent:findFirstChild("Humanoid") and h.Parent:findFirstChild("Humanoid")~=human then
					h.Parent["Humanoid"].WalkSpeed=0 print(h.Parent.Name.." is on the ROOM")
					table.insert(doomed, h.Parent)
				end
			end)
		end)
		dust.Touched:connect(function(h)
			p(function()
				if h.Parent:findFirstChild("Humanoid") and h.Parent:findFirstChild("Humanoid")~=human then
					h.Parent["Humanoid"].WalkSpeed=0
					table.insert(doomed, h.Parent)
				end
			end)
		end)
		local roomM=add.Mesh("SpecialMesh", room, Vector3.new(1, 1, 1), nil, "Sphere")
		for i=1, 0, -.1 do wait() obj.Ope.Transparency=i end
		for i=0, 120, 10 do wait() room.Size=Vector3.new(i, i, i) room.CFrame=torso.CFrame+torso.CFrame.lookVector*25 dustM.Scale=Vector3.new(i, i, i) dust.CFrame=room.CFrame*CFrame.Angles(math.rad(90), 0, 0) end
		tDeb=true
		trail(obj.Ope, CFrame.new(), "White")
		for i=0, 1, .1 do wait() play("rbxasset://sounds/swordslash.wav", 1)
			body.TorsoW.C1=CFrame.Angles(0, math.rad(45), 0)
			body.ArmLeftW.C1=CFrame.new(-1.5, .5, 0)*CFrame.Angles(math.rad(math.random(90, 135)), 0, -math.rad(math.random(-45, 45)))
			body.ArmRightW.C1=CFrame.new(1.5, .5, 0)*CFrame.Angles(-math.rad(45), 0, math.rad(45))
		end
		for i, v in pairs(doomed) do
			ypcall(function()
				local random=doomed[math.random(1, #doomed)]
				local armleft, armright=v["Left Arm"], v["Right Arm"]
				local legleft, legright=v["Left Leg"], v["Right Leg"]
				local head=v["Head"]
				add.Weld(armleft, random.Torso, CFrame.new(math.random(-1, 1), math.random(-1, 1), math.random(-1, 1))*CFrame.Angles(math.random(-45, 45),math.random(-45, 45),math.random(-45, 45)))
				add.Weld(armright, random.Torso, CFrame.new(math.random(-1, 1), math.random(-1, 1), math.random(-1, 1))*CFrame.Angles(math.random(-45, 45),math.random(-45, 45),math.random(-45, 45)))
				add.Weld(legleft, random.Torso, CFrame.new(math.random(-1, 1), math.random(-1, 1), math.random(-1, 1))*CFrame.Angles(math.random(-45, 45),math.random(-45, 45),math.random(-45, 45)))
				add.Weld(legright, random.Torso, CFrame.new(math.random(-1, 1), math.random(-1, 1), math.random(-1, 1))*CFrame.Angles(math.random(-45, 45),math.random(-45, 45),math.random(-45, 45)))
				add.Weld(head, random.Torso, CFrame.new(math.random(-1, 1), math.random(-1, 1), math.random(-1, 1))*CFrame.Angles(math.random(-45, 45),math.random(-45, 45),math.random(-45, 45)))
			end)
		end
		tDeb=false
		for i=0, 1, .1 do wait() obj.Ope.Transparency=i end
		for i=1, 0, -.1 do wait()
			body.TorsoW.C1=CFrame.Angles(0, math.rad(45), 0)
			body.ArmLeftW.C1=CFrame.new(-1.5, .5, 0)*CFrame.Angles(math.rad(135)*i, 0, -math.rad(45)*i)
			body.ArmRightW.C1=CFrame.new(1.5, .5, 0)*CFrame.Angles(-math.rad(45)*i, 0, math.rad(45)*i)
		end
		for i=1, 0, -.05 do wait() dustM.Scale=dustM.Scale*Vector3.new(i, i, i) roomM.Scale=roomM.Scale*Vector3.new(i, i, i) end
		room:remove() dust:remove()
		human.WalkSpeed=speed
		whileDeb=false
		wait(1)
	end;
	["Mes"]=function(mouse) human.WalkSpeed=1
		computePos(torso.CFrame.p, mouse.Hit.p)
		for i=0, 1, .1 do
			wait()
			body.TorsoW.C1=CFrame.Angles(0, -math.rad(90)*i, 0)
			body.ArmLeftW.C1=CFrame.new(-1.5, .5, 0)*CFrame.Angles(-math.rad(45)*i, 0, -math.rad(45)*i)
			body.ArmRightW.C1=CFrame.new(1.5, .5, 0)*CFrame.Angles(0, 0, math.rad(90)*i)
			obj.HandleW.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(-math.rad(90)+(-math.rad(90)*i), 0, 0)
		end
		obj.Blade.Touched:connect(hit)
		tDeb=true trail(obj.Point, CFrame.new(), "White")
		for i=0, 1, .25 do
			wait()
			body.TorsoW.C1=CFrame.new(-10*i, 0, 0)*CFrame.Angles(0, -math.rad(90), 0)
		end
		play("rbxasset://sounds/swordslash.wav", 1)
		for i=1, 0, -.2 do
			wait()
			body.TorsoW.C1=CFrame.new(-10*i, 0, 0)*CFrame.Angles(0, -math.rad(90), 0)
		end
		obj.Blade.Touched:connect(hit):disconnect()
		for i=1, 0, -.1 do
			wait()
			body.TorsoW.C1=CFrame.Angles(0, -math.rad(90)*i, 0)
			body.ArmLeftW.C1=CFrame.new(-1.5, .5, 0)*CFrame.Angles(-math.rad(45)*i, 0, -math.rad(45)*i)
			body.ArmRightW.C1=CFrame.new(1.5, .5, 0)*CFrame.Angles(0, 0, math.rad(90)*i)
			obj.HandleW.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(-math.rad(90)+(-math.rad(90)*i), 0, 0)
		end
		human.WalkSpeed=speed
		tDeb=false
		whileDeb=false
		wait(1)
	end;
	["Shield"]=function(mouse) human.WalkSpeed=0
		for i=0, 1, .1 do
			wait()
			body.TorsoW.C1=CFrame.Angles(0, 0, 0)
			body.ArmLeftW.C1=CFrame.new(-1.5+(.5*i), .5, -.5*i)*CFrame.Angles(math.rad(90)*i, 0, math.rad(45)*i)
			body.ArmRightW.C1=CFrame.new(1.5-(.5*i), .5, -.5*i)*CFrame.Angles(math.rad(90)*i, 0, -math.rad(45)*i)
			obj.HandleW.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(-math.rad(90)+(-math.rad(90)*i), 0, math.rad(45)*i)
		end
		obj.Blade.Touched:connect(hit)
		tDeb=true trail(obj.Point, CFrame.new(), "White")
		local rotate=45
		while loopDeb==true and mana>0 do wait() rotate=rotate+45 mana=mana-1
			computePos(torso.CFrame.p, mouse.Hit.p) torso.CFrame=torso.CFrame+torso.CFrame.lookVector*2
			obj.HandleW.C0=CFrame.Angles(math.rad(rotate), 0, 0)
			local wind=add.Part(model, true, false, "White", .5, Vector3.new(math.random(10, 15), 1, math.random(10, 15)), obj.Handle.CFrame*CFrame.Angles(0, 0, math.rad(90)))
			local windM=add.Mesh("CylinderMesh", wind, Vector3.new(1, 1, 1), nil, nil)
			wind.Touched:connect(hit)
			c(function()
			for i=.5, 1, .1 do
					wait()
					wind.Transparency=i
				end
				wind:remove()
			end)
		end
		obj.Blade.Touched:connect(hit):disconnect()
		tDeb=false
		loopDeb=false
	end;
	["Rappid"]=function(mouse) human.WalkSpeed=0
		for i=0, 1, .1 do
			wait()
			body.TorsoW.C1=CFrame.Angles(0, -math.rad(90)*i, 0)
			body.ArmLeftW.C1=CFrame.new(-1.5, .5, 0)*CFrame.Angles(-math.rad(45)*i, 0, -math.rad(45)*i)
			body.ArmRightW.C1=CFrame.new(1.5, .5, 0)*CFrame.Angles(0, 0, math.rad(90)*i)
			obj.HandleW.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(-math.rad(90)+(-math.rad(90)*i), 0, 0)
		end
		obj.Blade.Touched:connect(hit)
		tDeb=true trail(obj.Point, CFrame.new(), "White")
		while loopDeb2==true and mana>0 do wait() mana=mana-1 play("rbxasset://sounds/swordslash.wav", 1)
			computePos(torso.CFrame.p, mouse.Hit.p) torso.CFrame=torso.CFrame+torso.CFrame.lookVector*.2
			body.ArmRightW.C1=CFrame.new(1.5, .5, math.random(-.2, .2))*CFrame.Angles(math.rad(math.random(-45, 45)), 0, math.rad(90)+math.rad(math.random(-45, 45)))
		end
		obj.Blade.Touched:connect(hit):disconnect()
		tDeb=false
		loopDeb2=false
	end;
	["Charge"]=function() human.WalkSpeed=0
		for i=0, 1, .1 do
			wait()
			body.TorsoW.C1=CFrame.Angles(0, -math.rad(90)*i, 0)
			body.ArmLeftW.C1=CFrame.new(-1.5, .5, 0)*CFrame.Angles(0, 0, -math.rad(45)*i)
			body.ArmRightW.C1=CFrame.new(1.5, .5, 0)*CFrame.Angles(0, 0, math.rad(135)*i)
			obj.HandleW.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(-math.rad(90)+(-math.rad(90)*i), 0, 0)
		end
		while loopDeb3==true do wait() if mana>=0 and mana<100 then mana=mana+1 end play("http://www.roblox.com/asset/?id=2101137", 1)
			local aura=add.Part(model, true, false, "Really black", .5, Vector3.new(1, 1, 1), body.Torso.CFrame*CFrame.new(0, -4, 0)*CFrame.Angles(0, math.rad(math.random(-45, 45)), 0))
			local auraM=add.Mesh("SpecialMesh", aura, Vector3.new(1, 1, 1), nil, "File") auraM.MeshId="http://www.roblox.com/asset/?id=20329976"
			local aura2=add.Part(model, true, false, "Really black", .5, Vector3.new(5, 5, 5), body.Torso.CFrame*CFrame.new(math.random(-15, 15), math.random(-15, 15), math.random(-15, 15))*CFrame.Angles(math.rad(math.random(-45, 45)), math.rad(math.random(-45, 45)), math.rad(math.random(-45, 45))))
			c(function()
				for i=0, 3, .2 do wait()
					auraM.Scale=auraM.Scale+Vector3.new(i, i/2, i)
				end
				c(function()
					for i=.5, 1, .1 do
						wait()
						aura.Transparency=i	aura2.Transparency=i
					end
				end)
				aura:remove() aura2:remove()
			end)
		end
		for i=1, 0, -.1 do
			wait()
			body.TorsoW.C1=CFrame.Angles(0, -math.rad(90)*i, 0)
			body.ArmLeftW.C1=CFrame.new(-1.5, .5, 0)*CFrame.Angles(0, 0, -math.rad(45)*i)
			body.ArmRightW.C1=CFrame.new(1.5, .5, 0)*CFrame.Angles(0, 0, math.rad(135)*i)
			obj.HandleW.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(-math.rad(90)+(-math.rad(90)*i), 0, 0)
		end
		human.WalkSpeed=speed
	end;
	["Catastrophe"]=function() ypcall(function()
		local range=40
		local nChar=nearTorso(torso.CFrame.p, range).Parent
		if nChar then mana=mana-20 human.WalkSpeed=0
			local nTorso=nChar["Torso"]
			local nTorsoW=add.Weld(nTorso, torso, CFrame.new(0, 0, -range))
			for i=0, 1, .1 do wait()
				body.TorsoW.C1=CFrame.Angles(0, math.rad(45), 0)
				body.ArmLeftW.C1=CFrame.new(-1.5, .5, 0)*CFrame.Angles(math.rad(135)*i, 0, -math.rad(45)*i)
				body.ArmRightW.C1=CFrame.new(1.5, .5, 0)*CFrame.Angles(-math.rad(45)*i, 0, math.rad(45)*i)
			end
			local room=add.Part(model, true, false, "White", .5, Vector3.new(1, 1, 1), torso.CFrame+torso.CFrame.lookVector*range)
			local dust=add.Part(model, true, false, "White", .5, Vector3.new(1, 1, 1), room.CFrame*CFrame.Angles(math.rad(90), 0, 0))
			local dustM=add.Mesh("SpecialMesh", dust, Vector3.new(1, 1, 1), nil, "File") dustM.MeshId="http://www.roblox.com/asset/?id=3270017"
			local roomM=add.Mesh("SpecialMesh", room, Vector3.new(1, 1, 1), nil, "Sphere")
			for i=1, 0, -.1 do wait() obj.Ope.Transparency=i end
			for i=0, 20, 5 do wait() room.Size=Vector3.new(i, i, i) room.CFrame=torso.CFrame+torso.CFrame.lookVector*range dustM.Scale=Vector3.new(i, i, i) dust.CFrame=room.CFrame*CFrame.Angles(math.rad(90), 0, 0) end
			for i=0, 1, .1 do wait() obj.Ope.Transparency=i end
			tDeb=true
			trail(obj.Point, CFrame.new(), "White")
			for i=0, 1, .1 do wait()
				body.ArmLeftW.C1=CFrame.new(-1.5, .5, 0)*CFrame.Angles(math.rad(90)*i, 0, -math.rad(45)*i)
				body.ArmRightW.C1=CFrame.new(1.5, .5, 0)*CFrame.Angles(0, 0, math.rad(90)*i)
				obj.HandleW.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(-math.rad(90)+(-math.rad(90)*i), 0, 0)
			end
			for i=0, 1, .1 do wait()
				body.TorsoW.C1=CFrame.Angles(0, -math.rad(180)*i, 0)
			end
			ypcall(function()
				local nHead=nChar["Head"]
				local nTorso=nChar["Torso"]
				local nHumanoid=nChar["Humanoid"] nHumanoid.WalkSpeed=0
				local nHeadW=add.Weld(nHead, nTorso, CFrame.new(0, 1.5, 0))
				for i=0, 1, .1 do
					wait()
					nHeadW.C1=CFrame.new(0, 1.5+i, 0)
				end
				for i=0, 1, .1 do
					wait()
					nHeadW.C1=CFrame.new(0, 2.5, (range-2)*i)
				end
				nHeadW.Part1=body.ArmLeft
				nHeadW.C1=CFrame.new(0, -2, 0)
				local bomb=add.Part(model, false, false, "Really black", 0, Vector3.new(1, 1, 1), nil)
				local bombM=add.Mesh("SpecialMesh", bomb, Vector3.new(1.5, 1.5, 1.5), nil, "Sphere")
				local bombW=add.Weld(bomb, nTorso, CFrame.new(0, 1.5, 0))
				wait(1)
				local exp=Instance.new("Explosion", bomb)
				exp.Position=bomb.Position
				exp.BlastPressure=1
				exp.BlastRadius=3 nHumanoid.Health=0
				nTorsoW:remove()
			end)
			tDeb=false
			for i=1, 0, -.1 do wait()
				body.TorsoW.C1=CFrame.Angles(0, -math.rad(180)*i, 0)
				body.ArmLeftW.C1=CFrame.new(-1.5, .5, 0)*CFrame.Angles(-math.rad(45)*i, 0, -math.rad(45)*i)
				body.ArmRightW.C1=CFrame.new(1.5, .5, 0)*CFrame.Angles(0, 0, math.rad(90)*i)
				obj.HandleW.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(-math.rad(90)+(-math.rad(90)*i), 0, 0)
			end
			for i=1, 0, -.05 do wait() dustM.Scale=dustM.Scale*Vector3.new(i, i, i) roomM.Scale=roomM.Scale*Vector3.new(i, i, i) end
			room:remove() dust:remove()
			whileDeb=false
			human.WalkSpeed=speed
		end end)
	end;
	["Centipede"]=function()
	end;
}

bin.Selected:connect(function(mouse) createParts()
	for i=0, 1, .1 do wait()
		body.TorsoW.C1=CFrame.Angles(0, -math.rad(45), 0)
		body.ArmLeftW.C1=CFrame.new(-1.5, .5, 0)*CFrame.Angles(-math.rad(45)*i, 0, -math.rad(45)*i)
		body.ArmRightW.C1=CFrame.new(1.5, .5, 0)*CFrame.Angles(math.rad(45)*i, 0, math.rad(45)*i)
		body.LegLeftW.C1=CFrame.new(-.5, -1.5, 0)*CFrame.Angles(0, 0, -math.rad(15)*i)
		body.LegRightW.C1=CFrame.new(.5, -1.5, 0)*CFrame.Angles(0, 0, math.rad(15)*i)
	end
	c(function()
		while true do
			wait()
			clabel.Text="--=="..mana.."==--"
			charge.Size=UDim2.new(mana/100, 0, 1, 0)
		end
	end)
	human.Running:connect(function(speed)
		if speed>0 then while whileDeb==true do wait() end
			for i=0, 1, .1 do wait()
				body.TorsoW.C1=CFrame.Angles(0, -math.rad(45), 0)
				body.ArmLeftW.C1=CFrame.new(-1.5, .5, 0)*CFrame.Angles(-math.rad(45)*i, 0, -math.rad(45)*i)
				body.ArmRightW.C1=CFrame.new(1.5, .5, 0)*CFrame.Angles(math.rad(45)*i, 0, math.rad(45)*i)
				body.LegLeftW.C1=CFrame.new(-.5, -1.5, 0)*CFrame.Angles(0, 0, -math.rad(15)*i)
				body.LegRightW.C1=CFrame.new(.5, -1.5, 0)*CFrame.Angles(0, 0, math.rad(15)*i)
			end
		end
	end)
	mouse.Button1Down:connect(function()
		local fakeP=add.Part(workspace, true, false, "White", 0, Vector3.new(2, 2, 2), CFrame.new((torso.CFrame*CFrame.new(0, 0, 1.5)).p, torso.CFrame.p)*CFrame.Angles(math.rad(90), 0, 0))
		local mesh=add.Mesh("SpecialMesh", fakeP, Vector3.new(1, 1, 1), nil, "File") mesh.MeshId="http://www.roblox.com/asset/?id=20329976"
		c(function()
			for i=0, 1, .1 do
				wait()
				fakeP.Mesh.Scale=fakeP.Mesh.Scale+Vector3.new(i, 0, i)
				fakeP.Transparency=i
			end
			fakeP:remove()
		end)
		for i, v in pairs(model:getChildren()) do
			if v:isA("BasePart") then
				local clone=v:clone()
				clone.Anchored=true
				clone.CanCollide=false
				clone.CFrame=v.CFrame
				clone.Parent=workspace
				c(function()
					for i=0, 1, .1 do
						wait()
						clone.Transparency=i
					end
					clone:remove()
				end)
			end
		end
		torso.CFrame=torso.CFrame+torso.CFrame.lookVector*20
	end)
	mouse.KeyDown:connect(function(key)
		if key=="q" and mana>=50 and keyDeb==false then mana=mana-50 whileDeb=true keyDeb=true Attacks.Room(mouse) keyDeb=false end
		if key=="e" and mana>=40 and keyDeb==false then mana=mana-40 whileDeb=true keyDeb=true Attacks.Shambles(mouse) keyDeb=false end
		if key=="r" and mana>=10 and keyDeb==false then mana=mana-10 whileDeb=true keyDeb=true Attacks.Mes(mouse) keyDeb=false end
		if key=="c" and mana>=20 and keyDeb==false then whileDeb=true keyDeb=true Attacks.Catastrophe(mouse) keyDeb=false end
		--if key=="v" and mana>=30 and keyDeb==false then whileDeb=true keyDeb=true Attacks.Centipede(mouse) keyDeb=false end
		if key=="f" and keyDeb==false then whileDeb=true loopDeb=true keyDeb=true Attacks.Shield(mouse) end
		if key=="x" and keyDeb==false then whileDeb=true loopDeb2=true keyDeb=true Attacks.Rappid(mouse) end
		if key=="z" and keyDeb==false then whileDeb=true loopDeb3=true keyDeb=true Attacks.Charge() end
	end)
	mouse.KeyUp:connect(function(key)
		if key=="f" and keyDeb==true then keyDeb=false loopDeb=false whileDeb=false tDeb=false
			for i=1, 0, -.1 do
				wait()
				obj.HandleW.C0=CFrame.Angles(0, 0, 0)
				body.ArmLeftW.C1=CFrame.new(-1.5+(.5*i), .5, -.5*i)*CFrame.Angles(math.rad(90)*i, 0, math.rad(45)*i)
				body.ArmRightW.C1=CFrame.new(1.5-(.5*i), .5, -.5*i)*CFrame.Angles(math.rad(90)*i, 0, -math.rad(45)*i)
				obj.HandleW.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(-math.rad(90)+(-math.rad(90)*i), 0, math.rad(45)*i)
			end	human.WalkSpeed=speed
		end
		if key=="x" and keyDeb==true then keyDeb=false loopDeb2=false whileDeb=false tDeb=false
			for i=1, 0, -.1 do
				wait()
				body.TorsoW.C1=CFrame.Angles(0, -math.rad(90)*i, 0)
				body.ArmLeftW.C1=CFrame.new(-1.5, .5, 0)*CFrame.Angles(-math.rad(45)*i, 0, -math.rad(45)*i)
				body.ArmRightW.C1=CFrame.new(1.5, .5, 0)*CFrame.Angles(0, 0, math.rad(90)*i)
				obj.HandleW.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(-math.rad(90)+(-math.rad(90)*i), 0, 0)
			end	human.WalkSpeed=speed
		end
		if key=="z" and keyDeb==true then keyDeb=false loopDeb3=false whileDeb=false tDeb=false end
	end)
end)
bin.Deselected:connect(function() removeParts() end)--mediafire