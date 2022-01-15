Dummy()
select(for o in Objects where classOf o != Dummy and o.parent == undefined collect o)
$.parent = $Dummy001
$Dummy001.rotation = eulerAngles 0 0 90
select(for o in Objects where classOf o.parent == $Dummy001 collect o)
$.parent = undefined
delete $Dummy001

fn materialToSC2Standard mat texturename = 
(
   	mat = SC2_Standard_Material name:mat.name
	mat.MatSubType = 3
	mat.AlphaTestThreshold = 200
	mat.HDRSpecularMul = 4.0
	mat.simulateRoughness = true
	mat.Specularity2 = 8
	mat.CastTransparentShadows = true
	mat.environment.filename = "storm_blurredcube_warheadjunction_reflection.dds"
	mat.environment.UVMapping = 2
	mat.environment.ColorChannels = 0
	mat.Diffuse.filename = substituteString texturename "Diffuse" "diff"
	mat.Normal.filename = substituteString texturename "Diffuse" "norm"
	mat.Specular.filename = substituteString texturename "Diffuse" "spec"
	mat.Specular.ColorChannels = 0
	mat.GlossExp.filename = substituteString texturename "Diffuse" "mask_gloss_ao"
	mat.GlossExp.ColorChannels = 4
	mat.EnvironmentMask.filename = substituteString texturename "Diffuse" "spec"			
	mat.alphaMask.filename = substituteString texturename "Diffuse" "mask_gloss_ao"
	mat.alphaMask.ColorChannels = 3
	mat.AmbientOcclusion.filename = substituteString texturename "Diffuse" "mask_gloss_ao"
	mat.AmbientOcclusion.ColorChannels = 5
	mat
)

for mat in (getclassinstances WC3RefMaterial) do 
(
	texturename = filenameFromPath mat.diffuse_map.filename
	replaceinstances mat (materialToSC2Standard mat texturename)
)