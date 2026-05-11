--==Made by LuisPambid==--
--==RoCore CMD==--


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
local add={
	Part=function(par, a, c, col, t, s, cf)
		local p=Instance.new("Part", par) p.TopSurface="Smooth" p.BottomSurface="Smooth" p.formFactor="Custom" p.Anchored=a p.CanCollide=c p.BrickColor=BrickColor.new(col) p.Transparency=t p.Size=s p.CFrame=cf or CFrame.new()
		return p
	end,
	Weld=function(par, p1, cf)
		local w=Instance.new("Weld", par) w.Part0=w.Parent or par w.Part1=p1 w.C1=cf or CFrame.new()
		return w
	end,
	Mesh=function(ins, par, s, of, t)
		local m=Instance.new(ins, par) m.Scale=s or Vector3.new() m.Offset=of or Vector3.new() pcall(function() m.MeshType=t end)
		return m
	end
}
local model=Instance.new("Model", char) model.Name="Luffy Mode"
local bin=Instance.new("HopperBin", player.Backpack) bin.Name=model.Name
local fake={}
fake.Head=nil
fake.Torso=nil
fake.Mesh={}
fake.Leg={}
fake.Arm={}
local weld={}
weld.Head=nil
weld.Torso=nil
weld.Leg={}
weld.Arm={}
--==Fake==--
fake.Head=add.Part(model, false, false, "really black", 1, Vector3.new(1, 1, 1), nil)
fake.Arm.Left=add.Part(model, false, false, "really black", 1, Vector3.new(1, 1, 1), nil)
fake.Arm.Right=add.Part(model, false, false, "really black", 1, Vector3.new(1, 1, 1), nil)
fake.Leg.Left=add.Part(model, false, false, "really black", 1, Vector3.new(1, 1, 1), nil)
fake.Leg.Right=add.Part(model, false, false, "really black", 1, Vector3.new(1, 1, 1), nil)
--==Weldz==--
weld.Head=add.Weld(fake.Head, torso, CFrame.new(0, 1.5, 0))
weld.Arm.Left=add.Weld(fake.Arm.Left, torso, CFrame.new(-1.5, .5, 0))
weld.Arm.Right=add.Weld(fake.Arm.Right, torso, CFrame.new(1.5, .5, 0))
weld.Leg.Left=add.Weld(fake.Leg.Left, torso, CFrame.new(-.5, -1.5, 0))
weld.Leg.Right=add.Weld(fake.Leg.Right, torso, CFrame.new(.5, -1.5, 0))
add.Weld(arm.Left, fake.Arm.Left, CFrame.new(0, -.5, 0)) add.Weld(arm.Right, fake.Arm.Right, CFrame.new(0, -.5, 0))
add.Weld(leg.Left, fake.Leg.Left, CFrame.new(0, -.5, 0)) add.Weld(leg.Right, fake.Leg.Right, CFrame.new(0, -.5, 0))
add.Weld(head, fake.Head, nil)

local hDeb=false
local dmg=math.random(5, 10)
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
			pcall(function()h.Parent:findFirstChild("Torso").RotVelocity=Vector3.new(math.random(-50, 50), math.random(-50, 50), math.random(-50, 50)*200)end)
			pcall(function()h.Parent:findFirstChild("Torso").Velocity=Vector3.new(math.random(-100, 100), math.random(-100, 100), math.random(-100, 100)*200)end)
		wait()
		hDeb=false
		--end)
	end
end

local kDeb=false
local ksDeb=false
function ray(pos, pos2)
	local mag=(pos-pos2).magnitude
	local dis=(pos+pos2)/2
	local raypart=add.Part(workspace, true, false, arm.Left.Color or arm.Right.Color, 0, Vector3.new(1, mag, 1), CFrame.new(dis, pos)*CFrame.Angles(math.pi/2, 0, 0))
	local ball=add.Part(raypart, true, false, arm.Left.Color or arm.Right.Color, 0, Vector3.new(1.25, 1.25, 1.25), CFrame.new(pos2))
	local ballmesh=add.Mesh("SpecialMesh", ball, Vector3.new(1, 1, 1), nil, "Sphere")
	local raymesh=add.Mesh("CylinderMesh", raypart, Vector3.new(1, 1, 1), nil, nil)
	raypart.Touched:connect(hit)
	ball.Touched:connect(hit)
	c(function()
		for i=1, 0, -.05 do
			wait()
			ball.Mesh.Scale=ball.Mesh.Scale*Vector3.new(i, i, i)
			raypart.Mesh.Scale=raypart.Mesh.Scale*Vector3.new(i, 1, i)
		end
		raypart:remove()
	end)
