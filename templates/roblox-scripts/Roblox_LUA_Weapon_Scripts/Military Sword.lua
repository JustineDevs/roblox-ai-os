--==Made by LuisPambid==--
--==Military Sword==--


wait(.1)
repeat wait() until game.Players.LocalPlayer and game.Players.LocalPlayer.Character:findFirstChild("Torso")
local modelName="Military Sword" --Name here
local player=game.Players.LocalPlayer
local char=player.Character
local torso=char.Torso
local head=char.Head
local human=char.Humanoid
local arm={Left=char["Left Arm"], Right=char["Right Arm"]}
local leg={Left=char["Left Leg"], Right=char["Right Leg"]}
local joints={LeftShoulder=torso["Left Shoulder"], RightShoulder=torso["Right Shoulder"], LeftHip=torso["Left Hip"], RightHip=torso["Right Hip"]}
joints.LeftShoulder.Part0=torso joints.RightShoulder.Part0=torso joints.LeftHip.Part0=torso joints.RightHip.Part0=torso
local s=function(f) Spawn(f) end
local c=function(f) coroutine.resume(coroutine.create(f)) end
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
		local g=Instance.new(ins, par) pcall(function() g.BorderColor=BrickColor.new(bc) g.BackgroundColor=BrickColor.new(bg) g.TextColor=BrickColor.new(tc) g.FontSize=fs g.Font="ArialBold" g.Text=text g.BackgroundTransparency=t g.Size=s g.Position=pos  end)
		return g
	end,
	Weld=function(par, p1, cf)
		local w=Instance.new("Weld", par) pcall(function() w.Part0=w.Parent or par w.Part1=p1 w.C1=cf or CFrame.new() end)
		return w
	end,
	Mesh=function(ins, par, s, of, t, id, tid)
		local m=Instance.new(ins, par) pcall(function() m.Scale=s or Vector3.new() m.Offset=of or Vector3.new() m.MeshId=id or "" m.TextureId=tid or "" m.MeshType=t end)
		return m
	end,
	Sound=function(parent, id, volume, pitch)
		local s=Instance.new("Sound", parent) pcall(function() s.SoundId=id s.Volume=volume s.Pitch=pitch end)
		return s
	end,
}
pcall(function() player.Backpack[modelName]:remove() char["CharacterParts"]:remove() char[modelName]:remove() player.PlayerGui[modelName]:remove() end)
for i, v in pairs(char:children()) do if v:isA("BasePart") then v.Transparency=0 end end
--Settings--
local model=Instance.new("Model", char) model.Name="CharacterParts"
local modelB=Instance.new("Model", char) modelB.Name=modelName
local bin=Instance.new("HopperBin", player.Backpack) bin.Name=modelName
local skincolor="Really black"
local gui=Instance.new("ScreenGui")
local body={}
local animate={}
local obj={}
local deb={}
deb.trail=false
deb.key=false
deb.hit=false
local loop=false
local speed=16
local dmg=math.random(5, 10)
local combo=0
local shielding=false
local selected=false
local rage=100

--SwordColor--
local color={
	Handle="Deep orange";
	Blade="Medium stone grey";
}

