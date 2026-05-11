--==Made by LuisPambid==--
--==Soul Solid==--


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
local scriptname="Soul Solid" --Name here
pcall(function() player.Backpack[scriptname]:remove() char[scriptname]:remove() char["Objects"]:remove() player.PlayerGui[scriptname]:remove()  end)
local model=Instance.new("Model", char) model.Name="Objects"
local modelB=Instance.new("Model", char) modelB.Name=scriptname
local gui=Instance.new("ScreenGui", player.PlayerGui) gui.Name=scriptname
local bin=Instance.new("HopperBin", player.Backpack) bin.Name=scriptname
local skincolor="New Yeller"
local suitcolor="Really black"
local body={}
local animate={}
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
	body.TorsoW=add.Weld(body.Torso, torso, nil)
	body.ArmLeftW, body.ArmRightW=add.Weld(body.ArmLeft, body.Torso, CFrame.new(-1.5, .5, 0)), add.Weld(body.ArmRight, body.Torso, CFrame.new(1.5, .5, 0))
	body.LegLeftW, body.LegRightW=add.Weld(body.LegLeft, body.Torso, CFrame.new(-.5, -1.5, 0)), add.Weld(body.LegRight, body.Torso, CFrame.new(.5, -1.5, 0))
	--==MESHES==--
	add.Mesh("BlockMesh", body.ArmLeft, Vector3.new(1, 2, 1), Vector3.new(0, -.5, 0), nil)
	add.Mesh("BlockMesh", body.ArmRight, Vector3.new(1, 2, 1), Vector3.new(0, -.5, 0), nil)
	add.Mesh("BlockMesh", body.LegLeft, Vector3.new(1, 2, 1), Vector3.new(0, -.5, 0), nil)
	add.Mesh("BlockMesh", body.LegRight, Vector3.new(1, 2, 1), Vector3.new(0, -.5, 0), nil)
	---------------------------------------------------------------------------------------
	animate={
		["Head"]=function(cf) p(function() for i, v in pairs(model:children()) do v.Transparency=0 end end)
			body.HeadW.C1=CFrame.new(0, 1.5, 0)*cf
		end;
		["Torso"]=function(cf) p(function() for i, v in pairs(model:children()) do v.Transparency=0 end end)
			body.TorsoW.C1=cf
		end;
		["ArmLeft"]=function(cf) p(function() for i, v in pairs(model:children()) do v.Transparency=0 end end)
			body.ArmLeftW.C1=CFrame.new(-1.5, .5, 0)*cf
		end;
		["ArmRight"]=function(cf) p(function() for i, v in pairs(model:children()) do v.Transparency=0 end end)
			body.ArmRightW.C1=CFrame.new(1.5, .5, 0)*cf
		end;
		["LegLeft"]=function(cf) p(function() for i, v in pairs(model:children()) do v.Transparency=0 end end)
			body.LegLeftW.C1=CFrame.new(-.5, -1.5, 0)*cf
		end;
		["LegRight"]=function(cf) p(function() for i, v in pairs(model:children()) do v.Transparency=0 end end)
			body.LegRightW.C1=CFrame.new(.5, -1.5, 0)*cf
		end;
	}
	--==Objects==--
	--Suit--
	obj.ArmLeft, obj.ArmRight=add.Part(model, false, false, suitcolor, 0, Vector3.new(1, 1, 1), nil), add.Part(model, false, false, suitcolor, 0, Vector3.new(1, 1, 1), nil)
	obj.ArmLeftW, obj.ArmRightW=add.Weld(obj.ArmLeft, body.ArmLeft, nil), add.Weld(obj.ArmRight, body.ArmRight, nil)
	obj.LegLeft, obj.LegRight=add.Part(model, false, false, suitcolor, 0, Vector3.new(1, 1, 1), nil), add.Part(model, false, false, suitcolor, 0, Vector3.new(1, 1, 1), nil)
	obj.LegLeftW, obj.LegRightW=add.Weld(obj.LegLeft, body.LegLeft, nil), add.Weld(obj.LegRight, body.LegRight, nil)
	obj.Torso=add.Part(model, false, false, suitcolor, 0, Vector3.new(2, 2, 1), nil)
	obj.TorsoW=add.Weld(obj.Torso, body.Torso, nil)
	add.Mesh("BlockMesh", obj.ArmLeft, Vector3.new(1.1, 1.6, 1.1), Vector3.new(0, -.25, 0), nil)
	add.Mesh("BlockMesh", obj.ArmRight, Vector3.new(1.1, 1.6, 1.1), Vector3.new(0, -.25, 0), nil)
	add.Mesh("BlockMesh", obj.LegLeft, Vector3.new(1.1, 1.6, 1.1), Vector3.new(0, -.25, 0), nil)
	add.Mesh("BlockMesh", obj.LegRight, Vector3.new(1.1, 1.6, 1.1), Vector3.new(0, -.25, 0), nil)
	add.Mesh("BlockMesh", obj.Torso, Vector3.new(1.05, 1.05, 1.05), nil, nil)
	---------------------------------------------------------------------------------------
	obj.Handle=add.Part(modelB, false, false, "Really black", 0, Vector3.new(.25, 2, .25), nil)
	obj.HandleW=add.Weld(obj.Handle, body.ArmRight, CFrame.new(0, -1.5, 0)*CFrame.Angles(-math.rad(90), 0, 0))
	for i=1, 5 do
		obj.Design=add.Part(modelB, false, false, "White", 0, Vector3.new(.3, .1, .1), nil)
		obj.DesignW=add.Weld(obj.Design, obj.Handle, CFrame.new(0, -1+i/3, 0)*CFrame.Angles(math.rad(45), 0, 0))
	end
	--SEALS--
	obj.Seal=add.Part(modelB, false,false, "White", 0, Vector3.new(.2, .2, .2), nil)
	obj.SealM=add.Mesh("BlockMesh", obj.Seal, Vector3.new(.2, .5, 1), nil, nil)
	obj.SealW=add.Weld(obj.Seal, obj.Handle, CFrame.new(0, -1.15, .1))
	obj.Seal2=add.Part(modelB, false,false, "White", 0, Vector3.new(.2, .2, .2), nil)
	obj.Seal2M=add.Mesh("BlockMesh", obj.Seal2, Vector3.new(.25, 1, .5), nil, nil)
	obj.Seal2W=add.Weld(obj.Seal2, obj.Handle, CFrame.new(0, -1.1, 0))
	obj.Seal3=add.Part(modelB, false,false, "White", 0, Vector3.new(.3, 2, .2), nil)
	obj.Seal3M=add.Mesh("BlockMesh", obj.Seal3, Vector3.new(1, 1, .5), nil, nil)
	obj.Seal3W=add.Weld(obj.Seal3, obj.Handle, nil)
	---------------------------------------------------------------------------------------
	obj.Guard=add.Part(modelB, false, false, "Really black", 0, Vector3.new(.5, .2, .5), nil)
	obj.GuardW=add.Weld(obj.Guard, obj.Handle, CFrame.new(0, 1.1, 0))
	obj.GuardB=add.Part(modelB, false, false, "White", 0, Vector3.new(.25, .2, .3), nil)
	obj.GuardBM=add.Mesh("BlockMesh", obj.GuardB, Vector3.new(.5, 1, 1), nil, nil)
	obj.GuardBW=add.Weld(obj.GuardB, obj.Handle, CFrame.new(0, 1.25, 0))
	obj.Blade=add.Part(modelB, false, false, "Mid gray", 0, Vector3.new(.2, 4, .25), nil) obj.Blade.Reflectance=.5
	obj.BladeM=add.Mesh("BlockMesh", obj.Blade, Vector3.new(.5, 1, 1), nil, nil)
	obj.BladeW=add.Weld(obj.Blade, obj.Handle, CFrame.new(0, 3, 0))
	obj.Point=add.Wedge(modelB, false, false, "Mid gray", 0, Vector3.new(.2, 1, .25), nil) obj.Point.Reflectance=.5
	obj.PointM=add.Mesh("SpecialMesh", obj.Point, Vector3.new(.5, 1, 1), nil, "Wedge")
	obj.PointW=add.Weld(obj.Point, obj.Blade, CFrame.new(0, 2.5, 0)*CFrame.Angles(math.rad(0), 0, 0))
	--==Signature(L)==--
	obj.LH=add.Part(model, false, false, "White", 0, Vector3.new(.5, 1, .2), nil)
	obj.LHW=add.Weld(obj.LH, obj.ArmLeft, CFrame.new(-.4, -.25, -.2))
	obj.LH=add.Part(model, false, false, "White", 0, Vector3.new(.5, .2, .5), nil)
	obj.LHW=add.Weld(obj.LH, obj.ArmLeft, CFrame.new(-.4, -.65, 0))
