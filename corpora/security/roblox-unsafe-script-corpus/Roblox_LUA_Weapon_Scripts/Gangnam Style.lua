--==Made by LuisPambid==--
--==Gangnam Style==--


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
	Part=function(par, a, c, col, t, s, cf)
		local p=Instance.new("Part", par) pcall(function() p.TopSurface="Smooth" p.BottomSurface="Smooth" p.formFactor="Custom" p.Anchored=a p.CanCollide=c p.BrickColor=BrickColor.new(col) p.Transparency=t p.Size=s p.CFrame=cf or CFrame.new()  end)
		return p
	end,	
	Wedge=function(par, a, c, col, t, s, cf)
		local p=Instance.new("WedgePart", par) pcall(function() p.TopSurface="Smooth" p.BottomSurface="Smooth" p.formFactor="Custom" p.Anchored=a p.CanCollide=c p.BrickColor=BrickColor.new(col) p.Transparency=t p.Size=s p.CFrame=cf or CFrame.new()  end)
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
	end
}
local scriptname="GANGNAM STYLE" --Name here
pcall(function() player.Backpack[scriptname]:remove() char[scriptname]:remove() char["Objects"]:remove() player.PlayerGui[scriptname]:remove()  end)
local model=Instance.new("Model", char) model.Name="Objects"
local modelB=Instance.new("Model", char) modelB.Name=scriptname
local gui=Instance.new("ScreenGui", player.PlayerGui) gui.Name=scriptname
local skincolor="Really black"
local body={}
local animate={}
local obj={}
function createParts()
	--==PARTS==--
	body.Head=add.Part(model, false, false, skincolor, 1, Vector3.new(1, 1, 1), nil)
	body.Torso=add.Part(model, false, false, skincolor, 1, Vector3.new(2, 2, 1), nil)
	body.ArmLeft, body.ArmRight=add.Part(model, false, false, skincolor, 1, Vector3.new(1, 1, 1), nil), add.Part(model, false, false, skincolor, 1, Vector3.new(1, 1, 1), nil)
	body.LegLeft, body.LegRight=add.Part(model, false, false, skincolor, 1, Vector3.new(1, 1, 1), nil), add.Part(model, false, false, skincolor, 1, Vector3.new(1, 1, 1), nil)
	--==WELDS==--
	body.HeadW=add.Weld(body.Head, torso, CFrame.new(0, 1.5, 0))
	body.TorsoW=add.Weld(body.Torso, torso, nil)
	body.ArmLeftW, body.ArmRightW=add.Weld(body.ArmLeft, body.Torso, CFrame.new(-1.5, .5, 0)), add.Weld(body.ArmRight, body.Torso, CFrame.new(1.5, .5, 0))
	body.LegLeftW, body.LegRightW=add.Weld(body.LegLeft, body.Torso, CFrame.new(-.5, -1.5, 0)), add.Weld(body.LegRight, body.Torso, CFrame.new(.5, -1.5, 0))
	--==WELDS==--
	add.Weld(body.Head, head, nil)
	add.Weld(arm.Left, body.ArmLeft, CFrame.new(0, -.5, 0))
	add.Weld(arm.Right, body.ArmRight, CFrame.new(0, -.5, 0))
	add.Weld(leg.Left, body.LegLeft, CFrame.new(0, -.5, 0))
	add.Weld(leg.Right, body.LegRight, CFrame.new(0, -.5, 0))
	---------------------------------------------------------------------------------------
	animate={
		["Head"]=function(cf)
			body.HeadW.C1=CFrame.new(0, 1.5, 0)*cf
		end;
		["Torso"]=function(cf) body.Torso.Transparency=0 torso.Transparency=1
			body.TorsoW.C1=cf
		end;
		["ArmLeft"]=function(cf)
			body.ArmLeftW.C1=CFrame.new(-1.5, .5, 0)*cf
		end;
		["ArmRight"]=function(cf)
			body.ArmRightW.C1=CFrame.new(1.5, .5, 0)*cf
		end;
		["LegLeft"]=function(cf)
			body.LegLeftW.C1=CFrame.new(-.5, -1.5, 0)*cf
		end;
		["LegRight"]=function(cf)
			body.LegRightW.C1=CFrame.new(.5, -1.5, 0)*cf
		end;
	}
	--==Objects==--
end
local lyrics=0
local dance=0
local dancing=false
local onDancing=false
local startpos=false
createParts()
onDancing=true
for i=0, 1, .1 do wait()
	animate.Head(CFrame.Angles(math.rad(45), 0, 0))
	animate.ArmLeft(CFrame.new(1*i, 0, -.5*i)*CFrame.Angles(math.rad(90)*i, 0, math.rad(45)*i))
	animate.ArmRight(CFrame.new(-1*i, 0, -.5*i)*CFrame.Angles(math.rad(90)*i, 0, -math.rad(45)*i))
	animate.LegLeft(CFrame.Angles(0, 0, -math.rad(15)*i))
	animate.LegRight(CFrame.Angles(0, 0, math.rad(15)*i))
