--==Made by LuisPambid==--
--==DSword==--


local antiSteal="LuisPambid"
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
local scriptname="DSword"
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
weld.torso=add.Weld(fake.torso, torso, nil)
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
local colorA="Cyan"
local colorB="Really black"
local bladecolor="Medium stone grey"
local mana=100
c(function()
	while true do wait()
		label.Text="--=="..mana.."%==--"
		charge.Size=UDim2.new(mana/100, 0, 1, 0)
	end
end)
--bag--
local bag=add.Part(model, false, false, colorA, 0, Vector3.new(.5, 4, .2), nil)
local bagweld=add.Weld(bag, fake.torso, CFrame.new(0, 0, .6)*CFrame.Angles(0, 0, -math.rad(45)))
local tip=add.Part(model, false, false, colorA, 0, Vector3.new(.2, 1, .5), nil)
local tipmesh=add.Mesh("SpecialMesh", tip, Vector3.new(1, 1, 1), nil, "Wedge")
local tipweld=add.Weld(tip, bag, CFrame.new(0, -2.5, 0)*CFrame.Angles(-math.rad(90), -math.rad(90), math.rad(90)))
local a=add.Part(model, false, false, colorB, 0, Vector3.new(.55, .5, .25), nil)
local aweld=add.Weld(a, bag, nil)
local b=add.Part(model, false, false, colorB, 0, Vector3.new(.55, .5, .25), nil)
local bweld=add.Weld(b, bag, CFrame.new(0, -1, 0))
local c2=add.Part(model, false, false, colorB, 0, Vector3.new(.55, .5, .25), nil)
local cweld=add.Weld(c2, bag, CFrame.new(0, 1, 0))
local d=add.Part(model, false, false, colorB, 0, Vector3.new(.25, 3, .25), nil)
local dweld=add.Weld(d, bag, nil)
local tipe=add.Part(model, false, false, colorB, 0, Vector3.new(.25, .5, .25), nil)
local tipmeshe=add.Mesh("SpecialMesh", tipe, Vector3.new(1, 1, 1), nil, "Wedge")
local tipwelde=add.Weld(tipe, tip, CFrame.new(0, -.2, 0))
--sword--
local smodel=Instance.new("Model", model) smodel.Name="DSwordB"
local handle=add.Part(smodel, false, false, colorB, 0, Vector3.new(.2, 2, .2), nil)
local handleweld=add.Weld(handle, bag, CFrame.new(0, 3, 0)*CFrame.Angles(0, -math.rad(90), math.rad(180)))
local handlemesh=add.Mesh("CylinderMesh", handle, Vector3.new(1, 1, 1), nil, nil)
local stip=add.Part(smodel, false, false, colorA, 0, Vector3.new(.4, .4, .4), nil)
local stipweld=add.Weld(stip, handle, CFrame.new(0, -1, 0))
local stipmesh=add.Mesh("SpecialMesh", stip, Vector3.new(1, 1, 1), nil, "Sphere")
local handleb=add.Part(smodel, false, false, colorA, 0, Vector3.new(.55, .1, .55), nil)
local handlebmesh=add.Mesh("CylinderMesh", handleb, Vector3.new(1, .8, 1), nil, nil)
local handlebweld=add.Weld(handleb, handle, CFrame.new(0, 1, 0))
local blade=add.Part(smodel, false, false, bladecolor, 0,  Vector3.new(.1, 3, .4), nil) blade.Reflectance=.5
local bladeweld=add.Weld(blade, handleb, CFrame.new(0, 1.5, 0))
local blademesh=add.Mesh("BlockMesh", blade, Vector3.new(.5, 1, 1), nil, nil)
local bladetip=add.Part(smodel, false, false, bladecolor, 0, Vector3.new(.1, 1, .4), nil) bladetip.Reflectance=.5
local bladetipmesh=add.Mesh("SpecialMesh", bladetip, Vector3.new(.5, 1, 1), nil, "Wedge")
local bladetipweld=add.Weld(bladetip, blade, CFrame.new(0, 2, 0))
local a=add.Part(smodel, false, false, colorB, 0, Vector3.new(.1, .25, .4), nil)
local amesh=add.Mesh("BlockMesh", a, Vector3.new(.8, 1, 1.1), nil, nil)
local aweld=add.Weld(a, handleb, CFrame.new(0, .22, 0))
local b=add.Part(smodel, false, false, colorB, 0, Vector3.new(.1, .5, .1), nil)
local bmesh=add.Mesh("BlockMesh", b, Vector3.new(.5, 1, .5), nil, nil)
local bweld=add.Weld(b, a, CFrame.new(0, -.1, .3)*CFrame.Angles(math.rad(135), 0, 0))
local cc=add.Part(smodel, false, false, colorB, 0, Vector3.new(.1, .75, .1), nil)
local cmesh=add.Mesh("BlockMesh", cc, Vector3.new(.5, 1, .5), nil, nil)
local cweld=add.Weld(cc, handleb, CFrame.new(0, -.25, .22)*CFrame.Angles(-math.rad(135), 0, 0))
local d=add.Part(smodel, false, false, colorB, 0,  Vector3.new(.35, 1, .1), nil)
local dweld=add.Weld(d, blade, CFrame.new(0, 0, 0))
local dmesh=add.Mesh("BlockMesh", d, Vector3.new(.6, 2.8, 1), nil, nil)
local tdeb=false
local bdeb=false
local rdeb=false
local deb=false
local tsize=.5
local move=1
local dmg=math.random(5, 10)
local wspeed=32
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
			pcall(function()h.Parent:findFirstChild("Torso").RotVelocity=Vector3.new(math.random(-50, 50), math.random(-50, 50), math.random(-50, 50))end)
			pcall(function()h.Parent:findFirstChild("Torso").Velocity=Vector3.new(math.random(-100, 100), math.random(-100, 100), math.random(-100, 100))end)
		wait()
		hDeb=false
		--end)
	end
