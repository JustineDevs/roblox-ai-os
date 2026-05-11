--==Made by LuisPambid==--
--==Chop-Chop Operation==--


local player=game.Players.LocalPlayer
local char=player.Character
repeat wait() until player and char
local torso=char.Torso
local head=char.Head
local human=char.Humanoid
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
local scriptname="Chop-Chop" --Name here
pcall(function() player.Backpack[scriptname]:remove() char[scriptname]:remove() char["Objects"]:remove() player.PlayerGui[scriptname]:remove()  end)
local model=Instance.new("Model", char) model.Name="Objects"
local modelB=Instance.new("Model", char) modelB.Name=scriptname
local gui=Instance.new("ScreenGui", player.PlayerGui) gui.Name=scriptname
local bin=Instance.new("HopperBin", player.Backpack) bin.Name=scriptname
local skincolor="Really black"
local body={}
local animate={}
local obj={}
--Variables--
local trailDeb=false
local hitDeb=false
local using=false
local keyDeb=false
local pressing=false
local combo=0
local mana=100
local range=20
local dmg=math.random(10, 25)
local form=false
local Forms
local pitch=.5
local speed=16
local car
local pitch=.8
local Slash=add.Sound(torso, "rbxasset://sounds//swordslash.wav", 1, pitch)
local Portal2=add.Sound(torso, "http://roblox.com/asset/?id=10209668", 1, 1)
local Charge=add.Sound(torso, "http://www.roblox.com/asset/?id=2101137", 1, .5)
local chargeLabel=add.Gui("TextLabel", gui, "Really black", "White", "Really black", "Size14", mana, 0, UDim2.new(0, 200, 0, 20), UDim2.new(0, 0, 0, 100))
local charge=add.Gui("TextLabel", chargeLabel, "Really black", "Bright blue", "Really black", "Size14", "", 0.5, UDim2.new(1, 0, 1, 0), UDim2.new(0, 0, 0, 0))
local attackLabel=add.Gui("TextLabel", gui, "Really black", "Really black", "White", "Size18", "Festival(Hold(Q))", 0, UDim2.new(0, 150, 0, 50), UDim2.new(0, 0, 0, 150))
local attackLabel2=add.Gui("TextLabel", attackLabel, "Really black", "Really black", "White", "Size18", "Charge(F)", 0, UDim2.new(1, 0, 1, 0), UDim2.new(0, 0, 1, 0))
local attackLabel3=add.Gui("TextLabel", attackLabel2, "Really black", "Really black", "White", "Size18", "Tornado(E)", 0, UDim2.new(1, 0, 1, 0), UDim2.new(0, 0, 1, 0))
local attackLabel4=add.Gui("TextLabel", attackLabel3, "Really black", "Really black", "White", "Size18", "ChibiForm(C)", 0, UDim2.new(1, 0, 1, 0), UDim2.new(0, 0, 1, 0))
local attackLabel5=add.Gui("TextLabel", attackLabel4, "Really black", "Really black", "White", "Size18", "CarForm(V)", 0, UDim2.new(1, 0, 1, 0), UDim2.new(0, 0, 1, 0))
function createParts()
	--==PARTS==--
	body.Head=add.Part(model, false, false, skincolor, 1, Vector3.new(1, 1, 1), nil)
	body.Torso=add.Part(model, false, false, skincolor, 1, Vector3.new(2, 2, 1), nil)
	body.ArmLeft, body.ArmRight=add.Part(model, false, false, skincolor, 1, Vector3.new(1, 1, 1), nil), add.Part(model, false, false, skincolor, 1, Vector3.new(1, 1, 1), nil)
	body.LegLeft, body.LegRight=add.Part(model, false, false, skincolor, 1, Vector3.new(1, 1, 1), nil), add.Part(model, false, false, skincolor, 1, Vector3.new(1, 1, 1), nil)
	--==WELDS==--
	body.HeadW=add.Weld(body.Head, body.Torso, CFrame.new(0, 1.5, 0))
	body.TorsoW=add.Weld(body.Torso, torso, nil)
	body.ArmLeftW, body.ArmRightW=add.Weld(body.ArmLeft, body.Torso, CFrame.new(-1.5, .5, 0)), add.Weld(body.ArmRight, body.Torso, CFrame.new(1.5, .5, 0))
	body.LegLeftW, body.LegRightW=add.Weld(body.LegLeft, body.Torso, CFrame.new(-.5, -1.5, 0)), add.Weld(body.LegRight, body.Torso, CFrame.new(.5, -1.5, 0))
	--==WELDS==--
	add.Weld(body.Head, head, nil)
	add.Weld(arm.Left, body.ArmLeft, CFrame.new(0, -.5, 0))
	add.Weld(arm.Right, body.ArmRight, CFrame.new(0, -.5, 0))
	torso["Left Hip"].Part0=torso
	torso["Right Hip"].Part0=torso
	---------------------------------------------------------------------------------------
	animate={
		["Head"]=function(cf)
			body.HeadW.C1=CFrame.new(0, 1.5, 0)*cf
		end;
		["Torso"]=function(cf) body.Torso.Transparency=0 torso.Transparency=1
			body.TorsoW.C1=cf
			c(function()
				wait(0)
				body.Torso.Transparency=1 torso.Transparency=0
			end)
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
				wait(0)
				legLeftW:remove()
			end)
		end;
		["LegRight"]=function(cf)
			legRightW=add.Weld(leg.Right, body.LegRight, CFrame.new(0, -.5, 0))
			body.LegRightW.C1=CFrame.new(.5, -1.5, 0)*cf
			c(function()
				wait(0)
				legRightW:remove()
			end)
		end;
	}
	--==Objects==--