end
function removeParts()
	p(function()
		for i, v in pairs(model:children()) do v:remove() end		for i, v in pairs(modelB:children()) do v:remove() end	for i, v in pairs(char:children()) do v.Transparency=0 end
	end)
end
--Variables--
local trailDeb=false
local running=false
local hitDeb=false
local attacking=false
local hitting=false
local shield=false
local keyDeb=false
local keyDeb2=false
local looping=false
local w, a, s, d=false, false, false, false
local combo=0
local speed=32
local attackspeed=.25
local dmg=math.random(5, 10)
local looping2=false
local rage=1
local Slash=add.Sound(torso, "rbxasset://sounds//swordslash.wav", 1, 1)
local Dash=add.Sound(torso, "http://www.roblox.com/asset/?id=22968437", 1, 1)
local Clang=add.Sound(torso, "http://www.roblox.com/asset/?id=11113679", 1, 1)
local Heal=add.Sound(torso, "http://www.roblox.com/asset/?id=2101144", 1, 1)
local Electricity=add.Sound(torso, "http://www.roblox.com/asset/?id=10756118", 1, 1)
local attackLabel=add.Gui("TextLabel", gui, "Really black", "Really black", "White", "Size18", "Dash(C)", 0, UDim2.new(0, 150, 0, 50), UDim2.new(0, 0, 0, 150))
local attackLabel2=add.Gui("TextLabel", attackLabel, "Really black", "Really black", "White", "Size18", "Block(V)", 0, UDim2.new(1, 0, 1, 0), UDim2.new(0, 0, 1, 0))
local attackLabel3=add.Gui("TextLabel", attackLabel2, "Really black", "Really black", "White", "Size18", "Jump(Space)", 0, UDim2.new(1, 0, 1, 0), UDim2.new(0, 0, 1, 0))
local attackLabel4=add.Gui("TextLabel", attackLabel3, "Really black", "Really black", "White", "Size18", "Regenerate(X)", 0, UDim2.new(1, 0, 1, 0), UDim2.new(0, 0, 1, 0))
local attackLabel5=add.Gui("TextLabel", attackLabel4, "Really black", "Really black", "White", "Size18", "Ultimate(Z)ON/OFF", 0, UDim2.new(1, 0, 1, 0), UDim2.new(0, 0, 1, 0))
function lightningGen(startPos, endPos)
	local magnitude=(startPos-endPos).magnitude
	local distance=(startPos+endPos)/2
	local pattern=add.Part(workspace, true, false, "White", 1, Vector3.new(.2, .2, magnitude), CFrame.new(distance, startPos)) pattern.Name="Effect"
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
		local lightning=add.Part(workspace, true, false, "Bright yellow", 0, Vector3.new(.2, .2, magnitude), CFrame.new(distance, startPosProx2)) lightning.Name="Effect"
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

