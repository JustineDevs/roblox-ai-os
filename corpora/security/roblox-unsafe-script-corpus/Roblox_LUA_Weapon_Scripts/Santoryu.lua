--==Made by LuisPambid==--
--==Santoryu==--


--script:remove()
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
	Part=function(par, a, c, col, t, s, cf)
		local p=Instance.new("Part", par) p.TopSurface="Smooth" p.BottomSurface="Smooth" p.formFactor="Custom" p.Anchored=a p.CanCollide=c p.BrickColor=BrickColor.new(col) p.Transparency=t p.Size=s p.CFrame=cf or CFrame.new()
		return p
	end,	
	Wedge=function(par, a, c, col, t, s, cf)
		local p=Instance.new("WedgePart", par) p.TopSurface="Smooth" p.BottomSurface="Smooth" p.formFactor="Custom" p.Anchored=a p.CanCollide=c p.BrickColor=BrickColor.new(col) p.Transparency=t p.Size=s p.CFrame=cf or CFrame.new()
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
local scriptname="Santoryu" --Name here
pcall(function() player.Backpack[scriptname]:remove() char[scriptname]:remove() char[scriptname.."B"]:remove() player.PlayerGui[scriptname]:remove()  end)
local model=Instance.new("Model", char) model.Name=scriptname
local modelB=Instance.new("Model", char) modelB.Name=scriptname.."B"
local gui=Instance.new("ScreenGui", player.PlayerGui) gui.Name=scriptname
local sound=Instance.new("Sound", char)
local bin=Instance.new("HopperBin", player.Backpack) bin.Name=model.Name
local skincolor="White"
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
		["Head"]=function(cf) p(function() for i, v in pairs(model:children()) do v.Transparency=0 end end) leg.Left.Transparency=1 leg.Right.Transparency=1
			body.HeadW.C1=CFrame.new(0, 1.5, 0)*cf
		end;
		["Torso"]=function(cf) p(function() for i, v in pairs(model:children()) do v.Transparency=0 end end) leg.Left.Transparency=1 leg.Right.Transparency=1
			body.TorsoW.C1=cf
		end;
		["ArmLeft"]=function(cf) p(function() for i, v in pairs(model:children()) do v.Transparency=0 end end) leg.Left.Transparency=1 leg.Right.Transparency=1
			body.ArmLeftW.C1=CFrame.new(-1.5, .5, 0)*cf
		end;
		["ArmRight"]=function(cf) p(function() for i, v in pairs(model:children()) do v.Transparency=0 end end) leg.Left.Transparency=1 leg.Right.Transparency=1
			body.ArmRightW.C1=CFrame.new(1.5, .5, 0)*cf
		end;
		["LegLeft"]=function(cf) p(function() for i, v in pairs(model:children()) do v.Transparency=0 end end) leg.Left.Transparency=1 leg.Right.Transparency=1
			body.LegLeftW.C1=CFrame.new(-.5, -1.5, 0)*cf
		end;
		["LegRight"]=function(cf) p(function() for i, v in pairs(model:children()) do v.Transparency=0 end end) leg.Left.Transparency=1 leg.Right.Transparency=1
			body.LegRightW.C1=CFrame.new(.5, -1.5, 0)*cf
		end;
	}
	--==Objects==--
	obj.LH=add.Part(model, false, false, "Really black", 0, Vector3.new(.5, 1, .2), nil)
	obj.LHW=add.Weld(obj.LH, body.ArmLeft, CFrame.new(-.3, -.5, -.2))
	obj.LH=add.Part(model, false, false, "Really black", 0, Vector3.new(.5, .2, .5), nil)
	obj.LHW=add.Weld(obj.LH, body.ArmLeft, CFrame.new(-.3, -.9, 0))
	--Right
	obj.HandleRight=add.Part(modelB, false, false, "Really black", 0, Vector3.new(.25, 2, .25), nil)
	obj.HandleRightW=add.Weld(obj.HandleRight, body.ArmRight, CFrame.new(0, -1.5, 0)*CFrame.Angles(-math.rad(90), 0, 0))
	for i=1, 5 do
		obj.DesignRight=add.Part(modelB, false, false, "White", 0, Vector3.new(.3, .1, .1), nil)
		obj.DesignRightW=add.Weld(obj.DesignRight, obj.HandleRight, CFrame.new(0, -1+i/3, 0)*CFrame.Angles(math.rad(45), 0, 0))
	end
	obj.GuardRight=add.Part(modelB, false, false, "Really black", 0, Vector3.new(.5, .2, .5), nil)
	obj.GuardRightW=add.Weld(obj.GuardRight, obj.HandleRight, CFrame.new(0, 1.1, 0))
	obj.GuardRightB=add.Part(modelB, false, false, "White", 0, Vector3.new(.25, .2, .3), nil)
	obj.GuardRightBM=add.Mesh("BlockMesh", obj.GuardRightB, Vector3.new(.5, 1, 1), nil, nil)
	obj.GuardRightBW=add.Weld(obj.GuardRightB, obj.HandleRight, CFrame.new(0, 1.25, 0))
	obj.BladeRight=add.Part(modelB, false, false, "Mid gray", 0, Vector3.new(.2, 4, .25), nil) obj.BladeRight.Reflectance=.5
	obj.BladeRightM=add.Mesh("BlockMesh", obj.BladeRight, Vector3.new(.5, 1, 1), nil, nil)
	obj.BladeRightW=add.Weld(obj.BladeRight, obj.HandleRight, CFrame.new(0, 3, 0))
	obj.PointRight=add.Wedge(modelB, false, false, "Mid gray", 0, Vector3.new(.2, 1, .25), nil) obj.PointRight.Reflectance=.5
	obj.PointM=add.Mesh("SpecialMesh", obj.PointRight, Vector3.new(.5, 1, 1), nil, "Wedge")
	obj.PointW=add.Weld(obj.PointRight, obj.BladeRight, CFrame.new(0, 2.5, 0)*CFrame.Angles(math.rad(0), 0, 0))
	--Left
	obj.HandleLeft=add.Part(modelB, false, false, "Really black", 0, Vector3.new(.25, 2, .25), nil)
	obj.HandleLeftW=add.Weld(obj.HandleLeft, body.ArmLeft, CFrame.new(0, -1.5, 0)*CFrame.Angles(-math.rad(90), 0, 0))
	for i=1, 5 do
		obj.DesignLeft=add.Part(modelB, false, false, "White", 0, Vector3.new(.3, .1, .1), nil)
		obj.DesignLeftW=add.Weld(obj.DesignLeft, obj.HandleLeft, CFrame.new(0, -1+i/3, 0)*CFrame.Angles(math.rad(45), 0, 0))
	end
	obj.GuardLeft=add.Part(modelB, false, false, "Really black", 0, Vector3.new(.5, .2, .5), nil)
	obj.GuardLeftW=add.Weld(obj.GuardLeft, obj.HandleRight, CFrame.new(0, 1.1, 0))
	obj.GuardLeftB=add.Part(modelB, false, false, "White", 0, Vector3.new(.25, .2, .3), nil)
	obj.GuardLeftBM=add.Mesh("BlockMesh", obj.GuardLeftB, Vector3.new(.5, 1, 1), nil, nil)
	obj.GuardLeftBW=add.Weld(obj.GuardLeftB, obj.HandleLeft, CFrame.new(0, 1.25, 0))
	obj.BladeLeft=add.Part(modelB, false, false, "Mid gray", 0, Vector3.new(.2, 4, .25), nil) obj.BladeLeft.Reflectance=.5
	obj.BladeLeftM=add.Mesh("BlockMesh", obj.BladeLeft, Vector3.new(.5, 1, 1), nil, nil)
	obj.BladeLeftW=add.Weld(obj.BladeLeft, obj.HandleLeft, CFrame.new(0, 3, 0))
	obj.PointLeft=add.Wedge(modelB, false, false, "Mid gray", 0, Vector3.new(.2, 1, .25), nil) obj.PointLeft.Reflectance=.5
	obj.PointM=add.Mesh("SpecialMesh", obj.PointLeft, Vector3.new(.5, 1, 1), nil, "Wedge")
	obj.PointW=add.Weld(obj.PointLeft, obj.BladeLeft, CFrame.new(0, 2.5, 0)*CFrame.Angles(math.rad(0), 0, 0))
	--Head
	obj.HandleHead=add.Part(modelB, false, false, "Really black", 0, Vector3.new(.25, 2, .25), nil)
	obj.HandleHeadW=add.Weld(obj.HandleHead, body.Head, CFrame.new(0, -.25, -.5)*CFrame.Angles(0, 0, math.rad(90)))
	for i=1, 5 do
		obj.DesignHead=add.Part(modelB, false, false, "White", 0, Vector3.new(.3, .1, .1), nil)
		obj.DesignHeadW=add.Weld(obj.DesignHead, obj.HandleHead, CFrame.new(0, -1+i/3, 0)*CFrame.Angles(math.rad(45), 0, 0))
	end
	obj.GuardHead=add.Part(modelB, false, false, "Really black", 0, Vector3.new(.5, .2, .5), nil)
	obj.GuardHeadW=add.Weld(obj.GuardHead, obj.HandleHead, CFrame.new(0, 1.1, 0))
	obj.GuardHeadB=add.Part(modelB, false, false, "White", 0, Vector3.new(.25, .2, .3), nil)
	obj.GuardHeadBM=add.Mesh("BlockMesh", obj.GuardHeadB, Vector3.new(.5, 1, 1), nil, nil)
	obj.GuardHeadBW=add.Weld(obj.GuardHeadB, obj.HandleHead, CFrame.new(0, 1.25, 0))
	obj.BladeHead=add.Part(modelB, false, false, "Mid gray", 0, Vector3.new(.2, 4, .25), nil) obj.BladeHead.Reflectance=.5
	obj.BladeHeadM=add.Mesh("BlockMesh", obj.BladeHead, Vector3.new(.5, 1, 1), nil, nil)
	obj.BladeHeadW=add.Weld(obj.BladeHead, obj.HandleHead, CFrame.new(0, 3, 0))
	obj.PointHead=add.Wedge(modelB, false, false, "Mid gray", 0, Vector3.new(.2, 1, .25), nil) obj.PointHead.Reflectance=.5
	obj.PointM=add.Mesh("SpecialMesh", obj.PointHead, Vector3.new(.5, 1, 1), nil, "Wedge")
	obj.PointW=add.Weld(obj.PointHead, obj.BladeHead, CFrame.new(0, 2.5, 0)*CFrame.Angles(math.rad(0), 0, 0))