end
function removeParts()
	p(function()
		if torso then
			torso["Left Hip"].Part0=torso
			torso["Right Hip"].Part0=torso
		end
		for i, v in pairs(model:children()) do v:remove() end	for i, v in pairs(modelB:children()) do v:remove() end	for i, v in pairs(char:children()) do v.Transparency=0 end
		wait()
		torso.Transparency=0
	end)
end
function hit(h)
	if using==true then
		if h.Parent~=char and h.Parent:findFirstChild("Humanoid") and hitDeb==false then hitDeb=true
			local hHuman=h.Parent:findFirstChild("Humanoid")
			hHuman.Health=hHuman.Health-dmg
			local fakeM=Instance.new("Model", workspace) fakeM.Name=dmg
			local fakeH=Instance.new("Humanoid", fakeM) fakeH.MaxHealth=0 fakeH.Health=0
			local effect=add.Part(fakeM, false, false, "Bright red", 0, Vector3.new(1, 1, 1), h.CFrame) effect.Name="Head"
			local fakeMesh=add.Mesh("CylinderMesh", effect, Vector3.new(1, .5, 1), nil, nil)
			local bp=Instance.new("BodyPosition", effect) bp.maxForce=Vector3.new(math.huge, math.huge, math.huge) bp.position=h.Position+Vector3.new(0, 4, 0)
			game.Debris:addItem(fakeM, 2)
			wait(.5)
			hitDeb=false
		end
	end