function hit(h)
	if hitting==true and looping2==true and h.Parent:findFirstChild("Humanoid")==nil and h~=nil and h.Parent~=char and h.Parent~=model and h.Parent~=modelB and h.Name~="Effect" and h.Name~="Base" and hitDeb==false then hitDeb=true
		p(function() print("found")
			local pYPos=h.Position.y-(h.Size.y/2)
			local sYPos=obj.Blade.Position.y
			if sYPos<=pYPos or sYPos>=(pYPos+h.Size.y) then return end
			local p=h:clone() p.Parent=workspace p.Anchored=false p.CanCollide=true --p.Name="Effect"
			local p2=h:clone() p2.Parent=workspace p2.Anchored=false p2.CanCollide=true --p2.Name="Effect"
			h:remove()
			p.formFactor="Custom"
			p2.formFactor="Custom"
			p.Size=Vector3.new(h.Size.x, sYPos-pYPos, h.Size.z)
			p2.Size=Vector3.new(h.Size.x, p2.Size.y-(sYPos-pYPos), h.Size.z)
			p.CFrame=h.CFrame*CFrame.new(0, -p2.Size.y/2, 0)
			p2.CFrame=h.CFrame*CFrame.new(0, p.Size.y/2, 0)
			c(function() wait(2) 
			--[[p.Anchored=false p2.Anchored=false
				for i=0, 1, .05 do
					wait()
					p.Transparency=i p2.Transparency=i
				end]]
				p:remove() p2:remove()
			end)
		end)
		wait()
		hitDeb=false
	elseif hitting==true and game.Players[h.Parent.Name] and h.Parent~=char and hitDeb==false then hitDeb=true
		pcall(function()
			local hHuman=h.Parent:findFirstChild("Humanoid")
			hHuman.Health=hHuman.Health-dmg
			--[[for i=1, 5 do
				local spark=add.Part(workspace, true, false, "Bright yellow", 0, Vector3.new(.2, 1, .2), obj.Point.CFrame*CFrame.Angles(math.random(-45, 45), math.random(-45, 45), math.random(-45, 45))) spark.Name="Effect"
				local sparkM=add.Mesh("BlockMesh", spark, Vector3.new(.5, 1, .5), nil, nil)
				c(function()
					for i=0, 1, .05 do wait()
						spark.Transparency=i
					end spark:remove()
				end)
			end]]
			local fakeM=Instance.new("Model", workspace) fakeM.Name=dmg
			local fakeH=Instance.new("Humanoid", fakeM) fakeH.MaxHealth=0 fakeH.Health=0
			local effect=add.Part(fakeM, false, false, "Bright red", 0, Vector3.new(1, 1, 1), h.CFrame) effect.Name="Head"
			local fakeMesh=add.Mesh("CylinderMesh", effect, Vector3.new(1, .5, 1), nil, nil)
			local bp=Instance.new("BodyPosition", effect) bp.maxForce=Vector3.new(math.huge, math.huge, math.huge) bp.position=h.Position+Vector3.new(0, 4, 0)
			game.Debris:addItem(fakeM, 2)	
		end)
		wait(.2)
		hitDeb=false
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
			local trail=add.Part(workspace, true, false, "Pastel light blue", 0, Vector3.new(.2, mag, .2), CFrame.new(dis, new)*CFrame.Angles(math.pi/2, 0, 0)) trail.Name="Effect"
			trail.Touched:connect(hit)
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