end
function removeParts()
	p(function()
		for i, v in pairs(model:children()) do v:remove() end	for i, v in pairs(modelB:children()) do v:remove() end	for i, v in pairs(char:children()) do v.Transparency=0 end
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

--Variables--
local speed=32
local mana=100
local trailDeb=false
local hitDeb=false
local keyDeb=false
local loopDeb=false

local label=Instance.new("TextLabel", gui)
label.Position=UDim2.new(0, 0, 0, 100)
label.Size=UDim2.new(0, 200, 0, 20)
label.BorderColor=BrickColor.Black()
label.BackgroundColor=BrickColor.White()
label.TextColor=BrickColor.Black()
label.Font="ArialBold"
label.FontSize="Size18"
label.Text="100"
local charge=Instance.new("TextLabel", label) charge.Transparency=.5
charge.Position=UDim2.new(0, 0, 0, 0)
charge.Size=UDim2.new(1, 0, 1, 0)
charge.BorderColor=BrickColor.Black()
charge.BackgroundColor=BrickColor.Blue()
charge.TextColor=BrickColor.Black()
charge.Font="ArialBold"
charge.FontSize="Size18"
charge.Text=""

local attackLabel=Instance.new("TextLabel", gui)
attackLabel.Position=UDim2.new(0, 0, 0, 150)
attackLabel.Size=UDim2.new(0, 150, 0, 50)
attackLabel.BorderColor=BrickColor.Black()
attackLabel.BackgroundColor=BrickColor.Black()
attackLabel.TextColor=BrickColor.White()
attackLabel.Font="ArialBold"
attackLabel.FontSize="Size18"
attackLabel.Text="DemonSlash(Q)"
local attackLabel2=Instance.new("TextLabel", attackLabel)
attackLabel2.Position=UDim2.new(0, 0, 1, 0)
attackLabel2.Size=UDim2.new(1, 0, 1, 0)
attackLabel2.BorderColor=BrickColor.Black()
attackLabel2.BackgroundColor=BrickColor.Black()
attackLabel2.TextColor=BrickColor.White()
attackLabel2.Font="ArialBold"
attackLabel2.FontSize="Size18"
attackLabel2.Text="PoundHo(E)"
local attackLabel3=Instance.new("TextLabel", attackLabel2)
attackLabel3.Position=UDim2.new(0, 0, 1, 0)
attackLabel3.Size=UDim2.new(1, 0, 1, 0)
attackLabel3.BorderColor=BrickColor.Black()
attackLabel3.BackgroundColor=BrickColor.Black()
attackLabel3.TextColor=BrickColor.White()
attackLabel3.Font="ArialBold"
attackLabel3.FontSize="Size18"
attackLabel3.Text="ThousandWorlds(R)"
local attackLabel4=Instance.new("TextLabel", attackLabel3)
attackLabel4.Position=UDim2.new(0, 0, 1, 0)
attackLabel4.Size=UDim2.new(1, 0, 1, 0)
attackLabel4.BorderColor=BrickColor.Black()
attackLabel4.BackgroundColor=BrickColor.Black()
attackLabel4.TextColor=BrickColor.White()
attackLabel4.Font="ArialBold"
attackLabel4.FontSize="Size18"
attackLabel4.Text="Charge(Z)"
local attackLabel5=Instance.new("TextLabel", attackLabel4)
attackLabel5.Position=UDim2.new(0, 0, 1, 0)
attackLabel5.Size=UDim2.new(1, 0, 1, 0)
attackLabel5.BorderColor=BrickColor.Black()
attackLabel5.BackgroundColor=BrickColor.Black()
attackLabel5.TextColor=BrickColor.White()
attackLabel5.Font="ArialBold"
attackLabel5.FontSize="Size18"
attackLabel5.Text="GreatTwister(F)"
local attackLabel6=Instance.new("TextLabel", attackLabel5)
attackLabel6.Position=UDim2.new(0, 0, 1, 0)
attackLabel6.Size=UDim2.new(1, 0, 1, 0)
attackLabel6.BorderColor=BrickColor.Black()
attackLabel6.BackgroundColor=BrickColor.Black()
attackLabel6.TextColor=BrickColor.White()
attackLabel6.Font="ArialBold"
attackLabel6.FontSize="Size18"
attackLabel6.Text="Block(X)"

function hit(h)
	for i, v in pairs(modelB:children()) do if h==v then return end end
	for i, v in pairs(model:children()) do if h==v then return end end
	if runDeb==true and h.Parent~=char and h.Name~="Trailz" and h.Name~="Base" and hitDeb==false then hitDeb=true print("GotHit") h:remove()
		p(function()
		local pYPos=h.Position.y-(h.Size.y/2)
		local sYPos=obj.PointHead.Position.y
		local p=h:clone() p.Parent=workspace p.Anchored=true p.CanCollide=false p.Name="Trailz"
		local p2=h:clone() p2.Parent=workspace p2.Anchored=true p2.CanCollide=false p.Name="Trailz"
		p.formFactor="Custom"
		p2.formFactor="Custom"
		p.Size=Vector3.new(h.Size.x, sYPos-pYPos, h.Size.z)
		p2.Size=Vector3.new(h.Size.x, p2.Size.y-(sYPos-pYPos), h.Size.z)
		p.CFrame=h.CFrame*CFrame.new(0, -p2.Size.y/2, 0)
		p2.CFrame=h.CFrame*CFrame.new(0, p.Size.y/2, 0)
		c(function()
			for i=0, 1, .05 do
				wait()
				p.Transparency=i p2.Transparency=i
			end
			p:remove() p2:remove()
		end)
		end) wait()
		hitDeb=false
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
function trail(pos, cf)
	c(function()
		local old=(pos.CFrame*cf).p
		while trailDeb==true do
			wait()
			local new=(pos.CFrame*cf).p
			local mag=(old-new).magnitude
			local dis=(old+new)/2
			local trail=add.Part(model, true, false, "Pastel blue-green", 0, Vector3.new(.2, mag, .2), CFrame.new(dis, new)*CFrame.Angles(math.pi/2, 0, 0)) trail.Name="Trailz"
			local tMesh=add.Mesh("CylinderMesh", trail, Vector3.new(1, 1, 1), nil, nil)
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

local Attacks={
	["DemonSlash"]=function(mouse) human.WalkSpeed=0 computePos(torso.CFrame.p, mouse.Hit.p) mana=mana-5
		for i=0, 1, .1 do wait()
			animate.ArmLeft(CFrame.Angles(math.rad(90)*i, -math.rad(45)*i, math.rad(15)*i))
			animate.ArmRight(CFrame.Angles(math.rad(90)*i, math.rad(45)*i, -math.rad(15)*i))
		end
		trailDeb=true trail(obj.PointLeft, CFrame.new()) trail(obj.PointRight, CFrame.new())
		for i, v in pairs(modelB:children()) do
			connection=v.Touched:connect(hit)
		end
		play("rbxasset://sounds//swordslash.wav", 1)
		for i=0, 1, .2 do wait()
			torso.CFrame=torso.CFrame+torso.CFrame.lookVector*(10*i)
			animate.Torso(CFrame.new(0, -1.5*i, 0)*CFrame.Angles(-math.rad(45)*i, 0, 0))
			animate.ArmLeft(CFrame.Angles(math.rad(90), -math.rad(45)+(math.rad(45)*i), math.rad(15)-(math.rad(150)*i)))
			animate.ArmRight(CFrame.Angles(math.rad(90), math.rad(45)+(-math.rad(45)*i), -math.rad(15)-(-math.rad(150)*i)))
			animate.LegLeft(CFrame.new(0, 1.5*i, -.5*i)*CFrame.Angles(math.rad(45)*i, 0, 0))
			animate.LegRight(CFrame.Angles(-math.rad(45)*i, 0, 0))
			obj.HandleLeftW.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(-math.rad(90), 0, math.rad(90)*i)
			obj.HandleRightW.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(-math.rad(90), 0, -math.rad(90)*i)
		end
		wait(1)
		for i=1, 0, -.1 do wait()
			animate.Torso(CFrame.new(0, -1.5*i, 0)*CFrame.Angles(-math.rad(45)*i, 0, 0))
			animate.ArmLeft(CFrame.Angles(math.rad(90)*i, 0, -math.rad(90)*i))
			animate.ArmRight(CFrame.Angles(math.rad(90)*i, 0, math.rad(90)*i))
			animate.LegLeft(CFrame.new(0, 1.5*i, -.5*i)*CFrame.Angles(math.rad(45)*i, 0, 0))
			animate.LegRight(CFrame.Angles(-math.rad(45)*i, 0, 0))
			obj.HandleLeftW.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(-math.rad(90), 0, math.rad(135)*i)
			obj.HandleRightW.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(-math.rad(90), 0, -math.rad(135)*i)
		end
		trailDeb=false
		human.WalkSpeed=speed
	end;
	["PoundHo"]=function(mouse) human.WalkSpeed=0
		for i=0, 1, .1 do wait()
			animate.Torso(CFrame.new(0, 2.5*i, -5*i)*CFrame.Angles(-math.rad(90)*i, 0, 0))
			animate.ArmLeft(CFrame.Angles(0, 0, -math.rad(90)*i))
			animate.ArmRight(CFrame.Angles(0, 0, math.rad(90)*i))
			obj.HandleLeftW.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(-math.rad(90), 0, math.rad(180)*i)
		end
		local spin=45
		local rotate=45
		trailDeb=true trail(obj.PointLeft, CFrame.new()) trail(obj.PointRight, CFrame.new()) trail(obj.PointHead, CFrame.new())
		for i, v in pairs(modelB:children()) do
			connection=v.Touched:connect(hit)
		end
		while loopDeb==true and mana>0 do wait() spin=spin+rotate mana=mana-1
			--[[local wind=add.Part(model, true, false, "Cyan", .5, Vector3.new(1, 1, 1), body.Torso.CFrame*CFrame.new(0, 1.5, 0)*CFrame.Angles(math.rad(90), 0, 0)) wind.Name="Trailz"
			local windM=add.Mesh("SpecialMesh", wind, Vector3.new(1, 1, 1), nil, "File") windM.MeshId="http://www.roblox.com/asset/?id=3270017"
			c(function()
				for i=0, 3, .2 do wait()
					wind.CFrame=body.Torso.CFrame*CFrame.new(0, 1.5, 0)*CFrame.Angles(math.rad(90), 0, 0)
					wind.Mesh.Scale=wind.Mesh.Scale+Vector3.new(i, i, i)
				end
				wind:remove()
			end)]]
			computePos((torso.CFrame*CFrame.new(0, 0, -1)*CFrame.Angles(-math.rad(90), 0, 0)).p, mouse.Hit.p)
			animate.Torso(CFrame.new(0, 2.5, -5)*CFrame.Angles(-math.rad(90), -math.rad(spin), 0))
		end
		trailDeb=false
		for i=1, 0, -.1 do wait() play("rbxasset://sounds//swordslash.wav", 1)
			animate.Torso(CFrame.new(0, 2.5*i, -5*i)*CFrame.Angles(-math.rad(90)*i, 0, 0))
			animate.ArmLeft(CFrame.Angles(0, 0, -math.rad(90)*i))
			animate.ArmRight(CFrame.Angles(0, 0, math.rad(90)*i))
			obj.HandleLeftW.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(-math.rad(90), 0, math.rad(180)*i)
		end
		human.WalkSpeed=speed
	end;
	["ThousandWorlds"]=function(mouse) human.WalkSpeed=0 computePos(torso.CFrame.p, mouse.Hit.p) mana=mana-20
		for i=0, 1, .1 do wait()
			animate.ArmLeft(CFrame.new(.5*i, 0, -.5*i)*CFrame.Angles(math.rad(90)*i, 0, math.rad(45)*i))
			animate.ArmRight(CFrame.new(-.5*i, 0, -.5*i)*CFrame.Angles(math.rad(90)*i, 0, -math.rad(45)*i))
			obj.HandleLeftW.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(-math.rad(90), math.rad(45)*i, math.rad(180)*i)
			obj.HandleRightW.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(-math.rad(90), -math.rad(45)*i, 0)
		end
		trailDeb=true trail(obj.PointLeft, CFrame.new()) trail(obj.PointRight, CFrame.new())
		for i, v in pairs(modelB:children()) do
			connection=v.Touched:connect(hit)
		end
		for i=0, 50, 1 do wait() play("http://www.roblox.com/asset/?id=3931318", 1)
			obj.HandleLeftW.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(-math.rad(90), math.rad(45), math.rad(180)+i)
			obj.HandleRightW.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(-math.rad(90), -math.rad(45), i)
		end
		play("rbxasset://sounds//swordslash.wav", 1)
		for i=0, 1, .2 do wait()
			local fakeP=add.Part(workspace, true, false, "White", 0, Vector3.new(5, 5, 5), CFrame.new((torso.CFrame*CFrame.new(0, 0, 1.5)).p, torso.CFrame.p)*CFrame.Angles(math.rad(90), 0, 0)) fakeP.Name="Trailz"
			local mesh=add.Mesh("SpecialMesh", fakeP, Vector3.new(1, 1, 1), nil, "File") mesh.MeshId="http://www.roblox.com/asset/?id=20329976"
			c(function()
				for i=0, 1, .05 do
					wait()
					fakeP.Transparency=i
				end
				fakeP:remove()
			end)
			c(function()
				for i=1, 20, 1 do
					wait()
					mesh.Scale=Vector3.new(i, i/2, i)
				end
			end)
			torso.CFrame=torso.CFrame+torso.CFrame.lookVector*(20*i)
			animate.Torso(CFrame.new(0, -1.5*i, 0)*CFrame.Angles(-math.rad(45)*i, 0, 0))
			animate.ArmLeft(CFrame.new(.5*i, 0, -.5*i)*CFrame.Angles(math.rad(90)*i, 0, 0))
			animate.ArmRight(CFrame.new(-.5*i, 0, -.5*i)*CFrame.Angles(-math.rad(90)*i, 0, 0))
			obj.HandleLeftW.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(-math.rad(90), 0, -math.rad(90)*i)
			obj.HandleRightW.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(-math.rad(90), 0, math.rad(90)*i)
			animate.LegLeft(CFrame.new(0, 1.5*i, -.5*i)*CFrame.Angles(math.rad(45)*i, 0, 0))
			animate.LegRight(CFrame.Angles(-math.rad(45)*i, 0, 0))
		end
		trailDeb=false
		wait(3)
		for i=1, 0, -.1 do wait()
			animate.Torso(CFrame.new(0, -1.5*i, 0)*CFrame.Angles(-math.rad(45)*i, 0, 0))
			animate.ArmLeft(CFrame.new(.5*i, 0, -.5*i)*CFrame.Angles(math.rad(90)*i, 0, 0))
			animate.ArmRight(CFrame.new(-.5*i, 0, -.5*i)*CFrame.Angles(-math.rad(90)*i, 0, 0))
			obj.HandleLeftW.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(-math.rad(90), 0, -math.rad(90)*i)
			obj.HandleRightW.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(-math.rad(90), 0, math.rad(90)*i)
			animate.LegLeft(CFrame.new(0, 1.5*i, -.5*i)*CFrame.Angles(math.rad(45)*i, 0, 0))
			animate.LegRight(CFrame.Angles(-math.rad(45)*i, 0, 0))
		end
		human.WalkSpeed=speed
	end;
	["Charge"]=function(mouse) human.WalkSpeed=0 computePos(torso.CFrame.p, mouse.Hit.p)
		for i=0, 1, .1 do wait()
			animate.Torso(CFrame.new(0, -1.5*i, 0)*CFrame.Angles(-math.rad(45)*i, 0, 0))
			animate.ArmLeft(CFrame.Angles(0, 0, -math.rad(180)-(-math.rad(90)*i)))
			animate.ArmRight(CFrame.Angles(0, 0, -math.rad(180)-(math.rad(90)*i)))
			animate.LegLeft(CFrame.new(0, 1.5*i, -.5*i)*CFrame.Angles(math.rad(45)*i, 0, 0))
			animate.LegRight(CFrame.Angles(-math.rad(45)*i, 0, 0))
			obj.HandleLeftW.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(-math.rad(90), 0, -math.rad(45)*i)
			obj.HandleRightW.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(-math.rad(90), 0, math.rad(45)*i)
		end
		while loopDeb==true do wait() if mana>=0 and mana<100 then mana=mana+1 end play("http://www.roblox.com/asset/?id=2101137", 1)
			local aura=add.Part(model, true, false, "Really black", .5, Vector3.new(1, 1, 1), torso.CFrame*CFrame.new(0, -4, 0)*CFrame.Angles(0, math.rad(math.random(-45, 45)), 0)) aura.Name="Trailz"
			local auraM=add.Mesh("SpecialMesh", aura, Vector3.new(1, 1, 1), nil, "File") auraM.MeshId="http://www.roblox.com/asset/?id=20329976"
			local aura2=add.Part(model, true, false, "Really black", .5, Vector3.new(5, 5, 5), torso.CFrame*CFrame.new(math.random(-15, 15), math.random(-15, 15), math.random(-15, 15))*CFrame.Angles(math.rad(math.random(-45, 45)), math.rad(math.random(-45, 45)), math.rad(math.random(-45, 45))))
			aura2.Name="Trailz"
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
			animate.Torso(CFrame.new(0, -1.5*i, 0)*CFrame.Angles(-math.rad(45)*i, 0, 0))
			animate.ArmLeft(CFrame.Angles(0, 0, (-math.rad(90)*i)))
			animate.ArmRight(CFrame.Angles(0, 0, (math.rad(90)*i)))
			animate.LegLeft(CFrame.new(0, 1.5*i, -.5*i)*CFrame.Angles(math.rad(45)*i, 0, 0))
			animate.LegRight(CFrame.Angles(-math.rad(45)*i, 0, 0))
			obj.HandleLeftW.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(-math.rad(90), 0, -math.rad(45)*i)
			obj.HandleRightW.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(-math.rad(90), 0, math.rad(45)*i)
		end
		human.WalkSpeed=speed
	end;
	["GreatTwister"]=function(mouse) human.WalkSpeed=0 computePos(torso.CFrame.p, mouse.Hit.p) mana=mana-40
		for i=0, 1, .1 do wait()
			animate.Torso(CFrame.new(0, 0, -50*i))
			animate.ArmLeft(CFrame.Angles(0, 0, -math.rad(90)*i))
			animate.ArmRight(CFrame.Angles(0, 0, math.rad(90)*i))
			obj.HandleLeftW.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(-math.rad(90)+(-math.rad(90)*i), math.rad(180)*i, 0)
			obj.HandleRightW.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(-math.rad(90)+(-math.rad(90)*i), 0, 0)
		end
		trailDeb=true trail(obj.PointLeft, CFrame.new()) trail(obj.PointRight, CFrame.new())
		local tornado=add.Part(workspace, true, false, "Cyan", .5, Vector3.new(1, 1, 1), body.Torso.CFrame*CFrame.Angles(math.rad(180), 0, 0)) tornado.Name="Trailz"
		local tornadoM=add.Mesh("SpecialMesh", tornado, Vector3.new(1, 1, 1), nil, "File") tornadoM.MeshId="http://www.roblox.com/asset/?id=36755354"
		local spin=35
		for i=0, 50, 1 do wait() play("rbxasset://sounds//swordslash.wav", 1)
			animate.Torso(CFrame.new(0, 0, -50)*CFrame.Angles(0, -math.rad(i*45), 0))
			tornado.CFrame=body.Torso.CFrame*CFrame.new(0, 0, 0)*CFrame.Angles(math.rad(180), 0, 0)
			tornado.Size=Vector3.new(i, i, i)
			tornadoM.Scale=Vector3.new(i, i, i)
		end
		c(function() c(function()wait(10) tornado:remove() end) while true do wait() spin=spin+35 tornado.Touched:connect(hit) tornado.CFrame=tornado.CFrame*CFrame.new(0, 0, 0)*CFrame.Angles(0, math.rad(spin), 0) end end)
		for i=1, 0, -.1 do wait()
			animate.Torso(CFrame.new(0, 0, -50*i)*CFrame.Angles(0, -math.rad(i*45), 0))
			animate.Torso(CFrame.Angles(0, 0, 0))
			animate.ArmLeft(CFrame.Angles(0, 0, -math.rad(90)*i))
			animate.ArmRight(CFrame.Angles(0, 0, math.rad(90)*i))
			obj.HandleLeftW.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(-math.rad(90)+(-math.rad(90)*i), math.rad(180)*i, 0)
			obj.HandleRightW.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(-math.rad(90)+(-math.rad(90)*i), 0, 0)
		end
		trailDeb=false
		human.WalkSpeed=speed
	end;
	["Block"]=function(mouse) human.WalkSpeed=0 computePos(torso.CFrame.p, mouse.Hit.p)
		for i=0, 1, .1 do	wait()
			animate.ArmLeft(CFrame.Angles(math.rad(90)*i, -math.rad(45)*i, math.rad(15)*i))
			animate.ArmRight(CFrame.Angles(math.rad(90)*i, math.rad(45)*i, -math.rad(15)*i))
		end
		local shieldPart=add.Part(model, true, false, "White", 1, Vector3.new(10, 10, 1), torso.CFrame+torso.CFrame.lookVector*1.5)
		while loopDeb==true do wait() computePos(torso.CFrame.p, mouse.Hit.p) shieldPart.CFrame=torso.CFrame+torso.CFrame.lookVector*1.5
			shieldPart.Touched:connect(function(h) while runDeb==false do wait() end
			if h.Parent~=char and h.Parent~=modelB and h.Parent~=model and h.Name~="Trailz" and h.Name~="Base" and hitDeb==false then hitDeb=true print(h.Name)
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
					h.Anchored=false
					local bp=Instance.new("BodyPosition", h) bp.maxForce=Vector3.new(math.huge, math.huge, math.huge) bp.position=(CFrame.new(torso.CFrame.p, h.CFrame.p)*CFrame.new(0, 0, -50)).p
					h.Velocity=Vector3.new(0, 0, 0) h.RotVelocity=Vector3.new(0, 0, 0)
					game.Debris:addItem(bp, .2)
					wait()
					hitDeb=false
				end
			end)
		end
		shieldPart:remove()
		for i=1, 0, -.1 do wait()
			animate.ArmLeft(CFrame.Angles(math.rad(90)*i, -math.rad(45)*i, math.rad(15)*i))
			animate.ArmRight(CFrame.Angles(math.rad(90)*i, math.rad(45)*i, -math.rad(15)*i))
		end
		human.WalkSpeed=speed
	end
}

bin.Selected:connect(function(mouse) createParts() human.WalkSpeed=speed
	for i=0, 1, .1 do wait()
		animate.ArmLeft(CFrame.Angles(0, math.rad(45)*i, -math.rad(45)*i))
		animate.ArmRight(CFrame.Angles(0, -math.rad(45)*i, math.rad(45)*i))
	end
	human.Running:connect(function(speed)
		if speed>0 then while keyDeb==true do wait() end
			animate.ArmLeft(CFrame.Angles(0, math.rad(45), -math.rad(45)))
			animate.ArmRight(CFrame.Angles(0, -math.rad(45), math.rad(45)))
			body.LegLeft.Transparency=1 body.LegRight.Transparency=1
			leg.Left.Transparency=0 leg.Right.Transparency=0
		end
	end)
	mouse.KeyDown:connect(function(key)
		if key=="q" and keyDeb==false and mana>=5 then keyDeb=true runDeb=true
			Attacks.DemonSlash(mouse)
			keyDeb=false runDeb=false
		end
		if key=="e" and keyDeb==false and mana>=0 then keyDeb=true runDeb=true loopDeb=true
			Attacks.PoundHo(mouse)
			keyDeb=false runDeb=false
		end
		if key=="r" and keyDeb==false and mana>=20 then keyDeb=true runDeb=true loopDeb=true
			Attacks.ThousandWorlds(mouse)
			keyDeb=false runDeb=false
		end
		if key=="z" and keyDeb==false then keyDeb=true runDeb=true loopDeb=true
			Attacks.Charge(mouse)
			keyDeb=false runDeb=false
		end
		if key=="f" and keyDeb==false and mana>=40 then keyDeb=true runDeb=true loopDeb=true
			Attacks.GreatTwister(mouse)
			keyDeb=false runDeb=false
		end
		if key=="x" and keyDeb==false and mana>=0 then keyDeb=true runDeb=true loopDeb=true
			Attacks.Block(mouse)
			keyDeb=false runDeb=false
		end
	end)
	mouse.KeyUp:connect(function(key)
		if key=="e" and keyDeb==true then loopDeb=false end
		if key=="x" and keyDeb==true then loopDeb=false end
		if key=="z" and keyDeb==true then loopDeb=false end
	end)
	c(function() while true do wait() label.Text=mana charge.Size=UDim2.new(mana/100, 0, 1, 0) end end)
end)
bin.Deselected:connect(function() removeParts() end)--mediafire