--Sounds--
local Slash=add.Sound(torso, "rbxasset://sounds//swordslash.wav", 1, 1)
local Hit=add.Sound(torso, "http://www.roblox.com/asset/?id=11113679 ", 1, 1)
local Equipping=add.Sound(torso, "rbxasset://sounds/unsheath.wav", 1, 1)
local SlashDecal="http://www.roblox.com/asset/?id=25539335"
local Charge=add.Sound(torso, "http://www.roblox.com/asset/?id=2101137", .5, 1)
body.Torso=add.Part(modelB, false, false, skincolor, 0, Vector3.new(2, 2, 1), nil)
function createParts()
	for i, v in pairs(char:children()) do if v:isA("CharacterMesh") then v:remove() end end
	torso.Transparency=1 body.Torso.Transparency=0
	--Parts--
	gui.Parent=player.PlayerGui gui.Name=modelName
	body.Head=add.Part(model, false, false, skincolor, 1, Vector3.new(1, 1, 1), nil)
	body.LA, body.RA=add.Part(model, false, false, skincolor, 1, Vector3.new(1, 1, 1), nil), add.Part(model, false, false, skincolor, 1, Vector3.new(1, 1, 1), nil)
	body.LL, body.LR=add.Part(model, false, false, skincolor, 1, Vector3.new(1, 1, 1), nil), add.Part(model, false, false, skincolor, 1, Vector3.new(1, 1, 1), nil)
	
	--Welds--
	body.HeadW=add.Weld(body.Head, torso, CFrame.new(0, 1.5, 0))
	body.TorsoW=add.Weld(body.Torso, torso, nil)
	body.LAW, body.RAW=add.Weld(body.LA, body.Torso, CFrame.new(-1.5, .5, 0)), add.Weld(body.RA, body.Torso, CFrame.new(1.5, .5, 0))
	body.LLW, body.LRW=add.Weld(body.LL, body.Torso, CFrame.new(-.5, -1.5, 0)), add.Weld(body.LR, body.Torso, CFrame.new(.5, -1.5, 0))
	
	--Welds2--
	add.Weld(body.Head, head, nil)
	add.Weld(arm.Left, body.LA, CFrame.new(0, -.5, 0))
	add.Weld(arm.Right, body.RA, CFrame.new(0, -.5, 0))
	joints.LeftHip.Part0=body.Torso
	joints.RightHip.Part0=body.Torso
	
	--Sign--
	body.Part=add.Part(model, false, false, "White", 0, Vector3.new(.2, 1, .2))
	add.Weld(body.Part, body.Torso, CFrame.new(.25, 0, -.45))
	body.Part=add.Part(model, false, false, "White", 0, Vector3.new(.7, .2, .2))
	add.Weld(body.Part, body.Torso, CFrame.new(0, -.5, -.45))
	
	--Animation--
	animate={
		["Head"]=function(cf)
			body.HeadW.C1=CFrame.new(0, 1.5, 0)*cf
		end;
		["Torso"]=function(cf)
			body.TorsoW.C1=(cf or CFrame.new()*CFrame.Angles(0, 0, 0))
		end;
		["LA"]=function(cf)
			body.LAW.C1=CFrame.new(-1.5, .5, 0)*(cf or CFrame.new()*CFrame.Angles(0, 0, 0))
		end;
		["RA"]=function(cf)
			body.RAW.C1=CFrame.new(1.5, .5, 0)*(cf or CFrame.new()*CFrame.Angles(0, 0, 0))
		end;
		["LL"]=function(cf)
			LLW=add.Weld(leg.Left, body.LL, CFrame.new(0, -1, 0))
			body.LLW.C1=CFrame.new(-.5, -1, 0)*(cf or CFrame.new()*CFrame.Angles(0, 0, 0))
			c(function()
				wait()
				LLW:remove()
			end)
		end;
		["LR"]=function(cf)
			LRW=add.Weld(leg.Right, body.LR, CFrame.new(0, -1, 0))
			body.LRW.C1=CFrame.new(.5, -1, 0)*(cf or CFrame.new()*CFrame.Angles(0, 0, 0))
			c(function()
				wait()
				LRW:remove()
			end)
		end;
	}
	
	--GuiLabels--
	obj.AL=add.Gui("TextLabel", gui, "Really black", "Really black", "White", "Size18", "Attack(Click)", 0, UDim2.new(0, 150, 0, 50), UDim2.new(0, 0, 0, 150))
	obj.AL2=add.Gui("TextLabel", obj.AL, "Really black", "Really black", "White", "Size18", "Block(C)", 0, UDim2.new(1, 0, 1, 0), UDim2.new(0, 0, 1, 0))
	obj.AL3=add.Gui("TextLabel", obj.AL2, "Really black", "Really black", "White", "Size18", "ChargeAttack(F)", 0, UDim2.new(1, 0, 1, 0), UDim2.new(0, 0, 1, 0))
	obj.AL4=add.Gui("TextLabel", obj.AL3, "Really black", "Really black", "White", "Size18", "Ambush(Q)", 0, UDim2.new(1, 0, 1, 0), UDim2.new(0, 0, 1, 0))
	obj.ShowDMG=add.Gui("TextLabel", obj.AL4, "Really black", "Really black", "White", "Size18", "Damage: "..dmg, 0, UDim2.new(1, 0, 1, 0), UDim2.new(0, 0, 1, 0))
	obj.RageMeter=add.Gui("TextLabel", gui, "Really black", "White", "White", "Size18", "", 0, UDim2.new(0, 600, 0, 30), UDim2.new(.3, 0, 0, 0))
	obj.Meter=add.Gui("TextLabel", obj.RageMeter, "Really black", "Bright red", "White", "Size18", "", 0, UDim2.new(rage/100, 0, 1, 0), UDim2.new(0, 0, 0, 0))
	obj.MeterLabel=add.Gui("TextLabel", obj.RageMeter, "Really black", "Bright red", "Really black", "Size36", rage, 1, UDim2.new(.25, 0, .5, 0), UDim2.new(.4, 0, .2, 0))
	--WeaponDesgin--
	for i, v in pairs(modelB:children()) do
		if i~=1 then return end
	end
	--Case--
	obj.Case=add.Part(modelB, false, false, color.Handle, 0, Vector3.new(.4, .4, 3), nil, Vector3.new(.5, .5, 1))
	obj.CaseW=add.Weld(obj.Case, body.Torso, CFrame.new(-1, -1.5, .5)*CFrame.Angles(math.rad(45), 0, 0))
	obj.P=add.Part(modelB, false, false, "Black", 0, Vector3.new(.3, .3, 3), nil, Vector3.new(.5, .5, 1))
	obj.PW=add.Weld(obj.P, obj.Case, CFrame.new(0, 0, -.005))
	obj.Pointb=add.Wedge(modelB, false, false, color.Handle, 0, Vector3.new(.2, 1, .2), nil, Vector3.new(1, 1, .5))
	obj.PointbW=add.Weld(obj.Pointb, obj.Case, CFrame.new(0, .05, 2)*CFrame.Angles(math.pi/2, 0, 0))
	obj.Pointb=add.Wedge(modelB, false, false, color.Handle, 0, Vector3.new(.2, 1, .2), nil, Vector3.new(1, 1, .5))
	obj.PointbW=add.Weld(obj.Pointb, obj.Case, CFrame.new(0, -.05, 2)*CFrame.Angles(math.pi/2, math.pi, 0))

	obj.P=add.Part(modelB, false, false, color.Handle, 0, Vector3.new(2.1, .2, 1.1))
	obj.PW=add.Weld(obj.P, body.Torso, CFrame.new(0, -1, 0))
	
	--Militar Sword--

	obj.Handle=add.Part(modelB, false, false, color.Handle, 0, Vector3.new(.2, .2, 1), nil, Vector3.new(.7, .7, 1))
	obj.HandleW=add.Weld(obj.Handle, obj.Case, CFrame.new(0, 0, -2)*CFrame.Angles(0, math.pi, 0))

	obj.Guard=add.Part(modelB, false, false, color.Handle, 0, Vector3.new(.2, .5, .2), nil, Vector3.new(1, 1, .5))
	obj.GuardW=add.Weld(obj.Guard, obj.Handle, CFrame.new(0, 0, -.5))
	
	obj.P=add.Part(modelB, false, false, color.Handle, 0, Vector3.new(.3, .3, .3))
	obj.PW=add.Weld(obj.P, obj.Handle, CFrame.new(0, 0, .6))
	obj.PM=add.Mesh("SpecialMesh", obj.P, Vector3.new(1, 1, 1), nil, "Sphere")

	--Hilt--
	obj.P=add.Part(modelB, false, false, color.Handle, 0, Vector3.new(.2, .2, .45), nil, Vector3.new(1, .5, 1))
	obj.PW=add.Weld(obj.P, obj.Handle, CFrame.new(0, -.5, 0))
	obj.P=add.Part(modelB, false, false, color.Handle, 0, Vector3.new(.2, .2, .45), nil, Vector3.new(1, .5, 1))
	obj.PW=add.Weld(obj.P, obj.Handle, CFrame.new(0, -.35, -.35)*CFrame.Angles(math.rad(45), 0, 0))
	obj.P=add.Part(modelB, false, false, color.Handle, 0, Vector3.new(.2, .2, .6), nil, Vector3.new(1, .5, 1))
	obj.PW=add.Weld(obj.P, obj.Handle, CFrame.new(0, -.28, .38)*CFrame.Angles(-math.rad(50), 0, 0))

	obj.Blade=add.Part(modelB, false, false, color.Blade, 0, Vector3.new(.2, .2 , 3), nil, Vector3.new(.3, .8, 1))
	obj.BladeW=add.Weld(obj.Blade, obj.Handle, CFrame.new(0, 0, -2))
	
	obj.Point=add.Wedge(modelB, false, false, color.Blade, 0, Vector3.new(.2, 1, .2), nil, Vector3.new(.3, 1, .4))
	obj.PointW=add.Weld(obj.Point, obj.Blade, CFrame.new(0, -.04, -2)*CFrame.Angles(-math.pi/2, 0, 0))

	obj.Point=add.Wedge(modelB, false, false, color.Blade, 0, Vector3.new(.2, 1, .2), nil, Vector3.new(.3, 1, .4))
	obj.PointW=add.Weld(obj.Point, obj.Blade, CFrame.new(0, .04, -2)*CFrame.Angles(-math.pi/2, -math.pi, 0))