end
function computePos(pos, pos2)
	local pos3=Vector3.new(pos2.x, pos.y, pos2.z)
	torso.CFrame=CFrame.new(pos, pos3)
	return pos3
end

local wspeed=16
local speed=.2
local skincolor="Medium stone grey"
local range=50
local tlimit=30
local specials={
	["Gear2nd"]=function()
		human.WalkSpeed=0
		for i=0, 1, .1 do wait()
			weld.Arm.Left.C1=CFrame.new(-1.5, .5, 0)*CFrame.Angles(math.rad(90)*i, 0, -math.rad(90)*i)
			weld.Arm.Right.C1=CFrame.new(1.5, .5, 0)*CFrame.Angles(math.rad(90)*i, 0, math.rad(90)*i)
		end
		local ball=add.Part(workspace, false, false, "Really red", 0, Vector3.new(1.25, 1.25, 1.25), nil)
		local ballmesh=add.Mesh("SpecialMesh", ball, Vector3.new(1.2, 1.2, 1.2), nil, "Sphere")
		local ball2=add.Part(workspace, false, false, "Really red", 0, Vector3.new(1.25, 1.25, 1.25), nil)
		local ballmesh2=add.Mesh("SpecialMesh", ball2, Vector3.new(1.2, 1.25, 1.2), nil, "Sphere")
		local ballweld=add.Weld(ball, fake.Arm.Left, nil)
		local ballweld2=add.Weld(ball2, fake.Arm.Right, nil)
		for i=0, 1, .1 do wait()
			ballweld.C1=CFrame.new(0, -1*i, 0)
			ballweld2.C1=CFrame.new(0, -1*i, 0)
		end
		for i=1, 0, -.1 do wait()
			ballweld.C1=CFrame.new(0, -1*i, 0)
			ballweld2.C1=CFrame.new(0, -1*i, 0)
		end
		for i, v in pairs(char:children()) do if v:isA("Part") then v.BrickColor=ball.BrickColor or ball2.BrickColor end end
		ball:remove()
		ball2:remove()
		for i=1, 0, -.1 do wait()
			weld.Arm.Left.C1=CFrame.new(-1.5, .5, 0)*CFrame.Angles(math.rad(90)*i, 0, -math.rad(90)*i)
			weld.Arm.Right.C1=CFrame.new(1.5, .5, 0)*CFrame.Angles(math.rad(90)*i, 0, math.rad(90)*i)
		end
		wspeed=64
		human.WalkSpeed=wspeed
		speed=.01
		wait(tlimit)
		wspeed=16
		human.WalkSpeed=wspeed
		speed=.2
		for i, v in pairs(char:children()) do if v:isA("Part") then v.BrickColor=BrickColor.new(skincolor) end end
	end
}
local moves={
	["GatlingGun"]=function(mouse)
		target=mouse.Target.Position
		for i=0, 1, .1 do
			wait()
			weld.Head.C1=CFrame.new(0, 1.5, 0)*CFrame.Angles(math.rad(45)*i, 0, 0)
			weld.Arm.Left.C1=CFrame.new(-1.5, .5, 0)*CFrame.Angles(0, -math.rad(90)*i, -math.rad(90)*i)
			weld.Arm.Right.C1=CFrame.new(1.5, .5, 0)*CFrame.Angles(0, math.rad(90)*i, math.rad(90)*i)
			weld.Leg.Left.C1=CFrame.new(-.5, -1.5, 0)*CFrame.Angles(-math.rad(45)*i, 0, -math.rad(45)*i)
			weld.Leg.Right.C1=CFrame.new(.5, -1.5, 0)*CFrame.Angles(-math.rad(45)*i, 0, math.rad(45)*i)
		end
		for i=1, 50 do
			wait(speed)
			computePos(torso.CFrame.p, mouse.Hit.p)
			torso.CFrame=torso.CFrame+torso.CFrame.lookVector*.5
			pcall(function()ray(arm.Left.Position, target+Vector3.new(math.random(-2, 2), math.random(2, 5), math.random(-2, 2)))end)
			pcall(function()ray(arm.Right.Position, target+Vector3.new(math.random(-2, 2), math.random(2, 5), math.random(-2, 2)))end)
		end
		for i=1, 0, -.1 do
			wait()
			weld.Head.C1=CFrame.new(0, 1.5, 0)*CFrame.Angles(math.rad(45)*i, 0, 0)
			weld.Arm.Left.C1=CFrame.new(-1.5, .5, 0)*CFrame.Angles(0, -math.rad(90)*i, -math.rad(90)*i)
			weld.Arm.Right.C1=CFrame.new(1.5, .5, 0)*CFrame.Angles(0, math.rad(90)*i, math.rad(90)*i)
			weld.Leg.Left.C1=CFrame.new(-.5, -1.5, 0)*CFrame.Angles(-math.rad(45)*i, 0, -math.rad(45)*i)
			weld.Leg.Right.C1=CFrame.new(.5, -1.5, 0)*CFrame.Angles(-math.rad(45)*i, 0, math.rad(45)*i)
		end
	end,
	["Bazooka"]=function(mouse)
		target=mouse.Target.Position
		for i=0, 1, .2 do
			wait()
			weld.Head.C1=CFrame.new(0, 1.5, 0)*CFrame.Angles(math.rad(45)*i, 0, 0)
			weld.Arm.Left.C1=CFrame.new(-1.5, .5, 0)*CFrame.Angles(0, -math.rad(90)*i, -math.rad(90)*i)
			weld.Arm.Right.C1=CFrame.new(1.5, .5, 0)*CFrame.Angles(0, math.rad(90)*i, math.rad(90)*i)
			weld.Leg.Left.C1=CFrame.new(-.5, -1.5, 0)*CFrame.Angles(-math.rad(45)*i, 0, -math.rad(45)*i)
			weld.Leg.Right.C1=CFrame.new(.5, -1.5, 0)*CFrame.Angles(-math.rad(45)*i, 0, math.rad(45)*i)
		end
		computePos(torso.CFrame.p, mouse.Hit.p)
		torso.CFrame=torso.CFrame+torso.CFrame.lookVector*5
		pcall(function()ray(arm.Left.Position, target)end)
		pcall(function()ray(arm.Right.Position, target)end)
		for i=1, 0, -.2 do
			wait()
			weld.Head.C1=CFrame.new(0, 1.5, 0)*CFrame.Angles(math.rad(45)*i, 0, 0)
			weld.Arm.Left.C1=CFrame.new(-1.5, .5, 0)*CFrame.Angles(0, -math.rad(90)*i, -math.rad(90)*i)
			weld.Arm.Right.C1=CFrame.new(1.5, .5, 0)*CFrame.Angles(0, math.rad(90)*i, math.rad(90)*i)
			weld.Leg.Left.C1=CFrame.new(-.5, -1.5, 0)*CFrame.Angles(-math.rad(45)*i, 0, -math.rad(45)*i)
			weld.Leg.Right.C1=CFrame.new(.5, -1.5, 0)*CFrame.Angles(-math.rad(45)*i, 0, math.rad(45)*i)
		end
	end,
	["Hanabi"]=function()
		human.WalkSpeed=0
		local bp=Instance.new("BodyPosition", torso) bp.maxForce=Vector3.new(0, math.huge, 0) bp.position=torso.Position+Vector3.new(0, 20, 0)
		for i=0, 1, .2 do
			wait()
			weld.Head.C1=CFrame.new(0, 1.5, 0)*CFrame.Angles(math.rad(45)*i, 0, 0)
			weld.Arm.Left.C1=CFrame.new(-1.5, .5, 0)*CFrame.Angles(math.rad(225)*i, 0, -math.rad(45)*i)
			weld.Arm.Right.C1=CFrame.new(1.5, .5, 0)*CFrame.Angles(math.rad(225)*i, 0, math.rad(45)*i)
			weld.Leg.Left.C1=CFrame.new(-.5, -1.5, 0)*CFrame.Angles(-math.rad(45)*i, 0, -math.rad(45)*i)
			weld.Leg.Right.C1=CFrame.new(.5, -1.5, 0)*CFrame.Angles(-math.rad(45)*i, 0, math.rad(45)*i)
		end
		for i=1, 30 do
			wait(speed)
			torso.CFrame=torso.CFrame*CFrame.Angles(0, math.rad(15), 0)
			ray(torso.Position, torso.Position+Vector3.new(math.random(-range, range), math.random(-range, range), math.random(-range, range)))
		end
		for i=1, 0, -.2 do
			wait()
			weld.Head.C1=CFrame.new(0, 1.5, 0)*CFrame.Angles(math.rad(45)*i, 0, 0)
			weld.Arm.Left.C1=CFrame.new(-1.5, .5, 0)*CFrame.Angles(math.rad(225)*i, 0, -math.rad(45)*i)
			weld.Arm.Right.C1=CFrame.new(1.5, .5, 0)*CFrame.Angles(math.rad(225)*i, 0, math.rad(45)*i)
			weld.Leg.Left.C1=CFrame.new(-.5, -1.5, 0)*CFrame.Angles(-math.rad(45)*i, 0, -math.rad(45)*i)
			weld.Leg.Right.C1=CFrame.new(.5, -1.5, 0)*CFrame.Angles(-math.rad(45)*i, 0, math.rad(45)*i)
		end
		bp:remove()
		human.WalkSpeed=wspeed
	end,
	["Storm"]=function(mouse)
		local bp=Instance.new("BodyPosition", torso) bp.maxForce=Vector3.new(0, math.huge, 0) bp.position=torso.Position+Vector3.new(0, 20, 0)
		for i=0, 1, .1 do
			wait()
			torso.CFrame=torso.CFrame*CFrame.Angles(-math.rad(45)*i, 0, 0)
			weld.Head.C1=CFrame.new(0, 1.5, 0)*CFrame.Angles(math.rad(45)*i, 0, 0)
			weld.Arm.Left.C1=CFrame.new(-1.5, .5, 0)*CFrame.Angles(0, -math.rad(90)*i, -math.rad(90)*i)
			weld.Arm.Right.C1=CFrame.new(1.5, .5, 0)*CFrame.Angles(0, math.rad(90)*i, math.rad(90)*i)
			weld.Leg.Left.C1=CFrame.new(-.5, -1.5, 0)*CFrame.Angles(-math.rad(45)*i, 0, -math.rad(45)*i)
			weld.Leg.Right.C1=CFrame.new(.5, -1.5, 0)*CFrame.Angles(-math.rad(45)*i, 0, math.rad(45)*i)
		end
		for i=1, 50 do
			wait(speed)
			computePos(torso.CFrame.p, mouse.Hit.p)
			torso.CFrame=torso.CFrame+torso.CFrame.lookVector*.5
			ray(arm.Left.Position, mouse.Hit.p+Vector3.new(math.random(-2, 2), math.random(2, 5), math.random(-2, 2)))
			ray(arm.Right.Position, mouse.Hit.p+Vector3.new(math.random(-2, 2), math.random(2, 5), math.random(-2, 2)))
		end
		for i=1, 0, -.1 do
			wait()
			weld.Head.C1=CFrame.new(0, 1.5, 0)*CFrame.Angles(math.rad(45)*i, 0, 0)
			weld.Arm.Left.C1=CFrame.new(-1.5, .5, 0)*CFrame.Angles(0, -math.rad(90)*i, -math.rad(90)*i)
			weld.Arm.Right.C1=CFrame.new(1.5, .5, 0)*CFrame.Angles(0, math.rad(90)*i, math.rad(90)*i)
			weld.Leg.Left.C1=CFrame.new(-.5, -1.5, 0)*CFrame.Angles(-math.rad(45)*i, 0, -math.rad(45)*i)
			weld.Leg.Right.C1=CFrame.new(.5, -1.5, 0)*CFrame.Angles(-math.rad(45)*i, 0, math.rad(45)*i)
		end
		bp:remove()
	end
}

