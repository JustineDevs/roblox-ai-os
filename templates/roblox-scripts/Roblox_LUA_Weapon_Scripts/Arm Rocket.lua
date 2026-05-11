--==Made by LuisPambid==--
--==Arm Rocket==--


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
local gui=Instance.new("ScreenGui", player.PlayerGui)
local label=Instance.new("TextLabel", gui)
label.Text="Lock Off"
label.Position=UDim2.new(0, 0, 0, 200)
label.Size=UDim2.new(0, 80, 0, 50)
label.BorderColor=BrickColor.Black() label.BackgroundColor=BrickColor.Black()
label.TextColor=BrickColor.White()
label.Font="ArialBold"
label.FontSize="Size18"
local labelb=Instance.new("TextLabel", label)
labelb.Text=""
labelb.Position=UDim2.new(0, 0, 1, 0)
labelb.Size=UDim2.new(3, 0, 1, 0)
labelb.BorderColor=BrickColor.Black() labelb.BackgroundColor=BrickColor.Black()
labelb.TextColor=BrickColor.White()
labelb.Font="ArialBold"
labelb.FontSize="Size18"
local labelc=Instance.new("TextLabel", label)
labelc.Text="Slow Off"
labelc.Position=UDim2.new(0, 0, -1, 0)
labelc.Size=UDim2.new(1, 0, 1, 0)
labelc.BorderColor=BrickColor.Black() labelc.BackgroundColor=BrickColor.Black()
labelc.TextColor=BrickColor.White()
labelc.Font="ArialBold"
labelc.FontSize="Size18"

local scriptname="Advance Arm Rocket"
pcall(function() char[scriptname]:remove() end)
local model=Instance.new("Model", char) model.Name=scriptname
local bin=Instance.new("HopperBin", player.Backpack) bin.Name=model.Name
local skincolor="Really black"
local selected=false
local rShoulder
local hdeb=false
local tdeb=false
local kdeb=false
local kdeb2=false
local deb=false

function click(mouse)
	if deb==false then deb=true
		local rocket=add.Part(char, false, false, arm.Right.Color, 0, Vector3.new(1, 1, 2), torso.CFrame*CFrame.new(0, 4, 0)*CFrame.Angles(-math.rad(90), 0, 0))
		local trail
	c(function()
		local old=(rocket.CFrame*cf).p
		while tdeb==true do
			wait()
			local new=(rocket.CFrame*cf).p
			local mag=(old-new).magnitude
			local dis=(old+new)/2
			trail=add.Part(workspace, true, false, rocket.Color, 0, Vector3.new(1, 1, 1), CFrame.new(dis, new)*CFrame.Angles(math.pi/2, 0, 0))
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
		rocket.Touched:connect(function(h)
			if h.Parent~=nil and h~=trail and h~=rocket and hdeb==false and h.Parent~=char then hdeb=true
				local exp=Instance.new("Explosion", workspace)
				exp.Position=rocket.Position
				exp.BlastPressure=4
				exp.BlastRadius=4
				local boom=add.Part(char, true, false, "Bright yellow", .5, Vector3.new(4, 4, 4), rocket.CFrame)
				local mesh=add.Mesh("SpecialMesh", boom, Vector3.new(1, 1, 1), nil, "Sphere")
				c(function()
					for i=0, 2, .2 do
					wait()
						boom.Mesh.Scale=boom.Mesh.Scale+Vector3.new(i, i, i)
					end
					boom:remove()
				end)
				pcall(function() rocket:remove() end)
				wait()
				hdeb=false
				tdeb=false
			end
		end)
		local bf=Instance.new("BodyForce", rocket) bf.force=Vector3.new(0, rocket:getMass()*196.2, 0)
		local bv=Instance.new("BodyVelocity", rocket) bv.maxForce=Vector3.new(math.huge, math.huge, math.huge)
		local tgt=mouse.Target
		local h=mouse
		if mouse.Target and mouse.Target.Name~="Base" then
			c(function()
				while true do
					rocket.CFrame=CFrame.new(rocket.CFrame.p, tgt.CFrame.p)
					bv.velocity=rocket.CFrame.lookVector*50
					wait(0)
				end
			end)
		else
			bv.velocity=rocket.CFrame.lookVector*50
		end
		wait(.1)
		deb=false
	end
end
bin.Selected:connect(function(mouse) selected=true
	mouse.Icon="http://www.roblox.com/asset/?id=22589358" --GREEN
	mouse.KeyDown:connect(function(key)
		if key=="q" and kdeb==false and kdeb2==false then kdeb=true --kdeb2=true
			for i, v in pairs(workspace:children()) do
					pcall(function() if v.Humanoid~=human then v.Humanoid.WalkSpeed=1 end end)
			end
			labelc.Text="Slow On"
			labelc.TextColor=BrickColor.Red()
			for i=5, 0, -1 do
				wait(1)
				labelc.Text="Slow On "..i
			end
			for i, v in pairs(workspace:children()) do
					pcall(function() if v.Humanoid~=human then v.Humanoid.WalkSpeed=16 end end)
			end
			labelc.Text="Slow Off"
			labelc.TextColor=BrickColor.White()
			kdeb=false
		end
--[[		elseif key=="q" and kdeb==false and kdeb2==true then kdeb=true kdeb2=false
			for i, v in pairs(game.Workspace:children()) do
				pcall(function() v.Parent.Humanoid.WalkSpeed=16 end)
			end
			labelc.Text="Slow Off"
			labelc.TextColor=BrickColor.White()
			kdeb=false
		end]]
	end)
	mouse.Button1Down:connect(function() click(mouse) end)
	pcall(function() torso["Right Shoulder"]:remove() arm.Right.Anchored=true end)
	while selected do
		if mouse.Target and mouse.Target.Name~="Base" then
			pcall(function() labelb.Text=mouse.Target.Parent.Name.."'s "..mouse.Target.Name 
			labelb.TextColor=BrickColor.Red()
			end)
			label.Text="Lock On"
			label.TextColor=BrickColor.Red()
			mouse.Icon="http://www.roblox.com/asset/?id=22590748" --RED
		else
			pcall(function() labelb.Text="None"
			labelb.TextColor=BrickColor.White() end)
			label.Text="Lock Off"
			label.TextColor=BrickColor.White()
			mouse.Icon="http://www.roblox.com/asset/?id=22589358" --GREEN
		end
		local Place0=torso.CFrame
		Place0=Place0 + ((Place0 * CFrame.fromEulerAnglesXYZ(math.pi/2,0,0)).lookVector * 0.5) + (Place0 * CFrame.fromEulerAnglesXYZ(0,math.pi/2,0)).lookVector*-1
		local Place1=Place0 + ((Place0.p-mouse.Hit.p).unit * -2)
		arm.Right.CFrame=CFrame.new((Place0.p + Place1.p)/2, Place0.p) * CFrame.fromEulerAnglesXYZ(-math.pi/2,0,0)
		wait(0)
	end
end)--mediafire