end
function removeParts() pcall(function()	if torso then joints.LeftShoulder.Part0=torso joints.RightShoulder.Part0=torso joints.LeftHip.Part0=torso joints.RightHip.Part0=torso torso.Transparency=0 body.Torso.Transparency=1 end player.PlayerGui[modelName]:remove() for i, v in pairs(model:children()) do v:remove() end end) end
function fade(part, incr) for i=part.Transparency, 1, incr do wait() part.Transparency=i end end
function appear(part, incr) for i=part.Transparency, 0, -incr do wait() part.Transparency=i end end
function computePos(pos, pos2) local pos3=Vector3.new(pos2.x, pos.y, pos2.z) return CFrame.new(pos, pos3) end
function laser(pos, dir, col) local magnitude=(pos-dir).magnitude local distance=(pos+dir)/2 local ray=add.Part(workspace, true, false, col, 0, Vector3.new(.2, magnitude, .2), CFrame.new(distance, pos)*CFrame.Angles(-math.pi/2, 0, 0)) return ray end
function nearPos(pos, dis) local temp local distance=dis for i, v in pairs(workspace:children()) do if v:isA("Model") then temp=v:findFirstChild("Torso") local humanoid=v:findFirstChild("Humanoid") if temp and humanoid and v~=char and (temp.CFrame.p-pos).magnitude<distance then distance=(temp.CFrame.p-pos).magnitude return temp.Parent end end end end
function lightningGen(startPos, endPos, col) local magnitude=(startPos-endPos).magnitude local distance=(startPos+endPos)/2 local pattern=add.Part(workspace, true, false, "White", 1, Vector3.new(.2, .2, magnitude), CFrame.new(distance, startPos)) local startPosProx=startPos for i=1, 9 do local startPosProx2=startPosProx local random=Vector3.new(math.random(-1, 1), math.random(-1, 1), math.random(-1, 1)) local findSize=pattern.Size.z/10 local findOffSet=pattern.CFrame.lookVector*-1 local compute=i*findSize*findOffSet local newStartPos=startPos local newEndPos=CFrame.new(random+compute+newStartPos).p local magnitude=(startPosProx2-newEndPos).magnitude local distance=(startPosProx2+newEndPos)/2 local lightning=add.Part(workspace, true, false, col or "Bright yellow", 0, Vector3.new(.2, .2, magnitude), CFrame.new(distance, startPosProx2)) s(function() for i=0, 1, .1 do wait() lightning.Transparency=i end lightning:remove() end) startPosProx=newEndPos end pattern:remove() end
function trail(pos, cf, col, size) s(function() local old=(pos.CFrame*cf).p while deb.trail==true do wait() local new=(pos.CFrame*cf).p local mag=(old-new).magnitude local dis=(old+new)/2 local trail=add.Part(char, true, false, col or "White", 0, Vector3.new(1, mag, 1), CFrame.new(dis, new)*CFrame.Angles(math.pi/2, 0, 0)) trail.Name="Effect" local tMesh=add.Mesh("CylinderMesh", trail, Vector3.new(size or 1, 1, size or 1), nil, nil) old=new s(function() for i=1, 0, -.1 do wait() tMesh.Scale=tMesh.Scale*Vector3.new(i, 1, i) end trail:remove() end) s(function() for i=0, 1, .1 do wait() trail.Transparency=i end end) end end) end
function stickHit(from, to) local stickW=add.Weld(from, to, to.CFrame:inverse()*from.CFrame) stickW.C0=from.CFrame:inverse()*from.CFrame return stickW end
function glowMesh(prt, size, speed) local glow=prt:clone() add.Weld(prt, glow) glow.Parent=workspace glow.Anchored=false glow.CanCollide=false for i, v in pairs(glow:children()) do if v:isA("SpecialMesh") or v:isA("BlockMesh") or v:isA("CylinderMesh") then s(function() for i=0, size, speed do wait() v.Scale=v.Scale+Vector3.new(i, i, i) end end) s(function() fade(glow, .1) glow:remove() end) end end end
function makeCircle(prt, prts, dis, incr) local radius=dis+(prts*incr) local tb={} for i=1, prts do local prt2=prt:clone() prt2.Parent=model local x = math.sin((360/prts + 360/prts*i)/(180/math.pi))*radius local y = 0 local z = math.cos((360/prts + 360/prts*i)/(180/math.pi))*radius prt2.CFrame=prt.CFrame:toWorldSpace(CFrame.new(x,y,z)) prt:remove() table.insert(tb, prt2) end return tb end
function antiExplosion(model) local ffs={} for i, v in pairs(model:children()) do pcall(function() local ff2=Instance.new("ForceField", v.Handle) table.insert(ffs, ff2) end) if v:isA("BasePart") then local ff=Instance.new("ForceField", v) table.insert(ffs, ff) end end return ffs end
function dmgHit(h)
	local critical=math.random(1, 10)
	if deb.key==true and h.Parent:findFirstChild("Humanoid") and deb.hit==false and h.Parent~=char then
		deb.hit=true
		if rage<100 then rage=rage+1 end
		local fakeM=Instance.new("Model", workspace) 
		if critical==5 then
			dmg=50
			fakeM.Name=-dmg.." Critical!"
		else
			fakeM.Name=-dmg
		end
		local hHuman=h.Parent:findFirstChild("Humanoid")
		local hTorso=h.Parent:findFirstChild("Torso")
		hHuman.Health=hHuman.Health-dmg
		local fakeH=Instance.new("Humanoid", fakeM) fakeH.MaxHealth=0 fakeH.Health=0
		local effect=add.Part(fakeM, true, false, "Bright red", 0, Vector3.new(1, .5, 1), h.CFrame*CFrame.new(0, 4, 0)) effect.Name="Head"
		game.Debris:addItem(fakeM, 1)
		wait(.1)
		deb.hit=false
	--[[elseif deb.key==true and deb.hit==false and h.Parent~=char  then
		deb.hit=true
			pcall(function()
				print("found")
				local pYPos=h.Position.y-(h.Size.y/2)
				local sYPos=obj.Blade.Position.y
				if sYPos<=pYPos or sYPos>=(pYPos+h.Size.y) then return end
				local p=h:clone() p.Parent=workspace p.Anchored=false p.CanCollide=true --p.Name="Effect"
				local p2=h:clone() p2.Parent=workspace p2.Anchored=false p2.CanCollide=true --p2.Name="Effect"
				h:remove()
				p.formFactor="Custom"
				p2.formFactor="Custom"
				p.Friction=0
				p2.Friction=0
				p.Size=Vector3.new(h.Size.x, sYPos-pYPos, h.Size.z)
				p2.Size=Vector3.new(h.Size.x, p2.Size.y-(sYPos-pYPos), h.Size.z)
				p.CFrame=h.CFrame*CFrame.new(0, -p2.Size.y/2, 0)
				p2.CFrame=h.CFrame*CFrame.new(0, p.Size.y/2, 0)
				s(function()
					wait(5)
					p:remove() p2:remove()
				end)
			end)
		wait(.2)
		deb.hit=false]]
	end wait(1)
	dmg=math.random(5, 10)