end
while onDancing do wait() lyrics=lyrics+1 dance=dance+1
	if lyrics==1 then game:GetService("Chat"):Chat(head, "Op", "Blue") end
	if lyrics==2 then game:GetService("Chat"):Chat(head, "Op", "Blue") end
	if lyrics==4 then game:GetService("Chat"):Chat(head, "Oppa GANGNAM STYLE!", "Blue") end
	if dance<=2 and dancing==false then print(dance)
		dancing=true
		startpos=false
		for i=0, 1, .1 do wait()
			animate.Head(CFrame.Angles(math.rad(45*i), 0, 0))
			animate.Torso(CFrame.Angles(0, 0, math.rad(-5+10*i)))
			animate.ArmLeft(CFrame.new(1, .5*i, -.5)*CFrame.Angles(math.rad(90+45*i), 0, math.rad(45)))
			animate.ArmRight(CFrame.new(-1, .5*i, -.5)*CFrame.Angles(math.rad(90+45*i), 0, -math.rad(45)))
			animate.LegLeft(CFrame.new(0, .5-(.5*i), 0)*CFrame.Angles(0, 0, -math.rad(15)))
			animate.LegRight(CFrame.new(0, .5*i, 0)*CFrame.Angles(0, 0, math.rad(15)))
		end
		for i=0, 1, .1 do wait()
			animate.Head(CFrame.Angles(math.rad(45-45*i), 0, 0))
			animate.Torso(CFrame.Angles(0, 0, math.rad(5-10*i)))
			animate.ArmLeft(CFrame.new(1, .5-.5*i, -.5)*CFrame.Angles(math.rad(135-45*i), 0, math.rad(45)))
			animate.ArmRight(CFrame.new(-1, .5-.5*i, -.5)*CFrame.Angles(math.rad(135-45*i), 0, -math.rad(45)))
			animate.LegLeft(CFrame.new(0, .5*i, 0)*CFrame.Angles(0, 0, -math.rad(15)))
			animate.LegRight(CFrame.new(0, .5-(.5*i), 0)*CFrame.Angles(0, 0, math.rad(15)))
		end
		dancing=false
	elseif dance>=2 and dance<5 and dancing==false then print(dance)
		dancing=true
		startpos=false
		for i=0, 1, .1 do wait()
			animate.Head(CFrame.Angles(math.rad(45*i), 0, 0))
			animate.Torso(CFrame.Angles(0, 0, math.rad(-5+10*i)))
			animate.ArmLeft(CFrame.new(1, .5*i, -.5)*CFrame.Angles(math.rad(90+45*i), 0, math.rad(45)))
			animate.ArmRight(CFrame.Angles(math.rad(180+math.random(-45, 45)*i), 0, -math.rad(math.random(-45, 45)*i)))
			animate.LegLeft(CFrame.new(0, .5-(.5*i), 0)*CFrame.Angles(0, 0, -math.rad(15)))
			animate.LegRight(CFrame.new(0, .5*i, 0)*CFrame.Angles(0, 0, math.rad(15)))
		end
		for i=0, 1, .1 do wait()
			animate.Head(CFrame.Angles(math.rad(45-45*i), 0, 0))
			animate.Torso(CFrame.Angles(0, 0, math.rad(5-10*i)))
			animate.ArmLeft(CFrame.new(1, .5-.5*i, -.5)*CFrame.Angles(math.rad(135-45*i), 0, math.rad(45)))
			animate.ArmRight(CFrame.Angles(math.rad(180+math.random(-45, 45)*i), 0, -math.rad(math.random(-45, 45)*i)))
			animate.LegLeft(CFrame.new(0, .5*i, 0)*CFrame.Angles(0, 0, -math.rad(15)))
			animate.LegRight(CFrame.new(0, .5-(.5*i), 0)*CFrame.Angles(0, 0, math.rad(15)))
		end
		dancing=false
	elseif dance>=5 and dance<10 and dancing==false then print(dance)
		dancing=true
		if startpos==false then
			startpos=true
			game:GetService("Chat"):Chat(head, "EH SEXY LADY!", "Blue")
			for i=0, 1, .1 do wait()
				animate.Head(CFrame.Angles(math.rad(15), 0, 0))
				animate.Torso(CFrame.Angles(0, math.rad(90)*i, 0))
				animate.ArmLeft(CFrame.new(.2*i, 0, 0)*CFrame.Angles(0, 0, math.rad(15)*i))
				animate.ArmRight(CFrame.new(-.2*i, 0, 0)*CFrame.Angles(0, 0, -math.rad(15)*i))
			end
		end
		for i=0, 1, .2 do wait()
			torso.CFrame=torso.CFrame+torso.CFrame.lookVector*.2
			animate.Head(CFrame.Angles(math.rad(15), 0, 0))
			animate.Torso(CFrame.Angles(0, -math.rad(90), math.rad(-5+10*i)))
			animate.LegLeft(CFrame.new(0, .5-(.5*i), 0)*CFrame.Angles(0, 0, -math.rad(15)))
			animate.LegRight(CFrame.new(0, .5*i, 0)*CFrame.Angles(0, 0, math.rad(15)))
		end
		for i=0, 1, .2 do wait()
			torso.CFrame=torso.CFrame+torso.CFrame.lookVector*.2
			animate.Head(CFrame.Angles(math.rad(15), 0, 0))
			animate.Torso(CFrame.Angles(0, -math.rad(90), math.rad(5-10*i)))
			animate.LegLeft(CFrame.new(0, .5*i, 0)*CFrame.Angles(0, 0, -math.rad(15)))
			animate.LegRight(CFrame.new(0, .5-(.5*i), 0)*CFrame.Angles(0, 0, math.rad(15)))
		end
		dancing=false
	elseif dance<=10 then
		dance=0
		lyrics=0
	end
end--mediafire