function onRunning() while attacking or looping do wait() end
	if w or a or s or d then
		animate.ArmLeft(CFrame.Angles(0, 0, math.rad(-15)))
		animate.ArmRight(CFrame.Angles(0, 0, math.rad(15)))
		animate.LegLeft(CFrame.Angles(0, 0, math.rad(-5)))
		animate.LegRight(CFrame.Angles(0, 0, math.rad(5)))
	end
end

function doAttacks() combo=combo+1 rage=rage+1 print("Combo: "..combo)
	if attacking==false and looping==false then attacking=true
		if combo==1 then hitting=true Slash:play()
			for i, v in pairs(modelB:children()) do v.Touched:connect(hit) end
			for i=0, 1, attackspeed do wait()
				animate.Torso(CFrame.Angles(0, -math.rad(45)*i, 0))
				animate.ArmRight(CFrame.Angles(0, 0, math.rad(90)*i))
				obj.HandleW.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(-math.rad(90)-(math.rad(135)*i), 0, 0)
			end
			trailDeb=true	trail(obj.Point, CFrame.new(0, 1, 0))
			for i=0, 1, attackspeed do wait()
				animate.Torso(CFrame.Angles(0, -math.rad(45)-(-math.rad(135)*i), 0))
				obj.HandleW.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(-math.rad(225)-(-math.rad(135)*i), 0, -math.rad(15)*i)
			end
			if combo>1 then combo=2 print("Combo: "..combo) Slash:play()
				for i=1, 0, -attackspeed do wait()
					animate.Torso(CFrame.Angles(0, -math.rad(90)+(math.rad(90)*i), 0))
					animate.ArmRight(CFrame.Angles(0, 0, math.rad(180)*i))
					obj.HandleW.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(-math.rad(90), 0, -math.rad(15)*i)
				end
				trailDeb=false
				for i=1, 0, -attackspeed do wait()
					animate.Torso(CFrame.Angles(0, -math.rad(90)*i, 0))
				end
				attacking=false
				hitting=false
				combo=0
				onRunning()
				return
			end
			trailDeb=false
			for i=1, 0, -.2 do wait()
				animate.Torso(CFrame.Angles(0, math.rad(90)*i, 0))
				animate.ArmRight(CFrame.Angles(0, 0, math.rad(180)*i))
				obj.HandleW.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(-math.rad(90), 0, -math.rad(15)*i)
			end
		end
		attacking=false
		hitting=false
		combo=0
		onRunning()
	end