end
function Attack() combo=combo+1 loop=true
	for i, v in pairs(modelB:children()) do v.Touched:connect(dmgHit) end
	if deb.key==false and shielding==false then
		deb.key=true
		if combo>0 then Slash:play()
			for i=0, 1, .2 do wait()
				obj.HandleW.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(0, 0, 0)
				animate.RA(CFrame.Angles(math.rad(135)*i, 0, math.rad(45)*i))
			end
			deb.trail=true trail(obj.Blade, CFrame.new(0, 0, -3), "White", .2)
			for i=0, 1, .2 do wait()
				obj.HandleW.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(-math.rad(75)*i, 0, 0)
				animate.RA(CFrame.Angles(math.rad(135)-math.rad(90)*i, 0, math.rad(45)-math.rad(90)*i))
			end
			deb.trail=false
			for i=1, 0, -.2 do wait()
				obj.HandleW.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(-math.rad(75)*i, 0, 0)
				animate.RA(CFrame.Angles(math.rad(45)*i, 0, -math.rad(45)*i))
			end
		end
		if combo>1 then Slash:play()
			for i=0, 1, .2 do wait()
				animate.RA(CFrame.Angles(0, 0, math.rad(90)*i))
				obj.HandleW.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(-math.rad(90)*i, 0, 0)
			end
			deb.trail=true trail(obj.Blade, CFrame.new(0, 0, -3), "White", .2)
			for i=0, 1, .2 do wait()
				obj.HandleW.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(-math.rad(90)+math.rad(70)*i, 0, 0)
				animate.Torso(CFrame.Angles(0, math.rad(135)*i, 0))
				animate.RA(CFrame.Angles(0, math.rad(45)*i, math.rad(90)))
			end
			if combo>2 then Slash:play()
				for i=1, 0, -.2 do wait()
					obj.HandleW.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(-math.rad(90)+math.rad(70)*i, 0, 0)
					animate.Torso(CFrame.Angles(0, math.rad(135)*i, 0))
					animate.RA(CFrame.Angles(0, math.rad(45)*i, math.rad(90)))
				end
				deb.trail=false
				for i=1, 0, -.2 do wait()
					obj.HandleW.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(-math.rad(90)*i, 0, 0)
					animate.Torso(CFrame.Angles(0, 0, 0))
					animate.RA(CFrame.Angles(0, 0, math.rad(90)*i))
				end
				running()
				combo=0
				deb.key=false
				return
			end
			deb.trail=false
			for i=1, 0, -.2 do wait()
				obj.HandleW.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(-math.rad(20)*i, 0, 0)
				animate.Torso(CFrame.Angles(0, math.rad(135)*i, 0))
				animate.RA(CFrame.Angles(0, math.rad(45)*i, math.rad(90)*i))
			end
		end
		if loop then
			for i=0, 1, .2 do wait()
				obj.HandleW.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(-math.rad(90)*i, 0, 0)
				animate.Torso(CFrame.Angles(0, math.rad(90)*i, 0))
				animate.LA(CFrame.Angles(0, 0, -math.rad(135)*i))
				animate.RA(CFrame.Angles(0, 0, math.rad(90)*i))
			end
			deb.trail=true trail(obj.Blade, CFrame.new(0, 0, -3), "White", .2)
			while loop and rage>0 do wait(.05)  Slash:play() rage=rage-1
				animate.RA(CFrame.new(math.random(0, 1)*.5, math.random(-1, 1)*.5, math.random(-1, 1)*.5)*CFrame.Angles(0, 0, math.rad(90)))
			end
			deb.trail=false
			for i=1, 0, -.2 do wait()
				obj.HandleW.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(-math.rad(90)*i, 0, 0)
				animate.Torso(CFrame.Angles(0, math.rad(90)*i, 0))
				animate.LA(CFrame.Angles(0, 0, -math.rad(135)*i))
				animate.RA(CFrame.Angles(0, 0, math.rad(90)*i))
			end
		end
		running()
		combo=0
		deb.key=false
	end