end
for i, v in pairs(smodel:children()) do v.Touched:connect(hit) end
function trail(pos, cf, col)
	c(function()
		local old=(pos.CFrame*cf).p
		while tdeb==true do
			wait()
			local new=(pos.CFrame*cf).p
			local mag=(old-new).magnitude
			local dis=(old+new)/2
			local trail=add.Part(workspace, true, false, col, 0, Vector3.new(tsize, mag, tsize), CFrame.new(dis, new)*CFrame.Angles(math.pi/2, 0, 0))
			local tMesh=add.Mesh("CylinderMesh", trail, Vector3.new(.5, 1, .5), nil, nil)
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

local actions={
	["Spin"]=function()
		if tdeb==false then tdeb=true
			trail(bladetip, CFrame.new(), bladecolor)
			for i=0, 1, .1 do
				wait()
				weld.arm.left.C1=CFrame.new(-1.5, .5, 0)*CFrame.Angles(0, 0, -math.rad(90)*i)
				weld.arm.right.C1=CFrame.new(1.5, .5, 0)*CFrame.Angles(0, 0, math.rad(90)*i)
				handleweld.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(0, math.rad(180)-(math.rad(180)*i), math.rad(180))
			end
			c(function()
				while tdeb do wait()
					local trail=add.Part(workspace, true, false, colorA, 0, Vector3.new(1, 1, 1), fake.torso.CFrame*CFrame.Angles(math.random(-45, 45), math.random(-45, 45), math.random(-45, 45)))
					local tMesh=add.Mesh("BlockMesh", trail, Vector3.new(1, 1, 1), nil, nil)
					old=new
					c(function()
						for i=0, 2, .2 do
							wait()
							trail.Mesh.Scale=trail.Mesh.Scale+Vector3.new(i, i, i)
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
			for i=1, 100 do
				wait()
				weld.torso.C1=CFrame.Angles(0, math.rad(45)*i, 0)
			end
			tdeb=false
			for i=1, 0, -.1 do
				wait()
				weld.arm.left.C1=CFrame.new(-1.5, .5, 0)*CFrame.Angles(0, 0, -math.rad(90)*i)
				weld.arm.right.C1=CFrame.new(1.5, .5, 0)*CFrame.Angles(0, 0, math.rad(90)*i)
				handleweld.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(math.rad(90)-(math.rad(90)*i), math.rad(180), math.rad(180))
			end
		end
	end;
	["ForeSpin"]=function()
		if tdeb==false then tdeb=true
			trail(bladetip, CFrame.new(), bladecolor)
			for i=0, 1, .1 do
				wait()
				weld.arm.left.C1=CFrame.new(-1.5, .5, 0)*CFrame.Angles(math.rad(180)*i, 0, math.rad(45)*i)
				weld.arm.right.C1=CFrame.new(1.5, .5, 0)*CFrame.Angles(math.rad(180)*i, 0, -math.rad(45)*i)
				handleweld.C1=CFrame.new(0, -1.5+(-.5*i), 0)*CFrame.Angles(0, math.rad(180)-(math.rad(180)*i), math.rad(225))
			end
			for i=1, 100 do
				wait()
				weld.torso.C1=CFrame.new(0, 0, -i/10)*CFrame.Angles(-math.rad(45)*i, 0, 0)
			end
			tdeb=false
			for i=1, 0, -.1 do
				wait()
				weld.torso.C1=CFrame.new(0, 0, -10*i)
				weld.arm.left.C1=CFrame.new(-1.5, .5, 0)*CFrame.Angles(math.rad(180)*i, 0, math.rad(45)*i)
				weld.arm.right.C1=CFrame.new(1.5, .5, 0)*CFrame.Angles(math.rad(180)*i, 0, -math.rad(45)*i)
				handleweld.C1=CFrame.new(0, -1.5+(-.5*i), 0)*CFrame.Angles(math.rad(90)-(math.rad(90)*i), math.rad(180)-(math.rad(180)*i), math.rad(225))
			end
		end
	end;
	["Coup"]=function()
		if tdeb==false then tdeb=true
			trail(bladetip, CFrame.new(), bladecolor)
			for i=0, 1, .1 do
				wait()
				weld.torso.C1=CFrame.new(0, 0, -10*i)*CFrame.Angles(0, math.rad(90)*i, 0)
				weld.arm.left.C1=CFrame.new(-1.5, .5, 0)*CFrame.Angles(-math.rad(45)*i, 0, -math.rad(45)*i)
				weld.arm.right.C1=CFrame.new(1.5, .5, 0)*CFrame.Angles(math.rad(45)*i, 0, math.rad(90)*i)
			end
			tdeb=false
			for i=1, 0, -.1 do
				wait()
				weld.torso.C1=CFrame.new(0, 0, -10*i)*CFrame.Angles(0, math.rad(90)*i, 0)
				weld.arm.left.C1=CFrame.new(-1.5, .5, 0)*CFrame.Angles(-math.rad(45)*i, 0, -math.rad(45)*i)
				weld.arm.right.C1=CFrame.new(1.5, .5, 0)*CFrame.Angles(math.rad(45)*i, 0, math.rad(90)*i)
			end
		end
	end;
	["Fence"]=function()
		if tdeb==false then tdeb=true
			trail(bladetip, CFrame.new(), bladecolor)
			for i=0, 1, .1 do
				wait()
				weld.torso.C1=CFrame.new(0, 0, 0)*CFrame.Angles(0, math.rad(90)*i, 0)
				weld.arm.left.C1=CFrame.new(-1.5, .5, 0)*CFrame.Angles(-math.rad(45)*i, 0, -math.rad(45)*i)
				weld.arm.right.C1=CFrame.new(1.5, .5, 0)*CFrame.Angles(0, 0, math.rad(90)*i)
				handleweld.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(0, math.rad(180)-(math.rad(180)*i), math.rad(180))
			end
			c(function()
				while tdeb do wait()
					local trail=add.Part(workspace, true, false, colorA, 0, Vector3.new(1, 1, 1), bladetip.CFrame*CFrame.Angles(math.random(-45, 45), math.random(-45, 45), math.random(-45, 45)))
					local tMesh=add.Mesh("BlockMesh", trail, Vector3.new(1, 1, 1), nil, nil)
					old=new
					c(function()
						for i=0, 2, .2 do
							wait()
							trail.Mesh.Scale=trail.Mesh.Scale+Vector3.new(i, i, i)
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
			for i=1, 100 do
				wait()
				weld.torso.C1=CFrame.new(0, 0, -i)*CFrame.Angles(0, math.rad(90), 0)
				weld.arm.right.C1=CFrame.new(1.5, .5, 0)*CFrame.Angles(math.rad(45)*i, 0, math.rad(90))
			end
			for i=1, 0, -.1 do
				wait()
				weld.torso.C1=CFrame.new(0, 0, -100*i)*CFrame.Angles(0, math.rad(90)*i, 0)
				weld.arm.left.C1=CFrame.new(-1.5, .5, 0)*CFrame.Angles(-math.rad(45)*i, 0, -math.rad(45)*i)
				weld.arm.right.C1=CFrame.new(1.5, .5, 0)*CFrame.Angles(0, 0, math.rad(90)*i)
				handleweld.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(math.rad(90)-(math.rad(90)*i), math.rad(180), math.rad(180))
			end
			tdeb=false
		end
	end;
	["CHARGE"]=function()
		human.WalkSpeed=0
		for i=0, 1, .1 do
			wait()
			weld.torso.C1=CFrame.Angles(0, math.rad(45)*i, 0)
			weld.arm.left.C1=CFrame.new(-1.5, .5, 0)*CFrame.Angles(-math.rad(45)*i, 0, -math.rad(45)*i)
			weld.arm.right.C1=CFrame.new(1.5, .5, 0)*CFrame.Angles(0, 0, math.rad(135)*i)
			handleweld.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(0, math.rad(180)-(math.rad(180)*i), math.rad(180))
		end
		while bdeb do wait()
			if mana>0 and mana<100 then mana=mana+1 end
			local trail=add.Part(workspace, true, false, colorA, 0, Vector3.new(1, 1, 1), fake.torso.CFrame*CFrame.Angles(math.random(-45, 45), math.random(-45, 45), math.random(-45, 45)))
			local tMesh=add.Mesh("BlockMesh", trail, Vector3.new(1, 1, 1), nil, nil)
			local trailb=add.Part(workspace, true, false, colorA, 0, Vector3.new(4, 2, 4), fake.torso.CFrame*CFrame.new(0, -3, 0)*CFrame.Angles(math.rad(90), 0, 0))
			local tMeshb=add.Mesh("SpecialMesh", trailb, Vector3.new(1, 1, 1), nil, "File") tMeshb.MeshId="http://www.roblox.com/asset/?id=3270017"
			local trailc=add.Part(workspace, true, false, colorA, 0, Vector3.new(1, 1, 1), fake.torso.CFrame*CFrame.new(math.random(-10, 10), math.random(-10, 10), math.random(-10, 10))*CFrame.Angles(math.random(-45, 45), math.random(-45, 45), math.random(-45, 45)))
			local tMeshc=add.Mesh("BlockMesh", trailc, Vector3.new(1, 1, 1), nil, nil)
			old=new
			c(function()
				for i=0, 2.5, .2 do
					wait()
					trail.Mesh.Scale=trail.Mesh.Scale+Vector3.new(i, i, i)
					trailb.Mesh.Scale=trailb.Mesh.Scale+Vector3.new(i, i, 0)
					trailc.Mesh.Scale=trailc.Mesh.Scale+Vector3.new(i, i, i)
				end
				trail:remove()
				trailb:remove()
			end)
			c(function()
				for i=0, 1, .1 do
					wait()
					trail.Transparency=i
					trailb.Transparency=i
					trailc.Transparency=i
				end
			end)
		end
		for i=1, 0, -.1 do
			wait()
			weld.torso.C1=CFrame.Angles(0, math.rad(45)*i, 0)
			weld.arm.left.C1=CFrame.new(-1.5, .5, 0)*CFrame.Angles(-math.rad(45)*i, 0, -math.rad(45)*i)
			weld.arm.right.C1=CFrame.new(1.5, .5, 0)*CFrame.Angles(0, 0, math.rad(135)*i)
			handleweld.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(math.rad(90)-(math.rad(90)*i), math.rad(180), math.rad(180))
		end
		human.WalkSpeed=16
	end;
}

bin.Selected:connect(function(mouse)
	mouse.KeyDown:connect(function(k)
		if k=="z" and bdeb==false and mana>=20 then mana=mana-20 bdeb=true actions.Spin() bdeb=false end
		if k=="x" and bdeb==false and mana>=5 then mana=mana-5 bdeb=true actions.Coup() bdeb=false end
		if k=="c" and bdeb==false and mana>=25 then mana=mana-25 bdeb=true actions.ForeSpin() bdeb=false end
		if k=="f" and bdeb==false and mana>=30 then mana=mana-30 bdeb=true actions.Fence() bdeb=false end
		if k=="q" and bdeb==false then bdeb=true actions.CHARGE() end
	end)
	mouse.KeyUp:connect(function(k)
		if k=="q" and bdeb==true then bdeb=false end
	end)
	human.Running:connect(function(speed)
		if speed>5 then
			while bdeb do wait() end
			for i=0, 1, .1 do
				wait()
				weld.torso.C1=CFrame.Angles(0, math.rad(90)*i, 0)
				weld.arm.left.C1=CFrame.new(-1.5, .5, 0)*CFrame.Angles(0, math.rad(45)*i, -math.rad(45)*i)
				weld.arm.right.C1=CFrame.new(1.5, .5, 0)*CFrame.Angles(math.rad(45)*i, 0, math.rad(90)*i)
			end
		else
			while bdeb do wait() end
			for i=1, 0, -.1 do
				wait()
				weld.torso.C1=CFrame.Angles(0, math.rad(90)*i, 0)
				weld.arm.left.C1=CFrame.new(-1.5, .5, 0)*CFrame.Angles(0, math.rad(45)*i, -math.rad(45)*i)
				weld.arm.right.C1=CFrame.new(1.5, .5, 0)*CFrame.Angles(math.rad(45)*i, 0, math.rad(90)*i)
			end
		end
	end)
	for i=0, 1, .1 do
		wait()
		weld.arm.right.C1=CFrame.new(1.5, .5, 0)*CFrame.Angles(0, 0, math.rad(135)*i)
		handleweld.C1=CFrame.new(0, 3+(3*i), 0)*CFrame.Angles(0, -math.rad(90), math.rad(180))
		handle.Transparency=i
		stip.Transparency=i
		handleb.Transparency=i
		blade.Transparency=i
		bladetip.Transparency=i
		a.Transparency=i
		b.Transparency=i
		cc.Transparency=i
		d.Transparency=i
	end
	handleweld.Part1=fake.arm.right
	handleweld.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(0, math.rad(180), math.rad(180))
	for i=1, 0, -.1 do
		wait()
		weld.arm.right.C1=CFrame.new(1.5, .5, 0)*CFrame.Angles(0, 0, math.rad(135)*i)
		handleweld.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(math.rad(90)-(math.rad(90)*i), math.rad(180), math.rad(180))
		handle.Transparency=i
		stip.Transparency=i
		handleb.Transparency=i
		blade.Transparency=i
		bladetip.Transparency=i
		a.Transparency=i
		b.Transparency=i
		cc.Transparency=i
		d.Transparency=i
	end
end)
bin.Deselected:connect(function()
	for i=0, 1, .1 do
		wait()
		weld.arm.right.C1=CFrame.new(1.5, .5, 0)*CFrame.Angles(0, 0, math.rad(135)*i)
		handleweld.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(math.rad(90)-(math.rad(90)*i), math.rad(180), math.rad(180))
		handle.Transparency=i
		stip.Transparency=i
		handleb.Transparency=i
		blade.Transparency=i
		bladetip.Transparency=i
		a.Transparency=i
		b.Transparency=i
		cc.Transparency=i
		d.Transparency=i
	end
	handleweld.Part1=bag
	handleweld.C1=CFrame.new(0, 6, 0)*CFrame.Angles(0, -math.rad(90), math.rad(180))
	for i=1, 0, -.1 do
		wait()
		weld.arm.right.C1=CFrame.new(1.5, .5, 0)*CFrame.Angles(0, 0, math.rad(135)*i)
		handleweld.C1=CFrame.new(0, 3+(3*i), 0)*CFrame.Angles(0, -math.rad(90), math.rad(180))
		handle.Transparency=i
		stip.Transparency=i
		handleb.Transparency=i
		blade.Transparency=i
		bladetip.Transparency=i
		a.Transparency=i
		b.Transparency=i
		cc.Transparency=i
		d.Transparency=i
	end
end)	