end

local Abilities={
	["Dash"]=function() Dash:play()
		local aura=add.Part(workspace, true, false, "Bright yellow", 0, Vector3.new(1, 1, 1), body.Torso.CFrame*CFrame.new(0, 0, 1.5)*CFrame.Angles(math.rad(90), 0, 0)) aura.Name="Effect"
		local auraM=add.Mesh("SpecialMesh", aura, Vector3.new(4, 2, 4), nil, "File") auraM.MeshId="http://www.roblox.com/asset/?id=20329976"
		c(function()
			for i=0, 2, .1 do wait()
				auraM.Scale=auraM.Scale+Vector3.new(i, i/2, i)
			end
		end)
		c(function()
			for i=0, 1, .1 do
				wait()
				aura.Transparency=i
			end
			pcall(function() aura:remove() end)
		end)
		torso.CFrame=torso.CFrame+torso.CFrame.lookVector*10
	end;
	["DashJump"]=function() Dash:play()
		local aura=add.Part(workspace, true, false, "Bright yellow", 0, Vector3.new(1, 1, 1), body.Torso.CFrame*CFrame.new(0, -2, 0)*CFrame.Angles(math.rad(180), 0, 0)) aura.Name="Effect"
		local auraM=add.Mesh("SpecialMesh", aura, Vector3.new(4, 2, 4), nil, "File") auraM.MeshId="http://www.roblox.com/asset/?id=20329976"
		c(function()
			for i=0, 2, .1 do wait()
				auraM.Scale=auraM.Scale+Vector3.new(i, i/2, i)
			end
		end)
		c(function()
			for i=0, 1, .1 do
				wait()
				aura.Transparency=i
			end
			pcall(function() aura:remove() end)
		end)
		pcall(function() torso:findFirstChild("BodyPosition"):remove() end)
		c(function()
			local bp=Instance.new("BodyPosition", torso) bp.maxForce=Vector3.new(0, math.huge, 0) bp.position=torso.Position+Vector3.new(0, 10, 0)
			wait(3)
			bp:remove()
		end)
	end;
	["Shield"]=function(mouse) human.WalkSpeed=0
		local bp=Instance.new("BodyPosition", torso) bp.maxForce=Vector3.new(math.huge, math.huge, math.huge) bp.position=torso.Position
		looping=true
		for i=0, 1, .2 do wait()
			animate.ArmRight(CFrame.Angles(math.rad(45)*i, 0, 0))
			animate.ArmLeft(CFrame.Angles(math.rad(135)*i, 0, -math.rad(15)*i))
			obj.HandleW.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(-math.rad(90)+(-math.rad(45)*i), math.rad(35)*i, math.rad(90)*i)
		end
		Clang:play()
		local shieldPart=add.Part(model, true, false, "White", 1, Vector3.new(15, 15, 4), torso.CFrame+torso.CFrame.lookVector*1.5)
		while looping do wait() computePos(torso.CFrame.p, mouse.Hit.p) shieldPart.CFrame=torso.CFrame+torso.CFrame.lookVector*1.5
			shieldPart.Touched:connect(function(h)
				if h.Parent~=char and h.Parent~=modelB and h.Parent~=model and h.Name~="Trail" and h.Name~="Base" and hitDeb==false then hitDeb=true print(h.Name)
					Clang:play()
					c(function()
						--[[local effect=add.Part(workspace, true, false, "Bright yellow", 0, Vector3.new(1, 1, 1), CFrame.new(h.CFrame.p, torso.CFrame.p)) effect.Name="Trail"
						local mesh=add.Mesh("SpecialMesh", effect, Vector3.new(1.5, 1.5, 1.5), nil, "File") mesh.MeshId="http://www.roblox.com/asset/?id=3270017"
						c(function()
							for i=0, 1, .1 do
								wait()
								effect.Mesh.Scale=effect.Mesh.Scale+Vector3.new(i, i, i)
							end
							effect:remove()
						end)
						c(function()
							for i=0, 1, .1 do
								wait()
								effect.Transparency=i
							end
						end)]]
						h.Anchored=false
						local bp=Instance.new("BodyPosition", h) bp.maxForce=Vector3.new(math.huge, math.huge, math.huge) bp.position=(CFrame.new(torso.CFrame.p, h.CFrame.p)*CFrame.new(0, 0, -h.Velocity.z*1.5)).p
						local bg=Instance.new("BodyGyro", h) bg.maxTorque=Vector3.new(0, math.huge, 0) bg.cframe=CFrame.new(h.CFrame.p, torso.CFrame.p)
						h.Velocity=Vector3.new(0, 0, 0) h.RotVelocity=Vector3.new(0, 0, 0)
						game.Debris:addItem(bp, .2) game.Debris:addItem(bg, .2)
					end)
					wait()
					hitDeb=false
				end
			end)
		end
		bp:remove()
		shieldPart:remove()
		for i=1, 0, -.2 do wait()
			animate.ArmRight(CFrame.Angles(math.rad(45)*i, 0, 0))
			animate.ArmLeft(CFrame.Angles(math.rad(135)*i, 0, -math.rad(15)*i))
			obj.HandleW.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(-math.rad(90)+(-math.rad(45)*i), math.rad(35)*i, math.rad(90)*i)
		end
		human.WalkSpeed=speed
	end;
	["Regenerate"]=function(mouse) human.WalkSpeed=0
		looping=true
		for i=0, 1, .1 do wait()
			animate.Torso(CFrame.new(0, -1*i, 0))
			animate.ArmLeft(CFrame.new(.5*i, 0, -.5*i)*CFrame.Angles(math.rad(90)*i, 0, math.rad(45)*i))
			animate.ArmRight(CFrame.new(-.5*i, 0, -.5*i)*CFrame.Angles(math.rad(90)*i, 0, -math.rad(45)*i))
			animate.LegLeft(CFrame.new(0, 1*i, -1*i))
			animate.LegRight(CFrame.Angles(-math.rad(90)*i, 0, 0))
			obj.HandleW.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(-math.rad(90)+(-math.rad(180)*i), -math.rad(45)*i, 0)
		end
		while looping and human.Health<100 do wait() human.Health=human.Health+1 Heal:play()
			local aura=add.Part(workspace, true, false, "Pastel light blue", .5, Vector3.new(1, 1, 1), body.Torso.CFrame*CFrame.new(0, -2, 0)*CFrame.Angles(0, math.rad(math.random(-45, 45)), 0)) aura.Name="Effect"
			local auraM=add.Mesh("SpecialMesh", aura, Vector3.new(1, 1, 1), nil, "File") auraM.MeshId="http://www.roblox.com/asset/?id=20329976"
			local aura2=add.Part(workspace, true, false, "Pastel light blue", .5, Vector3.new(5, 5, 5), body.Torso.CFrame*CFrame.new(math.random(-15, 15), math.random(-15, 15), math.random(-15, 15))*CFrame.Angles(math.rad(math.random(-45, 45)), math.rad(math.random(-45, 45)), math.rad(math.random(-45, 45))))
			aura2.Name="Effect"
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
		for i=1, 0, -.1 do wait()
			animate.Torso(CFrame.new(0, -1*i, 0))
			animate.ArmLeft(CFrame.new(.5*i, 0, -.5*i)*CFrame.Angles(math.rad(90)*i, 0, math.rad(45)*i))
			animate.ArmRight(CFrame.new(-.5*i, 0, -.5*i)*CFrame.Angles(math.rad(90)*i, 0, -math.rad(45)*i))
			animate.LegLeft(CFrame.new(0, 1*i, -1*i))
			animate.LegRight(CFrame.Angles(-math.rad(90)*i, 0, 0))
			obj.HandleW.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(-math.rad(90)+(-math.rad(180)*i), -math.rad(45)*i, 0)
		end
		human.WalkSpeed=speed
	end;
	["Ultimate"]=function()
		c(function()
			looping2=true
			speed=40 attackspeed=.25 dmg=dmg*2.5
			while looping2 and human.Health>2 do wait(.2) human.Health=human.Health-2 Electricity:play()
				lightningGen(body.Torso.CFrame.p, body.Torso.Position+Vector3.new(math.random(-10, 10), math.random(-10, 10), math.random(-10, 10)))
				local aura=add.Part(workspace, true, false, "Bright yellow", 0, Vector3.new(1, 1, 1), body.Torso.CFrame*CFrame.new(0, -2, 0)*CFrame.Angles(0, math.rad(math.random(-45, 45)), 0)) aura.Name="Effect"
				local auraM=add.Mesh("SpecialMesh", aura, Vector3.new(4, 2, 4), nil, "File") auraM.MeshId="http://www.roblox.com/asset/?id=20329976"
				c(function()
					for i=0, 1, .1 do wait()
						auraM.Scale=auraM.Scale+Vector3.new(i, i/2, i)
					end
				end)
				c(function()
					for i=0, 1, .1 do
						wait()
						aura.Transparency=i
					end
					aura:remove()
				end)
			end
			speed=32 attackspeed=.2 dmg=math.random(5, 10)
			keyDeb=false looping2=false
		end)
	end;
}