end
function running()
	animate.LA(CFrame.Angles(-math.rad(15), 0, -math.rad(15)))
	animate.RA(CFrame.Angles(math.rad(15), 0, math.rad(15)))
end
function Block(mouse)
	for i=0, 1, .2 do wait()
		--obj.HandleW.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(0, math.rad(90)*i, 0)
		animate.Torso(CFrame.Angles(0, -math.rad(90)*i, 0))
		animate.LA(CFrame.Angles(0, 0, -math.rad(165)*i))
		animate.RA(CFrame.Angles(0, 0, math.rad(25)*i))
	end
	Hit:play()
	local ff=antiExplosion(char)
	local shield=add.Part(char, false, true, "Deep orange", 0, Vector3.new(5.5, 5.5, 3), torso.CFrame*CFrame.new(0, 1, 0)*CFrame.Angles(0, 0, math.rad(90)))
	local ff2=Instance.new("ForceField", shield)
	local shieldM=add.Mesh("SpecialMesh", shield, Vector3.new(1*shield.Size.x, 1*shield.Size.y, 4), nil, nil, "http://www.roblox.com/asset/?id=96670147")
	local shieldW=add.Weld(shield, torso, CFrame.new(0, 1, -2)*CFrame.Angles(0, 0, math.rad(90)))
	shield.Touched:connect(function(h)
		if h~=shield and h.Parent~=char and not h.Parent:findFirstChild("Humanoid") and h.Parent~=modelB and h.Parent~=model and h.Name~="Base" and deb.hit==false then
			deb.hit=true
			local bp=Instance.new("BodyPosition", h) bp.maxForce=Vector3.new(math.huge, math.huge, math.huge) bp.position=(CFrame.new(torso.CFrame.p, h.CFrame.p)*CFrame.new(0, 0, -50)).p bp.D=500
			local bg=Instance.new("BodyGyro", h) bg.maxTorque=Vector3.new(math.huge, math.huge, math.huge) bg.cframe=CFrame.new(h.CFrame.p, torso.CFrame.p)
			game.Debris:addItem(bp, .2) game.Debris:addItem(bg, .2)
			deb.hit=false
		end
	end)
	local bg=Instance.new("BodyGyro", torso) bg.maxTorque=Vector3.new(0, math.huge, 0) bg.D=100
	s(function()
		while loop do wait(.5)
			glowMesh(shield, 1, .2)
		end
	end)
	while loop do wait()
		bg.cframe=computePos(torso.CFrame.p, mouse.Hit.p)
	end
	for i, v in pairs(ff) do v:remove() end ff2:remove()
	wait(.5)
	shield:remove()
	bg:remove()
	for i=1, 0, -.2 do wait()
		animate.Torso(CFrame.Angles(0, -math.rad(90)*i, 0))
		animate.LA(CFrame.Angles(0, 0, -math.rad(165)*i))
		animate.RA(CFrame.Angles(0, 0, math.rad(25)*i))
	end
	running()