end
function running()
	if form==false then speed=16
		animate.Torso(CFrame.new())
		animate.Head(CFrame.new())
		animate.ArmLeft(CFrame.Angles(-math.rad(15), 0, -math.rad(15)))
		animate.ArmRight(CFrame.Angles(-math.rad(15), 0, math.rad(15)))
	elseif form==true and Form=="Chibi" then speed=16 Portal2:play()
		animate.Torso(CFrame.new(0, -1.5, 0))
		wait()
		torso.Transparency=1
		animate.ArmLeft(CFrame.new(.5, 0, 0)*CFrame.Angles(0, 0, -math.rad(45)))
		animate.ArmRight(CFrame.new(-.5, 0, 0)*CFrame.Angles(0, 0, math.rad(45)))
	elseif form==true and Form=="Car" then speed=100 Portal2:play()
		human.WalkSpeed=speed
		animate.Torso(CFrame.new(0, -2, 0)*CFrame.Angles(-math.rad(90), 0, 0))
		animate.Head(CFrame.new(0, -1.5, 1)*CFrame.Angles(math.rad(90), 0, 0))
		animate.ArmLeft(CFrame.new(.5, 0, 0)*CFrame.Angles(math.rad(180), 0, math.rad(15)))
		animate.ArmRight(CFrame.new(-.5, 0, 0)*CFrame.Angles(math.rad(180), 0, -math.rad(15)))
		car=Instance.new("Model", char) car.Name="Car"
		local handle=add.Part(car, false,true, "Medium stone grey", 0, Vector3.new(.5, 7.2, .5), nil)
		local handleM=add.Mesh("CylinderMesh", handle, Vector3.new(1, 1, 1), nil, nil)
		local handleW=add.Weld(handle, body.Torso, CFrame.new(0, 2, 0)*CFrame.Angles(0, 0, -math.rad(90)))

		local TireLeft=add.Part(car, false, true, "Really black", 0, Vector3.new(2, 1, 2), nil)
		TireLeftM=add.Mesh("CylinderMesh", TireLeft, Vector3.new(1, 1, 1), nil, nil)
		TireLeftW=add.Weld(TireLeft, handle, CFrame.new(0, -3, 0))
		local TireRight=add.Part(car, false, true, "Really black", 0, Vector3.new(2, 1, 2), nil)
		TireRightM=add.Mesh("CylinderMesh", TireRight, Vector3.new(1, 1, 1), nil, nil)
		TireRightW=add.Weld(TireRight, handle, CFrame.new(0, 3, 0))

		local handle=add.Part(car, false,true, "Medium stone grey", 0, Vector3.new(.5, 7.2, .5), nil)
		local handleM=add.Mesh("CylinderMesh", handle, Vector3.new(1, 1, 1), nil, nil)
		local handleW=add.Weld(handle, body.Torso, CFrame.new(0, -2, 0)*CFrame.Angles(0, 0, -math.rad(90)))

		local TireLeft=add.Part(car, false, true, "Really black", 0, Vector3.new(2, 1, 2), nil)
		TireLeftM=add.Mesh("CylinderMesh", TireLeft, Vector3.new(1, 1, 1), nil, nil)
		TireLeftW=add.Weld(TireLeft, handle, CFrame.new(0, -3, 0))
		local TireRight=add.Part(car, false, true, "Really black", 0, Vector3.new(2, 1, 2), nil)
		TireRightM=add.Mesh("CylinderMesh", TireRight, Vector3.new(1, 1, 1), nil, nil)
		TireRightW=add.Weld(TireRight, handle, CFrame.new(0, 3, 0))
		c(function()
			while form do wait()
				animate.Torso(CFrame.new(0, -2, 0)*CFrame.Angles(-math.rad(90), 0, 0))
				animate.LegLeft(CFrame.Angles(0, 0, 0))
				animate.LegRight(CFrame.Angles(0, 0, 0))
			end
			animate.Torso(CFrame.new())
			animate.Head(CFrame.new())
			car:remove()
		end)
	end
	human.WalkSpeed=speed
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
			trail.Touched:connect(hit)
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
function Attack() combo=combo+1
	if using==false then
		if form==false and keyDeb==false then
			using=true
			for i, v in pairs(char:children()) do
				if v:isA("BasePart") then
					v.Touched:connect(hit)
				end
			end
			if combo==1 then Slash:play() print("Right Hook")
				trailDeb=true
				trail(body.ArmRight, CFrame.new(0, -1.5, 0))
				for i=0, 1, .1 do wait()
					animate.Torso(CFrame.Angles(0, math.rad(15)*i, 0))
					animate.ArmRight(CFrame.new(-.5*i, 0, -range*i)*CFrame.Angles(math.rad(90), 0, 0))
				end
				for i=1, 0, -.1 do wait()
					animate.Torso(CFrame.Angles(0, math.rad(15)*i, 0))
					animate.ArmRight(CFrame.new(-.5*i, 0, -range*i)*CFrame.Angles(math.rad(90), 0, 0))
				end
				trailDeb=false
				if combo>2 then Slash:play()
					trailDeb=true
					trail(body.ArmLeft, CFrame.new(0, -1.5, 0))
					for i=0, 1, .1 do wait()
						animate.Torso(CFrame.Angles(0, -math.rad(15)*i, 0))
						animate.ArmLeft(CFrame.new(.5*i, 0, -range*i)*CFrame.Angles(math.rad(90), 0, 0))
					end
					for i=1, 0, -.1 do wait()
					animate.Torso(CFrame.Angles(0, -math.rad(15)*i, 0))
						animate.ArmLeft(CFrame.new(.5*i, 0, -range*i)*CFrame.Angles(math.rad(90), 0, 0))
					end
					trailDeb=false
				end
				if combo>3 then Slash:play() print("Both Hook")
					trailDeb=true
					for i=0, 1, .1 do wait()
					animate.ArmLeft(CFrame.new(.5*i, 0, -range*i)*CFrame.Angles(math.rad(90), 0, 0))
					animate.ArmRight(CFrame.new(-.5*i, 0, -range*i)*CFrame.Angles(math.rad(90), 0, 0))
					end
					for i=1, 0, -.1 do wait()
					animate.ArmLeft(CFrame.new(.5*i, 0, -range*i)*CFrame.Angles(math.rad(90), 0, 0))
					animate.ArmRight(CFrame.new(-.5*i, 0, -range*i)*CFrame.Angles(math.rad(90), 0, 0))
					end
					trailDeb=false
				end
				if combo>4 then print("Rappid Punch")
					trailDeb=true
					for i=1, 2 do wait()
						for i=0, 1, .2 do wait() Slash:play()
							animate.ArmLeft(CFrame.new(math.random(-2, 2), math.random(-2, 2), -range*i)*CFrame.Angles(math.rad(90), 0, 0))
							animate.ArmRight(CFrame.new(math.random(-2, 2), math.random(-2, 2), -range-(-range*i))*CFrame.Angles(math.rad(90), 0, 0))
						end
						for i=0, 1, .2 do wait()
							animate.ArmLeft(CFrame.new(math.random(-2, 2), math.random(-2, 2), -range-(-range*i))*CFrame.Angles(math.rad(90), 0, 0))
							animate.ArmRight(CFrame.new(math.random(-2, 2), math.random(-2, 2), -range*i)*CFrame.Angles(math.rad(90), 0, 0))
						end
					end
					trailDeb=false
				end
			end
			trailDeb=false
			animate.ArmLeft(CFrame.Angles(0, 0, 0))
			animate.ArmRight(CFrame.Angles(0, 0, 0))
			using=false
			combo=0
			running()
		end
	end