function keyDown(key, mouse)
	if key==" "  then
		--JMUP--
		if ksDeb==true then
			local fakeP=add.Part(workspace, true, false, "White", 0, Vector3.new(2, 2, 2), CFrame.new((torso.CFrame*CFrame.new(0, -4, 0)).p, torso.CFrame.p)*CFrame.Angles(math.rad(90), 0, 0))
			local mesh=add.Mesh("SpecialMesh", fakeP, Vector3.new(1, 1, 1), nil, "File") mesh.MeshId="http://www.roblox.com/asset/?id=20329976"
			c(function()
				for i=0, 1, .1 do
					wait()
					fakeP.Mesh.Scale=fakeP.Mesh.Scale+Vector3.new(i, 0, i)
					fakeP.Transparency=i
				end
				fakeP:remove()
			end)
			for i, v in pairs(char:children()) do
				if v:isA("BasePart") then
					local cloned=v:clone()
					cloned.Parent=workspace
					cloned.Anchored=true
					cloned.CFrame=v.CFrame
					cloned.CanCollide=false
					c(function()
						for i=1, 0, -.1 do
							wait()
							cloned.Transparency=1-i
						end
						cloned:remove()
					end)
				end
			end
			torso.CFrame=torso.CFrame*CFrame.new(0, 10, 0)
		end
	end
	if key=="e" and kDeb==false then kDeb=true moves.GatlingGun(mouse) kDeb=false end
	if key=="r" and kDeb==false then kDeb=true moves.Bazooka(mouse) kDeb=false end
	if key=="t" and kDeb==false then kDeb=true moves.Hanabi() kDeb=false end
	if key=="y" and kDeb==false then kDeb=true moves.Storm(mouse) kDeb=false end
	if key=="z" and ksDeb==false then ksDeb=true specials.Gear2nd() ksDeb=false end