end
function AttackHold(mouse)
	human.WalkSpeed=10
	for i=0, 1, .2 do wait()
		obj.HandleW.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(0, 0, math.rad(45)*i)
		animate.LA(CFrame.new(.5*i, .5*i, -.5*i)*CFrame.Angles(math.rad(135)*i, 0, math.rad(45)*i))
		animate.RA(CFrame.new(-.5*i, .5*i, -.5*i)*CFrame.Angles(math.rad(135)*i, 0, -math.rad(45)*i))
	end
	Charge:play()
	local bg=Instance.new("BodyGyro", torso) bg.maxTorque=Vector3.new(0, math.huge, 0) bg.D=100
	while loop do wait()
		bg.cframe=computePos(torso.CFrame.p, mouse.Hit.p)
		dmg=dmg+2
		local aura=add.Part(workspace, false, false, "Bright yellow", 0, Vector3.new(1, 1, 1), body.Torso.CFrame*CFrame.new(0, -3, 0))
		local auraM=add.Mesh("SpecialMesh", aura, Vector3.new(2, .5, 2), nil, "File") auraM.MeshId="http://www.roblox.com/asset/?id=20329976"
		add.Weld(aura, body.Torso, CFrame.new(0, -3, 0)*CFrame.Angles(0, math.rad(math.random(-45, 45)), 0))
		s(function()
			for i=2, 6, .2 do wait()
				auraM.Scale=Vector3.new(i, auraM.Scale.y, i)
			end
			aura:remove()
		end)
		s(function()
			for i=0, 1, .05 do wait()
				aura.Transparency=i
			end
		end)
	end
	local p=add.Part(workspace, false, false, "Bright yellow", 0, Vector3.new(2, 2, 2), body.Torso.CFrame)
	local pM=add.Mesh("SpecialMesh", p, nil, nil, "Sphere")
	add.Weld(p, body.Torso)
	for i=0, 1, .1 do wait()
		p.Transparency=i
		pM.Scale=pM.Scale+Vector3.new(i*2, i*2, i*2)
	end
	bg:remove()
	deb.trail=true trail(obj.Blade, CFrame.new(0, 0, -3), "White", .2)
	Slash:play()
	for i, v in pairs(modelB:children()) do v.Touched:connect(dmgHit) end
	for i, v in pairs(char:children()) do if v:isA("BasePart") then v.Touched:connect(dmgHit) end end
	for i=0, 1, .2 do wait()
		torso.CFrame=torso.CFrame+torso.CFrame.lookVector*2*i
		animate.Torso(CFrame.Angles(0, -math.rad(45)+math.rad(45), 0))
		animate.LA(CFrame.new(.5, .5-.5*i, -.5)*CFrame.Angles(math.rad(135)-math.rad(135)*i, 0, math.rad(45)))
		animate.RA(CFrame.new(-.5, .5-.5*i, -.5)*CFrame.Angles(math.rad(135)-math.rad(135)*i, 0, -math.rad(45)))
	end
	deb.trail=false
	for i=1, 0, -.2 do wait()
		obj.HandleW.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(0, 0, math.rad(45)*i)
		animate.LA(CFrame.new(.5*i, 0, -.5*i)*CFrame.Angles(0, 0, math.rad(45)*i))
		animate.RA(CFrame.new(-.5*i, 0, -.5*i)*CFrame.Angles(0, 0, -math.rad(45)*i))
	end
	p:remove()
	dmg=math.random(5, 10)
	human.WalkSpeed=speed
	running()
