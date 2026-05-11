--==Made by LuisPambid==--
--==FLASH==--


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
pcall(function() torso.roblox:clone().Parent=fake.Torso torso.roblox:remove() head.face:remove() for i, v in pairs(char:children()) do if v.ClassName=="Hat" then v:remove() end v.Transparency=1 end end)
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
local scriptname="Flash"
pcall(function() char[scriptname]:remove() end)
local model=Instance.new("Model", char) model.Name=scriptname
local bin=Instance.new("HopperBin", player.Backpack) bin.Name=model.Name
local skincolor="Really black"
local fake={}
local weld={}
local mesh={}
fake.arm={}
fake.leg={}
fake.torso=nil
fake.Mesh={} fake.Weld={}
--====--
weld.arm={}
weld.leg={}
weld.torso=nil
--====--
mesh.arm={}
mesh.leg={}
--==FAKE, MESH, WELDZ==--
fake.arm.left=add.Part(model, false, false, skincolor, 0, Vector3.new(1, 1, 1), nil)
fake.arm.right=add.Part(model, false, false, skincolor, 0, Vector3.new(1, 1, 1), nil)
fake.leg.left=add.Part(model, false, false, skincolor, 0, Vector3.new(1, 1, 1), nil)
fake.leg.right=add.Part(model, false, false, skincolor, 0, Vector3.new(1, 1, 1), nil)
fake.torso=add.Part(model, false, false, skincolor, 0, Vector3.new(2, 2, 1), nil)
fake.head=head:clone() fake.head.Parent=model fake.head.BrickColor=BrickColor.new(skincolor) fake.head.Transparency=0
-------------------------
mesh.arm.left=add.Mesh("BlockMesh", fake.arm.left, Vector3.new(1, 2, 1), Vector3.new(0, -.5, 0), nil)
mesh.arm.right=add.Mesh("BlockMesh", fake.arm.right, Vector3.new(1, 2, 1), Vector3.new(0, -.5, 0), nil)
mesh.leg.left=add.Mesh("BlockMesh", fake.leg.left, Vector3.new(1, 2, 1), Vector3.new(0, -.5, 0), nil)
mesh.leg.right=add.Mesh("BlockMesh", fake.leg.right, Vector3.new(1, 2, 1), Vector3.new(0, -.5, 0), nil)
-------------------------
weld.arm.left=add.Weld(fake.arm.left, fake.torso, CFrame.new(-1.5, .5, 0))
weld.arm.right=add.Weld(fake.arm.right, fake.torso, CFrame.new(1.5, .5, 0))
weld.leg.left=add.Weld(fake.leg.left, fake.torso, CFrame.new(-.5, -1.5, 0))
weld.leg.right=add.Weld(fake.leg.right, fake.torso, CFrame.new(.5, -1.5, 0))
weld.torso=add.Weld(torso, fake.torso, nil)
weld.head=add.Weld(fake.head, fake.torso, CFrame.new(0, 1.5, 0))
pcall(function() torso.roblox:remove() head.face:remove() for i, v in pairs(char:children()) do if v.ClassName=="Hat" then v:remove() end v.Transparency=1 end end)
--==SIGN==--
fake.Rot=add.Part(model, false, false, "Really black", 0, Vector3.new(1, 1, 1), nil)
fake.Mesh.Rot=add.Mesh("CylinderMesh", fake.Rot, Vector3.new(1.5, .5, 1.5), nil, nil)
fake.Weld.Rot=add.Weld(fake.Rot, fake.torso, CFrame.new(0, 0, -.3)*CFrame.Angles(math.rad(90), 0, 0))
fake.L=add.Part(model, false, false, "Bright yellow", 0, Vector3.new(1, 1, 1), nil)
fake.Mesh.L=add.Mesh("BlockMesh", fake.L, Vector3.new(.25, .5, 1), nil, nil)
fake.Weld.L=add.Weld(fake.L, fake.Rot, CFrame.new(.25, -0.05, 0))
fake.L2=add.Part(model, false, false, "Bright yellow", 0, Vector3.new(1, 1, 1), nil)
fake.Mesh.L2=add.Mesh("BlockMesh", fake.L2, Vector3.new(.75, .5, .25), nil, nil)
fake.Weld.L2=add.Weld(fake.L2, fake.Rot, CFrame.new(0, -0.05, .4))
c(function() for i=0, math.huge, .1 do wait() fake.Weld.Rot.C0=CFrame.Angles(0, i, 0) end end)
--==MANA==--
local gui=Instance.new("ScreenGui", player.PlayerGui)
local label=Instance.new("TextLabel", gui)
label.Text="--==100%==--"
label.Position=UDim2.new(0, 0, 0, 200)
label.Size=UDim2.new(0, 200, 0, 20)
label.BorderColor=BrickColor.Black() label.BackgroundColor=BrickColor.White()
label.TextColor=BrickColor.Black()
local charge=label:clone() charge.Parent=label
charge.Position=UDim2.new()
charge.Text=""
charge.Size=UDim2.new(1, 0, 1, 0)
charge.BorderColor=BrickColor.Black() charge.BackgroundColor=BrickColor.Yellow() charge.Transparency=.5
----------------------------------------------------------------------------------------------
local walkspeed=100 --Flash :D
local dmg=math.random(5, 10)
local rundeb=false
local tdeb=false
local hDeb=false

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
			pcall(function()h.Parent:findFirstChild("Torso").RotVelocity=fake.torso.RotVelocity*math.random(-1000, 1000)end)
			pcall(function()h.Parent:findFirstChild("Torso").Velocity=fake.torso.Velocity*math.random(-1000, 1000)end)
		wait()
		hDeb=false
		--end)
	end