bin.Selected:connect(function(mouse) createParts() human.WalkSpeed=speed
	onRunning()
	while attacking do wait() end
	mouse.Button1Down:connect(doAttacks)
	mouse.KeyDown:connect(function(key) key=key:lower()
		if key=="w" then w=true onRunning() end
		if key=="a" then a=true onRunning() end
		if key=="s" then s=true onRunning() end
		if key=="d" then d=true onRunning() end
		if key=="c" and keyDeb2==false then keyDeb2=true Abilities.Dash() wait() keyDeb2=false end
		if key==" " and keyDeb2==false then keyDeb2=true Abilities.DashJump() wait() keyDeb2=false end
		if key=="v" and keyDeb==false then keyDeb=true Abilities.Shield(mouse) keyDeb=false end
		if key=="x" and keyDeb==false and human.Health<100 then keyDeb=true Abilities.Regenerate(mouse) keyDeb=false end
		if key=="z" and keyDeb==false and human.Health>5 then
			keyDeb=true
			Abilities.Ultimate(mouse)
		elseif key=="z" and keyDeb==true then
			keyDeb=false looping2=false
		end
	end)
	mouse.KeyUp:connect(function(key) key=key:lower()
		if key=="v" then looping=false end
		if key=="x" then looping=false end
	end)
end)
bin.Deselected:connect(function() removeParts() end)--mediafire