end
function Ambush()
	local nChar=nearPos(torso.CFrame.p, 20)
	if nChar then
		for i, v in pairs(char:children()) do 
			if v:isA("BasePart") then
				s(function()
				pcall(function() s(function() fade(v:findFirstChild("Handle"), .2)end) end)
				pcall(function() s(function() fade(v:findFirstChild("face"), .2)end) end)
				pcall(function() s(function() fade(v:findFirstChild("roblox"), .2)end) end)
				fade(v, .2)
				end)
			end
		end
		for i, v in pairs(modelB:children()) do
			if v:isA("BasePart") then
				s(function() fade(v, .2) end)
			end
		end
		wait(.5)
		for i, v in pairs(modelB:children()) do v.Touched:connect(dmgHit) end
		for i, v in pairs(char:children()) do if v:isA("BasePart") then v.Touched:connect(dmgHit) end end
		local torsoW=add.Weld(torso, nChar.Torso, CFrame.new(0, 0, 5))
		for i, v in pairs(char:children()) do 
			if v:isA("BasePart") then
				s(function()
				pcall(function() s(function() appear(v:findFirstChild("Handle"), .2)end) end)
				pcall(function() s(function() appear(v:findFirstChild("face"), .2)end) end)
				pcall(function() s(function() appear(v:findFirstChild("roblox"), .2)end) end)
				appear(v, .2)
				end)
			end
		end
		for i, v in pairs(modelB:children()) do
			if v:isA("BasePart") then
				s(function() appear(v, .2) end)
			end
		end
		for i=0, 1, .2 do wait()
			obj.HandleW.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(-math.rad(90)*i, 0, 0)
			animate.Torso(CFrame.Angles(0, math.rad(90)*i, 0))
			animate.LA(CFrame.Angles(0, 0, -math.rad(135)*i))
			animate.RA(CFrame.Angles(0, 0, math.rad(90)*i))
		end
		deb.trail=true trail(obj.Blade, CFrame.new(0, 0, -3), "White", .2)
		for i=1, 50 do wait() Slash:play()
			animate.RA(CFrame.new(math.random(0, 1)*.5, math.random(-1, 1)*.5, math.random(-1, 1)*.5)*CFrame.Angles(0, 0, math.rad(90)))
		end
		deb.trail=false
		torsoW:remove()
		for i=1, 0, -.2 do wait()
			obj.HandleW.C1=CFrame.new(0, -1.5, 0)*CFrame.Angles(-math.rad(90)*i, 0, 0)
			animate.Torso(CFrame.Angles(0, math.rad(90)*i, 0))
			animate.LA(CFrame.Angles(0, 0, -math.rad(135)*i))
			animate.RA(CFrame.Angles(0, 0, math.rad(90)*i))
		end
	end