end
local Specials={
	["Festival"]=function() human.WalkSpeed=0
		pressing=true
		for i=0, 1, .1 do wait()
			animate.ArmLeft(CFrame.Angles(0, 0, -math.rad(135)*i))
			animate.ArmRight(CFrame.Angles(0, 0, math.rad(135)*i))
			animate.LegLeft(CFrame.Angles(0, 0, -math.rad(45)*i))
			animate.LegRight(CFrame.Angles(0, 0, math.rad(45)*i))
		end
		trailDeb=true
		trail(body.ArmLeft, CFrame.new(0, -1.5, 0))
		trail(body.ArmRight, CFrame.new(0, -1.5, 0))
		trail(body.LegLeft, CFrame.new(0, -1.5, 0))
		trail(body.LegRight, CFrame.new(0, -1.5, 0))
		while pressing and mana>=1 do wait() mana=mana-1 Slash:play()
				pcall(function()
					local touchHelper=add.Part(workspace, true, false, "White", 1, Vector3.new(range*1.5, range*1.5, range*1.5), torso.CFrame)
					touchHelper.Touched:connect(hit)
					c(function() wait(1)
						touchHelper:remove()
					end)
				end)
			for i, v in pairs(char:children()) do
				if v.ClassName=="Hat" then
					pcall(function()
						v.Handle.Transparency=1
						torso.Transparency=1
						head.Transparency=1
					end)
				end
				pcall(function() v.face.Transparency=1 end)
			end
			animate.ArmLeft(CFrame.new(math.random(-range, range), math.random(-range, range), math.random(-range, range))*CFrame.Angles(math.random(-range, range), math.random(-45, 45), math.random(-45, 45)))
			animate.ArmRight(CFrame.new(math.random(-range, range), math.random(-range, range), math.random(-range, range))*CFrame.Angles(math.random(-range, range), math.random(-45, 45), math.random(-45, 45)))
			animate.LegLeft(CFrame.new(math.random(-range, range), math.random(-range, range), math.random(-range, range))*CFrame.Angles(math.random(-range, range), math.random(-45, 45), math.random(-45, 45)))
			animate.LegRight(CFrame.new(math.random(-range, range), math.random(-range, range), math.random(-range, range))*CFrame.Angles(math.random(-range, range), math.random(-45, 45), math.random(-45, 45)))
		end
		trailDeb=false
		for i, v in pairs(char:children()) do
			if v.ClassName=="Hat" then
				pcall(function()
					v.Handle.Transparency=0
					torso.Transparency=0
					head.Transparency=0
				end)
			end
			pcall(function() v.face.Transparency=0 end)
		end
		for i=1, 0, -.1 do wait()
			animate.ArmLeft(CFrame.Angles(0, 0, -math.rad(135)*i))
			animate.ArmRight(CFrame.Angles(0, 0, math.rad(135)*i))
			animate.LegLeft(CFrame.Angles(0, 0, -math.rad(45)*i))
			animate.LegRight(CFrame.Angles(0, 0, math.rad(45)*i))
		end
		running()
		human.WalkSpeed=speed
	end;
	["Charge"]=function() human.WalkSpeed=0
		pressing=true
		for i=0, 1, .1 do wait()
			animate.ArmLeft(CFrame.Angles(-math.rad(15)*i, 0, -math.rad(15)*i))
			animate.ArmRight(CFrame.Angles(math.rad(135)*i, 0, math.rad(15)*i))
		end
		Charge:play()
		while pressing do wait() if mana<100 then mana=mana+1 end
			local aura=add.Part(workspace, true, false, "Bright blue", .5, Vector3.new(1, 1, 1), torso.CFrame*CFrame.new(0, -2, 0)*CFrame.Angles(0, math.rad(math.random(-45, 45)), 0)) aura.Name="Effect"
			local auraM=add.Mesh("SpecialMesh", aura, Vector3.new(1, 1, 1), nil, "File") auraM.MeshId="http://www.roblox.com/asset/?id=20329976"
			c(function()
				for i=0, 3, .1 do wait()
					auraM.Scale=auraM.Scale+Vector3.new(i, i/2, i)
				end
				c(function()
					for i=.5, 1, .1 do
						wait()
						aura.Transparency=i
					end
				end)
				aura:remove()
			end)
		end
		for i=1, 0, -.1 do wait()
			animate.ArmLeft(CFrame.Angles(-math.rad(15)*i, 0, -math.rad(15)*i))
			animate.ArmRight(CFrame.Angles(math.rad(135)*i, 0, -math.rad(15)*i))
		end
		running()
		human.WalkSpeed=speed
	end;
	["Tornado"]=function() human.WalkSpeed=0
		mana=mana-20
		for i=0, 1, .1 do wait()
			animate.ArmLeft(CFrame.Angles(0, 0, -math.rad(90)*i))
			animate.ArmRight(CFrame.Angles(0, 0, math.rad(90)*i))
			animate.LegLeft(CFrame.new()) animate.LegRight(CFrame.new())
		end
		trailDeb=true
		trail(body.ArmLeft, CFrame.new(0, -1.5, 0))
		trail(body.ArmRight, CFrame.new(0, -1.5, 0))
		for i=1, 50 do wait() Slash:play()
			animate.Torso(CFrame.Angles(0, math.rad(45)*i, 0))
			animate.ArmLeft(CFrame.new(-i, i/25, 0)*CFrame.Angles(0, 0, -math.rad(90)))
			animate.ArmRight(CFrame.new(i, i/25, 0)*CFrame.Angles(0, 0, math.rad(90)))
			animate.LegLeft(CFrame.new()) animate.LegRight(CFrame.new())
		end
		for i=50, 0, -1 do wait() Slash:play()
			animate.Torso(CFrame.Angles(0, math.rad(45)*i, 0))
			animate.ArmLeft(CFrame.new(-i, i/25, 0)*CFrame.Angles(0, 0, -math.rad(90)))
			animate.ArmRight(CFrame.new(i, i/25, 0)*CFrame.Angles(0, 0, math.rad(90)))
			animate.LegLeft(CFrame.new()) animate.LegRight(CFrame.new())
		end
		trailDeb=false
		for i=1, 0, -.1 do wait()
			animate.ArmLeft(CFrame.Angles(0, 0, -math.rad(90)*i))
			animate.ArmRight(CFrame.Angles(0, 0, math.rad(90)*i))
		end
		human.WalkSpeed=speed
	end;
}
bin.Selected:connect(function(mouse) createParts()
	running()
	mouse.Button1Down:connect(Attack)
	mouse.KeyDown:connect(function(key)
		local key=key:lower()
		if form==false and using==false then
			if key=="q" and mana>=0 and keyDeb==false then
				keyDeb=true using=true
				Specials.Festival()
				keyDeb=false using=false
			end
			if key=="e" and keyDeb==false and mana>=20 then
				keyDeb=true using=true
				Specials.Tornado()
				keyDeb=false using=false
			end
			if key=="f" and keyDeb==false then
				keyDeb=true
				Specials.Charge()
				keyDeb=false
			end
		end
		if key=="c" and keyDeb==false and form==false then
			keyDeb=true form=true Form="Chibi"
			running()
			keyDeb=false
		elseif key=="c" and keyDeb==false and form==true then
			keyDeb=true form=false Form=nil
			running()
			keyDeb=false
		end
		if key=="v" and keyDeb==false and form==false then
			keyDeb=true form=true Form="Car"
			running()
			keyDeb=false
		elseif key=="v" and keyDeb==false and form==true then
			keyDeb=true form=false Form=nil
			running()
			pcall(function() car:remove() end)
			keyDeb=false
		end
	end)
	mouse.KeyUp:connect(function(key)
		if form==false then
			if key=="q" then pressing=false end
			if key=="f" then pressing=false end
		end
	end)
	while wait() do charge.Size=UDim2.new(mana/100, 0, 1, 0) chargeLabel.Text=mana end
end)
bin.Deselected:connect(function() removeParts() end)--mediafire