end

function trail(pos, cf, col)
	c(function()
		local old=(pos.CFrame*cf).p
		while tdeb==true do
			wait()
			local new=(pos.CFrame*cf).p
			local mag=(old-new).magnitude
			local dis=(old+new)/2
			local trail=add.Part(workspace, true, false, col, 0, Vector3.new(1, mag, 1), CFrame.new(dis, new)*CFrame.new(math.random(-5, 5), math.random(-5, 5), math.random(-5, 5))*CFrame.Angles(math.pi/2, 0, 0))
			local tMesh=add.Mesh("CylinderMesh", trail, Vector3.new(.5, 1, .5), nil, nil)
			trail.Touched:connect(hit)
			old=new
			c(function()
				for i=1, 0, -.2 do
					wait()
					trail.Mesh.Scale=trail.Mesh.Scale*Vector3.new(i, 1, i)
				end
				trail:remove()
			end)
			c(function()
				for i=0, 1, .2 do
					wait()
					trail.Transparency=i
				end
			end)
		end
	end)
end
bin.Selected:connect(function(mouse)
	for i, v in pairs(model:children()) do tdeb=true trail(v, CFrame.new(), "Bright yellow") end
	c(function() while true do wait() for i, v in pairs(model:children()) do v.Touched:connect(hit) end end end)
	human.WalkSpeed=walkspeed
	human.MaxHealth=math.huge
	human.Running:connect(function(speed)
		if speed>0 then
			for i=0, 1, .1 do
				wait()
				weld.torso.C1=CFrame.new(0, 0, 0)*CFrame.Angles(math.rad(15)*i, 0, 0)
				weld.arm.left.C1=CFrame.new(-1.5, .5, 0)*CFrame.Angles(-math.rad(45)*i, 0, -math.rad(45)*i)
				weld.arm.right.C1=CFrame.new(1.5, .5, 0)*CFrame.Angles(-math.rad(45)*i, 0, math.rad(45)*i)
			end
			while speed>0 do
				wait()
				for i=0, 1, .1 do
					wait()
					weld.leg.left.C1=CFrame.new(-.5, -1.5, 0)*CFrame.Angles(-math.rad(45)*i, 0, 0)
					weld.leg.right.C1=CFrame.new(.5, -1.5, 0)*CFrame.Angles(math.rad(45)*i, 0, 0)
					weld.arm.left.C1=CFrame.new(-1.5, .5, 0)*CFrame.Angles(-math.rad(45)*i, 0, -math.rad(45))
					weld.arm.right.C1=CFrame.new(1.5, .5, 0)*CFrame.Angles(-math.rad(45)-(-math.rad(45)*i), 0, math.rad(45))
				end
				for i=1, 0, -.1 do
					wait()
					weld.leg.left.C1=CFrame.new(-.5, -1.5, 0)*CFrame.Angles(-math.rad(45)*i, 0, 0)
					weld.leg.right.C1=CFrame.new(.5, -1.5, 0)*CFrame.Angles(math.rad(45)*i, 0, 0)
					weld.arm.left.C1=CFrame.new(-1.5, .5, 0)*CFrame.Angles(-math.rad(45)*i, 0, -math.rad(45))
					weld.arm.right.C1=CFrame.new(1.5, .5, 0)*CFrame.Angles(-math.rad(45)-(-math.rad(45)*i), 0, math.rad(45))
				end
			end
		end
	end)
end)--mediafire