end
bin.Selected:connect(function(mouse) createParts()
	Equipping:play()
	for i=0, 1, .1 do wait()
		animate.Head(CFrame.Angles(-math.rad(25)*i, math.rad(45)*i, 0))
		animate.LA(CFrame.Angles(-math.rad(15)*i, 0, -math.rad(15)*i))
		animate.RA(CFrame.new(-1*i, 0, -.5*i)*CFrame.Angles(math.rad(65)*i, 0, -math.rad(45)*i))
		obj.HandleW.C1=CFrame.new(0, 0, -2-i/2)*CFrame.Angles(0, math.pi, 0)
	end
	obj.HandleW.Part1=body.RA
	obj.HandleW.C1=CFrame.new(0, -1.5, 0)
	for i=1, 0, -.1 do wait()
		animate.Head(CFrame.Angles(-math.rad(25)*i, math.rad(45)*i, 0))
		animate.LA(CFrame.Angles(-math.rad(15)*i, 0, -math.rad(15)*i))
		animate.RA(CFrame.new(-1*i, 0, -.5*i)*CFrame.Angles(math.rad(65)*i, 0, -math.rad(45)*i))
	end
	running()
	mouse.Button1Down:connect(Attack)
	mouse.Button1Up:connect(function() loop=false end)
	mouse.KeyDown:connect(function(key)
		local key=key:lower()
		if key=="c" and deb.key==false and shielding==false then
			shielding=true loop=true
			Block(mouse)
			shielding=false
		end
		if key=="f" and deb.key==false and shielding==false then
			deb.key=true loop=true
			AttackHold(mouse)
			deb.key=false
		end
		if key=="q" and deb.key==false and shielding==false then
			deb.key=true
			Ambush()
			deb.key=false
		end
	end)
	mouse.KeyUp:connect(function(key)
		local key=key:lower()
		if key=="c" then loop=false end
		if key=="f" then loop=false end
	end)
	selected=true
	s(function()
		while selected do wait()
			obj.ShowDMG.Text="Damage: "..dmg
			obj.Meter.Size=UDim2.new(rage/100, 0, 1, 0)
			obj.MeterLabel.Text=rage
		end
	end)
end)
bin.Deselected:connect(function()
	selected=false loop=false
	for i=0, 1, .1 do wait()
		animate.Head(CFrame.Angles(-math.rad(25)*i, math.rad(45)*i, 0))
		animate.LA(CFrame.Angles(-math.rad(15)*i, 0, -math.rad(15)*i))
		animate.RA(CFrame.new(-1*i, 0, -.5*i)*CFrame.Angles(math.rad(65)*i, 0, -math.rad(45)*i))
	end
	obj.HandleW.Part1=obj.Case
	obj.HandleW.C1=CFrame.new(0, 0, -2.5)*CFrame.Angles(0, math.pi, 0)
	for i=0, .5, .05 do wait()
		obj.HandleW.C1=CFrame.new(0, 0, -2.5+i)*CFrame.Angles(0, math.pi, 0)
	end
	for i=1, 0, -.1 do wait()
		animate.Head(CFrame.Angles(-math.rad(25)*i, math.rad(45)*i, 0))
		animate.LA(CFrame.Angles(-math.rad(15)*i, 0, -math.rad(15)*i))
		animate.RA(CFrame.new(-1*i, 0, -.5*i)*CFrame.Angles(math.rad(65)*i, 0, -math.rad(45)*i))
	end
	removeParts()
end)
--mediafire