end
function button1down()
	if ksDeb==true then
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
		for i, v in pairs(char:children()) do
			if v:isA("BasePart") then
				local cloned=v:clone()
				cloned.Parent=workspace
				cloned.Anchored=true
				cloned.CFrame=v.CFrame
				cloned.CanCollide=false
				c(function()
					for i=1, 0, -.1 do
						wait()
						cloned.Transparency=1-i
					end
					cloned:remove()
				end)
			end
		end
		torso.CFrame=torso.CFrame+torso.CFrame.lookVector*10
	end
end

human.Running:connect(function(s)
	if s>2 and kDeb==false then
		for i=0, 1, .1 do
			wait()
			weld.Arm.Left.C1=CFrame.new(-1.5, .5, 0)*CFrame.Angles(-math.rad(45)*i, 0, -math.rad(45)*i)
			weld.Arm.Right.C1=CFrame.new(1.5, .5, 0)*CFrame.Angles(-math.rad(45)*i, 0, math.rad(45)*i)
			weld.Leg.Left.C1=CFrame.new(-.5, -1.5, 0)*CFrame.Angles(0, 0, -math.rad(5)*i)
			weld.Leg.Right.C1=CFrame.new(.5, -1.5, 0)*CFrame.Angles(0, 0, math.rad(5)*i)
		end
	elseif kDeb==false then
		for i=1, 0, -.1 do
			wait()
			weld.Arm.Left.C1=CFrame.new(-1.5, .5, 0)*CFrame.Angles(-math.rad(45)*i, 0, -math.rad(45)*i)
			weld.Arm.Right.C1=CFrame.new(1.5, .5, 0)*CFrame.Angles(-math.rad(45)*i, 0, math.rad(45)*i)
			weld.Leg.Left.C1=CFrame.new(-.5, -1.5, 0)*CFrame.Angles(0, 0, -math.rad(5)*i)
			weld.Leg.Right.C1=CFrame.new(.5, -1.5, 0)*CFrame.Angles(0, 0, math.rad(5)*i)
		end
	end
end)

bin.Selected:connect(function(mouse)
	mouse.keyDown:connect(function(k) keyDown(k, mouse) end)
	mouse.Button1Down:connect(button1down)
end)